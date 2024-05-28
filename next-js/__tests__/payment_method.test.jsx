import PaymentMethod from '../src/components/payment_method';
import { verifySession } from '../src/lib/dal';
import { getPartialBill, getRomanBill, getTotalBill } from '../src/lib/database/order';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('../src/lib/database/order', () => ({
  getPartialBill: jest.fn(),
  getRomanBill: jest.fn(),
  getTotalBill: jest.fn(),
}));

jest.mock('../src/lib/dal', () => ({
  verifySession: jest.fn().mockResolvedValue({ id: 1 }),
}));

const selectedOption = "Ognuno";
const params = 10;

const setSelectedOption = jest.fn().mockReturnThis();

describe('Verifica il funzionamento frontend del componente Payment Method', () => {
  beforeAll(() => {
    jest.spyOn(global, 'alert').mockImplementation(() => { });
  });

  it('Verifica del calcolo del totale', async () => {
    getPartialBill.mockResolvedValue(10);
    getRomanBill.mockResolvedValue(10);
    getTotalBill.mockResolvedValue(10);

    await waitFor(() => {
      render(<PaymentMethod selectedOption={selectedOption} params={params} setSelectedOption={setSelectedOption} />);
    });
    expect(screen.getByText('Totale: €10')).toBeInTheDocument();
    expect(screen.getByText('La tua parte: €10')).toBeInTheDocument();


  });
});