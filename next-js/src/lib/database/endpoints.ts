export class Endpoints {
    //Questo file contiene gli url utili per effetuare
    //il fetch dei dati dal DB
    static readonly host = "http://localhost:6969/";
    static readonly restaurant = Endpoints.host + "restaurant/";
    static readonly reservation = Endpoints.host + "reservation/";
    static readonly order = Endpoints.host + "order/";
    static readonly socket = "http://localhost:8000/";
}