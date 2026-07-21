function creerHoraires(config) {
  const jours = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
  const noms = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  const resultat = {};
  jours.forEach((j, i) => {
    const [amOuv, amFer, pmOuv, pmFer] = config[j];
    resultat[noms[i]] = {
      matin: amOuv === 'Fermé' ? null : [amOuv, amFer],
      apresmidi: pmOuv === 'Fermé' ? null : [pmOuv, pmFer]
    };
  });
  return resultat;
}

export const annuaire = [
  {
    categorie: "Alimentation / Boulangerie", nom: "Boulangerie LOISANCE", commune: "Piré-Chancé", adresse: "Centre-bourg", telephone: "02 99 44 41 54",
    horaires: creerHoraires({
      lun: ['Fermé', 'Fermé', 'Fermé', 'Fermé'], mar: ['07:00', '13:00', '15:00', '19:30'], mer: ['07:00', '13:00', '15:00', '19:30'],
      jeu: ['07:00', '13:00', '15:00', '19:30'], ven: ['07:00', '13:00', '15:00', '19:30'], sam: ['07:30', '13:00', '15:00', '19:00'], dim: ['07:30', '12:30', 'Fermé', 'Fermé'],
    })
  },
  {
    categorie: "Restauration", nom: "ROZA Restaurant & Bar", commune: "Châteaubourg", adresse: "Espace Fayelle", telephone: "02 58 47 35 45",
    horaires: creerHoraires({
      lun: ['Fermé', 'Fermé', 'Fermé', 'Fermé'], mar: ['12:00', '14:00', '19:00', '22:00'], mer: ['12:00', '14:00', '19:00', '22:00'],
      jeu: ['12:00', '14:00', '19:00', '23:00'], ven: ['12:00', '14:00', '19:00', '23:00'], sam: ['Fermé', 'Fermé', '19:00', '23:30'], dim: ['Fermé', 'Fermé', 'Fermé', 'Fermé'],
    })
  },
  {
    categorie: "Restauration", nom: "B FAST FOOD", commune: "Bais", adresse: "13, place de l'Ancien Marché", telephone: "02 90 70 33 09",
    horaires: creerHoraires({
      lun: ['Fermé', 'Fermé', '18:30', '21:30'], mar: ['Fermé', 'Fermé', '18:30', '21:30'], mer: ['11:30', '13:30', '18:30', '21:30'],
      jeu: ['11:30', '13:30', '18:30', '21:30'], ven: ['11:30', '13:30', '18:30', '22:30'], sam: ['Fermé', 'Fermé', '18:30', '22:30'], dim: ['Fermé', 'Fermé', '18:30', '21:30'],
    })
  },
  { categorie: "Services / Auto", nom: "Sécuritest Auto Bilan", commune: "Châteaubourg", adresse: "Zone Artisanale", telephone: "02 99 00 87 22", horaires: null },
  { categorie: "Restauration / Hôtel", nom: "Auberge des Tilleuls", commune: "Piré-Chancé", adresse: "Place de l'Église", telephone: "02 99 44 40 00", horaires: null },
  { categorie: "Services / Beauté", nom: "Le Salon de Manuella", commune: "Piré-Chancé", adresse: "Rue principale", telephone: "02 99 44 45 45", horaires: null },
  { categorie: "Alimentation / Boulangerie", nom: "Boulangerie Artisanale", commune: "Domagné", adresse: "Place de l'Église", telephone: "02 99 00 00 00", horaires: null },
  { categorie: "Commerce / Fleurs", nom: "Châteaugiron Fleurs", commune: "Châteaugiron", adresse: "Rue de la Madeleine", telephone: "02 99 37 00 00", horaires: null },
  {
    categorie: "Alimentation / Boucherie", nom: "Boucherie Castelgironnaise", commune: "Châteaugiron", adresse: "Grande Rue", telephone: "02 99 37 11 11",
    horaires: creerHoraires({
      lun: ['Fermé', 'Fermé', 'Fermé', 'Fermé'], mar: ['08:00', '12:45', '15:30', '19:15'], mer: ['08:00', '12:45', '15:30', '19:15'],
      jeu: ['08:00', '12:45', '15:30', '19:15'], ven: ['08:00', '12:45', '15:30', '19:15'], sam: ['08:00', '13:00', '15:30', '19:00'], dim: ['09:00', '12:15', 'Fermé', 'Fermé'],
    })
  },
  {
    categorie: "Services / Coiffure", nom: "Domloup Coiffure", commune: "Domloup", adresse: "Centre Commercial", telephone: "02 99 37 22 22",
    horaires: creerHoraires({
      lun: ['Fermé', 'Fermé', 'Fermé', 'Fermé'], mar: ['09:00', '12:00', '14:00', '19:00'], mer: ['09:00', '12:00', '14:00', '19:00'],
      jeu: ['09:00', '12:00', '14:00', '19:00'], ven: ['09:00', '12:00', '14:00', '19:30'], sam: ['08:30', '17:00', 'Fermé', 'Fermé'], dim: ['Fermé', 'Fermé', 'Fermé', 'Fermé'],
    })
  },
  {
    categorie: "Commerce / Fleurs", nom: "Domagné Fleurs", commune: "Domagné", adresse: "Place de l'Église", telephone: "02 99 49 05 05",
    horaires: creerHoraires({
      lun: ['Fermé', 'Fermé', 'Fermé', 'Fermé'], mar: ['09:00', '12:15', '14:30', '19:00'], mer: ['09:00', '12:15', '14:30', '19:00'],
      jeu: ['09:00', '12:15', '14:30', '19:00'], ven: ['09:00', '12:15', '14:30', '19:30'], sam: ['09:00', '12:30', '14:30', '19:00'], dim: ['09:30', '12:30', 'Fermé', 'Fermé'],
    })
  },
  {
    categorie: "Services / Auto", nom: "Garage de l'Ille", commune: "Saint-Didier", adresse: "Zone Artisanale", telephone: "02 99 00 45 45",
    horaires: creerHoraires({
      lun: ['08:30', '12:00', '14:00', '18:30'], mar: ['08:30', '12:00', '14:00', '18:30'], mer: ['08:30', '12:00', '14:00', '18:30'],
      jeu: ['08:30', '12:00', '14:00', '18:30'], ven: ['08:30', '12:00', '14:00', '18:00'], sam: ['09:00', '12:00', 'Fermé', 'Fermé'], dim: ['Fermé', 'Fermé', 'Fermé', 'Fermé'],
    })
  },
  {
    categorie: "Alimentation / Boulangerie", nom: "Le Semoir", commune: "Châteaubourg", adresse: "Rue de Rennes", telephone: "02 23 37 12 67",
    horaires: creerHoraires({
      lun: ['07:15', '13:00', '15:30', '19:15'], mar: ['07:15', '13:00', '15:30', '19:15'], mer: ['07:15', '13:00', '15:30', '19:15'],
      jeu: ['07:15', '13:00', '15:30', '19:15'], ven: ['07:15', '13:00', '15:30', '19:15'], sam: ['07:15', '13:00', '15:30', '19:00'], dim: ['07:30', '12:30', 'Fermé', 'Fermé'],
    })
  },
  {
    categorie: "Santé / Pharmacie", nom: "Pharmacie du Centre", commune: "Châteaubourg", adresse: "Centre-ville", telephone: "02 99 00 31 18",
    horaires: creerHoraires({
      lun: ['09:00', '12:30', '14:00', '19:30'], mar: ['09:00', '12:30', '14:00', '19:30'], mer: ['09:00', '12:30', '14:00', '19:30'],
      jeu: ['09:00', '12:30', '14:00', '19:30'], ven: ['09:00', '12:30', '14:00', '19:30'], sam: ['09:00', '12:30', '14:00', '18:00'], dim: ['Fermé', 'Fermé', 'Fermé', 'Fermé'],
    })
  },
  {
    categorie: "Commerce / Fleurs", nom: "Rozabelle", commune: "Châteaubourg", adresse: "9 rue Louis Pasteur", telephone: "02 99 00 81 27",
    horaires: creerHoraires({
      lun: ['Fermé', 'Fermé', 'Fermé', 'Fermé'], mar: ['09:00', '12:30', '14:30', '19:15'], mer: ['09:00', '12:30', '14:30', '19:15'],
      jeu: ['09:00', '12:30', '14:30', '19:15'], ven: ['09:00', '12:30', '14:30', '19:30'], sam: ['09:00', '13:00', '14:30', '19:00'], dim: ['09:30', '12:30', 'Fermé', 'Fermé'],
    })
  },
  {
    categorie: "Commerce / Chaussures", nom: "Aux pieds des artistes", commune: "Châteaubourg", adresse: "Rue de la Gare", telephone: "09 75 27 04 42",
    horaires: creerHoraires({
      lun: ['Fermé', 'Fermé', '14:30', '19:00'], mar: ['09:30', '12:30', '14:30', '19:00'], mer: ['09:30', '12:30', '14:30', '19:00'],
      jeu: ['09:30', '12:30', '14:30', '19:00'], ven: ['09:30', '12:30', '14:30', '19:00'], sam: ['09:30', '12:30', '14:30', '18:30'], dim: ['Fermé', 'Fermé', 'Fermé', 'Fermé'],
    })
  },
  {
    categorie: "Services / Coiffure", nom: "Atelier SG", commune: "Bais", adresse: "11 place de l'Ancien Marché", telephone: "02 99 00 11 22",
    horaires: creerHoraires({
      lun: ['Fermé', 'Fermé', 'Fermé', 'Fermé'], mar: ['09:00', '12:00', '14:00', '19:00'], mer: ['09:00', '12:00', '14:00', '19:00'],
      jeu: ['09:00', '19:00', 'Fermé', 'Fermé'], ven: ['08:30', '16:00', 'Fermé', 'Fermé'], sam: ['Fermé', 'Fermé', 'Fermé', 'Fermé'], dim: ['Fermé', 'Fermé', 'Fermé', 'Fermé'],
    })
  },
];
