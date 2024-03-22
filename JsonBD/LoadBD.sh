#!/bin/bash

mongoimport --db NEST --collection utilisateurs --file utilisateurs.json --jsonArray --drop
mongoimport --db NEST --collection biens --file biens.json --jsonArray --drop
mongoimport --db NEST --collection locations --file locations.json --jsonArray --drop
