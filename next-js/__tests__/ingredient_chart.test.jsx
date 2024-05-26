import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IngredientChart } from '../src/components/ingredient_chart';
import { getToken, verifySession } from '../src/lib/dal';
import { updateListOrders } from '../src/lib/database/order';

jest.mock('socket.io-client', () => {
	return {
		io: jest.fn().mockReturnValue({
			on: jest.fn(),
			emit: jest.fn(),
			off: jest.fn(),
			disconnect: jest.fn(),
		}),
	};
});

jest.mock('../src/lib/dal', () => {
	return {
		verifySession: jest.fn().mockResolvedValue({}),
		getToken: jest.fn().mockResolvedValue('token'),
	}
});

jest.mock('../src/lib/database/order', () => ({
	updateListOrders: jest.fn(),
}));

const mockFetchedOrders = {
	"Categoria1": [
		{
			food: { name: "Pasta", image: "" },
			ingredients: [
				{ ingredient: { name: "Pomodoro" }, removed: false },
				{ ingredient: { name: "Formaggio" }, removed: false },
			],
		},
	],
};

describe('Verifica il funzionamento frontend del componente Ingredient Chart', () => {
	beforeAll(() => {
		jest.spyOn(global, 'alert').mockImplementation(() => { });
	});

	it('Verifica della visualizzazione', () => {
		render(<IngredientChart fetchedOrders={mockFetchedOrders} reservationId={123} />);

		expect(screen.getByText('Categoria1')).toBeInTheDocument();
		expect(screen.getByText('Pasta')).toBeInTheDocument();
		expect(screen.getByText('Pomodoro')).toBeInTheDocument();
		expect(screen.getByText('Formaggio')).toBeInTheDocument();
	});

	it('Verifica la rimozione di un ingrediente', () => {
		render(<IngredientChart fetchedOrders={mockFetchedOrders} reservationId={123} />);

		const removeButtons = screen.getAllByText('Rimuovi', { selector: 'button' });
		const firstButton = removeButtons[0];
		fireEvent.click(firstButton);

		expect(firstButton).toHaveTextContent('Aggiungi');
	});

	it('Verifica che la ordinazione venga aggiornata', async () => {
		render(<IngredientChart fetchedOrders={mockFetchedOrders} reservationId={123} />);

		await waitFor(() => {
			expect(screen.getByTestId('conferma-button')).toBeInTheDocument();
		});

		updateListOrders.mockResolvedValueOnce(true);

		// Esegui il clic sul pulsante "Conferma"
		await waitFor(() => fireEvent.click(screen.getByTestId('conferma-button')));

		// Verifica che l'alert venga chiamato con il messaggio corretto
		expect(alert).toHaveBeenCalledWith('Ordine aggiornato');
	});


	it('Verifica che vengano chiamati gli eventi relativi al socket', async () => {
		const { io } = require('socket.io-client');
		const mockSocket = io();

		await waitFor(async () => {
			render(<IngredientChart fetchedOrders={mockFetchedOrders} reservationId={123} />);
		})

		expect(mockSocket.on).toHaveBeenCalledWith('onIngredient', expect.any(Function));
		expect(mockSocket.on).toHaveBeenCalledWith('onConfirm', expect.any(Function));
	});
});
