import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderCart from '../src/components/order_cart';

describe('Verifica il funzionamento frontend del componente Order Cart', () => {

    it('Verifica della visualizzazione', () => {
        render(<OrderCart />);

        // Check the presence of specific elements
        expect(screen.getByText('Il vostro ordine')).toBeInTheDocument();
        expect(screen.getByText('Totale')).toBeInTheDocument();
        expect(screen.getByText('La tua parte')).toBeInTheDocument();
        expect(screen.getByText('Alla romana')).toBeInTheDocument();
        expect(screen.getByText('Ognun per sé')).toBeInTheDocument();
        expect(screen.getByText('Checkout')).toBeInTheDocument();
    });

    it('Verifica del cambio di metodo di pagamento', () => {
        render(<OrderCart />);

        const allaRomanaOption = screen.getByTestId('AllaRomana');
        const ognunoOption = screen.getByTestId('Ognuno');

        expect(allaRomanaOption.checked).toBe(true);
        expect(ognunoOption.checked).toBe(false);

        fireEvent.click(ognunoOption);

        expect(allaRomanaOption.checked).toBe(false);
        expect(ognunoOption.checked).toBe(true);
    });
});

