import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RestaurantSearch from '../src/components/restaurant_search';

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        replace: jest.fn(),
    }),
    useSearchParams: () => ({
        replace: jest.fn(),
    }),
    usePathname: () => ({
        replace: jest.fn(),
    })
}));

const cuisines = [
    "Cucina_1", "Cucina_2", "Cucina_3"
];

const cities = [
    "Città_1", "Città_2", "Città_3"
];

describe('Verifica il funzionamento frontend del componente Restaurant Search', () => {

    it('Verifica della visualizzazione', () => {

        render(<RestaurantSearch cuisines={cuisines} cities={cities} />);

        expect(screen.getByTestId('InputNomeRistorante')).toBeInTheDocument();
        expect(screen.getByTestId('InputCittà')).toBeInTheDocument();
        expect(screen.getByTestId('InputData')).toBeInTheDocument();
        expect(screen.getByTestId('InputTipoCucina')).toBeInTheDocument();
        expect(screen.getByTestId('InputResetFiltri')).toBeInTheDocument();
    });

    it('Verifica degli input', async () => {

        render(<RestaurantSearch cuisines={cuisines} cities={cities} />);

        fireEvent.change(screen.getByTestId('InputNomeRistorante'), { target: { value: 'Ristorante_1' } });
        fireEvent.change(screen.getByTestId('InputCittà'), { target: { value: cities[0] } });
        fireEvent.change(screen.getByTestId('InputData'), { target: { value: '2024-05-09' } });
        fireEvent.change(screen.getByTestId('InputTipoCucina'), { target: { value: cuisines[0] } });

        expect(screen.getByTestId('InputNomeRistorante')).toHaveValue('Ristorante_1');
        expect(screen.getByTestId('InputCittà')).toHaveValue(cities[0]);
        expect(screen.getByTestId('InputData')).toHaveValue('2024-05-09');
        expect(screen.getByTestId('InputTipoCucina')).toHaveDisplayValue(cuisines[0]);

        fireEvent.click(screen.getByTestId('InputResetFiltri'));

        await waitFor(() => {
            expect(screen.getByTestId('InputNomeRistorante')).toHaveValue('');
            expect(screen.getByTestId('InputCittà')).toHaveValue('');
            expect(screen.getByTestId('InputData')).toHaveValue('');
            expect(screen.getByTestId('InputTipoCucina')).toHaveValue('');
        });
    });
});