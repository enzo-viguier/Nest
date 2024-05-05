require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const app = express();

const saltRounds = 10;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));
app.use(cookieParser());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

const MongoClient = require("mongodb").MongoClient;
// const url = "mongodb://localhost:27017";
const url = process.env.MONGO_URL;

// mongoose.connect("mongodb://localhost:27017/NEST");
mongoose.connect(process.env.MONGO_BD_URL);
mongoose.connection.on('error', console.error.bind(console, 'Erreur lors de la connexion à la base de données:'));

const utilisateurSchema = new Schema({
    mail: { type: String, required: true, unique: true },
    prénom: { type: String, required: true },
    nom: { type: String, required: true },
    téléphone: { type: String, required: true },
    motDePasse: { type: String, required: true }
})

const bienSchema = new Schema({
    idBien: { type: Number, required: true, unique: true },
    mailProprio: { type: String, required: true, ref: 'utilisateur' }, // Clé étrangère vers Utilisateurs
    commune: String,
    rue: String,
    cp: String,
    nbCouchages: Number,
    nbChambres: Number,
    distance: Number,
    prix: Number
});

const locationSchema = new Schema({
    idLocation: { type: Number, required: true, unique: true },
    idBien: { type: Number, required: true, ref: 'Bien' },
    mailLoueur: { type: String, required: true, ref: 'utilisateurs' },
    dateDébut: { type: String, required: true },
    dateFin: { type: String, required: true },
    avis: String
});


const Utilisateur = mongoose.model('utilisateurs', utilisateurSchema, 'utilisateurs');
const Bien = mongoose.model('Biens', bienSchema, "biens");
const Location = mongoose.model('Locations', locationSchema, "locations");


app.listen(8888, () => {
    console.log("Serveur démarré sur http://localhost:8888");
});

const client = new MongoClient(url);

function checkDates(dateDebut, dateFin) {
    const dateDebutInt = parseInt(dateDebut);
    const dateFinInt = parseInt(dateFin);

    return dateDebutInt < dateFinInt;

}

function createJWTToken(payload, secretKey, expiresIn) {
    return jwt.sign(payload, secretKey, { expiresIn });
}

