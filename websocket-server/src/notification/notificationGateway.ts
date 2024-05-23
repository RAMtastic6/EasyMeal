import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(81, { cors: { origin: '*' } })
@Injectable()
export class NotificationGateway implements OnModuleInit {
  // riferimento al server socket che sta girando.
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      if (socket.handshake.query.id_utente) {
        socket.join(socket.handshake.query.id_utente);
        console.log(
          socket.id +
            ' connected to notifcationGateway/room: ' +
            socket.handshake.query.id_utente,
        );
      }
      socket.on('disconnect', () => {
        console.log(
          socket.id +
            ' disconnected from notifcationGateway/room: ' +
            socket.handshake.query.id_utente,
        );
      });
    });
  }

  emitAll(): void {
    console.log("going to emit evento to all clients that are subscribed to this thing");
  }
}
