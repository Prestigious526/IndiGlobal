const axios = require('axios');

let cachedRates = null;
let lastFetched = 0;
const TTL = 60 * 60 * 1000; // 1 hour TTL

const fetchRates = async () => {
  const now = Date.now();
  if (cachedRates && now - lastFetched < TTL) {
    return cachedRates;
  }

  try {
    const res = await axios.get(`https://api.exchangerate.host/latest?base=INR`);
    cachedRates = res.data.rates;
    lastFetched = now;
    return cachedRates;
  } catch (error) {
    console.error('Currency API error:', error);
    throw new Error('Currency conversion service unavailable');
  }
};

const convert = async (amountINR, toCurrency) => {
  const rates = await fetchRates();
  const rate = rates[toCurrency];
  if (!rate) throw new Error(`Unsupported currency: ${toCurrency}`);
  return amountINR * rate;
};

module.exports = {
  fetchRates,
  convert
};
