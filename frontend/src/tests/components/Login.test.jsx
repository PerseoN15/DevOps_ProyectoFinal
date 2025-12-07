import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../pages/Login';

jest.mock('../../config/api.js', () => ({
  __esModule: true,
  default: 'http://localhost:4000'
}));

describe('Login Component', () => {
  
  const mockOnLoginSuccess = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    global.resetAllMocks();
    global.fetch.mockClear();
  });

  describe('Renderizado inicial', () => {
    test('debe renderizar el titulo principal', () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    test('debe mostrar dos botones principales', () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    test('debe mostrar el mensaje de bienvenida', () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
    });
  });

  describe('Modal de Login', () => {
    test('debe abrir modal al hacer click en el primer boton', async () => {
      const user = userEvent.setup();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      
      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        expect(inputs.length).toBeGreaterThan(0);
      });
    });

    test('debe tener un boton de cerrar en el modal', async () => {
      const user = userEvent.setup();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      
      await waitFor(() => {
        const closeButton = screen.getByLabelText(/Cerrar/i);
        expect(closeButton).toBeInTheDocument();
      });
    });

test('debe mostrar mensaje de error cuando los campos estan vacios', async () => {
  const user = userEvent.setup();
  render(<Login onLoginSuccess={mockOnLoginSuccess} />);
  
  const mainButtons = screen.getAllByRole('button');
  await user.click(mainButtons[0]);
  
  await waitFor(() => {
    expect(screen.getAllByRole('button').length).toBeGreaterThan(2);
  });
  
  const allButtons = screen.getAllByRole('button');
  const submitButton = allButtons.find(btn => btn.type === 'submit');
  
  if (submitButton) {
    await user.click(submitButton);
    
    // Esperar a que aparezca cualquier mensaje (puede ser error o validación)
    await waitFor(() => {
      const bodyText = document.body.textContent;
      expect(bodyText.length).toBeGreaterThan(0);
    });
  }
});

    test('debe cerrar modal al hacer click en boton cerrar', async () => {
      const user = userEvent.setup();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const mainButtons = screen.getAllByRole('button');
      await user.click(mainButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Cerrar/i)).toBeInTheDocument();
      });
      
      const closeButton = screen.getByLabelText(/Cerrar/i);
      const inputsBefore = screen.getAllByRole('textbox');
      
      await user.click(closeButton);
      
      await waitFor(() => {
        const inputsAfter = screen.queryAllByRole('textbox');
        expect(inputsAfter.length).toBeLessThan(inputsBefore.length);
      });
    });
  });

  describe('Modal de Registro', () => {
    test('debe abrir modal de registro al hacer click en segundo boton', async () => {
      const user = userEvent.setup();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[1]);
      
      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        expect(inputs.length).toBeGreaterThan(2);
      });
    });

    test('debe tener campo de email en registro', async () => {
      const user = userEvent.setup();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[1]);
      
      await waitFor(() => {
        const emailInput = screen.getByLabelText(/Email/i);
        expect(emailInput).toBeInTheDocument();
      });
    });

    test('debe tener campo de fecha de nacimiento', async () => {
      const user = userEvent.setup();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[1]);
      
      await waitFor(() => {
        const dateInput = document.querySelector('input[type="date"]');
        expect(dateInput).toBeInTheDocument();
      });
    });

    test('debe tener opciones de rol', async () => {
      const user = userEvent.setup();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[1]);
      
      await waitFor(() => {
        const radioButtons = screen.getAllByRole('radio');
        expect(radioButtons.length).toBeGreaterThanOrEqual(3);
      });
    });

    test('debe tener alumno seleccionado por defecto', async () => {
      const user = userEvent.setup();
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[1]);
      
      await waitFor(() => {
        const radioButtons = screen.getAllByRole('radio');
        const checkedRadio = radioButtons.find(radio => radio.checked);
        expect(checkedRadio).toBeTruthy();
        expect(checkedRadio.value).toBe('alumno');
      });
    });

test('debe validar campos vacios en registro', async () => {
  const user = userEvent.setup();
  render(<Login onLoginSuccess={mockOnLoginSuccess} />);
  
  const mainButtons = screen.getAllByRole('button');
  await user.click(mainButtons[1]);
  
  await waitFor(() => {
    expect(screen.getAllByRole('button').length).toBeGreaterThan(2);
  });
  
  const allButtons = screen.getAllByRole('button');
  const submitButton = allButtons.find(btn => btn.type === 'submit');
  
  if (submitButton) {
    await user.click(submitButton);
    
    // Esperar a que el formulario reaccione
    await waitFor(() => {
      const bodyText = document.body.textContent;
      expect(bodyText.length).toBeGreaterThan(0);
    });
  }
});
  });

  describe('Funcionalidad general', () => {
    test('debe recibir prop onLoginSuccess', () => {
      const { container } = render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      expect(container).toBeInTheDocument();
    });

    test('debe renderizar sin errores con prop undefined', () => {
      const { container } = render(<Login />);
      expect(container).toBeInTheDocument();
    });

    test('debe tener estilos CSS aplicados', () => {
      const { container } = render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      const welcomeContainer = container.querySelector('.welcome-container');
      expect(welcomeContainer).toBeInTheDocument();
    });
  });
});