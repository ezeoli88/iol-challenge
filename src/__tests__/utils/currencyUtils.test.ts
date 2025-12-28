/**
 * Unit tests for currency conversion utility functions
 * These test the core mathematical logic in isolation
 */

describe('Currency Conversion Utilities', () => {
  // Simulating the cross-rate calculation logic from CurrencyConverter
  const calculateCrossRate = (
    rates: Record<string, number>,
    fromCurrency: string,
    toCurrency: string
  ): number => {
    const rateFrom = rates[fromCurrency] || 1;
    const rateTo = rates[toCurrency] || 1;
    return rateTo / rateFrom;
  };

  const convertAmount = (
    amount: number,
    rates: Record<string, number>,
    fromCurrency: string,
    toCurrency: string
  ): number => {
    const crossRate = calculateCrossRate(rates, fromCurrency, toCurrency);
    return amount * crossRate;
  };

  const formatValue = (val: number): string => {
    return Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const mockRates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    ARS: 808.50,
  };

  describe('calculateCrossRate', () => {
    it('returns 1 for same currency', () => {
      const rate = calculateCrossRate(mockRates, 'USD', 'USD');
      expect(rate).toBe(1);
    });

    it('returns correct rate for USD to EUR', () => {
      const rate = calculateCrossRate(mockRates, 'USD', 'EUR');
      expect(rate).toBe(0.92);
    });

    it('returns correct rate for EUR to USD (inverse)', () => {
      const rate = calculateCrossRate(mockRates, 'EUR', 'USD');
      expect(rate).toBeCloseTo(1.087, 2);
    });

    it('calculates cross-rate for non-USD pairs', () => {
      // EUR to GBP: 0.79 / 0.92 ≈ 0.8587
      const rate = calculateCrossRate(mockRates, 'EUR', 'GBP');
      expect(rate).toBeCloseTo(0.8587, 3);
    });

    it('handles missing currency with fallback to 1', () => {
      const rate = calculateCrossRate(mockRates, 'INVALID', 'EUR');
      expect(rate).toBe(0.92);
    });
  });

  describe('convertAmount', () => {
    it('converts 100 USD to EUR correctly', () => {
      const result = convertAmount(100, mockRates, 'USD', 'EUR');
      expect(result).toBe(92);
    });

    it('converts 100 EUR to USD correctly', () => {
      const result = convertAmount(100, mockRates, 'EUR', 'USD');
      expect(result).toBeCloseTo(108.7, 1);
    });

    it('converts 1000 JPY to EUR correctly', () => {
      // 1000 * (0.92 / 149.50) ≈ 6.15
      const result = convertAmount(1000, mockRates, 'JPY', 'EUR');
      expect(result).toBeCloseTo(6.15, 1);
    });

    it('returns 0 when amount is 0', () => {
      const result = convertAmount(0, mockRates, 'USD', 'EUR');
      expect(result).toBe(0);
    });

    it('handles large amounts', () => {
      const result = convertAmount(1000000, mockRates, 'USD', 'JPY');
      expect(result).toBe(149500000);
    });

    it('handles decimal amounts', () => {
      const result = convertAmount(99.99, mockRates, 'USD', 'EUR');
      expect(result).toBeCloseTo(91.99, 2);
    });
  });

  describe('formatValue', () => {
    it('formats integer with 2 decimal places', () => {
      expect(formatValue(100)).toBe('100.00');
    });

    it('formats with thousand separators', () => {
      expect(formatValue(1000)).toBe('1,000.00');
    });

    it('formats large numbers correctly', () => {
      expect(formatValue(1234567.89)).toBe('1,234,567.89');
    });

    it('rounds to 2 decimal places', () => {
      expect(formatValue(99.999)).toBe('100.00');
    });

    it('handles zero', () => {
      expect(formatValue(0)).toBe('0.00');
    });

    it('handles negative numbers', () => {
      expect(formatValue(-100.5)).toBe('-100.50');
    });
  });

  describe('Edge Cases and Precision', () => {
    it('maintains precision for small exchange rates', () => {
      const smallRates = { USD: 1, BTC: 0.000025 };
      const result = convertAmount(1, smallRates, 'USD', 'BTC');
      expect(result).toBe(0.000025);
    });

    it('maintains precision for large exchange rates', () => {
      const result = convertAmount(1, mockRates, 'USD', 'ARS');
      expect(result).toBe(808.5);
    });

    it('handles floating point precision issues', () => {
      // Classic floating point issue: 0.1 + 0.2 !== 0.3
      const rates = { A: 0.1, B: 0.2 };
      const crossRate = calculateCrossRate(rates, 'A', 'B');
      expect(crossRate).toBeCloseTo(2, 10);
    });
  });
});
