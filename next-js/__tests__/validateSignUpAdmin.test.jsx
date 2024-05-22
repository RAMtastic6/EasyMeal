import { validateSignUpAdmin } from '../src/actions/validateSignUpAdmin';
import { createUser } from '../src/lib/database/user';
import { createRestaurant } from '../src/lib/database/restaurant';
import { createStaff } from '../src/lib/database/staff';
import { createDaysOpen } from '../src/lib/database/daysopen';
import { getFormData } from '@/src/lib/utils';
import { daysOfWeek } from '@/src/lib/types/definitions';

jest.mock('../src/lib/database/user');
jest.mock('../src/lib/database/restaurant');
jest.mock('../src/lib/database/staff');
jest.mock('../src/lib/database/daysopen');
jest.mock('../src/lib/utils');

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

    createUser.mockResolvedValue({ id: 1 });
    createRestaurant.mockResolvedValue({ id: 1 });
    createStaff.mockResolvedValue({ id: 1 });
    createDaysOpen.mockResolvedValue({});

    const result = await validateSignUpAdmin({}, formData);
    expect(result).toEqual({ message: 'Registration successful' });
  });
});