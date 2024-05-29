"use client";
import { useEffect, useState } from "react";
import { CustomNotification, NotificationStatus } from "../../lib/types/definitions";
import Notification from "@/src/components/notification";
import { useNotification } from "../../contexts/notification_context";

export function NotificationPage({ notificationsList }: {
  notificationsList: CustomNotification[]
}) {
  const [notifications , setNotifications] = 
    useState<CustomNotification[]>(notificationsList);

  const { socket } = useNotification();

  const addNotification = (notification: CustomNotification) => {
    setNotifications((prev) => {
      let newList = [...prev];
      newList.unshift(notification);
      return newList;
    });
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  }

  useEffect(() => {
    if(!socket.current) return;
    console.log("Setting up notification listener")
    socket.current.on("onNotification", addNotification);
    return () => {
      console.log("Removing notification listener")
      socket.current.off("onNotification", addNotification);
    }
  }, [socket]);

  return (
    <>
      {notifications.map((notification) => 
        <Notification 
          key={notification.id}
          id={notification.id} 
          title={notification.title} 
          description={notification.message} 
          hook={deleteNotification}>
        </Notification>
      )}
      {notifications.length === 0 && 
      <p className="text-center text-gray-500"> Nessuna notifica </p>}
    </>
  );
}