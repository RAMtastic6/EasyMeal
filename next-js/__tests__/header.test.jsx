import React from 'react';
import { render, screen } from '@testing-library/react'
import Header from '../src/components/header';

describe('Verifica il funzionamento frontend del componente Restaurant Search', () => {

    it('Verifica della visualizzazione', () => {
        render(<Header />)

        const homeLink = screen.getByTestId('HomeLink')
        const loginLink = screen.getByTestId('LoginLink')

        expect(homeLink).toBeInTheDocument()
        expect(loginLink).toBeInTheDocument()
    })
})