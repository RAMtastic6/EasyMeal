import { validateSignUp } from '../src/actions/validateSignUp';
import { createUser } from '../src/lib/database/user';
import { redirect } from 'next/navigation';

jest.mock('../src/lib/database/user');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Verifica del funzionamento della funzionalità di registrazione per utente base', () => {
  it('Lancia un errore se manca la mail', async () => {
    const formData = new FormData();
    formData.set('nome', 'John');
    formData.set('cognome', 'Doe');
    formData.set('password', 'password123');
    formData.set('password_confirmation', 'password123');
    
    const result = await validateSignUp({}, formData);
    expect(result).toEqual({ message: 'Email is required' });
  });

  it('Lancia un errore se la mail è invalida', async () => {
    const formData = new FormData();
    formData.set('email', 'invalidemail');
    formData.set('nome', 'John');
    formData.set('cognome', 'Doe');
    formData.set('password', 'password123');
    formData.set('password_confirmation', 'password123');
    
    const result = await validateSignUp({}, formData);
    expect(result).toEqual({ message: 'Email must be valid' });
  });

  it('Lancia un errore se manca il nome', async () => {
    const formData = new FormData();
    formData.set('email', 'test@example.com');
    formData.set('cognome', 'Doe');
    formData.set('password', 'password123');
    formData.set('password_confirmation', 'password123');
    
    const result = await validateSignUp({}, formData);
    expect(result).toEqual({ message: 'First name is required' });
  });

  it('Lancia un errore se manca il cognome', async () => {
    const formData = new FormData();
    formData.set('email', 'test@example.com');
    formData.set('nome', 'John');
    formData.set('password', 'password123');
    formData.set('password_confirmation', 'password123');
    
    const result = await validateSignUp({}, formData);
    expect(result).toEqual({ message: 'Last name is required' });
  });

  it('Lancia un errore se manca la password', async () => {
    const formData = new FormData();
    formData.set('email', 'test@example.com');
    formData.set('nome', 'John');
    formData.set('cognome', 'Doe');
    formData.set('password_confirmation', 'password123');
    
    const result = await validateSignUp({}, formData);
    expect(result).toEqual({ message: 'Password is required' });
  });

  it('Lancia un errore se manca la conferma della password', async () => {
    const formData = new FormData();
    formData.set('email', 'test@example.com');
    formData.set('nome', 'John');
    formData.set('cognome', 'Doe');
    formData.set('password', 'password123');
    
    const result = await validateSignUp({}, formData);
    expect(result).toEqual({ message: 'Password confirmation is required' });
  });

  it('Lancia un errore se le password non coincidono', async () => {
    const formData = new FormData();
    formData.set('email', 'test@example.com');
    formData.set('nome', 'John');
    formData.set('cognome', 'Doe');
    formData.set('password', 'password123');
    formData.set('password_confirmation', 'password456');
    
    const result = await validateSignUp({}, formData);
    expect(result).toEqual({ message: 'Passwords do not match' });
  });

  it('Verifica che la registrazione venga effettuata con successo', async () => {
    createUser.mockResolvedValue({
      ok: true,
    });

    const formData = new FormData();
    formData.set('email', 'test@example.com');
    formData.set('nome', 'John');
    formData.set('cognome', 'Doe');
    formData.set('password', 'password123');
    formData.set('password_confirmation', 'password123');
    
    await validateSignUp({}, formData);
    expect(redirect).toHaveBeenCalledWith('login?signup=success');
  });

  it('Verifica che la registrazione fallisca (should be an array)', async () => {
    createUser.mockResolvedValue({
      ok: false,
      json: async () => ({ message: ['Error1', 'Error2'] }),
    });

    const formData = new FormData();
    formData.set('email', 'test@example.com');
    formData.set('nome', 'John');
    formData.set('cognome', 'Doe');
    formData.set('password', 'password123');
    formData.set('password_confirmation', 'password123');
    
    const result = await validateSignUp({}, formData);
    expect(result).toEqual({ message: 'Error1, Error2' });
  });

  it('Verifica che la registrazione fallisca (specific error)', async () => {
    createUser.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Error1' }),
    });

    const formData = new FormData();
    formData.set('email', 'test@example.com');
    formData.set('nome', 'John');
    formData.set('cognome', 'Doe');
    formData.set('password', 'password123');
    formData.set('password_confirmation', 'password123');
    
    const result = await validateSignUp({}, formData);
    expect(result).toEqual({ message: 'Error1' });
  });

  it('Verifica che la registrazione fallisca (generic)', async () => {
    createUser.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    const formData = new FormData();
    formData.set('email', 'test@example.com');
    formData.set('nome', 'John');
    formData.set('cognome', 'Doe');
    formData.set('password', 'password123');
    formData.set('password_confirmation', 'password123');
    
    const result = await validateSignUp({}, formData);
    expect(result).toEqual({ message: 'Registration failed' });
  });
})