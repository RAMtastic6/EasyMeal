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

describe('Verifica il funzionamento frontend del componente Sign Up Admin', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  });

  it('Verifica della visualizzazione', () => {

    const mockState = { message: '' };
    const mockFormAction = jest.fn();
    require('react-dom').useFormState.mockReturnValue([mockState, mockFormAction]);

    render(<SignupAdmin />);

    expect(screen.getByTestId('InputEmail')).toBeInTheDocument();
    expect(screen.getByTestId('InputNome')).toBeInTheDocument();
    expect(screen.getByTestId('InputCognome')).toBeInTheDocument();
    expect(screen.getByTestId('InputNomeRistorante')).toBeInTheDocument();
    expect(screen.getByTestId('InputCittà')).toBeInTheDocument();
    expect(screen.getByTestId('InputIndirizzo')).toBeInTheDocument();
    expect(screen.getByTestId('InputDescrizione')).toBeInTheDocument();
    if (dayOfWeek && Array.isArray(dayOfWeek)) {
      dayOfWeek.forEach((day) => {
        expect(screen.getByTestId('InputOrari-' + day)).toBeInTheDocument();
        expect(screen.getByTestId('InputOrari-' + day + '-apertura')).toBeInTheDocument();
        expect(screen.getByTestId('InputOrari-' + day + '-chiusura')).toBeInTheDocument();
      });
    }
    expect(screen.getByTestId('InputCoperti')).toBeInTheDocument();
    expect(screen.getByTestId('InputNumero')).toBeInTheDocument();
    expect(screen.getByTestId('InputEmailRistorante')).toBeInTheDocument();
    expect(screen.getByTestId('InputCucina')).toBeInTheDocument();
    expect(screen.getByTestId('InputPassword')).toBeInTheDocument();
    expect(screen.getByTestId('InputConfirmPassword')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('Verifica degli input', () => {

    const mockState = { message: '' };
    const mockFormAction = jest.fn();
    require('react-dom').useFormState.mockReturnValue([mockState, mockFormAction]);

    render(<SignupAdmin />);

    fireEvent.change(screen.getByTestId('InputEmail'), { target: { value: 'test@example.it' } });
    fireEvent.change(screen.getByTestId('InputNome'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('InputCognome'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('InputNomeRistorante'), { target: { value: 'Ristorante' } });
    fireEvent.change(screen.getByTestId('InputCittà'), { target: { value: 'Città' } });
    fireEvent.change(screen.getByTestId('InputIndirizzo'), { target: { value: 'Indirizzo' } });
    fireEvent.change(screen.getByTestId('InputDescrizione'), { target: { value: 'Descrizione' } });
    if (dayOfWeek && Array.isArray(dayOfWeek)) {
      dayOfWeek.forEach((day) => {
        fireEvent.change(screen.getByTestId('InputOrari-' + day + '-apertura'), { target: { value: '08:00' } });
        fireEvent.change(screen.getByTestId('InputOrari-' + day + '-chiusura'), { target: { value: '20:00' } });
      });
    }
    fireEvent.change(screen.getByTestId('InputCoperti'), { target: { value: '100' } });
    fireEvent.change(screen.getByTestId('InputNumero'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('InputEmailRistorante'), { target: { value: 'prova@example.it' } });
    fireEvent.change(screen.getByTestId('InputCucina'), { target: { value: 'Italiana' } });
    fireEvent.change(screen.getByTestId('InputPassword'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId('InputConfirmPassword'), { target: { value: 'password123' } });

    expect(screen.getByTestId('InputEmail')).toHaveValue('test@example.it');
    expect(screen.getByTestId('InputNome')).toHaveValue('John');
    expect(screen.getByTestId('InputCognome')).toHaveValue('Doe');
    expect(screen.getByTestId('InputNomeRistorante')).toHaveValue('Ristorante');
    expect(screen.getByTestId('InputCittà')).toHaveValue('Città');
    expect(screen.getByTestId('InputIndirizzo')).toHaveValue('Indirizzo');
    expect(screen.getByTestId('InputDescrizione')).toHaveValue('Descrizione');
    if(dayOfWeek && Array.isArray(dayOfWeek)){
      dayOfWeek.forEach((day) => {
        expect(screen.getByTestId('InputOrari-' + day + '-apertura')).toHaveValue('08:00');
        expect(screen.getByTestId('InputOrari-' + day + '-chiusura')).toHaveValue('20:00');
      });
    }
    expect(screen.getByTestId('InputCoperti')).toHaveValue(100);
    expect(screen.getByTestId('InputNumero')).toHaveValue('1234567890');
    expect(screen.getByTestId('InputEmailRistorante')).toHaveValue('prova@example.it');
    expect(screen.getByTestId('InputCucina')).toHaveValue('Italiana');
    expect(screen.getByTestId('InputPassword')).toHaveValue('password123');
    expect(screen.getByTestId('InputConfirmPassword')).toHaveValue('password123');
  });
});