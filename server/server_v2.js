const express = require("express");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

const utilisateurSchema = new Schema({
    mail: { type: String, required: true, unique: true },
    prénom: { type: String, required: true },
    nom: { type: String, required: true },
    téléphone: { type: String, required: true }
})

const bienSchema = new Schema({
    idBien: { type: Number, required: true, unique: true },
    mailProprio: { type: String, required: true, ref: 'Utilisateur' }, // Clé étrangère vers Utilisateurs
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
    mailLocateur: { type: String, required: true, ref: 'utilisateurs' },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    avis: String
});


const Utilisateur = mongoose.model('utilisateurs', utilisateurSchema);
const Bien = mongoose.model('Biens', bienSchema);
const Location = mongoose.model('Locations', locationSchema);


app.listen(8888, () => {
    console.log("Serveur démarré")
});

const client = new MongoClient(url);

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

                // Récupérer tous les utilisateurs
                // app.get("/utilisateurs", async (req, res) => {
                //    try {
                //        let document = await db.collection("utilisateurs").find().toArray();
                //        res.json(document);
                //    } catch (error) {
                //        console.log("Erreur lors de la récupérations des utilisateurs:", error);
                //        res.status(500).json({error: "Une erreur est survenue"});
                //    }
                //
                // });

                app.get("/utilisateurs", async (req, res) => {

                    try {
                        const utilisateurs = await Utilisateur.find({});
                        res.json(utilisateurs);
                    } catch (error) {
                        res.status(500).send(error);
                    }

                });

                // Récupérer un utilisateur par son mail (identifiant)
                app.get("/utilisateurs/:mail", async (req, res) => {

                    try {
                        let document = await db.collection("utilisateurs").find({mail: req.params.mail}).toArray();
                        res.json(document);
                    } catch (error) {
                        console.log("Erreur lors de la récupérations des utilisateurs:", error);
                        res.status(500).json({error: "Une erreur est survenue"});
                    }
                });

                // Ajouter un utilisateur

                // Ancienne méthode
                // app.post("/utilisateurs/ajouter", async (req, res) => {
                //     const { mail, prenom, nom, telephone } = req.body;
                //
                //     //TODO Vous pouvez ajouter une validation ici pour vous assurer que les données sont correctes
                //
                //
                //     try {
                //         const newUser = {
                //             mail,
                //             prenom,
                //             nom,
                //             telephone
                //         };
                //         const result = await db.collection("utilisateurs").insertOne(newUser);
                //         res.status(201).json({ message: "Utilisateur créé avec succès", result: result });
                //     } catch (error) {
                //         console.error("Erreur lors de la création de l'utilisateur:", error);
                //         res.status(500).json({ error: "Une erreur est survenue lors de la création de l'utilisateur" });
                //     }
                //
                // });

                app.post("/utilisateurs/ajouter", async (req, res) => {
                    const { mail, prenom, nom, telephone } = req.body;

                    //TODO Vous pouvez ajouter une validation ici pour vous assurer que les données sont correctes

                    const nouveauUtilisateur =  new Utilisateur({
                        mail,
                        prenom,
                        nom,
                        telephone
                    });

                    await nouveauUtilisateur.save((err) => {
                        if (err) return console.error(err);
                        console.log("Utilisateur ajouté avec succès");
                    })

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

                // ### BIENS ###

                //TODO Faire les lien pour les "Biens"

                // Récupérer tous les biens
                app.get("/biens", async (req, res) => {
                    try {
                        const biens = await db.collection("biens").find().toArray();
                        res.status(200).json(biens);
                    } catch (error) {
                        console.error("Erreur lors de la récupération des biens:", error);
                        res.status(500).json({ error: "Une erreur est survenue" });
                    }
                });

                // Récupérer un bien par son id
                app.get("/biens/:idBien", async (req, res) => {
                    const idBien = req.params.idBien;

                    try {
                        const bien = await db.collection("biens").findOne({ idBien });
                        if (bien) {
                            res.status(200).json(bien);
                        } else {
                            res.status(404).json({ message: "Bien non trouvé" });
                        }
                    } catch (error) {
                        console.error("Erreur lors de la récupération du bien:", error);
                        res.status(500).json({ error: "Une erreur est survenue" });
                    }
                });

                // Ajouter un bien
                app.post("/biens/ajouter", async (req, res) => {
                    const { mailProprio, commune, rue, cp, nbCouchages, nbChambres, distance, prix } = req.body;

                    try {
                        const lastBien = await db.collection("biens").find().sort({ idBien: -1 }).limit(1).toArray();
                        const nextId = lastBien.length > 0 ? String(Number(lastBien[0].idBien) + 1) : "1";

                        const newBien = {
                            idBien: nextId, // Assurez-vous que cet ID est unique
                            mailProprio,
                            commune,
                            rue,
                            cp,
                            nbCouchages,
                            nbChambres,
                            distance,
                            prix
                        };

                        await db.collection("biens").insertOne(newBien);
                        res.status(201).json({ message: "Bien créé avec succès", bien: newBien });
                    } catch (error) {
                        console.error("Erreur lors de la création du bien:", error);
                        res.status(500).json({ error: "Une erreur est survenue lors de la création du bien" });
                    }
                });

                // Modifier un bien
                app.put("/biens/modifier/:idBien", async (req, res) => {
                    const idBien = req.params.idBien;
                    const updateData = req.body;

                    try {
                        const result = await db.collection("biens").updateOne({ idBien }, { $set: updateData });

                        if (result.matchedCount === 0) {
                            res.status(404).json({ message: "Bien non trouvé" });
                        } else {
                            res.status(200).json({ message: "Bien mis à jour avec succès", result: result });
                        }
                    } catch (error) {
                        console.error("Erreur lors de la mise à jour du bien:", error);
                        res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour du bien" });
                    }
                });

                // Supprimer un bien
                app.delete("/biens/supprimer/:idBien", async (req, res) => {
                    const idBien = req.params.idBien;

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

                // ### LOCATIONS ###

                // Récupérer toutes les locations
                app.get("/locations", async (req, res) => {
                    try {
                        const locations = await db.collection("locations").find().toArray();
                        res.json(locations);
                    } catch (error) {
                        console.error("Erreur lors de la récupération des locations:", error);
                        res.status(500).json({ error: "Une erreur est survenue" });
                    }
                });

                // Récupérer une location par son id
                app.get("/locations/:idLocation", async (req, res) => {
                    try {
                        const location = await db.collection("locations").findOne({ idLocation: req.params.idLocation });
                        if (location) {
                            res.json(location);
                        } else {
                            res.status(404).json({ message: "Location non trouvée" });
                        }
                    } catch (error) {
                        console.error("Erreur lors de la récupération de la location:", error);
                        res.status(500).json({ error: "Une erreur est survenue" });
                    }
                });

                // Ajouter une location
                app.post("/locations/ajouter", async (req, res) => {
                    try {
                        // Générer un nouvel ID pour la location
                        const nouvelIdLocation = new ObjectId(); // Ceci génère un nouvel ObjectId
                        const nouvelleLocation = {
                            idLocation: nouvelIdLocation.toString(),
                            ...req.body
                        };
                        const result = await db.collection("locations").insertOne(nouvelleLocation);
                        res.status(201).json({ message: "Location créée avec succès", result: result });
                    } catch (error) {
                        console.error("Erreur lors de la création de la location:", error);
                        res.status(500).json({ error: "Une erreur est survenue" });
                    }
                });

                // Modifier une location
                app.put("/locations/modifier/:idLocation", async (req, res) => {
                    const idLocation = req.params.idLocation;
                    const miseAJour = req.body;

                    try {
                        const result = await db.collection("locations").updateOne({ idLocation }, { $set: miseAJour });

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
                    const idLocation = req.params.idLocation;

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

                // OLD DATABASE

                app.get("/produits", async (req, res) => {
                    console.log("/produits");

                    try {
                        let documents = await db.collection("produits").find().toArray();
                        res.json(documents);
                    } catch (error) {
                        console.error("Erreur lors de la récupération des produits:", error);
                        res.status(500).json({ error: "Une erreur est survenue" });
                    }

                });

                app.get("/produits/:type", async (req, res) => {
                    console.log("/produits/"+req.params.type);
                    let documents = await db.collection("produits").find({type:req.params.type}).toArray();
                    res.json(documents);
                });

                app.get("/categories", async (req,res) => {
                    console.log("/categories");
                    categories = [];
                    let documents = await db.collection("produits").find().toArray();
                    for (let doc of documents) {
                        if (!categories.includes(doc.type)) categories.push(doc.type);
                    }
                    res.json(categories);
                });

                app.post("/user/connexion", async (req,res) => {
                    console.log("/user/connexion avec ", req.body);
                    let document = await db.collection("users").find(req.body).toArray();
                    if (document.length === 1)
                        res.json({"resultat": 1, "message": "Authentification réussie"});
                    else res.json({"resultat": 0, "message": "Email et/ou mot de passe incorrect"});
                });

                // FIN OLD DATABASE

            });
}

main();





