import { render, screen, waitFor } from '@testing-library/react';
import RestaurantsTable from '../src/components/restaurants_table';

jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
}));

jest.mock('next/link', () => ({ children }) => children);

jest.mock('../src/lib/database/restaurant', () => ({
    getFilteredRestaurants: jest.fn().mockResolvedValue([
        { id: 1, name: 'Restaurant 1', address: 'Address 1', city: 'City 1', cuisine: 'Cuisine 1' },
        { id: 2, name: 'Restaurant 2', address: 'Address 2', city: 'City 2', cuisine: 'Cuisine 2' },
    ]),
}));

console.log = jest.fn();

describe('Verifica il funzionamento frontend del componente Restaurants Table', () => {

    it('Verifica della visualizzazione del caricamento', () => {
        
        jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue({
            get: () => null,
        });

        render(<RestaurantsTable ITEMS_PER_PAGE={10} />);

        expect(console.log).toHaveBeenCalledWith('Fecthing restaurants data...');
    });

    it('Verifica della visualizzazione dopo il caricamento', async () => {
        
        jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue({
            get: () => null,
        });

        render(<RestaurantsTable ITEMS_PER_PAGE={10} />);

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(console.log).toHaveBeenCalledWith('Fecthing restaurants data...');

        await waitFor(() => {
            expect(console.log).toHaveBeenCalledTimes(4);
            expect(console.log).toHaveBeenNthCalledWith(1, 'Fecthing restaurants data...');
            expect(console.log).toHaveBeenNthCalledWith(2, 'Fecthing restaurants data...');
            expect(console.log).toHaveBeenNthCalledWith(3, 'Data fecth completed after 3 seconds.');
        });

        expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
        expect(screen.getByText('Address 1')).toBeInTheDocument();
        expect(screen.getByText('City 1')).toBeInTheDocument();
        expect(screen.getByText('Cuisine 1')).toBeInTheDocument();

        expect(screen.getByText('Restaurant 2')).toBeInTheDocument();
        expect(screen.getByText('Address 2')).toBeInTheDocument();
        expect(screen.getByText('City 2')).toBeInTheDocument();
        expect(screen.getByText('Cuisine 2')).toBeInTheDocument();
    });
});
