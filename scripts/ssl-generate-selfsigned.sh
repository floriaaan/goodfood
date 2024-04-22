#!/bin/bash

# Créer un répertoire pour les certificats
CERT_DIR="./ssl/self-signed"
mkdir -p $CERT_DIR

# Générer une clé privée pour le serveur
openssl genpkey -algorithm RSA -out "$CERT_DIR/server.key" -aes256

# Générer un certificat auto-signé pour le serveur
openssl req -new -key "$CERT_DIR/server.key" -out "$CERT_DIR/server.csr"
openssl x509 -req -days 365 -in "$CERT_DIR/server.csr" -signkey "$CERT_DIR/server.key" -out "$CERT_DIR/server.crt"

# Générer une clé privée pour le client
openssl genpkey -algorithm RSA -out "$CERT_DIR/client.key" -aes256

# Générer un certificat auto-signé pour le client
openssl req -new -key "$CERT_DIR/client.key" -out "$CERT_DIR/client.csr"
openssl x509 -req -days 365 -in "$CERT_DIR/client.csr" -signkey "$CERT_DIR/client.key" -out "$CERT_DIR/client.crt"

# Assurez-vous que les fichiers ont les autorisations appropriées
chmod 600 "$CERT_DIR/server.key" "$CERT_DIR/client.key"

echo "Certificats auto-signés pour le serveur et le client gRPC générés avec succès dans $CERT_DIR"
