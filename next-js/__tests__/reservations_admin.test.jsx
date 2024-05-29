import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import ReservationsAdmin from '@/src/components/reservations_admin';
import { getReservationsByAdminId } from "@/src/lib/database/reservation";

// Mocking the getReservationsByRestaurantId function
jest.mock('../src/lib/database/reservation', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    getReservationsByAdminId: jest.fn().mockResolvedValue([
      { id: 1, number_people: 2, date: tomorrow.toISOString(), state: 'pending' },
      { id: 2, number_people: 4, date: tomorrow.toISOString(), state: 'accept' },
      { id: 3, number_people: 6, date: tomorrow.toISOString(), state: 'reject' },
      { id: 4, number_people: 8, date: tomorrow.toISOString(), state: 'to_pay' },
      { id: 5, number_people: 10, date:tomorrow.toISOString(), state: 'completed' },
    ]),
  };
});

describe('Verifica il funzionamento frontend del componente ReservationsAdmin', () => {
  beforeEach(() => {
    // Clear mock calls and reset mock implementation before each test
    jest.clearAllMocks();
    jest.spyOn(global, 'setInterval').mockImplementation(() => { });
  });

  it('Verifica della visualizzazione del caricamento', async () => {
    render(<ReservationsAdmin />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render "Non è stata effettuata nessuna prenotazione" when there are no reservations', async () => {
    // Mocking the fetchReservations function to simulate loading state
    getReservationsByAdminId.mockResolvedValueOnce([]);

    render(<ReservationsAdmin />);

    await waitFor(() => {
      expect(screen.getByText('Non è stata effettuata nessuna prenotazione')).toBeInTheDocument();
      expect(getReservationsByAdminId).toHaveBeenCalledTimes(1);
    });
  });

  it('Verifica della visualizzazione dopo il caricamento', async () => {
    render(<ReservationsAdmin />);

    await waitFor(() => {
      expect(getReservationsByAdminId).toHaveBeenCalledTimes(1);
    });

    expect(screen.getAllByText('In attesa di conferma')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Accettata')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Rifiutata')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Da pagare')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Completata')[0]).toBeInTheDocument();

  });
});
