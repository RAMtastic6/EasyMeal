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

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token;
    if (!token) {
      socket.disconnect();
      return;
    }
    const backend = process.env.BACKEND_HOST || 'localhost';
    const response = await fetch(`http://${backend}:6969/authentication/decodeToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    if(response.status !== 200) {
      socket.disconnect();
      return;
    }
    const data: {id: number, role: string} = await response.json();
    socket.join(data.id.toString());
    console.log(
      socket.id +
        ' connected to notifcationGateway/room: ' +
        data.id,
    );
    socket.on('disconnect', () => {
      console.log(
        socket.id +
          ' disconnected from notifcationGateway/room: ' +
          data.id,
      );
    });
  }

  onModuleInit() {
    this.server.on('connection', this.handleConnection);
  }

  @SubscribeMessage('onNotification')
  async emitAll(notification: NotificationDto) {
    const ids = notification.id_receiver.map((id) => id.toString());
    this.server.to(ids).emit('onNotification', {
      title: notification.title, 
      message : notification.message,
      id: notification.id,
    });
    console.log("sending notification to " + ids.map((id) => id.toString()));
  }
}
