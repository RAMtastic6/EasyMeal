import { getMenuByRestaurantId } from "./menu";
import { getReservation, getReservationById } from "./reservation";
import { getCities, getCuisines, getRestaurants, getRestaurantById } from "./restaurant";

//prova per la connessione al DB
//FIXME: da rimuovere, sostituire con i test
export async function prova() {
    console.log("Ristoranti");
    console.log(await getRestaurants());
    console.log("Cucine");
    console.log(await getCuisines());
    console.log("Città");
    console.log(await getCities());
    console.log("Prenotazioni");
    console.log(await getReservation());
    console.log("Prenotazione con id 1");
    console.log(await getReservationById(1));
    console.log("Ristorante con id 1");
    console.log(await getRestaurantById(1));
    console.log("Menu del ristorante con id 1");
    console.log(await getMenuByRestaurantId(1));
}