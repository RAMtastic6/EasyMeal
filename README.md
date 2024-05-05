# EasyMeal
Progetto del gruppo 14 per il capitolato Easy Meal.

## Download del progetto

**Clonare il repository del progetto**:
   
    ```bash
    git clone https://github.com/tuoutis/easy-meal.git
    cd easy-meal
    ```

## Procedimento per avviare l'applicazione:

- [Docker](#docker)
- [Npm](#npm) 

N.B: Si consiglia il metodo npm durante lo sviluppo poichè supporta il fast refresh

## Docket <a name="docker"></a>

Questo progetto utilizza Docker Compose per gestire l'avvio dei container Docker. Segui le istruzioni di seguito per avviare i container e utilizzare l'applicazione.

### Avvio dei container

Per avviare i container utilizzando Docker Compose, esegui il seguente comando nella directory del progetto:

```bash
docker-compose up
```

Questo comando avvierà i container secondo la configurazione definita nel file `docker-compose.yml`. Assicurati di avere Docker e Docker Compose installati sul tuo sistema prima di eseguire questo comando.

Una volta avviati i container, potrai accedere all'applicazione utilizzando il browser o gli strumenti di sviluppo appropriati.
Per esempio per poter accedere al progetto NextJS collegati al link: http://localhost:3000/create_reservation .

Tieni presente che NextJS utilizza la porta 3000, NestJS 6969 e Postgres utilizza 7070.

### Modifica dei file Dockerfile e compose.yaml
Se modifichi i files devi usare ctrl-c sul termianle e premere S per fermare l'applicazione.
Per applicare le modifiche e far partire il progetto devi usare:

```bash
docker-compose up --build
```

## Ripetizione del processo

Se desideri ricreare completamente l'ambiente, per esempio ricaricare il database dal file init.sql in "postgres/" e avviare nuovamente i container, è possibile utilizzare il seguente comando:

```bash
docker-compose down -v
```

Questo comando fermerà e rimuoverà tutti i container definiti nel file `docker-compose.yml`, e rimuoverà anche i volumi Docker associati. L'opzione `-v` viene utilizzata per rimuovere anche i volumi, quindi tutti i dati persistenti all'interno dei volumi verranno eliminati.

Dopo aver eseguito `docker-compose down -v`, puoi eseguire nuovamente `docker-compose up` per ricreare l'ambiente e avviare i container nuovamente.

Assicurati di avere un backup dei dati importanti prima di eseguire `docker-compose down -v`, poiché i dati non saranno più recuperabili una volta eliminati.

Per ulteriori informazioni su Docker Compose, consulta la documentazione ufficiale: https://docs.docker.com/compose/

## NPM <a name="npm"></a>

**Senza Docker**

### Prerequisiti
- Node.js
- npm (Node Package Manager)
- postgresSQL

N.B: Si ricorda che bisogna importare il dump del database nel proprio computer, per farlo si puo usare pgAdmin

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

6. **Avviare il server backend Nest.js**:

    ```bash
    npm run start:dev
    ```

7. **Accedere all'applicazione**:
   
   Una volta avviati sia il server backend Nest.js che il server frontend Next.js, è possibile accedere all'applicazione utilizzando il browser. Apri il browser e vai all'indirizzo [http://localhost:3000/create_reservation](http://localhost:3000/create_reservation) per accedere alla pagina di creazione delle prenotazioni.
