import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import { getFilteredRestaurants } from '../src/lib/database/restaurant';
import RestaurantsTable from '../src/components/restaurants_table';

// Mocking dependencies
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('../src/lib/database/restaurant', () => ({
  getFilteredRestaurants: jest.fn(),
}));

const ITEMS_PER_PAGE = 10;

describe('RestaurantsTable', () => {
  const mockUseSearchParams = useSearchParams as jest.Mock;
  const mockGetFilteredRestaurants = getFilteredRestaurants as jest.Mock;

  beforeEach(() => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render restaurants when data is fetched', async () => {
    const mockRestaurants = [
      {
        id: 1,
        name: 'Restaurant A',
        address: '123 Main St',
        city: 'City A',
        cuisine: 'Italian',
      },
      {
        id: 2,
        name: 'Restaurant B',
        address: '456 Elm St',
        city: 'City B',
        cuisine: 'French',
      },
    ];

    mockGetFilteredRestaurants.mockResolvedValue(mockRestaurants);
		render(<RestaurantsTable ITEMS_PER_PAGE={ITEMS_PER_PAGE} />);

    await waitFor(() => {
      expect(screen.getByText('Restaurant A')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('City A')).toBeInTheDocument();
      expect(screen.getByText('Italian')).toBeInTheDocument();

      expect(screen.getByText('Restaurant B')).toBeInTheDocument();
      expect(screen.getByText('456 Elm St')).toBeInTheDocument();
      expect(screen.getByText('City B')).toBeInTheDocument();
      expect(screen.getByText('French')).toBeInTheDocument();
    });
  });

  it('should display message when no restaurants are found', async () => {
    mockGetFilteredRestaurants.mockResolvedValue([]);

    render(<RestaurantsTable ITEMS_PER_PAGE={ITEMS_PER_PAGE} />);

    await waitFor(() => {
      expect(screen.getByText('Nessun ristorante trovato')).toBeInTheDocument();
    });
  });

  it('should handle error during data fetching', async () => {
    console.error = jest.fn(); // Suppress error logging in the test output
    mockGetFilteredRestaurants.mockRejectedValue(new Error('Error fetching data'));

    render(<RestaurantsTable ITEMS_PER_PAGE={ITEMS_PER_PAGE} />);

    await waitFor(() => {
      expect(screen.getByText('Nessun ristorante trovato')).toBeInTheDocument();
    });

    expect(console.error).toHaveBeenCalledWith('Error fetching restaurants', new Error('Error fetching data'));
  });
});

