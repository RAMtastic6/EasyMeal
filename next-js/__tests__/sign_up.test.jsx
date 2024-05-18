import { screen, render, fireEvent } from '@testing-library/react'
import Signup from '../src/components/sign_up'

jest.mock('react-dom', () => {
    const originalModule = jest.requireActual('react-dom');
    return {
        ...originalModule,
        useFormState: jest.fn(),
    };
});

describe('Verifica il funzionamento frontend del componente Sign Up', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    });

    it('Verifica della visualizzazione', () => {

        const mockState = { message: '' };
        const mockFormAction = jest.fn();
        require('react-dom').useFormState.mockReturnValue([mockState, mockFormAction]);

        render(<Signup />);

        expect(screen.getByText('Registrati')).toBeInTheDocument();
        expect(screen.getByTestId('InputEmail')).toBeInTheDocument();
        expect(screen.getByTestId('InputNome')).toBeInTheDocument();
        expect(screen.getByTestId('InputCognome')).toBeInTheDocument();
        expect(screen.getByTestId('InputPassword')).toBeInTheDocument();
        expect(screen.getByTestId('InputConfirmPassword')).toBeInTheDocument();
        expect(screen.getByText('Sign up')).toBeInTheDocument();
    });

    it('Verifica degli input', () => {

        const mockState = { message: '' };
        const mockFormAction = jest.fn();
        require('react-dom').useFormState.mockReturnValue([mockState, mockFormAction]);

        render(<Signup />);

        fireEvent.change(screen.getByTestId('InputEmail'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId('InputNome'), { target: { value: 'John' } });
        fireEvent.change(screen.getByTestId('InputCognome'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByTestId('InputPassword'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByTestId('InputConfirmPassword'), { target: { value: 'password123' } });

        expect(screen.getByTestId('InputEmail')).toHaveValue('test@example.com');
        expect(screen.getByTestId('InputNome')).toHaveValue('John');
        expect(screen.getByTestId('InputCognome')).toHaveValue('Doe');
        expect(screen.getByTestId('InputPassword')).toHaveValue('password123');
        expect(screen.getByTestId('InputConfirmPassword')).toHaveValue('password123');
    })
});