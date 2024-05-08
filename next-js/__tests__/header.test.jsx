import React from 'react';
import { render, screen } from '@testing-library/react'
import  Header  from '../src/components/header';

test('Verifica che il componente Header sia renderizzato correttamente', () => {
        render(<Header />)

        const homeLink = screen.getByTestId('HomeLink')
        const loginLink = screen.getByTestId('LoginLink')
 
        expect(homeLink).toBeInTheDocument()
        expect(loginLink).toBeInTheDocument()
    })