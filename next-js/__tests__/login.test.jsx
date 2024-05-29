import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../src/components/login'; 
import { useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        replace: jest.fn(),
    }),
    useSearchParams: () => ({
        get: jest.fn(),
    }),
}));

jest.mock('../src/lib/session', () => ({
  createSession: jest.fn(() => Promise.resolve(true)),
}));

describe('Verifica il funzionamento frontend del componente Login', () => {

    it('Verifica della visualizzazione', () => {

      render(<Login />);

      expect(screen.getByRole(('heading'), { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole(('heading'), { level: 2 })).toBeInTheDocument();
      expect(screen.getByTestId('InputEmail')).toBeInTheDocument();
      expect(screen.getByTestId('InputPassword')).toBeInTheDocument();
      expect(screen.getByTestId('LoginButton')).toBeInTheDocument();
      expect(screen.getByTestId('LinkRegister')).toBeInTheDocument();
    });

    it('Verifica degli input', () => {

        render(<Login />);

        fireEvent.change(screen.getByTestId('InputEmail'), { target: { value: 'test@email.com' } });
        fireEvent.change(screen.getByTestId('InputPassword'), { target: { value: '1234' } });

        expect(screen.getByTestId('InputEmail')).toHaveValue('test@email.com');
        expect(screen.getByTestId('InputPassword')).toHaveValue('1234');
    });
});