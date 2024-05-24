"use server";
import Header from "@/src/components/header";
import Notification from "@/src/components/notification"
import { getNotifications } from "../../lib/database/notification";
import { NotificationStatus } from "../../lib/types/definitions";
import { NotificationPage } from "./notification_page";

export default async function Page() {

	const notifications = await getNotifications();

	return (
		<>
			<div className="w-full">
				<div className="container mx-auto mt-4 space-y-4">
					<h1 className="text-lg font-bold text-center text-red-950"> Notifiche </h1>
						<NotificationPage notificationsList={notifications}/>
				</div>
			</div>
		</>
	);
}