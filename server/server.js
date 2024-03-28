const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');

const Schema = mongoose.Schema;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

mongoose.connect("mongodb://localhost:27017/NEST");
mongoose.connection.on('error', console.error.bind(console, 'Erreur lors de la connexion à la base de données:'));

const utilisateurSchema = new Schema({
    mail: { type: String, required: true, unique: true },
    prénom: { type: String, required: true },
    nom: { type: String, required: true },
    téléphone: { type: String, required: true }
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
    mailLocateur: { type: String, required: true, ref: 'utilisateurs' },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    avis: String
});


const Utilisateur = mongoose.model('utilisateurs', utilisateurSchema, 'utilisateurs');
const Bien = mongoose.model('Biens', bienSchema, "biens");
const Location = mongoose.model('Locations', locationSchema, "locations");


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

                app.get('/utilisateurs/:mail', async (req, res) => {
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


                // Ajouter un utilisateur

                app.post('/utilisateurs/ajouter', async (req, res) => {
                    // Création d'une nouvelle instance de l'utilisateur avec les données reçues (ex. via le corps de la requête)
                    const nouvelUtilisateur = new Utilisateur({
                        mail: req.body.mail,
                        prénom: req.body.prénom,
                        nom: req.body.nom,
                        téléphone: req.body.téléphone
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

                app.get("/biens", async (req, res) => {

                        try {
                            const biens = await Bien.find({});
                            res.json(biens);
                        } catch (error) {
                            res.status(500).send(error);
                        }
                });

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

                // OLD DATABASE

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





