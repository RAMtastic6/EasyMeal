import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notification from '../src/components/notification'; // Assicurati che il percorso sia corretto
import { setReadNotification, deleteNotification } from '../src/lib/database/notification';

// Mock delle funzioni di database
jest.mock('../src/lib/database/notification', () => ({
    setReadNotification: jest.fn(),
    deleteNotification: jest.fn(),
}));

describe('Verifica il funzionamento del componente Notification', () => {
    const mockHook = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Verifica della visualizzazione', () => {
        render(<Notification id={1} title="Test Title" description="Test Description" status="unread" hook={mockHook} />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('Verifica del click sul pulsante', async () => {
        setReadNotification.mockResolvedValueOnce(true);
        deleteNotification.mockResolvedValueOnce(true);

        render(<Notification id={1} title="Test Title" description="Test Description" status="unread" hook={mockHook} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(setReadNotification).toHaveBeenCalledWith({ id: 1 });
            expect(deleteNotification).toHaveBeenCalledWith({ id: 1 });
            expect(mockHook).toHaveBeenCalledWith(1);
        });
    });
});
