import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { UserInvite } from '../src/components/user_invite';
import { acceptInviteReservation } from '../src/lib/database/reservation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../src/lib/database/reservation', () => ({
  acceptInviteReservation: jest.fn(),
}));

describe('UserInvite', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with the correct reservation ID', () => {
    const { getByText } = render(<UserInvite reservationId={123} />);

    expect(getByText("Vuoi accettare l'invito della prenotazione con id: 123?")).toBeInTheDocument();
  });

  it('should call acceptInviteReservation and redirect on accept', async () => {
    (acceptInviteReservation as jest.Mock).mockResolvedValue({ status: true });

    const { getByText } = render(<UserInvite reservationId={123} />);

    fireEvent.click(getByText('Accetta'));

    await waitFor(() => {
      expect(acceptInviteReservation).toHaveBeenCalledWith(123);
      expect(mockPush).toHaveBeenCalledWith('/user/reservations_list');
    });
  });

  it('should log error and not redirect on accept invite failure', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    (acceptInviteReservation as jest.Mock).mockResolvedValue({ status: false });

    const { getByText } = render(<UserInvite reservationId={123} />);

    fireEvent.click(getByText('Accetta'));

    await waitFor(() => {
      expect(acceptInviteReservation).toHaveBeenCalledWith(123);
      expect(consoleSpy).toHaveBeenCalledWith('Error accepting invite');
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('should redirect to reservations list on refuse', () => {
    const { getByText } = render(<UserInvite reservationId={123} />);

    fireEvent.click(getByText('Rifiuta'));

    expect(mockPush).toHaveBeenCalledWith('/user/reservations_list');
  });
});
