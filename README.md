# Proof-of-Concept
Proof of Concept per il capitolato Easy Meal.
## Installazione
*Aggiornare questa parte con le istruzioni per l'installazione del progetto.*

## Utilizzo di Docker Compose per avviare i container

Questo progetto utilizza Docker Compose per gestire l'avvio dei container Docker. Segui le istruzioni di seguito per avviare i container e utilizzare l'applicazione.

## Avvio dei container

Per avviare i container utilizzando Docker Compose, esegui il seguente comando nella directory del progetto:

```bash
docker-compose up
```

Questo comando avvierà i container secondo la configurazione definita nel file `docker-compose.yml`. Assicurati di avere Docker e Docker Compose installati sul tuo sistema prima di eseguire questo comando.

Una volta avviati i container, potrai accedere all'applicazione utilizzando il browser o gli strumenti di sviluppo appropriati.
Per esempio per poter accedere al progetto NextJS collegati al link: http://localhost:3000/create_reservation .

Tieni presente che NextJS utilizza la porta 3000, NestJS 6969 e Postgres utilizza 7070.

### Modifica dei file Dockerfile e compose.yaml
Se modifichi i file:
- Dockerfile
- compose.yaml

devi eseguire questo comando per applicare le modifiche

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