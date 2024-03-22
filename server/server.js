var express = require("express");
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";
app.listen(8888, () => {
    console.log("Serveur démarré")
});

const client = new MongoClient(url);

async function main() {
    client.connect()
        .then(
            client => {
                db = client.db("NEST");

                app.get("/", (req, res) =>{
                    return res.send("Hello World");
                });

                // UTILISATEURS

                app.get("/utilisateurs", async (req, res) => {
                   try {
                       let document = await db.collection("utilisateurs").find().toArray();
                       res.json(document);
                   } catch (error) {
                       console.log("Erreur lors de la récupérations des utilisateurs:", error);
                       res.status(500).json({error: "Une erreur est survenue"});
                   }

                });

                //TODO Continuer les liens pour utilisateur

                // BIENS

                //TODO Faire les lien pour les "Biens"

                // LOCATIONS

                //TODO Faire les lien pour les "Locations"


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
                    if (document.length == 1)
                        res.json({"resultat": 1, "message": "Authentification réussie"});
                    else res.json({"resultat": 0, "message": "Email et/ou mot de passe incorrect"});
                });

                // FIN OLD DATABASE

            });
}

main();





