export default function ReservationAdmin({ params }: { params: { id: string } }) {
  // TO DO: implement the reservation admin page
  return (
    <>
      <div className="w-full">
        <div className="container mx-auto mt-4 space-y-4">
          <h1>Consulta la prenotazione {params.id}</h1>
        </div>
      </div>
    </>
  );
}