import React from 'react';
import { fireEvent, getByTestId, render, waitFor } from '@testing-library/react';
import ReservationUser from '@/src/components/reservation_user';
import exp from 'constants';

// Mocking the API functions
jest.mock('../src/lib/database/reservation', () => ({
  getReservationById: jest.fn().mockImplementation((id) => {
    // Assuming different reservations with different states for testing
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reservations = {
      '1': { id: 1, number_people: 4, state: 'pending', date: tomorrow.toISOString(), restaurant_id: 1 },
      '2': { id: 2, number_people: 2, state: 'accept', date: tomorrow.toISOString(), restaurant_id: 1 },
      '3': { id: 3, number_people: 3, state: 'reject', date: tomorrow.toISOString(), restaurant_id: 1 },
      '4': { id: 4, number_people: 4, state: 'to_pay', date: tomorrow.toISOString(), restaurant_id: 1 },
      '5': { id: 5, number_people: 5, state: 'completed', date: tomorrow.toISOString(), restaurant_id: 1 },
    };
    return Promise.resolve(reservations[id.toString()]);
  }),
}));
jest.mock('../src/lib/database/order', () => ({
  getOrderByReservationId: jest.fn().mockResolvedValue({
      "aperitivo": [{
        id: 1,
        user_id: 1,
        food: { id: 1, name: 'Pizza', price: 10 },
        ingredients: [{ id: 1, ingredient: { id: 1, name: 'Cheese' } }],
        quantity: 2
      }],
    }),
}));
jest.mock('../src/lib/database/restaurant', () => ({
  getRestaurantById: jest.fn().mockResolvedValue({
    id: 1,
    name: 'Ristorante Test',
    address: 'Indirizzo Test',
    city: 'Città Test',
    cuisine: 'Cucina Test',
    phone_number: '123456789',
    email: 'test@test.com'
  }),
}));
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(),
  },
});
describe('Verifica il funzionamento frontend del componente Reservation User', () => {

  it('Visualizza il caricamento', () => {
    render(<ReservationUser params={{ id: '1' }} />);
  });

  // Verifica il funzionamento frontend del componente Reservation User
describe('Visualizza i dettagli della prenotazione per diversi stati', () => {
  it.each([
    ['1', 'La prenotazione è in attesa di conferma da parte dell\'amministratore.'],
    ['2', 'La prenotazione è stata accettata. Le ordinazioni sono in attesa di conferma.'],
    ['3', 'La prenotazione è stata rifiutata.'],
    ['4', 'Le ordinazioni sono state confermate. La prenotazione è in attesa di pagamento.'], 
    ['5', 'La prenotazione è stata pagata e completata.'],
  ])('Visualizza i dettagli della prenotazione per lo stato %s', async (id, expectedText) => {
    const { getByText, queryByText } = render(<ReservationUser params={{ id }} />);
    // Wait for data to be fetched
    await waitFor(() => {
      
      expect(getByText('Numero di persone:')).toBeInTheDocument();
      expect(getByText('Stato:')).toBeInTheDocument();
      expect(getByText('Data:')).toBeInTheDocument();
      expect(getByText('Ora:')).toBeInTheDocument();
      
      // Check specific states
      expect(queryByText(expectedText)).toBeInTheDocument();
  
      // Check common elements
      expect(getByText('Informazioni sul Ristorante')).toBeInTheDocument();
      expect(getByText('Dettagli Prenotazione')).toBeInTheDocument();
      expect(getByText('Ristorante:')).toBeInTheDocument();
      expect(getByText('Indirizzo:')).toBeInTheDocument();
      expect(getByText('Città:')).toBeInTheDocument();
      expect(getByText('Cucina:')).toBeInTheDocument();
      expect(getByText('Numero di telefono:')).toBeInTheDocument();
      expect(getByText('Email:')).toBeInTheDocument();
    });
    if(id === '2') {
      expect(getByText('Copia Link')).toBeInTheDocument();
      await waitFor(() => fireEvent.click(getByText('Copia Link')));
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/order/${id}/`);
      expect(getByText('Link copiato!')).toBeInTheDocument();
    }
  });
});

});
