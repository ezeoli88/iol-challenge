
import CurrencyConverter from '../components/CurrencyConverter';

interface RatesResponse {
  rates: Record<string, number>;
  date: string;
  base: string;
}

async function getRates(): Promise<RatesResponse> {
  const res = await fetch('https://api.vatcomply.com/rates?base=USD', {
    next: { revalidate: 3600 } // ISR: revalidar cada hora
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch rates');
  }
  
  return res.json();
}

export default async function Home() {
  const data = await getRates();
  
  return (
    <main>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">Currency Converter</div>
        </div>
      </nav>
      <CurrencyConverter initialRates={data.rates} initialDate={data.date} />
    </main>
  );
}
