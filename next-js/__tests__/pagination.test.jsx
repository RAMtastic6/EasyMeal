import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../src/components/pagination';
import { usePathname, useSearchParams } from 'next/navigation';
import { generatePagination } from '../src/lib/utils';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../src/lib/utils', () => ({
  generatePagination: jest.fn(),
}));

describe('Pagination component', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/current-path');
    useSearchParams.mockReturnValue(new URLSearchParams('?page=1'));
    generatePagination.mockReturnValue([1, 2, 3, '...', 10]);
  });

  it('renders pagination links correctly', () => {
    render(<Pagination totalPages={10} />);

    // Troviamo tutti i link nel componente di paginazione
    const pageLinks = screen.getAllByRole('link');

    // Verifica il numero totale di link (incluso il "..." che non ha un ruolo di link)
    expect(pageLinks).toHaveLength(4); // 3 pagine + 1 freccia destra

    // Verifica href dei link di paginazione
    expect(pageLinks[0]).toHaveAttribute('href', '/current-path?page=2');
    expect(pageLinks[1]).toHaveAttribute('href', '/current-path?page=3');
    expect(pageLinks[2]).toHaveAttribute('href', '/current-path?page=10');
    expect(pageLinks[3]).toHaveAttribute('href', '/current-path?page=2');
  });

  it('disables previous arrow on the first page', () => {
    render(<Pagination totalPages={10} />);

    const leftArrow = screen.getByLabelText('Previous page');
    expect(leftArrow.closest('div')).toHaveClass('pointer-events-none text-gray-300');
  });

  it('disables next arrow on the last page', () => {
    useSearchParams.mockReturnValue(new URLSearchParams('?page=10'));

    render(<Pagination totalPages={10} />);

    const rightArrow = screen.getByLabelText('Next page');
    expect(rightArrow.closest('div')).toHaveClass('pointer-events-none text-gray-300');
  });

  it('navigates to the correct page on link click', () => {
    render(<Pagination totalPages={10} />);

    const page2Link = screen.getByText('2');
    fireEvent.click(page2Link);
    expect(page2Link).toHaveAttribute('href', '/current-path?page=2');
  });
});
