import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ReservationsUser from '@/src/components/reservations_user';
import { getReservationsByUserId } from '@/src/lib/database/reservation';

// Mocking the getReservationsByUserId function
jest.mock('../src/lib/database/reservation', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    getReservationsByUserId: jest.fn().mockResolvedValue([
      {
        id: 1,
        number_people: 2,
        date: tomorrow.toISOString(),
        state: 'pending',
        restaurant: { name: 'Ristorante 1' }
      },
      {
        id: 2,
        number_people: 4,
        date: tomorrow.toISOString(),
        state: 'accept',
        restaurant: { name: 'Ristorante 2' }
      },
      {
        id: 3,
        number_people: 6,
        date: tomorrow.toISOString(),
        state: 'reject',
        restaurant: { name: 'Ristorante 3' }
      },
      {
        id: 4,
        number_people: 8,
        date: tomorrow.toISOString(),
        state: 'to_pay',
        restaurant: { name: 'Ristorante 4' }
      },
      {
        id: 5,
        number_people: 10,
        date: tomorrow.toISOString(),
        state: 'completed',
        restaurant: { name: 'Ristorante 5' }
      },
    ]),
    }
  });

describe('Verifica il funzionamento frontend del componente ReservationsUser', () => {
  beforeEach(() => {
    // Clear mock calls and reset mock implementation before each test
    jest.clearAllMocks();
  });

  it('Verifica della visualizzazione del caricamento', async () => {
    render(<ReservationsUser userId={1} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render "Non è stata effettuata nessuna prenotazione" when there are no reservations', async () => {
    // Mocking the fetchReservations function to simulate loading state
    getReservationsByUserId.mockResolvedValueOnce([]);

    render(<ReservationsUser userId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Non è stata effettuata nessuna prenotazione')).toBeInTheDocument();
      expect(getReservationsByUserId).toHaveBeenCalledTimes(1);
    });
  });

  it('Verifica della visualizzazione dopo il caricamento', async () => {
    render(<ReservationsUser userId={1} />);

    await waitFor(() => {
      expect(getReservationsByUserId).toHaveBeenCalledTimes(1);
    });

    // Verifica dei nomi dei ristoranti
    expect(screen.getByText('Ristorante 1')).toBeInTheDocument();
    expect(screen.getByText('Ristorante 2')).toBeInTheDocument();
    expect(screen.getByText('Ristorante 3')).toBeInTheDocument();
    expect(screen.getByText('Ristorante 4')).toBeInTheDocument();
    expect(screen.getByText('Ristorante 5')).toBeInTheDocument();

    // Verifica degli stati delle prenotazioni
    expect(screen.getByText('In attesa di conferma')).toBeInTheDocument();
    expect(screen.getByText('Accettata')).toBeInTheDocument();
    expect(screen.getByText('Rifiutata')).toBeInTheDocument();
    expect(screen.getByText('Da pagare')).toBeInTheDocument();
    expect(screen.getByText('Completata')).toBeInTheDocument();

    // Verifica quantità prenotazioni
    expect(screen.getByText('Visualizzate 5 prenotazioni')).toBeInTheDocument();



  });
});
