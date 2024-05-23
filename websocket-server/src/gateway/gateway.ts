import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { Inject, OnModuleInit } from "@nestjs/common";

@WebSocketGateway({ cors: { origin: '*' } })
export class MyGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      if(socket.handshake.query.id_prenotazione) {
        socket.join(socket.handshake.query.id_prenotazione);
        console.log(socket.id + " connected to gatewayOrdinazioneCollaborativa/room: " + socket.handshake.query.id_prenotazione);
      }
      socket.on('disconnect', () => {
        console.log(socket.id + " disconnected from gatewayOrdinazioneCollaborativa/room: " + socket.handshake.query.id_prenotazione);
      });
    });
  }

  @SubscribeMessage('onMessage')
  async onIncrement(@MessageBody() body: any) {
    const id_prenotazione: string = body["id_prenotazione"];
    this.server.to(id_prenotazione).emit('onMessage', body.data);
  }

  @SubscribeMessage('onIngredient')
  async onIngredient(@MessageBody() body: any) {
    const id_prenotazione: string = body["id_prenotazione"];
    this.server.to(id_prenotazione).emit('onIngredient', body.data);
  }

  @SubscribeMessage('onConfirm')
  async onConfirm(@MessageBody() body, @ConnectedSocket() client: Socket) {
    const id_prenotazione: string = body["id_prenotazione"];
    this.server.sockets.sockets.forEach((socket) => {
      if(socket.rooms.has(id_prenotazione) && socket.id != client.id) {
        socket.emit('onConfirm');
      }
    });
  }
}