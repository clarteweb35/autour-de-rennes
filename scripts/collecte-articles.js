import { DateTime } from 'luxon';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const DATATOURISME_API_KEY = process.env.DATATOURISME_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!DATATOURISME_API_KEY || !GEMINI_API_KEY) {
  console.error('ERREUR : les cles API sont manquantes. Verifie ton fichier .env (local) ou tes Secrets GitHub Actions.');
  process.exit(1);
}

function normalizeDatatourisme(item) {
  const occurrences = item.takesPlaceAt;
  if (!Array.isArray(occurrences) || occurrences.length === 0) {
    return { date_confiance: 'invalide', date_source_brute: 'champ takesPlaceAt absent ou vide' };
  }
  const occ = occurrences[0];
  if (!occ.startDate) {
    return { date_confiance: 'invalide', date_source_brute: JSON.stringify(occ) };
  }
  const start = DateTime.fromISO(occ.startDate);
  const end = occ.endDate ? DateTime.fromISO(occ.endDate) : start;
  if (!start.isValid) {
    return { date_confiance: 'invalide', date_source_brute: JSON.stringify(occ) };
  }
  return {
    date_debut: start.toISODate(),
    date_fin: end.isValid ? end.toISODate() : start.toISODate(),
    heure_debut: occ.startTime || null,
    heure_fin: occ.endTime || null,
    date_confiance: 'haute',
    date_source_brute: JSON.stringify(occ)
  };
}

async function fetchDatatourisme() {
  const url = `https://api.datatourisme.fr/v1/entertainmentAndEvent?filters=isLocatedAt.address.hasAddressCity.insee[in]=35238,35113,35360&fields=uuid,label,takesPlaceAt,isLocatedAt,hasDescription,lastUpdate,hasContact&lang=fr&page_size=20`;
  const response = await fetch(url, {
    headers: { 'X-API-Key': DATATOURISME_API_KEY }
  });
  if (!response.ok) throw new Error(`Erreur DATAtourisme : ${response.status}`);
  const data = await response.json();
  console.log(`OK - ${data.objects.length} evenements recuperes depuis DATAtourisme`);
  return data.objects;
}

const articleSchema = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["ok", "insufficient_data"] },
    missing_fields: { type: "array", items: { type: "string" } },
    article_markdown: { type: "string" },
    meta_title: { type: "string" },
    meta_description: { type: "string" },
    keywords: { type: "array", items: { type: "string" } },
    needs_human_review: { type: "boolean" }
  },
  required: ["status", "missing_fields", "article_markdown", "meta_title", "meta_description", "keywords", "needs_human_review"]
};

const SYSTEM_PROMPT = `Tu es un journaliste local specialise dans l'actualite et l'agenda culturel de la region rennaise (Rennes et son bassin de vie, Ille-et-Vilaine). Tu rediges des articles pour un site d'actualite locale destine aux habitants cherchant "quoi faire ce week-end" (brocantes, braderies, evenements culturels, marches, sorties familiales).

REGLE ABSOLUE — tu ne dois JAMAIS inventer une date, un horaire, une adresse, un tarif, un nom de lieu ou d'organisateur qui ne figure pas explicitement dans les donnees JSON fournies. Si un champ est vide ou absent, indique-le tel quel ("Non communique"), ne le devine jamais.

Ton dynamique, chaleureux, journalistique. Structure l'article en Markdown : titre H1 accrocheur, introduction, corps (2-4 paragraphes courts bases uniquement sur la description fournie), un tableau Markdown "fiche pratique" (date, horaire, lieu, adresse, tarif, source), conclusion courte.

Genere aussi : meta_title (60 caracteres max), meta_description (150-160 caracteres max), keywords (5-8 mots-cles incluant des variantes locales).

Si les donnees sont insuffisantes (titre, date ou lieu manquant), reponds avec status "insufficient_data" et liste les champs manquants dans missing_fields, en laissant article_markdown vide.`;

async function genererArticle(eventData) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{
        role: 'user',
        parts: [{ text: `Voici les donnees brutes de l'evenement a traiter :\n\n${JSON.stringify(eventData, null, 2)}` }]
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: articleSchema
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Erreur Gemini : ${response.status} — ${await response.text()}`);
  }

  const data = await response.json();
  const texteJson = data.candidates[0].content.parts[0].text;
  return JSON.parse(texteJson);
}

// Retire les caracteres de controle invalides (byte nul et autres) qui peuvent
// occasionnellement apparaitre dans une reponse IA et casser le parsing YAML/Markdown
function nettoyerTexte(texte) {
  if (typeof texte !== 'string') return texte;
  return texte.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}

function nettoyerArticle(article) {
  return {
    ...article,
    article_markdown: nettoyerTexte(article.article_markdown),
    meta_title: nettoyerTexte(article.meta_title),
    meta_description: nettoyerTexte(article.meta_description),
    keywords: article.keywords.map(k => nettoyerTexte(k))
  };
}

function genererSlug(titre, dateDebut) {
  const titreSlug = titre
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${dateDebut}-${titreSlug}`;
}

