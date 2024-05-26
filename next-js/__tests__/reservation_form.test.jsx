import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import ReservationForm from '../src/components/reservation_form';
import { createReservation } from '../src/lib/database/reservation';

jest.mock('../src/lib/database/reservation', () => ({
	createReservation: jest.fn(),
}));

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(),
  },
});

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

		//TODO: fix
		/*expect(createReservation).toHaveBeenCalledWith({
				date: "5/12/2024, 6:00:00 PM",
				number_people: 4,
				restaurant_id: 1,
				customer_id: 1,
		});*/
	});

	it('Verifica del bottone per copiare il link', async () => {
		
		const reservationData = {
			id: 123,
		};

		createReservation.mockResolvedValueOnce({ status: true, body: reservationData });

		render(<ReservationForm restaurant_id={1} />);

		fireEvent.change(screen.getByTestId('InputData'), { target: { value: '2024-05-12' } });
		fireEvent.change(screen.getByTestId('InputOra'), { target: { value: '18:00' } });
		fireEvent.change(screen.getByTestId('InputPersone'), { target: { value: '4' } });
		fireEvent.click(screen.getByTestId('ButtonPrenota'));

		await waitFor(() => expect(screen.getByTestId('ButtonCopia')).toBeInTheDocument());

		await waitFor(() => fireEvent.click(screen.getByTestId('ButtonCopia')));
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/order/${reservationData.id}/`);
		expect(screen.getByText('Link copiato!')).toBeInTheDocument();
	});
});
