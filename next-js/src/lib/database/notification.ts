"use server";
import { cookies } from "next/headers";
import { Endpoints } from "./endpoints";
import { redirect } from "next/navigation";
import { CustomNotification } from "../types/definitions";

export async function getNotifications() {
  const token = cookies().get("session")?.value;
  if (!token) {
    redirect("/login");
  }
  const response = await fetch(Endpoints.notification, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      token: token,
    }),
  });

  const notifications: CustomNotification[] = await response.json();
  return notifications;
}

export async function setReadNotification(data: { id: number }) {
  const token = cookies().get("session")?.value;
  if (!token) {
    redirect("/login");
  }
  const response = await fetch(Endpoints.notification, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      token: token,
      notificationId: data.id,
    }),
  });
  return response.status;
}