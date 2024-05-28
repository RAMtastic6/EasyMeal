const socket = process.env.SOCKET;
const backend = process.env.BACKEND_HOST;

export class Endpoints {
    //Questo file contiene gli url utili per effetuare
    //il fetch dei dati dal DB
    static readonly host = "http://" + backend + ":6969/";
    static readonly restaurant = Endpoints.host + "restaurant/";
    static readonly reservation = Endpoints.host + "reservation/";
    static readonly user = Endpoints.host + "user/"; 
    static readonly order = Endpoints.host + "orders/";
    static readonly socket = "http://" + "localhost" +":8000/";
    static readonly staff = Endpoints.host + "staff/";
    static readonly daysopen = Endpoints.host + "daysopen/";
    static readonly menu = Endpoints.host + "menu/";
    static readonly notification = Endpoints.host + "notification/";
    static readonly authentication = Endpoints.host + "authentication/";

    static readonly socketNotfication = Endpoints.socket + "notification";
}
