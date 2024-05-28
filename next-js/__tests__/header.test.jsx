import React from 'react';
import { render, screen, waitFor } from '@testing-library/react'
import Header from '../src/components/header';
import { cookies } from 'next/headers';

// Mock del componente Navbar
jest.mock('../src/components/nav_bar', () => ({
  __esModule: true,
  Navbar: jest.fn(() => {
    return (
      <div data-testid="navbar-mock">Mocked Navbar</div>
    );
  }),
}));

describe('Header', () => {

	it('should render the EasyMeal link', () => {
		const isLoggedIn = false;

		render(<Header isLogin={isLoggedIn}/>);
		const homeLink = screen.getByTestId('HomeLink');
		expect(homeLink).toBeInTheDocument();
		expect(homeLink).toHaveTextContent('EasyMeal');
	});

	it('should show login button when user is not logged in', () => {
		const isLoggedIn = false;

		render(<Header isLogin={isLoggedIn}/>);
		const loginButton = screen.getByText(/Login/i); // assuming your LoginLogout component has a login button with "Login" text
		expect(loginButton).toBeInTheDocument();
	});

	it('should show logout button when user is logged in', () => {
		const isLoggedIn = true;

		render(<Header isLogin={isLoggedIn}/>);
		const logoutButton = screen.getByText(/Logout/i); // assuming your LoginLogout component has a logout button with "Logout" text
		expect(logoutButton).toBeInTheDocument();
	});

	it('Verifica della visualizzazione', async () => {
		const isLoggedIn = false;

		render(<Header isLogin={isLoggedIn}/>);
		const homeLink = screen.getByTestId('HomeLink')
		const loginLink = screen.getByTestId('LoginLink')

		expect(homeLink).toBeInTheDocument()
		expect(loginLink).toBeInTheDocument()
	});

  it('renders all links for admin user', () => {
    render(<Header isLogin={true} isAdmin={true} />);

    expect(screen.getAllByTestId('home-link')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('create-reservation-link')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('admin-reservations-link')[0]).toBeInTheDocument();
    expect(screen.queryByTestId('user-reservations-link')).not.toBeInTheDocument();
  });

  it('renders all links for regular user', () => {
    render(<Header isLogin={true} isAdmin={false} />);

    expect(screen.getAllByTestId('home-link')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('create-reservation-link')[0]).toBeInTheDocument();
    expect(screen.queryByTestId('admin-reservations-link')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('user-reservations-link')[0]).toBeInTheDocument();
  });
});