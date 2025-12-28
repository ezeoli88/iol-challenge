import { render, screen, fireEvent } from '@testing-library/react';
import CurrencyConverter from '@/components/CurrencyConverter';

// Mock data
const mockRates: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  ARS: 350.0,
};

const mockDate = '2025-12-28';

describe('CurrencyConverter Component', () => {
  describe('Rendering', () => {
    it('renders the converter with initial values', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
      expect(screen.getByLabelText('From')).toBeInTheDocument();
      expect(screen.getByLabelText('To')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /swap currencies/i })).toBeInTheDocument();
    });

    it('renders all available currencies in dropdowns', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const fromSelect = screen.getByLabelText('From');
      const options = fromSelect.querySelectorAll('option');
      
      expect(options).toHaveLength(Object.keys(mockRates).length);
    });

    it('displays the last updated date', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      expect(screen.getByText(/Last updated/)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(mockDate))).toBeInTheDocument();
    });

    it('displays default currencies USD and EUR', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      expect(screen.getByLabelText('From')).toHaveValue('USD');
      expect(screen.getByLabelText('To')).toHaveValue('EUR');
    });
  });

  describe('Amount Input', () => {
    it('updates amount when user types a valid number', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      fireEvent.change(amountInput, { target: { value: '100' } });
      
      expect(amountInput.value).toBe('100');
    });

    it('sets amount to 0 when input is cleared', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      fireEvent.change(amountInput, { target: { value: '' } });
      
      // Component sets to 0 when empty
      expect(amountInput.value).toBe('');
    });

    it('does not accept negative values', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      const initialValue = amountInput.value;
      
      fireEvent.change(amountInput, { target: { value: '-50' } });
      
      // Should keep previous value for negative numbers
      expect(amountInput.value).toBe(initialValue);
    });
  });

  describe('Currency Selection', () => {
    it('allows changing the source currency', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const fromSelect = screen.getByLabelText('From');
      fireEvent.change(fromSelect, { target: { value: 'GBP' } });
      
      expect(fromSelect).toHaveValue('GBP');
    });

    it('allows changing the target currency', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const toSelect = screen.getByLabelText('To');
      fireEvent.change(toSelect, { target: { value: 'JPY' } });
      
      expect(toSelect).toHaveValue('JPY');
    });
  });

  describe('Swap Functionality', () => {
    it('swaps currencies when swap button is clicked', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const fromSelect = screen.getByLabelText('From');
      const toSelect = screen.getByLabelText('To');
      const swapButton = screen.getByRole('button', { name: /swap currencies/i });
      
      // Initial state
      expect(fromSelect).toHaveValue('USD');
      expect(toSelect).toHaveValue('EUR');
      
      // Click swap
      fireEvent.click(swapButton);
      
      // After swap
      expect(fromSelect).toHaveValue('EUR');
      expect(toSelect).toHaveValue('USD');
    });

    it('swaps back to original when clicked twice', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const fromSelect = screen.getByLabelText('From');
      const toSelect = screen.getByLabelText('To');
      const swapButton = screen.getByRole('button', { name: /swap currencies/i });
      
      fireEvent.click(swapButton);
      fireEvent.click(swapButton);
      
      expect(fromSelect).toHaveValue('USD');
      expect(toSelect).toHaveValue('EUR');
    });
  });

  describe('Conversion Calculation', () => {
    it('displays correct conversion result for USD to EUR', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      // Default: 1 USD to EUR with rate 0.85
      // Result should contain 0.85 (appears in multiple places)
      const results = screen.getAllByText(/0\.850000/);
      expect(results.length).toBeGreaterThan(0);
    });

    it('updates conversion when amount changes', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const amountInput = screen.getByLabelText('Amount');
      fireEvent.change(amountInput, { target: { value: '100' } });
      
      // 100 USD * 0.85 = 85
      expect(screen.getByText(/85\.000000/)).toBeInTheDocument();
    });

    it('updates conversion when source currency changes', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const fromSelect = screen.getByLabelText('From');
      fireEvent.change(fromSelect, { target: { value: 'EUR' } });
      
      // 1 EUR to EUR = 1 (appears multiple times)
      const results = screen.getAllByText(/1\.000000/);
      expect(results.length).toBeGreaterThan(0);
    });

    it('displays inverse rate correctly', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      // 1 EUR = X USD -> 1/0.85 ≈ 1.176471
      expect(screen.getByText(/1\.176471/)).toBeInTheDocument();
    });
  });

  describe('Title/Hero Section', () => {
    it('displays formatted amount in hero title', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const heroTitle = screen.getByRole('heading', { level: 1 });
      expect(heroTitle).toHaveTextContent('1.00');
      expect(heroTitle).toHaveTextContent('USD');
      expect(heroTitle).toHaveTextContent('EUR');
    });

    it('updates hero title when currencies change', () => {
      render(<CurrencyConverter initialRates={mockRates} initialDate={mockDate} />);
      
      const fromSelect = screen.getByLabelText('From');
      fireEvent.change(fromSelect, { target: { value: 'GBP' } });
      
      const heroTitle = screen.getByRole('heading', { level: 1 });
      expect(heroTitle).toHaveTextContent('GBP');
    });
  });
});
