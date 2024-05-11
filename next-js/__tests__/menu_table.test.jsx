import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MenuTable from '../src/components/menu_table';

const updateHandler = jest.fn();
const setMenu = jest.fn();

jest.mock('next/image', () => ({
    __esModule: true,
    default: () => {
      return <img />
    },
}));

const menu = {
    id: 1,
    name: 'Antipasti',
    price: 10,
    description: 'Description',
    foods: [
        { id: 1, name: 'Food 1', price: 5, quantity: 5 },
        { id: 2, name: 'Food 2', price: 7, quantity: 5 },
    ],
};

describe('Verifica il funzionamento frontend del componente Menu Table', () => {

    it('Verifica della visualizzazione', () => {

        render(<MenuTable menu={menu} updateHandler={updateHandler} setMenu={setMenu} />);

        expect(screen.getByText('Antipasti')).toBeInTheDocument();
        expect(screen.getByText('Food 1')).toBeInTheDocument();
        expect(screen.getByText('Food 2')).toBeInTheDocument();
    });

    // it('Verifica degli input', () => {
    //     render(<MenuTable menu={menu} updateHandler={updateHandler} setMenu={setMenu} />);

    //     const decreaseButton = screen.getByTestId('decrease_1');
    //     const increaseButton = screen.getByTestId('increase_1');

    //     fireEvent.click(decreaseButton);

    //     console.log(menu.foods[0].quantity);
    // })

    // it('Verifica cambiamento display', () => {
    //     render(<MenuTable menu={menu} updateHandler={updateHandler} setMenu={setMenu} />);

    //     expect(screen.getByTestId('display_1')).toHaveValue(menu.foods[0].quantity);
    // })
});