#!/bin/bash

# Importe la collection "users" dans la base de données "NEST"
mongoimport --db NEST --collection users --file users.json --jsonArray --drop

# Importe la collection "produits" dans la base de données "NEST"
mongoimport --db NEST --collection produits --file produits.json --jsonArray --drop

# Importe la collection "marques" dans la base de données "NEST"
mongoimport --db NEST --collection marques --file marques.json --jsonArray --drop

# NEW

mongoimport --db NEST --collection utilisateurs --file utilisateurs.json --jsonArray --drop
mongoimport --db NEST --collection biens --file biens.json --jsonArray --drop
mongoimport --db NEST --collection locations --file locations.json --jsonArray --drop
