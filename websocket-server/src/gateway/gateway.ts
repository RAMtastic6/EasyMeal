import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { Inject, OnModuleInit } from "@nestjs/common";

@WebSocketGateway({ cors: { origin: '*' } })
export class MyGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    if (socket.handshake.query.id_prenotazione) {
      const token = socket.handshake.auth.token;
      if (!token) {
        socket.disconnect();
        return;
      }
      const host = process.env.BACKEND_HOST || 'localhost';
      const response = await fetch('http://' + host + ':6969/authentication/decodeToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      });
      if (response.status != 200) {
        socket.disconnect();
        return;
      }
      socket.join(socket.handshake.query.id_prenotazione);
      console.log(socket.id + " connected to room: " + socket.handshake.query.id_prenotazione);
    } else {
      socket.disconnect();
      return;
    }
    socket.on('disconnect', () => {
      console.log(socket.id + " disconnected from room: " + socket.handshake.query.id_prenotazione);
    });
  }

  onModuleInit() {
    this.server.on('connection', this.handleConnection);
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
    this.server.to(id_prenotazione).except(client.id).emit('onConfirm');
  }
}