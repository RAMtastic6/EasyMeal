import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from "next/navigation";
import HomePageCards from '@/src/components/homepage_cards';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
      replace: jest.fn(),
  }),
}));

describe('Verifica il funzionamento frontend del componente HomePageCards', () => {

  it('Verifica della visualizzazione', () => {

    render(<HomePageCards />);

    expect(screen.getByText('Sei un utente?')).toBeInTheDocument();
    expect(screen.getByText('Sei un ristoratore?')).toBeInTheDocument();
    expect(screen.getAllByRole('button', {name: /Sign-up/i})).toHaveLength(2);
    expect(screen.getAllByRole('button', {name: /Login/i})).toHaveLength(2);
    expect(screen.getAllByText('Ti sei già registrato?')).toHaveLength(2);
  });
});