
'use client';

import { useState, ChangeEvent } from 'react';

interface CurrencyConverterProps {
  initialRates: Record<string, number>;
  initialDate: string;
}

export default function CurrencyConverter({ initialRates, initialDate }: CurrencyConverterProps) {
  // Application State
  const [amount, setAmount] = useState<number>(1.00);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');

  // Handlers
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setAmount(value);
    } else if (e.target.value === '') {
        setAmount(0);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Logic
  const currencies = Object.keys(initialRates).sort();
  
  // Cross-Rate Calculation
  const rateFrom = initialRates[fromCurrency] || 1;
  const rateTo = initialRates[toCurrency] || 1;
  const crossRate = rateTo / rateFrom;
  
  const result = (amount * crossRate).toFixed(6);
  
  // Inverse for display: 1 To = X From
  const inverseCrossRate = (1 / crossRate).toFixed(6);

  // Formatting helper
  const formatVal = (val: number) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <div className="hero">
        <div className="container">
            <h1 className="hero-title white-text">
                 {formatVal(amount)} {fromCurrency} to {toCurrency} - Convert {fromCurrency} to {toCurrency}
            </h1>
        </div>
      </div>

      <div className="container">
        <div className="converter-card">
                <div className="input-group">
                    <div className="input-field">
                    <label htmlFor="amount" className="input-label">Amount</label>
                    <div style={{position: 'relative'}}>
                        <span style={{position: 'absolute', left: '12px', top: '12px', color: '#888', pointerEvents: 'none'}}>$</span>
                        <input 
                        id="amount"
                        type="number" 
                        value={amount || ''} 
                        onChange={handleAmountChange} 
                        className="currency-input" 
                        style={{paddingLeft: '25px'}}
                        min="0"
                        />
                    </div>
                    </div>

                    <div className="input-field">
                    <label htmlFor="fromCurrency" className="input-label">From</label>
                    <select 
                        id="fromCurrency"
                        value={fromCurrency} 
                        onChange={(e) => setFromCurrency(e.target.value)} 
                        className="currency-select"
                    >
                        {currencies.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                        ))}
                    </select>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', height: '100%', paddingBottom: '5px'}}>
                        <button className="swap-btn" onClick={handleSwap} aria-label="Swap currencies" title="Swap currencies">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 7L5 10L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 10H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 17L19 14L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19 14H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        </button>
                    </div>

                    <div className="input-field">
                    <label htmlFor="toCurrency" className="input-label">To</label>
                    <select 
                        id="toCurrency"
                        value={toCurrency} 
                        onChange={(e) => setToCurrency(e.target.value)} 
                        className="currency-select"
                    >
                        {currencies.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                        ))}
                    </select>
                    </div>
                </div>

                <div className="result-section">
                    <div className="conversion-result">
                    <h2 className="main-result">
                        {formatVal(amount)} {fromCurrency} =
                        <br />
                        {result} {toCurrency}
                    </h2>
                    <p className="sub-result">
                        1 {toCurrency} = {inverseCrossRate} {fromCurrency}
                        <br />
                        1 {fromCurrency} = {crossRate.toFixed(6)} {toCurrency}
                    </p>
                    </div>

                    <div className="info-box">
                    <p>
                        We use the mid-market rate for our Converter. This is for informational
                        purposes only. You won&apos;t receive this rate when sending money.
                    </p>
                    </div>
                </div>

                <div className="last-updated">
                    <p>US Dollar to Euro conversion — Last updated {initialDate}</p>
                </div>
        </div>
      </div>
    </>
  );
}
