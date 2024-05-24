import { screen, render, fireEvent } from '@testing-library/react';
import SignupAdmin from '@/src/components/sign_up_admin'
import { dayOfWeek } from '@/src/lib/types/definitions'

jest.mock('react-dom', () => {
  const originalModule = jest.requireActual('react-dom');
  return {
    ...originalModule,
    useFormState: jest.fn(),
  };
});

const input = ['InputEmail', 'InputNome', 'InputCognome', 'InputNomeRistorante', 'InputCittà', 'InputIndirizzo', 'InputDescrizione', 'InputCoperti', 'InputNumero', 'InputEmailRistorante', 'InputCucina', 'InputPassword', 'InputConfirmPassword']

describe('Verifica il funzionamento frontend del componente Sign Up Admin', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  });

  it('Verifica della visualizzazione', () => {

    const mockState = { message: '' };
    const mockFormAction = jest.fn();
    require('react-dom').useFormState.mockReturnValue([mockState, mockFormAction]);

    render(<SignupAdmin />);

    // Check the presence of the elements
    if (input && Array.isArray(input)) {
      input.forEach((element) => {
        expect(screen.getByTestId(element)).toBeInTheDocument();
      }
      );
    }
    if (dayOfWeek && Array.isArray(dayOfWeek)) {
      dayOfWeek.forEach((day) => {
        expect(screen.getByTestId('InputOrari-' + day)).toBeInTheDocument();
        expect(screen.getByTestId('InputOrari-' + day + '-apertura')).toBeInTheDocument();
        expect(screen.getByTestId('InputOrari-' + day + '-chiusura')).toBeInTheDocument();
      });
    }
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('Verifica degli input', () => {

    const mockState = { message: '' };
    const mockFormAction = jest.fn();
    require('react-dom').useFormState.mockReturnValue([mockState, mockFormAction]);

    render(<SignupAdmin />);

    // Array of values to test
    const valueExamples = ['test@example.it', 'John', 'Doe', 'Ristorante', 'Città', 'Indirizzo', 'Descrizione', 100, '1234567890', 'prova@example.it', 'Italiana', 'password123', 'password123']
    
    // Change the value of the input
    if (input && Array.isArray(input)) {
      input.forEach((element, index) => {
        fireEvent.change(screen.getByTestId(element), { target: { value: valueExamples[index] } });
      });
    }
    if (dayOfWeek && Array.isArray(dayOfWeek)) {
      dayOfWeek.forEach((day) => {
        fireEvent.change(screen.getByTestId('InputOrari-' + day + '-apertura'), { target: { value: '08:00' } });
        fireEvent.change(screen.getByTestId('InputOrari-' + day + '-chiusura'), { target: { value: '20:00' } });
      });
    }

    // Check the value of the input
    if (input && Array.isArray(input)) {
      input.forEach((element, index) => {
        expect(screen.getByTestId(element)).toHaveValue(valueExamples[index]);
      });
    }
    if (dayOfWeek && Array.isArray(dayOfWeek)) {
      dayOfWeek.forEach((day) => {
        expect(screen.getByTestId('InputOrari-' + day + '-apertura')).toHaveValue('08:00');
        expect(screen.getByTestId('InputOrari-' + day + '-chiusura')).toHaveValue('20:00');
      });
    }
  });
});
