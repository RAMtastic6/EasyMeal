import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { io } from 'socket.io-client';
import { getToken, verifySession } from '../src/lib/dal';
import { updateListOrders } from '../src/lib/database/order';
import { IngredientChart } from '../src/components/ingredient_chart';
import { setPaymentMethod } from '../src/lib/database/reservation';

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

// Mock getToken
jest.mock('../src/lib/dal', () => ({
  getToken: jest.fn(),
}));

// Mock updateListOrders
jest.mock('../src/lib/database/order', () => ({
  updateListOrders: jest.fn(),
}));

jest.mock('../src/lib/database/reservation', () => ({
	setPaymentMethod: jest.fn(),
}));

jest.mock('../src/lib/dal', () => ({
  verifySession: jest.fn().mockResolvedValue({ id: 1 }),
  getToken: jest.fn().mockResolvedValue('token'),
}));

describe('IngredientChart', () => {
  let mockSocket: any;
  const mockFetchedOrders = {
    pizza: [
      {
        food: { name: 'Pizza Margherita', image: null },
        ingredients: [
          { ingredient: { name: 'Tomato' }, removed: false },
          { ingredient: { name: 'Cheese' }, removed: false },
        ],
      },
    ],
  };
  const mockReservationId = 123;

  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    };
    (io as jest.Mock).mockReturnValue(mockSocket);
    (getToken as jest.Mock).mockResolvedValue('mockToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with the correct orders', () => {
    const { getByText } = render(<IngredientChart fetchedOrders={mockFetchedOrders} reservationId={mockReservationId} />);

    expect(getByText('Pizza Margherita')).toBeInTheDocument();
    expect(getByText('Tomato')).toBeInTheDocument();
    expect(getByText('Cheese')).toBeInTheDocument();
  });

  it('should change ingredient state on button click', async () => {
    render(<IngredientChart fetchedOrders={mockFetchedOrders} reservationId={mockReservationId} />);

    const tomatoButton = screen.getAllByText('Rimuovi')[0];

    await waitFor(() => {
      fireEvent.click(tomatoButton);
      expect(tomatoButton).toHaveTextContent('Aggiungi');
      expect(mockSocket.emit).toHaveBeenCalledWith('onIngredient', {
        id_prenotazione: mockReservationId,
        data: {
          key: 'pizza',
          index: 0,
          ingredientIndex: 0,
          removed: true,
        },
      });
    });
  });

  it('should handle submit and emit onConfirm', async () => {
    (updateListOrders as jest.Mock).mockResolvedValue(true);

    const { getByText } = render(<IngredientChart fetchedOrders={mockFetchedOrders} reservationId={mockReservationId} />);

    const confirmButton = getByText('Conferma');

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(updateListOrders).toHaveBeenCalledWith({
        reservation_id: mockReservationId,
        orders: mockFetchedOrders,
      });
      expect(mockSocket.emit).toHaveBeenCalledWith('onConfirm', {
        id_prenotazione: mockReservationId,
      });
      expect(confirmButton).toHaveTextContent('Conferma');
    });
  });

  it('should alert if order is already confirmed', async () => {
    window.alert = jest.fn();
    (updateListOrders as jest.Mock).mockResolvedValue(false);

    const { getByText } = render(<IngredientChart fetchedOrders={mockFetchedOrders} reservationId={mockReservationId} />);

    const confirmButton = getByText('Conferma');

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(updateListOrders).toHaveBeenCalledWith({
        reservation_id: mockReservationId,
        orders: mockFetchedOrders,
      });
      expect(window.alert).toHaveBeenCalledWith('Ordine già confermato!');
    });
  });

  it('should establish socket connection with correct parameters', async () => {
    render(<IngredientChart fetchedOrders={mockFetchedOrders} reservationId={mockReservationId} />);

    await waitFor(() => {
      expect(io).toHaveBeenCalledWith(expect.anything(), {
        query: { id_prenotazione: mockReservationId },
        auth: { token: 'mockToken' },
      });
    });

    expect(mockSocket.on).toHaveBeenCalledWith('onIngredient', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('onConfirm', expect.any(Function));
  });
});

