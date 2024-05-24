"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Endpoints } from "../lib/database/endpoints";
import { CustomNotification } from "../lib/types/definitions";

const NotificationContext = createContext<{socket: any | null}>({socket: null});
export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children, token }: {
  children: React.ReactNode;
  token?: string
}) {
  const socketRef = useRef<Socket | null>(null);

  const handleNotification = (notification: CustomNotification) => {
    alert(notification.title + " - " + notification.message);
  }

  useEffect(() => {
    if(!token) return;
    socketRef.current = io(Endpoints.socketNotfication, {
      auth: {
        token: token,
      },
    });
    socketRef.current.on("onNotification", handleNotification);
    return () => {
      socketRef.current?.off("onNotification", handleNotification);
      socketRef.current?.disconnect();
    };
  }, [token]);

  return (
    <NotificationContext.Provider value={{socket: socketRef}}>
      {children}
    </NotificationContext.Provider>
  );
};