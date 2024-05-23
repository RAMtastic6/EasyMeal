import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuTable from '../src/components/menu_table';
import { io } from 'socket.io-client';
import { saveOrders, deleteOrders } from '../src/lib/database/order';
import exp from 'constants';

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

    it('Verifica della visualizzazione', () => {
        render(<MenuTable menuData={mockMenuData} params={mockParams} />);

        expect(screen.getByText('Pasta')).toBeInTheDocument();
        expect(screen.getByText('Pizza')).toBeInTheDocument();
        expect(screen.getByText('10€')).toBeInTheDocument();
        expect(screen.getByText('12€')).toBeInTheDocument();

        const cheeseElements = screen.getAllByText('Formaggio', { selector: '.text-gray-700' });

        expect(cheeseElements).toHaveLength(2);
    });

    it('Verifica di aumento quantità', async () => {
        render(<MenuTable menuData={mockMenuData} params={mockParams} />);

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
        render(<MenuTable menuData={mockMenuData} params={mockParams} />);

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

    it('Verifica il prezzo totale', async () => {
        render(<MenuTable menuData={mockMenuData} params={mockParams} />);

        const totalPriceElement = screen.getByTestId('total-price');
        const totalPrice = parseInt(totalPriceElement.textContent.replace('€', ''));
        // it should be 32 because the first food has a price of 10 and a quantity of 2, while the second food has a price of 12 and a quantity of 1 after the previous test
        expect(totalPrice).toBe(32); 
        
        
        const increaseButton = screen.getByTestId('increase_1');
        fireEvent.click(increaseButton);

        const totalPriceElement2 = screen.getByTestId('total-price');
        const totalPrice2 = parseInt(totalPriceElement2.textContent.replace('€', ''));
        expect(totalPrice2).toBe(42);

        const decreaseButton = screen.getByTestId('decrease_2');
        fireEvent.click(decreaseButton);
        
        const totalPriceElement3 = screen.getByTestId('total-price');
        const totalPrice3 = parseInt(totalPriceElement3.textContent.replace('€', ''));
        expect(totalPrice3).toBe(30);
        
    });
    it('Verifica che vengano chiamati gli eventi relativi al socket', () => {
        render(<MenuTable menuData={mockMenuData} params={mockParams} />);

        expect(io().on).toHaveBeenCalledWith('onMessage', expect.any(Function));
    });
});
