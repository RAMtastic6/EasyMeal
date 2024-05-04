# Usa un'immagine di Node.js come base
FROM node:21

# Imposta la directory di lavoro all'interno del contenitore
WORKDIR /app

# Copia i file di dipendenza
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia i file dell'applicazione nell'immagine
COPY . .

# Esponi la porta su cui verrà eseguita l'applicazione
EXPOSE 3000