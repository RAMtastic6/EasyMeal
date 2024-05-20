import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import ReservationsAdmin from '@/src/components/reservations_admin';
import { getReservationsByRestaurantId } from "@/src/lib/database/reservation";

// Mocking the getReservationsByRestaurantId function
jest.mock('../src/lib/database/reservation', () => ({
  getReservationsByRestaurantId: jest.fn().mockResolvedValue([
    { id: 1, number_people: 2, date: '2021-12-01T12:00:00Z', state: 'pending' },
    { id: 2, number_people: 4, date: '2021-12-02T12:00:00Z', state: 'accept' },
    { id: 3, number_people: 6, date: '2021-12-03T12:00:00Z', state: 'reject' },
    { id: 4, number_people: 8, date: '2021-12-04T12:00:00Z', state: 'to_pay' },
    { id: 5, number_people: 10, date: '2021-12-05T12:00:00Z', state: 'completed' },
  ]),
}
));

describe('Verifica il funzionamento frontend del componente ReservationsAdmin', () => {
  beforeEach(() => {
    // Clear mock calls and reset mock implementation before each test
    jest.clearAllMocks();
  });

  it('Verifica della visualizzazione del caricamento', async () => {
    render(<ReservationsAdmin userId={1}/>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render "Non è stata effettuata nessuna prenotazione" when there are no reservations', async () => {
    // Mocking the fetchReservations function to simulate loading state
    getReservationsByRestaurantId.mockResolvedValueOnce([]);

    render(<ReservationsAdmin userId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Non è stata effettuata nessuna prenotazione')).toBeInTheDocument();
      expect(getReservationsByRestaurantId).toHaveBeenCalledTimes(1);
    });
  });

  it('Verifica della visualizzazione dopo il caricamento', async () => {
    render(<ReservationsAdmin userId={1}/>);

    await waitFor(() => {
      expect(getReservationsByRestaurantId).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('In attesa di conferma')).toBeInTheDocument();
    expect(screen.getByText('Accettata')).toBeInTheDocument();
    expect(screen.getByText('Rifiutata')).toBeInTheDocument();
    expect(screen.getByText('Da pagare')).toBeInTheDocument();
    expect(screen.getByText('Completata')).toBeInTheDocument();

  }
  );
}
);
