import { Injectable, OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationDto } from './dto/notification.dto';

@WebSocketGateway({ cors: { origin: '*' }, namespace : "notification"  })
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

  @SubscribeMessage('onNotification')
  async emitAll(notification: NotificationDto) {
    const ids = notification.id_receiver.map((id) => id.toString());
    this.server.to(ids).emit('onNotification', JSON.stringify({title: notification.title, message : notification.message}));
    console.log("sending notification to " + notification.id_receiver);
  }

}
