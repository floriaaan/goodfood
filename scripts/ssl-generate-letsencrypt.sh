#!/bin/bash

# Assurez-vous que Certbot est installé
if ! command -v certbot &> /dev/null; then
    echo "Certbot n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Replace these with your domain and custom directories
DOMAIN=""
CONFIG_DIR="./ssl/lets-encrypt/config"
WORK_DIR="./ssl/lets-encrypt/work"
LOGS_DIR="./ssl/lets-encrypt/logs"

# Générer un certificat Let's Encrypt pour le serveur web
certbot certonly  --standalone -d $DOMAIN --config-dir $CONFIG_DIR --work-dir $WORK_DIR --logs-dir $LOGS_DIR

# Assurez-vous que le certificat a été généré avec succès

if [ ! -f "$CONFIG_DIR/live/$DOMAIN/fullchain.pem" ] || [ ! -f "$CONFIG_DIR/live/$DOMAIN/privkey.pem" ]; then
    echo "Certificat Let's Encrypt pour le serveur web n'a pas été généré avec succès."
    exit 1
fi

# Copier les fichiers du certificat dans un répertoire de destination
DEST_DIR="./ssl/lets-encrypt"

# Créer un répertoire pour les certificats
mkdir -p $DEST_DIR

cp "$CONFIG_DIR/live/$DOMAIN/fullchain.pem" "$DEST_DIR/server.crt"
cp "$CONFIG_DIR/live/$DOMAIN/privkey.pem" "$DEST_DIR/server.key"

# Assurez-vous que les fichiers ont les autorisations appropriées
chmod 644 "$DEST_DIR/server.crt"
chmod 600 "$DEST_DIR/server.key"

echo "Certificat Let's Encrypt pour le serveur web généré avec succès et copié dans $DEST_DIR"
