import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuTable from '../src/components/menu_table';
import { io } from 'socket.io-client';
import { saveOrders, deleteOrders } from '../src/lib/database/order';
import { useRouter } from 'next/navigation';

// Mocking socket.io-client
jest.mock('socket.io-client', () => ({
	io: jest.fn().mockReturnValue({
		on: jest.fn(),
		emit: jest.fn(),
		off: jest.fn(),
		disconnect: jest.fn(),
	}),
}));

// Mocking saveOrders and deleteOrders
jest.mock('../src/lib/database/order', () => ({
	saveOrders: jest.fn(),
	deleteOrders: jest.fn(),
}));

jest.mock('../src/lib/dal', () => {
	return {
		verifySession: jest.fn().mockResolvedValue({}),
		getToken: jest.fn().mockResolvedValue('token'),
	}
});

jest.mock('next/navigation', () => ({
	useRouter: jest.fn()
}));

const mockMenuData = {
	id: 1,
	name: "Menu 1",
	price: 100,
	description: "Test Menu",
	foods: [
		{
			id: 1,
			name: "Pasta",
			price: 10,
			quantity: 1,
			ingredients: [{ name: "Pomodoro" }, { name: "Formaggio" }],
		},
		{
			id: 2,
			name: "Pizza",
			price: 12,
			quantity: 2,
			ingredients: [{ name: "Salame" }, { name: "Formaggio" }],
		},
	],
};

const mockParams = { number: '123' };

describe('Verifica il funzionamento frontend del componente Menu Table', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Verifica della visualizzazione', async () => {
		await waitFor(() => {
			render(<MenuTable menuData={mockMenuData} params={mockParams} />);
		});

		expect(screen.getByText('Pasta')).toBeInTheDocument();
		expect(screen.getByText('Pizza')).toBeInTheDocument();
		expect(screen.getByText('10€')).toBeInTheDocument();
		expect(screen.getByText('12€')).toBeInTheDocument();

		const cheeseElements = screen.getAllByText('Formaggio', { selector: '.text-gray-700' });

		expect(cheeseElements).toHaveLength(2);
	});

	it('Verifica di aumento quantità', async () => {
		await waitFor(() => {
			render(<MenuTable menuData={mockMenuData} params={mockParams} />);
		});

		const increaseButtons = screen.getAllByTestId('increase_1');
		const quantityDisplays = screen.getAllByTestId('display_1');

		fireEvent.click(increaseButtons[0]);

		await waitFor(() => expect(quantityDisplays[0]).toHaveValue('2'));

		expect(saveOrders).toHaveBeenCalledWith({
			reservation_id: parseInt(mockParams.number),
			food_id: 1,
		});

		expect(io().emit).toHaveBeenCalledWith('onMessage', {
			id_prenotazione: mockParams.number,
			data: {
				index: 0,
				quantity: 2,
			},
		});
	});

	it('Verifica di diminuzione quantità', async () => {
		await waitFor(() => {
			render(<MenuTable menuData={mockMenuData} params={mockParams} />);
		});

		const decreaseButtons = screen.getAllByTestId('decrease_2');
		const quantityDisplays = screen.getAllByTestId('display_2');

		fireEvent.click(decreaseButtons[0]);

		await waitFor(() => expect(quantityDisplays[0]).toHaveValue('1'));

		expect(deleteOrders).toHaveBeenCalledWith({
			reservation_id: parseInt(mockParams.number),
			food_id: 2,
		});

		expect(io().emit).toHaveBeenCalledWith('onMessage', {
			id_prenotazione: mockParams.number,
			data: {
				index: 1,
				quantity: 1,
			},
		});
	});
	it('Verifica che vengano chiamati gli eventi relativi al socket', async () => {
		await waitFor(() => {
			render(<MenuTable menuData={mockMenuData} params={mockParams} />);
		});

		expect(io().on).toHaveBeenCalledWith('onMessage', expect.any(Function));
	});
});
