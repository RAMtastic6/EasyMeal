import React from 'react';
import { getByAltText, getByText, render, screen, waitFor } from '@testing-library/react';
import ReservationAdmin from '@/src/components/reservation_admin';
import { describe } from 'node:test';

// Mocking the API functions
jest.mock('../src/lib/database/reservation', () => ({
  getReservationById: jest.fn().mockResolvedValue({
    id: 1,
    number_people: 4,
    state: 'pending',
    date: new Date().toISOString(),
  }),
}));
jest.mock('../src/lib/database/order', () => ({
  getOrderByReservationId: jest.fn().mockResolvedValue([
    {
      id: 1,
      customer_id: 1,
      food: { id: 1, name: 'Pizza' },
      ingredients: [{ id: 1, ingredient: { id: 1, name: 'Cheese' } }],
    },
  ]),
}));
/*
to do: prove another state
{ id: 1, date: '2021-12-30T12:30:00.000Z', number_people: 1, restaurant_id: 1, state: 'accept', user_id: 1 },
    { id: 2, date: '2021-12-30T12:30:00.000Z', number_people: 2, restaurant_id: 2, state: 'reject', user_id: 2 },
    { id: 3, date: '2021-12-30T12:30:00.000Z', number_people: 3, restaurant_id: 3, state: 'pending', user_id: 3 },
    { id: 4, date: '2021-12-30T12:30:00.000Z', number_people: 4, restaurant_id: 4, state: 'to_pay', user_id: 4},
    { id: 5, date: '2021-12-30T12:30:00.000Z', number_people: 5, restaurant_id: 5, state: 'completed', user_id: 5 },
*/

describe('Verifica il funzionamento frontend del componente Reservation Admin', () => {

  it('Verifica della visualizzazione del caricamento', () => {
    render(<ReservationAdmin params={{ id: '1' }} />);
  });
  it('renders reservation details', async () => {
    const { getByText } = render(<ReservationAdmin params={{ id: '1' }} />);

    // Wait for data to be fetched
    await waitFor(() => {
      expect(getByText('Numero persone:')).toBeInTheDocument();
      expect(getByText('Stato:')).toBeInTheDocument();
      expect(getByText('Giorno:')).toBeInTheDocument();
      expect(getByText('Ora:')).toBeInTheDocument();
      expect(getByText('La prenotazione è in attesa di conferma.')).toBeInTheDocument();
      expect(getByText('Accetta')).toBeInTheDocument();
      expect(getByText('Rifiuta')).toBeInTheDocument();
      expect(getByText('Posti disponibili:')).toBeInTheDocument();
    });
  });
});
/*
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ReservationDetails from '@/src/components/reservation_admin';

// Mocking the API functions
jest.mock('../src/lib/database/reservation', () => ({
  getReservationById: jest.fn().mockResolvedValue({
    id: 1,
    number_people: 4,
    state: 'pending',
    date: new Date().toISOString(),
  }),
}));

jest.mock('../src/lib/database/order', () => ({
  getOrderByReservationId: jest.fn().mockResolvedValue([
    {
      id: 1,
      customer_id: 1,
      food: { id: 1, name: 'Pizza' },
      ingredients: [{ id: 1, ingredient: { id: 1, name: 'Cheese' } }],
    },
  ]),
}));

describe('ReservationDetails', () => {
  it('renders reservation details', async () => {
    const { getByText } = render(<ReservationDetails params={{ id: '1' }} />);
    
    // Wait for data to be fetched
    await waitFor(() => {
      expect(getByText('Numero persone:')).toBeInTheDocument();
      expect(getByText('Stato:')).toBeInTheDocument();
      expect(getByText('Giorno:')).toBeInTheDocument();
      expect(getByText('Ora:')).toBeInTheDocument();
      expect(getByText('La prenotazione è in attesa di conferma.')).toBeInTheDocument();
      expect(getByText('Accetta')).toBeInTheDocument();
      expect(getByText('Rifiuta')).toBeInTheDocument();
      expect(getByText('Posti disponibili:')).toBeInTheDocument();
    });
  });
});
*/