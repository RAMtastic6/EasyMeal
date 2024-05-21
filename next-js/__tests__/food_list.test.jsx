import React from "react";
import { render, screen } from '@testing-library/react';
import FoodList from '../src/components/food_list';

describe('FoodList component', () => {
    // questo praticamente è un set di dati di rpova.
    const mockMenu = [
      { id: 1, name: 'Pizza', price: 10 },
      { id: 2, name: 'Pasta', price: 8 },
      { id: 3, name: 'Salad', price: 5 },
    ];
  
    test('renders the menu title', () => {
      render(<FoodList menu={mockMenu} />);
      const titleElement = screen.getByText(/Menu:/i);
      expect(titleElement).toBeInTheDocument();
    });
  
    test('renders a list of menu items', () => {
      render(<FoodList menu={mockMenu} />);
      const menuItems = screen.getAllByRole('listitem');
      expect(menuItems).toHaveLength(mockMenu.length)/*  */;
    });
  
    test('renders the correct names and prices for each menu item', () => {
      render(<FoodList menu={mockMenu} />);
      mockMenu.forEach(item => {
        const menuItem = screen.getByText(new RegExp(`${item.name} - ${item.price} €`, 'i'));
        expect(menuItem).toBeInTheDocument();
      });
    });
  
    test('renders an empty list when no menu items are provided', () => {
      render(<FoodList menu={[]} />);
      const menuItems = screen.queryAllByRole('listitem');
      expect(menuItems).toHaveLength(0);
    });
  });