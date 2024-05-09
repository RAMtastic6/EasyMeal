import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'
import RestaurantSearch from '../src/components/restaurant_search'

jest.mock('next/navigation', () => ({
    useRouter() {
        return {}
    },
    useSearchParams() {
        return {}
    },
    usePathname() {
        return ('')
    }
}));

const cuisines = [
    "Italiana", "Cinese", "Americana"
];

describe('Verifica il funzionamento frontend del componente Restaurant Search', () => {

    render(<RestaurantSearch cuisines={cuisines} cities={[]} />);

    const inputNomeRistorante = screen.getByTestId('InputNomeRistorante');
    const inputCittà = screen.getByTestId('InputCittà');
    const inputData = screen.getByTestId('InputData');
    const inputTipoCucina = screen.getByTestId('InputTipoCucina');
    const inputResetFiltri = screen.getByTestId('InputResetFiltri');

    it('Verifica della visualizzazione', () => {

        expect(inputNomeRistorante).toBeInTheDocument();
        expect(inputCittà).toBeInTheDocument();
        expect(inputData).toBeInTheDocument();
        expect(inputTipoCucina).toBeInTheDocument();
        expect(inputResetFiltri).toBeInTheDocument();
    })

    it('Verifica degli input', () => {

        fireEvent.change(inputNomeRistorante, { target: { value: 'Nome del Ristorante' } });
        fireEvent.change(inputCittà, { target: { value: 'Città del Ristorante' } });
        fireEvent.change(inputData, { target: { value: '2024-05-09' } });
        fireEvent.select(inputTipoCucina, { target: { value: cuisines[0] } });

        expect(inputNomeRistorante).toHaveValue('Nome del Ristorante');
        expect(inputCittà).toHaveValue('Città del Ristorante');
        expect(inputData).toHaveValue('2024-05-09');
        expect(inputTipoCucina).toHaveDisplayValue('Italiana');
    })
});