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
    expect(screen.getByRole('button', {name: /Sign-up/i})).toBeInTheDocument();
    expect(screen.getByText('Ti sei già registrato?')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Login/i})).toBeInTheDocument();
    expect(screen.getByText('Sei un ristoratore?')).toBeInTheDocument();
    expect(screen.getAllByRole('button', {name: /Sign-up/i})).toHaveLenght(2);
    expect(screen.getAllByRole('button', {name: /Login/i})).toHaveLenght(2);
    expect(screen.getAllByText('Ti sei già registrato?')).toHaveLenght(2);
  });
});