function ecrireArticle(article, eventData, slug) {
  const frontmatter = `---
title: "${article.meta_title.replace(/"/g, '\\"')}"
slug: "${slug}"
meta_title: "${article.meta_title.replace(/"/g, '\\"')}"
meta_description: "${article.meta_description.replace(/"/g, '\\"')}"
keywords: ${JSON.stringify(article.keywords)}
date_debut: "${eventData.date_debut}"
date_fin: "${eventData.date_fin}"
heure_debut: ${eventData.heure_debut ? `"${eventData.heure_debut}"` : 'null'}
heure_fin: ${eventData.heure_fin ? `"${eventData.heure_fin}"` : 'null'}
lieu: "${eventData.lieu || 'Non communique'}"
ville: "${eventData.ville || 'Non communique'}"
code_postal: "35000"
prix: null
source_url: "https://www.datatourisme.fr/"
needs_human_review: ${article.needs_human_review}
publishedAt: "${new Date().toISOString()}"
categorie: null
---

${article.article_markdown}
`;

  const dossier = path.join('src', 'content', 'articles');
  const cheminFichier = path.join(dossier, `${slug}.md`);
  fs.writeFileSync(cheminFichier, frontmatter, { encoding: 'utf8' });
  console.log(`  -> Fichier ecrit : ${slug}.md`);
}

function attendre(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Limite de securite : on ne depasse jamais ce nombre d'appels Gemini par execution du script,
// meme si le quota reel est plus eleve - filet de securite contre tout bug ou boucle infinie.
const LIMITE_SECURITE_GEMINI = 100;

async function main() {
  const events = await fetchDatatourisme();
  const dossierArticles = path.join('src', 'content', 'articles');

  let compteurCrees = 0;
  let compteurIgnores = 0;
  let compteurErreurs = 0;
  let compteurAppelsGemini = 0;

  for (let i = 0; i < events.length; i++) {
    if (compteurAppelsGemini >= LIMITE_SECURITE_GEMINI) {
      console.log(`\nLimite de securite de ${LIMITE_SECURITE_GEMINI} appels atteinte, arret du traitement pour cette execution.`);
      break;
    }

    const item = events[i];
    const titre = item.label?.['@fr'];
    const dateInfo = normalizeDatatourisme(item);

    console.log(`\n[${i + 1}/${events.length}] ${titre || '(titre manquant)'}`);

    if (dateInfo.date_confiance === 'invalide' || !titre) {
      console.log('  -> Ignore : donnees de date ou titre invalides');
      compteurErreurs++;
      continue;
    }

    const slugPrevu = genererSlug(titre, dateInfo.date_debut);
    const cheminPrevu = path.join(dossierArticles, `${slugPrevu}.md`);

    if (fs.existsSync(cheminPrevu)) {
      console.log('  -> Deja existant, ignore');
      compteurIgnores++;
      continue;
    }

    const eventData = {
      titre: nettoyerTexte(titre),
      description: nettoyerTexte(item.hasDescription?.[0]?.description?.['@fr'] || null),
      lieu: nettoyerTexte(item.isLocatedAt?.[0]?.address?.[0]?.streetAddress?.join(', ') || null),
      ville: nettoyerTexte(item.isLocatedAt?.[0]?.address?.[0]?.addressLocality || null),
      ...dateInfo
    };

    try {
      const article = await genererArticle(eventData);
      compteurAppelsGemini++;

      if (article.status === 'insufficient_data') {
        console.log('  -> Donnees insuffisantes cote IA :', article.missing_fields);
        compteurErreurs++;
      } else {
        const articlePropre = nettoyerArticle(article);
        ecrireArticle(articlePropre, eventData, slugPrevu);
        compteurCrees++;
      }
    } catch (err) {
      console.log('  -> ERREUR :', err.message);
      compteurErreurs++;
    }

    if (i < events.length - 1) {
      await attendre(4000);
    }
  }

  console.log(`\n=== BILAN ===`);
  console.log(`Articles crees : ${compteurCrees}`);
  console.log(`Articles deja existants (ignores) : ${compteurIgnores}`);
  console.log(`Erreurs/donnees insuffisantes : ${compteurErreurs}`);
}

main().catch(err => console.error('Erreur fatale:', err));
