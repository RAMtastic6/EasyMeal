import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { OnModuleInit } from "@nestjs/common";

@WebSocketGateway({ cors: { origin: '*' } })
export class MyGateway implements OnModuleInit {

	// questi sono tutti dati solamente a scopo dimostrativo
	db = {}

	@WebSocketServer()
	server: Server;

	onModuleInit() {

		this.db = {
			/*1: {
				"menu": { "id": 1, "foods": [{ "id": 1, "name": "Spaghetti alla carbonara", "price": 10, "quantity": 20 }, { "id": 2, "name": "Spaghetti all'amatriciana", "price": 9, "quantity": 0 }, { "id": 3, "name": "Spaghetti al pomodoro", "price": 8, "quantity": 0 }] }
			},*/
		};

		this.server.on('connection', async (socket) => {
			console.log(socket.id + " connected");
			if (socket.handshake.query["id_prenotazione"] != null) { // significa che ci stiamo connettendo al server socket.
				const id_prenotazione: string = socket.handshake.query.id_prenotazione.toString();
				if(id_prenotazione) {
					socket.join(id_prenotazione);
				}
				if(this.db[id_prenotazione] == null) {
					//connessione provvisoria al db
					const result = await fetch('http://nestjs:6969/reservation/'+id_prenotazione+'/orders');
					this.db[id_prenotazione] = {
						menu: (await result.json())["restaurant"]["menu"]
					};
				}
				// debug
				console.log(this.db[id_prenotazione]["menu"]);

				this.server.to(socket.id).to(id_prenotazione).emit('onMessage', this.db[id_prenotazione]['menu']);
			} else {
				socket.disconnect();
			}
		});
	}

	@SubscribeMessage('increment')
	async onIncrement(@MessageBody() body: any) {

		const id_prenotazione: string = body["id_prenotazione"];
		/*const piatto: string = body["plate"];
		const inc: number = body["quantity"];
		this.db[prenotazione][piatto] += inc;*/

		// debug
		console.log(this.db[id_prenotazione], body["menu"]);

		this.db[id_prenotazione]["menu"] = body["menu"];
		console.log(this.db[id_prenotazione]["menu"]);
		this.server.to(id_prenotazione).emit('onMessage', this.db[id_prenotazione]["menu"]);
	}

	@SubscribeMessage('decrement')
	async onDecrement(@MessageBody() body: any) {

		const id_prenotazione: string = body["id_prenotazione"];
		/*
		const piatto: string = body["plate"];
		const dec: number = body["quantity"]
		this.db[prenotazione][piatto] -= dec; */

		this.db[id_prenotazione]["menu"] = body["menu"];
		console.log(this.db[id_prenotazione]["menu"]);
		this.server.to(id_prenotazione).emit('onMessage', this.db[id_prenotazione]["menu"]);

		// debug
		console.log(this.db);
	}
}