async function main() {
    client.connect()
        .then(
            client => {
                db = client.db("NEST");

                //TODO Lors de la création de document qui possède une clé étrangère, il faut vérifier que la clé étrangère existe bien dans la collection associée

                app.get("/", (req, res) =>{
                    return res.send("Hello World");
                });

                // ### UTILISATEURS ###

                app.get("/utilisateurs", async (req, res) => {

                    try {
                        const utilisateurs = await Utilisateur.find({});
                        if (!utilisateurs) {
                            res.status(404).send('Aucun utilisateur trouvé');
                        }
                        else {
                            res.json(utilisateurs);
                        }
                    } catch (error) {
                        res.status(500).send(error);
                    }

                });

                app.get('/utilisateur/:mail', async (req, res) => {
                    const email = req.params.mail;
                    try {
                        const utilisateur = await Utilisateur.findOne({ mail: email });
                        if (!utilisateur) {
                            res.status(404).send('Utilisateur non trouvé');
                            console.log(res)
                        } else {
                            res.json(utilisateur);
                        }
                    } catch (err) {
                        res.status(500).send(err);
                    }
                });


                // Ajouter un utilisateur

                app.post('/utilisateurs/ajouter', async (req, res) => {
                    // Création d'une nouvelle instance de l'utilisateur avec les données reçues (ex. via le corps de la requête)

                    const hashedPassword = await bcrypt.hash(req.body.motDePasse, saltRounds);

                    const nouvelUtilisateur = new Utilisateur({
                        mail: req.body.mail,
                        prénom: req.body.prénom,
                        nom: req.body.nom,
                        téléphone: req.body.téléphone,
                        motDePasse: hashedPassword
                    });

                    try {
                        // Sauvegarde de l'utilisateur dans la base de données
                        const utilisateurEnregistre = await nouvelUtilisateur.save();
                        res.status(201).json(utilisateurEnregistre); // Envoi de l'utilisateur enregistré en réponse avec le statut 201 (Créé)
                    } catch (err) {
                        res.status(500).send(err); // En cas d'erreur, envoi d'une réponse avec le statut 500
                    }
                });


                // Modifier un utilisateur
                app.put("/utilisateurs/modifier/:mail", async (req, res) => {
                    const { prenom, nom, telephone } = req.body;
                    const mail = req.params.mail;

                    //TODO Vous pouvez ajouter une validation ici pour vous assurer que les données sont correctes

                    try {
                        const updatedData = {
                            ...(prenom && {prenom}),
                            ...(nom && {nom}),
                            ...(telephone && {telephone})
                        };

                        const result = await db.collection("utilisateurs").updateOne({ mail }, { $set: updatedData });

                        if (result.matchedCount === 0) {
                            res.status(404).json({ message: "Utilisateur non trouvé" });
                        } else {
                            res.status(200).json({ message: "Utilisateur mis à jour avec succès", result: result });
                        }
                    } catch (error) {
                        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
                        res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de l'utilisateur" });
                    }
                });

                // Supprimer un utilisateur
                app.delete("/utilisateurs/supprimer/:mail", async (req, res) => {
                    const mail = req.params.mail;

                    try {
                        const result = await db.collection("utilisateurs").deleteOne({ mail });

                        if (result.deletedCount === 0) {
                            res.status(404).json({ message: "Utilisateur non trouvé" });
                        } else {
                            res.status(200).json({ message: "Utilisateur supprimé avec succès", result: result });
                        }
                    } catch (error) {
                        console.error("Erreur lors de la suppression de l'utilisateur:", error);
                        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de l'utilisateur" });
                    }
                });

                // ### LOCATIONS ###

                // Récupérer toutes les biens
                app.get("/biens", async (req, res) => {

                        try {
                            const biens = await Bien.find({});
                            res.json(biens);
                        } catch (error) {
                            res.status(500).send(error);
                        }
                });

                // Récupérer un bien par son id
                app.get("/biens/:idBien", async (req, res) => {
                    const idBien = req.params.idBien;
                    try {
                        const bien = await Bien.findOne({ idBien: idBien });
                        if (!bien) {
                            res.status(404).send('Bien non trouvé');
                        } else {
                            res.json(bien);
                        }
                    } catch (err) {
                        res.status(500).send(err);
                    }
                });

                function formatDateString(dateString) {
                    if (!dateString) return undefined;
                    const parts = dateString.split('-');
                    if (parts.length !== 3) return undefined;

                    const [day, month, year] = parts;
                    return `${year}${month}${day}`;
                }

                app.post("/biens/filter", async (req, res) => {
                    try {
                        const { commune, nbCouchages, prix, nbChambres, distance, dateDébut, dateFin } = req.body;
                        let query = {};

                        if (commune) {
                            query.commune = commune;
                        }
                        if (nbCouchages) {
                            query.nbCouchages = { $gte: parseInt(nbCouchages) };
                        }
                        if (prix) {
                            query.prix = {$lte: parseInt(prix)};
                        }
                        if (nbChambres) {
                            query.nbChambres = { $gte: parseInt(nbChambres) };
                        }
                        if (distance) {
                            query.distance = { $lte: parseInt(distance) };
                        }

                        const startDate = formatDateString(dateDébut);
                        const endDate = formatDateString(dateFin);
                        if (startDate && endDate && checkDates(startDate, endDate)) {
                            // Query for overlapping locations
                            const overlappingLocations = await Location.find({
                                $or: [
                                    {dateDébut: {$lte: endDate, $gte: startDate}},
                                    {dateFin: {$gte: startDate, $lte: endDate}},
                                    {dateDébut: {$lte: startDate}, dateFin: {$gte: endDate}}
                                ]
                            }).distinct('idBien'); // Get the unique bien IDs that have overlaps

                            // Exclude these biens from the final query
                            if (overlappingLocations.length > 0) {
                                query.idBien = {$nin: overlappingLocations};
                            }
                        }
                            // Fetch biens that match the criteria and do not have overlapping bookings
                            const availableBiens = await Bien.find(query).lean();
                            res.json(availableBiens);

                    } catch (error) {
                        console.error("Error fetching filtered biens:", error);
                        res.status(500).send("Internal Server Error");
                    }
                });


                // Ajouter un bien
                app.post("/biens/ajouter", async (req, res) => {
                    // Extraction des données du corps de la requête
                    const idBien = await getNextIdBien();
                    const { mailProprio, commune, rue, cp, nbCouchages, nbChambres, distance, prix } = req.body;

                    try {
                        // Vérification de l'existence du propriétaire
                        const proprietaireExiste = await Utilisateur.findOne({ mail: mailProprio });

                        // Si le propriétaire n'existe pas, renvoyez une erreur
                        if (!proprietaireExiste) {
                            return res.status(400).json({ message: "Le mail du propriétaire n'existe pas dans la collection des utilisateurs." });
                        }

                        // Si le propriétaire existe, créez le bien
                        const nouveauBien = new Bien({
                            idBien,
                            mailProprio,
                            commune,
                            rue,
                            cp,
                            nbCouchages,
                            nbChambres,
                            distance,
                            prix
                        });

                        // Sauvegarde du bien dans la base de données
                        const bienEnregistre = await nouveauBien.save();
                        res.status(201).json(bienEnregistre);
                    } catch (err) {
                        console.error("Erreur lors de l'ajout du bien: ", err);
                        res.status(500).send(err);
                    }
                });

                // Modifier un bien
                app.put("/biens/modifier/:idBien", async (req, res) => {
                    const {
                        commune, rue, cp, nbCouchages, nbChambres, distance, prix
                    } = req.body;

                    const idBien = req.params.idBien; // Assuming idBien is passed as a URL parameter

// Construct the update object dynamically based on provided values
                    const updateData = {
                        ...(commune !== undefined && { commune }),
                        ...(rue !== undefined && { rue }),
                        ...(cp !== undefined && { cp }),
                        ...(nbCouchages !== undefined && { nbCouchages }),
                        ...(nbChambres !== undefined && { nbChambres }),
                        ...(distance !== undefined && { distance }),
                        ...(prix !== undefined && { prix })
                    };

                    Bien.findOneAndUpdate(
                        { idBien: idBien }, // Search criteria using custom field idBien
                        { $set: updateData }, // Set updated values
                        { new: true, runValidators: true } // Options to return updated doc and run schema validators
                    )
                        .then(updatedBien => {
                            if (!updatedBien) {
                                res.status(404).json({ message: 'Bien non trouvé' });
                            } else {
                                res.json(updatedBien); // Send back the updated document
                            }
                        })
                        .catch(error => {
                            console.error('Erreur lors de la mise à jour du bien:', error);
                            res.status(500).json({ error: 'Erreur interne du serveur' });
                        });
                });

                // Supprimer un bien
                app.delete("/biens/supprimer/:idBien", async (req, res) => {

                    const idBien = Number(req.params.idBien);

                    try {
                        const result = await db.collection("biens").deleteOne({ idBien });

                        if (result.deletedCount === 0) {
                            res.status(404).json({ message: "Bien non trouvé" });
                        } else {
                            res.status(200).json({ message: "Bien supprimé avec succès", result: result });
                        }
                    } catch (error) {
                        console.error("Erreur lors de la suppression du bien:", error);
                        res.status(500).json({ error: "Une erreur est survenue lors de la suppression du bien" });
                    }
                });

                // Endpoint pour récupérer la moyenne des avis d'un bien spécifique
                app.get("/biens/avis/:idBien", async (req, res) => {
                    const idBien = Number(req.params.idBien); // Assurez-vous que l'ID est bien un nombre

                    try {

                        const bien = await Bien.findOne({ idBien: idBien });
                        if (!bien) {
                            return res.status(404).json({ message: "Le bien n'existe pas." });
                        }

                        let moyenneDesAvis = 0;

                        // Récupérer tous les avis pour le bien spécifié
                        const locations = await Location.find({ idBien: idBien });
                        if (!locations || locations.length === 0) {
                            moyenneDesAvis = "Aucun avis";
                        }
                        else {
                            // Calculer la moyenne des avis
                            const sommeDesAvis = locations.reduce((acc, location) => {
                                return acc + (location.avis ? parseFloat(location.avis) : 0);
                            }, 0);
                            moyenneDesAvis = parseFloat((sommeDesAvis / locations.length).toFixed(1));
                        }

                        // Retourner la moyenne des avis
                        res.json({ moyenneDesAvis });
                    } catch (err) {
                        console.error("Erreur lors de la récupération des avis:", err);
                        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des avis." });
                    }
                });

                app.get("/biens/proprio/:mailProprio", async (req, res) => {
                    const mailProprio = req.params.mailProprio;
                    try {
                        const biens = await Bien.find({ mailProprio: mailProprio });
                        if (!biens) {
                            res.status(404).send('Bien non trouvé');
                        } else {
                            res.json(biens);
                        }
                    } catch (err) {
                        res.status(500).send(err);
                    }
                });

                // Endpoint pour récupérer l'utilisateur d'un bien spécifique
                app.get("/biens/user/:idBien", async (req, res) => {
                    const idBien = Number(req.params.idBien); // Assurez-vous que l'ID est bien un nombre

                    try {

                        // Récupère le mailProprio du bien
                        const bien = await Bien.findOne({ idBien: idBien });

                        // Vérifie si le bien existe
                        if (!bien) {
                            return res.status(404).json({ message: "Le bien n'existe pas." });
                        }

                        const mailProprio = bien.mailProprio;

                        // Récupère l'utilisateur avec le mailProprio
                        const utilisateur = await Utilisateur.findOne({ mail: mailProprio });

                        // Vérifie si l'utilisateur existe
                        if (!utilisateur) {
                            return res.status(404).json({ message: "L'utilisateur n'existe pas." });
                        }

                        res.json(utilisateur);

                    } catch (err) {
                        console.error("Erreur lors de la récupération de l'utilisateur:", err);
                        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de l'utilisateur." });
                    }
                });

                app.get("/biens/filter", async (req, res) => {

                    return res.send("Hello World");
                    // TODO : Implémenter la fonctionnalité de filtrage des biens

                });

                // ### LOCATIONS ###

                app.get("/locations/loueur/:mailLoueur", async (req, res) => {
                    const mailLoueur = req.params.mailLoueur;
                    try {
                        const location = await Location.find({ mailLoueur: mailLoueur });
                        if (!location) {
                            res.status(404).send('Location non trouvée');
                        } else {
                            res.json(location);
                        }
                    } catch (err) {
                        res.status(500).send(err);
                    }
                });

                // Récupérer toutes les locations
                app.get("/locations", async (req, res) => {
                    try {
                        const locations = await Location.find({});
                        res.json(locations);
                    } catch (error) {
                        res.status(500).send(error);
                    }
                });

                // Récupérer une location par son id
                app.get("/locations/:idLocation", async (req, res) => {
                    const idLocation = req.params.idLocation;
                    try {
                        const location = await Location.findOne({ idLocation: idLocation });
                        if (!location) {
                            res.status(404).send('Location non trouvée');
                        } else {
                            res.json(location);
                        }
                    } catch (err) {
                        res.status(500).send(err);
                    }
                });

                // Ajouter une location
                // app.post("/locations/ajouter", async (req, res) => {
                //     // Extraction des données du corps de la requête
                //     const { idLocation, idBien, mailLoueur, dateDébut, dateFin, avis } = req.body;
                //
                //     try {
                //         // Vérification de l'existence du locateur
                //         const locateurExiste = await Utilisateur.findOne({ mail: mailLoueur });
                //
                //         // Vérification de l'existence du bien
                //         const bienExiste = await Bien.findOne({ idBien: idBien });
                //
                //         // Si le locateur ou le bien n'existe pas, renvoyez une erreur
                //         if (!locateurExiste) {
                //             return res.status(400).json({ message: "Le mail du locateur n'existe pas dans la collection des utilisateurs." });
                //         }
                //
                //         if (!bienExiste) {
                //             return res.status(400).json({ message: "L'id du bien n'existe pas dans la collection des biens." });
                //         }
                //
                //         // Si le locateur et le bien existent, créez la location
                //         const nouvelleLocation = new Location({
                //             idLocation,
                //             idBien,
                //             mailLoueur,
                //             dateDébut,
                //             dateFin,
                //             avis
                //         });
                //
                //         // Sauvegarde de la location dans la base de données
                //         const locationEnregistree = await nouvelleLocation.save();
                //         res.status(201).json(locationEnregistree);
                //     } catch (err) {
                //         console.error("Erreur lors de l'ajout de la location: ", err);
                //         res.status(500).send(err);
                //     }
                // });

                async function getNextIdLocation() {
                    const lastLocation = await Location.findOne().sort({ idLocation: -1 }).exec();
                    return lastLocation ? lastLocation.idLocation + 1 : 1;
                }

                async function getNextIdBien() {
                    const lastBien = await Bien.findOne().sort({ idBien: -1 }).exec();
                    console.log("LAST BIEN : ", lastBien);
                    return lastBien ? lastBien.idBien + 1 : 1;
                }

                // Ajouter une location
                app.post("/locations/ajouter", async (req, res) => {
                    const idLocation = await getNextIdLocation();
                    const { idBien, mailLoueur, dateDébut, dateFin, avis } = req.body;
                    const debutNouvelleLocation = parseInt(dateDébut);
                    const finNouvelleLocation = parseInt(dateFin);


                    if (!checkDates(debutNouvelleLocation, finNouvelleLocation)) {
                        console.log("DATE DEBUT : " + debutNouvelleLocation);
                        console.log("DATE FIN : " + finNouvelleLocation);
                        console.log("RESULT : " + checkDates(debutNouvelleLocation, finNouvelleLocation));
                        return res.status(400).json({ message: "Error CheckDate" });
                    }
                    else {
                        console.log("Date is OK")
                    }

                    try {
                        // Vérification de l'existence du locateur
                        const locateurExiste = await Utilisateur.findOne({ mail: mailLoueur });

                        // Vérification de l'existence du bien
                        const bienExiste = await Bien.findOne({ idBien: idBien });

                        // Si le locateur ou le bien n'existe pas, renvoyez une erreur
                        if (!locateurExiste) {
                            return res.status(400).json({ message: "Le mail du locateur n'existe pas dans la collection des utilisateurs." });
                        }

                        if (!bienExiste) {
                            return res.status(400).json({ message: "L'id du bien n'existe pas dans la collection des biens." });
                        }

                        const listeLocationsExistantes = await Location.find({ idBien: idBien });

                        console.log(listeLocationsExistantes);
                        console.log("--------------------");

                        for (let location of listeLocationsExistantes) {

                            const debutExistante = parseInt(location.dateDébut);
                            const finExistante = parseInt(location.dateFin);

                            if (debutNouvelleLocation < debutExistante && finNouvelleLocation > debutExistante && finNouvelleLocation < finExistante) {
                                return res.status(400).json({ message: "Chevauchement de dates" });
                            }

                            if (debutNouvelleLocation > debutExistante && debutNouvelleLocation < finExistante && finNouvelleLocation > finExistante) {
                                return res.status(400).json({ message: "Chevauchement de dates" });
                            }

                            if (debutNouvelleLocation < debutExistante && finExistante < finNouvelleLocation) {
                                return res.status(400).json({ message: "Chevauchement de dates" });
                            }

                            if (debutExistante < debutNouvelleLocation && finNouvelleLocation < finExistante) {
                                return res.status(400).json({ message: "Chevauchement de dates" });
                            }

                        }

                        console.log("Je suis passé !")

                        // Si le locateur et le bien existent, créez la location
                        const nouvelleLocation = new Location({
                            idLocation,
                            idBien,
                            mailLoueur,
                            dateDébut,
                            dateFin,
                            avis
                        });

                        // Sauvegarde de la location dans la base de données
                        const locationEnregistree = await nouvelleLocation.save();
                        res.status(201).json(locationEnregistree);

                    } catch (err) {
                        console.error("Erreur lors de l'ajout de la location: ", err);
                        res.status(500).send(err);
                    }

                });


                // Modifier une location
                app.put("/locations/modifier/:idLocation", async (req, res) => {

                    const { dateDébut, dateFin, avis } = req.body;
                    const idLocation = Number(req.params.idLocation);

                    try {
                        const updatedData = {
                            ...(dateDébut && {dateDébut}),
                            ...(dateFin && {dateFin}),
                            ...(avis && {avis})
                        };

                        const result = await db.collection("locations").updateOne({ idLocation }, { $set: updatedData });

                        if (result.matchedCount === 0) {
                            res.status(404).json({ message: "Location non trouvée" });
                        } else {
                            res.status(200).json({ message: "Location mise à jour avec succès", result: result });
                        }

                    } catch (error) {
                        console.error("Erreur lors de la mise à jour de la location:", error);
                        res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de la location" });
                    }

                });

                // Supprimer une location
                app.delete("/locations/supprimer/:idLocation", async (req, res) => {

                    const idLocation = Number(req.params.idLocation);

                    try {
                        const result = await db.collection("locations").deleteOne({ idLocation });

                        if (result.deletedCount === 0) {
                            res.status(404).json({ message: "Location non trouvée" });
                        } else {
                            res.status(200).json({ message: "Location supprimée avec succès", result: result });
                        }
                    } catch (error) {
                        console.error("Erreur lors de la suppression de la location:", error);
                        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de la location" });
                    }
                });

                app.post("/utilisateur/connexion", async (req, res) => {
                    try {
                        const utilisateur = await Utilisateur.findOne({ mail: req.body.mail });
                        if (utilisateur) {
                            // Comparez le mot de passe fourni avec le haché stocké
                            const match = await bcrypt.compare(req.body.motDePasse, utilisateur.motDePasse);
                            if (match) {
                                // Authentification réussie
                                res.json({ "resultat": 1, "message": "Authentification réussie" });
                            } else {
                                // Échec de l'authentification
                                res.json({ "resultat": 0, "message": "Mot de passe incorrect" });
                            }
                        } else {
                            res.status(404).json({ message: "Utilisateur non trouvé" });
                        }
                    } catch (err) {
                        // Gestion des erreurs
                    }
                });

                app.get("biens/user/:mail", async (req, res) => {
                    const email = req.params.mail;
                    try {
                        const utilisateur = await Utilisateur.findOne({ mail: email });
                        if (!utilisateur) {
                            res.status(404).send('Utilisateur non trouvé');
                        } else {
                            res.json(utilisateur);
                        }
                    } catch (err) {
                        res.status(500).send(err);
                    }
                });

                app.get('/api/images', async (req, res) => {
                    const images = await fetchImages();
                    res.json({ images });
                });


                app.post('/connexion', async (req, res) => {
                    const { mail, motDePasse } = req.body;
                    try {
                        const utilisateur = await Utilisateur.findOne({ mail });
                        if (!utilisateur) {
                            return res.status(404).json({ message: "Utilisateur non trouvé" });
                        }

                        const match = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
                        if (match) {

                            const payload = {
                                mail: utilisateur.mail,
                                prénom: utilisateur.prénom,
                                nom: utilisateur.nom,
                                téléphone: utilisateur.téléphone
                            };

                            const secretKey = process.env.JWT_SECRET_KEY;
                            const expireIn = '1h';

                            const token = createJWTToken(payload, secretKey, expireIn);

                            console.log("Token: ", token)
                            console.log("Token decoded: ", jwt.decode(token));

                            const cookieOptions = {
                                maxAge: 1000 * 60 * 60, // 1 hour
                                sameSite: 'Lax',
                                httpOnly: false,
                                secure: false
                            }

                            let tokenJson = {
                                token: token,
                            };

                            console.log("Token JSON: ", tokenJson)

                            res.cookie('nest', token, cookieOptions);
                            return res.status(200).json(tokenJson);

                        } else {
                            return res.status(401).json({ message: "Mot de passe incorrect" });
                        }
                    } catch (err) {
                        console.error("Erreur lors de l'authentification:", err);
                        res.status(500).json({ error: "Une erreur est survenue lors de l'authentification" });
                    }
                });


                // OLD DATABASE

                // app.post("/user/connexion", async (req,res) => {
                //     console.log("/user/connexion avec ", req.body);
                //     let document = await db.collection("users").find(req.body).toArray();
                //     if (document.length === 1)
                //         res.json({"resultat": 1, "message": "Authentification réussie"});
                //     else res.json({"resultat": 0, "message": "Email et/ou mot de passe incorrect"});
                // });

                // FIN OLD DATABASE

            });

    app.post("/token", (req, res) => {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Non autorisé" });
            }
            res.json(decoded);
        });
    });

}

async function fetchImages() {
    try {
        const response = await axios.get('https://pixabay.com/api/?key=43721256-8a1e714a0918566e71762d223&q=house&image_type=photo&pretty=true');
        const webformatURLs = response.data.hits.map(hit => hit.webformatURL);
        return webformatURLs;
    } catch (error) {
        console.error('Erreur lors de la récupération des images:', error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

main();





