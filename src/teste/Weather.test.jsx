import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Weather from '../pages/Weather';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        azul: {
            main: '#1976d2',
        },
    },
});

describe('Componente Weather', () => {
    const renderWithTheme = (component) =>
        render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);

    it('renderiza campos e botão', () => {
        renderWithTheme(<Weather />);
        expect(screen.getByLabelText(/Cidade/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Dias/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Buscar/i })).toBeInTheDocument();
    });

    it('permite digitar nos campos', () => {
        renderWithTheme(<Weather />);
        const cidadeInput = screen.getByLabelText(/Cidade/i);
        const diasInput = screen.getByLabelText(/Dias/i);

        fireEvent.change(cidadeInput, { target: { value: 'São Paulo' } });
        fireEvent.change(diasInput, { target: { value: '3' } });

        expect(cidadeInput.value).toBe('São Paulo');
        expect(diasInput.value).toBe('3');
    });
});
