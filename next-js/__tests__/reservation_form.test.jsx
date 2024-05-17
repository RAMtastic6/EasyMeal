import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import ReservationForm from '../src/components/reservation_form';
import { createReservation } from '../src/lib/database/reservation';

jest.mock('../src/lib/database/reservation', () => ({
    createReservation: jest.fn(),
}));

describe('Verifica il funzionamento frontend del componente Reservation Form', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Verifica della visualizzazione iniziale', () => {

        render(<ReservationForm restaurant_id={1} />);

        expect(screen.getByText('Effettua una prenotazione')).toBeInTheDocument();
        expect(screen.getByTestId('InputData')).toBeInTheDocument();
        expect(screen.getByTestId('InputOra')).toBeInTheDocument();
        expect(screen.getByTestId('InputPersone')).toBeInTheDocument();
        expect(screen.getByTestId('ButtonPrenota')).toBeInTheDocument();
    });

    it('Verifica degli input', async () => {

        const reservationData = {
            id: 123,
        };

        createReservation.mockResolvedValueOnce({ status: true, body: reservationData });

        render(<ReservationForm restaurant_id={1} />);

        fireEvent.change(screen.getByTestId('InputData'), { target: { value: '2024-05-12' } });
        fireEvent.change(screen.getByTestId('InputOra'), { target: { value: '18:00' } });
        fireEvent.change(screen.getByTestId('InputPersone'), { target: { value: '4' } });
        fireEvent.click(screen.getByTestId('ButtonPrenota'));

        await waitFor(() => expect(screen.getByText('Prenotazione confermata!')).toBeInTheDocument());

        expect(createReservation).toHaveBeenCalledWith({
            date: '2024-05-12T16:00:00.000Z', // Expect Two hours less, don't know exactly why
            number_people: 4,
            restaurant_id: 1,
            customer_id: 1,
        });
    });
});
