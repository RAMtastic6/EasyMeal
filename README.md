# EasyMeal
Progetto del gruppo 14 per il capitolato Easy Meal.

## Download del progetto

**Clonare il repository del progetto**:
   
```bash
git clone https://github.com/RAMtastic6/EasyMeal.git
cd easy-meal
```

## Procedimento per avviare l'applicazione:

- [Docker](#docker) **consigliato**
- [Npm](#npm) 


## <a name="docker"></a> Docker

Questo progetto utilizza Docker Compose per gestire l'avvio dei container Docker. Segui le istruzioni di seguito per avviare i container e utilizzare l'applicazione.

### Avvio dei container

Per avviare i container utilizzando Docker Compose, esegui il seguente comando nella directory del progetto:

```bash
docker-compose up
```

**Sviluppo locale:**

Se intendi usare docker per lo sviluppo locale allora utilizza il seguente comando per vedere in "tempo reale" le modifiche:

```bash
docker-compose watch
```

**N.B:**: per fermare i container dopo "watch" non basta ctrl-c ma bisogna usare:

```bash
docker-compose stop
```

Se invece intendi solo far partire i servizi senza che la console di comando attendi la chiusura usa:

```bash
docker-compose up -d
```

Una volta avviati i container, potrai accedere all'applicazione utilizzando il browser o gli strumenti di sviluppo appropriati.
Per esempio per poter accedere al progetto NextJS collegati al link: http://localhost:3000/create_reservation .

Tieni presente che NextJS utilizza la porta 3000, NestJS 6969, Postgres utilizza 7070 e Socket 8000.

### Modifica dei file Dockerfile e compose.yaml
Per applicare le modifiche e far partire il progetto devi usare:

```bash
docker-compose up --build
```

## Ripetizione del processo

Se desideri cancellare completamente l'ambiente è possibile utilizzare il seguente comando:

```bash
docker-compose down -v
```

Per ulteriori informazioni su Docker Compose, consulta la documentazione ufficiale: https://docs.docker.com/compose/

## <a name="npm"></a> NPM

**Senza Docker**

### Prerequisiti
- Node.js
- npm (Node Package Manager)
- postgresSQL

**N.B**: Si ricorda che bisogna importare il dump del database nel proprio computer, per farlo si puo usare pgAdmin

1. **Installare le dipendenze per il backend Nest.js**:

```bash
cd nest-js
npm install
``` 

2. **Avviare il server backend Nest.js**:

```bash
npm run start:dev
```

3. **Installare le dipendenze per il frontend Next.js**:
    Aprire una nuova shell lasciando la precedente in esecuzione

```bash
cd next-js
npm install
```

4. **Avviare il server frontend Next.js**:

```bash
npm run dev
```

5. **Installare le dipendenze per il progetto socket Nest.js**:

```bash
cd websocket-server
npm install
```

6. **Avviare il server socket Nest.js**:

```bash
npm run start:dev
```

7. **Accedere all'applicazione**:
   
   Una volta avviati sia il server backend Nest.js che il server frontend Next.js, è possibile accedere all'applicazione utilizzando il browser. Apri il browser e vai all'indirizzo [http://localhost:3000/create_reservation](http://localhost:3000/create_reservation) per accedere alla pagina di creazione delle prenotazioni.

