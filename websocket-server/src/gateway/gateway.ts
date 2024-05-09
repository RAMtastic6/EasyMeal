import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { Inject, OnModuleInit } from "@nestjs/common";

@WebSocketGateway({ cors: { origin: '*' } })
export class MyGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      if(socket.handshake.query.id_prenotazione) {
        socket.join(socket.handshake.query.id_prenotazione);
        console.log(socket.id + " connected to room: " + socket.handshake.query.id_prenotazione);
      }
      socket.on('disconnect', () => {
        console.log(socket.id + " disconnected from room: " + socket.handshake.query.id_prenotazione);
      });
    });
  }

  @SubscribeMessage('onMessage')
  async onIncrement(@MessageBody() body: any) {
    const id_prenotazione: string = body["id_prenotazione"];
    this.server.to(id_prenotazione).emit('onMessage', body.data);
  }
}