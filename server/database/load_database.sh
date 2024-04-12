#!/bin/bash

# Fonction pour exécuter des requêtes HTTP depuis un fichier .http
execute_requests() {
    while IFS= read -r line; do
        # Vérifier si la ligne contient une méthode HTTP comme POST
        if [[ "$line" == POST* ]]; then
            url=$(echo "$line" | awk '{print $2}') # Extraire l'URL
            echo "Envoi de la requête à $url"
        elif [[ "$line" == Content-Type* ]]; then
            content_type=$(echo "$line" | awk '{print $2}')
        elif [[ "$line" == '{'* ]]; then
            # Commencer à lire le corps JSON
            json="$line"
            while IFS= read -r line && [[ "$line" != '}' ]]; do
                json+=$'\n'"$line"
            done
            json+=$'\n'"$line" # Ajouter la dernière ligne du JSON
            # Envoyer la requête
            curl -X POST "$url" -H "Content-Type: $content_type" -d "$json"
            echo "Requête envoyée."
        fi
    done < "$1"
}

echo "Début du chargement des données..."

# Exécution des requêtes pour les utilisateurs
echo "Chargement des utilisateurs..."
execute_requests "utilisateurs_loader.http"

# Exécution des requêtes pour les biens
echo "Chargement des biens..."
execute_requests "biens_loader.http"

# Exécution des requêtes pour les locations
echo "Chargement des locations..."
execute_requests "locations_loader.http"

echo "Chargement terminé."
