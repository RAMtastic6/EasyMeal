# Usa un'immagine di Node.js come base
FROM node:21

# Imposta il working directory nell'applicazione
WORKDIR /var/socket

# Copia il package.json e l'package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice sorgente nell'immagine Docker
COPY . .

# Espone la porta su cui l'applicazione è in ascolto
EXPOSE 8000 