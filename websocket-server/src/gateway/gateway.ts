import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { Inject, OnModuleInit } from "@nestjs/common";

@WebSocketGateway({ cors: { origin: '*' } })
export class MyGateway implements OnModuleInit {

  constructor(
    //@Inject(CACHE_MANAGER)
    //private cacheManager: Cache
  ){}

  @WebSocketServer()
  server: Server;

  async getData(id_prenotazione: string) {
    const result = await fetch('http://'+process.env.BACKEND_HOST+':6969/reservation/' + id_prenotazione + '/orders');
    return await result.json();
  }

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      console.log(socket.id + " connected");
      if (socket.handshake.query["id_prenotazione"] != null) {
        // significa che ci stiamo connettendo al server socket.
        const id_prenotazione: string = socket.handshake.query.id_prenotazione.toString();
        const data = await this.getData(id_prenotazione);
        console.log(data);
        socket.join(id_prenotazione);
        this.server.to(socket.id).to(id_prenotazione).emit('onMessage', data);
      }
    });

    this.server.on('disconnect', async (socket) => {
      console.log(socket.id + " disconnected");
      socket.disconnect();
    });
  }

  @SubscribeMessage('increment')
  async onIncrement(@MessageBody() body: any) {
    const id_prenotazione: string = body["id_prenotazione"];
    const data = await this.getData(id_prenotazione);
    this.server.to(id_prenotazione).emit('onMessage', data);
  }

  @SubscribeMessage('decrement')
  async onDecrement(@MessageBody() body: any) {
    const id_prenotazione: string = body["id_prenotazione"];
    const data = await this.getData(id_prenotazione);
    this.server.to(id_prenotazione).emit('onMessage', data);
  }
}