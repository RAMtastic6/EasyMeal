import React from 'react';
import { mount, render, screen, fireEvent } from '@testing-library/react'
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

describe('Verifica il funzionamento frontend del componente Restaurant Search', () => {

    it('Verifica il rendering', () => {
        render(<RestaurantSearch cuisines={[]} cities={[]} />);
        const inputNomeRistorante = screen.getByTestId('InputNomeRistorante');
        // const cityInput = screen.getByPlaceholderText('Inserisci una città...');
        // const dateInput = screen.getByLabelText('Data');
        // const cuisineSelect = screen.getByLabelText('Tipologia di cucina');
        // const resetLink = screen.getByText('Resetta i filtri');
    
        expect(inputNomeRistorante).toBeInTheDocument();
        // expect(cityInput).toBeInTheDocument();
        // expect(dateInput).toBeInTheDocument();
        // expect(cuisineSelect).toBeInTheDocument();
        // expect(resetLink).toBeInTheDocument();
      });
})