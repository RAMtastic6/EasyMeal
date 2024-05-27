import { json } from 'stream/consumers';
import { validateSignUpAdmin } from '../src/actions/validateSignUpAdmin';
import { createAdmin } from '../src/lib/database/user';
import { getFormData } from '@/src/lib/utils';
import { redirect } from 'next/navigation';

jest.mock('../src/lib/database/user');
jest.mock('../src/lib/utils');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));


describe('Verifica del funzionamento della funzionalità di registrazione per utente amministratore', () => {
  let formData;

  beforeEach(() => {
    formData = new FormData();
    getFormData.mockImplementation((fields, formData) => {
      const data = {};
      fields.forEach(field => {
        data[field] = formData.get(field);
      });
      return data;
    });
  });

  it('Lancia un errore se la mail è invalida', async () => {
    formData.append('email', 'invalidemail');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Email must be valid' });
  });

  it('Lancia un errore se manca il nome', async () => {
    formData.append('email', 'test@example.com');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'First name is required' });
  });

  it('Lancia un errore se manca il cognome', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password1234');
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Last name is required' });
  });

  it('Lancia un errore se le password non coincidono', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password1234');
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Passwords do not match' });
  });

  it('Lancia un errore se manca il nome del ristorante', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password1234');
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Restaurant name is required' });
  });

  it('Lancia un errore se manca la città', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'City is required' });
  });

  it('Lancia un errore se manca indirizzo del ristorante', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Address is required' });
  });

  it('Lancia un errore se manca il numero di coperti', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Number of seats is required' });
  });

  it('Lancia un errore se manca il numero di telefono', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Phone number is required' });
  });

  it('Lancia un errore se manca la mail del ristorante', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Restaurant email is required' });
  });

  it('Lancia un errore se manca la tipologia di cucina', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Cuisine is required' });
  });

  it('Verifica che la registrazione venga effettuata con successo', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');

    createAdmin.mockResolvedValue({
      ok: true,
    });

    await validateSignUpAdmin({}, formData);
    expect(redirect).toHaveBeenCalledWith('login?signup=success');
  });

  it('Lancia un errore se la registrazione non va a buon fine (should return an array of errors)', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');
    createAdmin.mockResolvedValue({
      ok: false,
      json: () => ({ message: ['Error', 'Error2'] })
    });
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Error, Error2' });
  });

  it('Lancia un errore se la registrazione non va a buon fine (should return a string error)', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');
    createAdmin.mockResolvedValue({
      ok: false,
      json: () => ({ message: 'Error' })
    });
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Error' });
  });

  it('Lancia un errore se la registrazione non va a buon fine (should return a generic error)', async () => {
    formData.append('email', 'test@example.com');
    formData.append('nome', 'John');
    formData.append('cognome', 'Doe');
    formData.append('nome-ristorante', 'Ristorante Test');
    formData.append('city', 'Test City');
    formData.append('indirizzo', 'Test Address');
    formData.append('coperti', '50');
    formData.append('numero', '1234567890');
    formData.append('email-ristorante', 'ristorante@example.com');
    formData.append('cucina', 'Italian');
    formData.append('password', 'password123');
    formData.append('password_confirmation', 'password123');
    createAdmin.mockResolvedValue({
      ok: false,
      json: () => ({})
    });
    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Registration failed' });
  });
});