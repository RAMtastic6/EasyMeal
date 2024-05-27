import { decodeToken, login } from "../src/lib/database/authentication";
import { Endpoints } from "../src/lib/database/endpoints";
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

jest.mock('node-fetch');

describe('Authentication', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Reset all mocked functions before each test
  });

  describe('login', () => {
    it('should return token on successful login', async () => {
      // Mock successful login response
      const mockToken = 'mockToken';
      jest.spyOn(window, 'fetch').mockResolvedValueOnce({
        status: 200,
        json: async () => ({ token: mockToken }),
      } as any);

      const email = 'test@example.com';
      const password = 'password';
      const token = await login(email, password);

      expect(token).toBe(mockToken);
      expect(window.fetch).toHaveBeenCalledWith(Endpoints.authentication + 'signin', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
    });

    it('should return null on failed login', async () => {
      // Mock failed login response
      jest.spyOn(window, 'fetch').mockResolvedValueOnce({
        status: 401, // Unauthorized
      } as any);

      const email = 'test@example.com';
      const password = 'password';
      const token = await login(email, password);

      expect(token).toBeNull();
    });
  });

  describe('decodeToken', () => {
    it('should return decoded token', async () => {
      // Mock successful decodeToken response
      const mockDecodedToken = { id: 1, role: 'admin' };
      jest.spyOn(window, 'fetch').mockResolvedValueOnce({
        status: 200,
        json: async () => mockDecodedToken,
      } as any);

      const token = 'mockToken';
      const decodedToken = await decodeToken(token);

      expect(decodedToken).toEqual(mockDecodedToken);
      expect(window.fetch).toHaveBeenCalledWith(Endpoints.authentication + 'decodeToken', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    });

    it('should return null on failed decoding', async () => {
      // Mock failed decodeToken response
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 500, // Internal Server Error
      } as any);

      const token = 'mockToken';
      const decodedToken = await decodeToken(token);

      expect(decodedToken).toBeNull();
    });
  });
});
