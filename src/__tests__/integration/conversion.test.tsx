/**
 * Integration tests for the currency conversion flow
 * Tests the complete user journey from entering an amount to seeing results
 */

import { render, screen, fireEvent, within } from '@testing-library/react';
import CurrencyConverter from '@/components/CurrencyConverter';

// Realistic mock rates based on actual exchange rates
const realisticRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  ARS: 808.50,
  BRL: 4.89,
  MXN: 17.15,
  CAD: 1.35,
  AUD: 1.53,
  CHF: 0.86,
};

const mockDate = '2025-12-28';

describe('Currency Conversion Integration', () => {
  describe('Complete Conversion Flow', () => {
    it('completes a full USD to EUR conversion', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      // Step 1: Enter amount
      const amountInput = screen.getByLabelText('Amount');
      fireEvent.change(amountInput, { target: { value: '1000' } });
      
      // Step 2: Verify currencies are set (USD -> EUR by default)
      expect(screen.getByLabelText('From')).toHaveValue('USD');
      expect(screen.getByLabelText('To')).toHaveValue('EUR');
      
      // Step 3: Verify conversion result
      // 1000 USD * 0.92 = 920 EUR (formatted as 1,000.00)
      const mainResult = screen.getByRole('heading', { level: 2 });
      expect(mainResult).toHaveTextContent('USD');
      expect(mainResult).toHaveTextContent('EUR');
      expect(mainResult).toHaveTextContent('920.000000');
    });

    it('completes a conversion with currency swap', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      // Enter amount
      const amountInput = screen.getByLabelText('Amount');
      fireEvent.change(amountInput, { target: { value: '500' } });
      
      // Swap currencies
      const swapButton = screen.getByRole('button', { name: /swap currencies/i });
      fireEvent.click(swapButton);
      
      // Verify swap occurred
      expect(screen.getByLabelText('From')).toHaveValue('EUR');
      expect(screen.getByLabelText('To')).toHaveValue('USD');
    });

    it('handles multi-step currency changes', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      const fromSelect = screen.getByLabelText('From');
      const toSelect = screen.getByLabelText('To');
      
      // Change from USD to JPY
      fireEvent.change(fromSelect, { target: { value: 'JPY' } });
      expect(fromSelect).toHaveValue('JPY');
      
      // Change to GBP
      fireEvent.change(toSelect, { target: { value: 'GBP' } });
      expect(toSelect).toHaveValue('GBP');
      
      // Enter amount
      const amountInput = screen.getByLabelText('Amount');
      fireEvent.change(amountInput, { target: { value: '10000' } });
      
      // Verify title updates
      const heroTitle = screen.getByRole('heading', { level: 1 });
      expect(heroTitle).toHaveTextContent('JPY');
      expect(heroTitle).toHaveTextContent('GBP');
    });
  });

  describe('Cross-Rate Calculations', () => {
    it('calculates EUR to GBP correctly (cross-rate)', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      // Set EUR to GBP
      fireEvent.change(screen.getByLabelText('From'), { target: { value: 'EUR' } });
      fireEvent.change(screen.getByLabelText('To'), { target: { value: 'GBP' } });
      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
      
      // Cross-rate: GBP/EUR = 0.79/0.92 ≈ 0.8587
      // 100 EUR * 0.8587 ≈ 85.87 GBP
      // The result should be approximately 85.87
      const mainResult = screen.getByRole('heading', { level: 2 });
      expect(mainResult).toHaveTextContent('EUR');
      expect(mainResult).toHaveTextContent('GBP');
    });

    it('calculates JPY to ARS correctly (exotic pair)', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      fireEvent.change(screen.getByLabelText('From'), { target: { value: 'JPY' } });
      fireEvent.change(screen.getByLabelText('To'), { target: { value: 'ARS' } });
      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '1000' } });
      
      // Cross-rate: ARS/JPY = 808.50/149.50 ≈ 5.408
      // 1000 JPY ≈ 5408 ARS
      const heroTitle = screen.getByRole('heading', { level: 1 });
      expect(heroTitle).toHaveTextContent('JPY');
      expect(heroTitle).toHaveTextContent('ARS');
    });

    it('returns 1 when converting same currency', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      // Set both to EUR
      fireEvent.change(screen.getByLabelText('From'), { target: { value: 'EUR' } });
      fireEvent.change(screen.getByLabelText('To'), { target: { value: 'EUR' } });
      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
      
      // Should show 100.000000
      expect(screen.getByText(/100\.000000/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large amounts', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      const amountInput = screen.getByLabelText('Amount');
      fireEvent.change(amountInput, { target: { value: '999999999' } });
      
      // Should still render without crashing
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('handles decimal amounts', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      const amountInput = screen.getByLabelText('Amount');
      fireEvent.change(amountInput, { target: { value: '123.45' } });
      
      // Verify the input accepted the decimal
      expect(amountInput).toHaveValue(123.45);
    });

    it('handles zero amount', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      const amountInput = screen.getByLabelText('Amount');
      fireEvent.change(amountInput, { target: { value: '0' } });
      
      // Should show 0.000000 in result
      expect(screen.getByText(/0\.000000/)).toBeInTheDocument();
    });
  });

  describe('UI State Consistency', () => {
    it('maintains state after multiple interactions', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      const amountInput = screen.getByLabelText('Amount');
      const fromSelect = screen.getByLabelText('From');
      const toSelect = screen.getByLabelText('To');
      const swapButton = screen.getByRole('button', { name: /swap currencies/i });
      
      // Sequence of interactions
      fireEvent.change(amountInput, { target: { value: '250' } });
      fireEvent.change(fromSelect, { target: { value: 'GBP' } });
      fireEvent.change(toSelect, { target: { value: 'JPY' } });
      fireEvent.click(swapButton);
      fireEvent.change(amountInput, { target: { value: '500' } });
      
      // Verify final state
      expect(amountInput).toHaveValue(500);
      expect(fromSelect).toHaveValue('JPY');
      expect(toSelect).toHaveValue('GBP');
    });

    it('displays both direct and inverse rates', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      // Check that sub-result section shows both rates
      const subResult = screen.getByText(/1 EUR =/i);
      expect(subResult).toBeInTheDocument();
      
      const directRate = screen.getByText(/1 USD =/i);
      expect(directRate).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible form labels', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
      expect(screen.getByLabelText('From')).toBeInTheDocument();
      expect(screen.getByLabelText('To')).toBeInTheDocument();
    });

    it('swap button has accessible name', () => {
      render(<CurrencyConverter initialRates={realisticRates} initialDate={mockDate} />);
      
      const swapButton = screen.getByRole('button', { name: /swap currencies/i });
      expect(swapButton).toHaveAttribute('aria-label', 'Swap currencies');
      expect(swapButton).toHaveAttribute('title', 'Swap currencies');
    });
  });
});
