export class Endpoints {
    //Questo file contiene gli url utili per effetuare
    //il fetch dei dati dal DB
    static readonly host = "http://" + process.env.BACKEND_HOST + ":6969/";
    static readonly restaurant = Endpoints.host + "restaurant/";
    static readonly reservation = Endpoints.host + "reservation/";
    static readonly user = Endpoints.host + "user/"; 
    static readonly order = Endpoints.host + "order/";
    static readonly socket = "http://localhost:8000/";
}