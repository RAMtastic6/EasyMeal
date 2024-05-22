import Header from "@/src/components/header";
import Notification from "@/src/components/notification"

export default function Page() {
    return (
        <>
            <div className="w-full">
                <div className="container mx-auto mt-4 space-y-4">
                    <h1 className="text-lg font-bold text-center text-red-950"> Notifiche </h1>
                    <Notification id="1234" title="Ordinazione #123456" description="Descrizione della notifica relativa all'ordinazione xxx"></Notification>
                </div>
            </div>
        </>
    );
}