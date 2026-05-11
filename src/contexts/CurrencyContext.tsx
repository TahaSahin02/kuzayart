"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "EUR" | "USD" | "TRY";

export interface Rates {
  USD: number; // 1 EUR = X USD
  TRY: number; // 1 EUR = X TRY
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Rates | null;
  /** Format a EUR base price in the selected currency */
  format: (eurAmount: number) => string;
  /** Convert EUR → TRY (for PayTR) */
  toTRY: (eurAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "EUR",
  setCurrency: () => {},
  rates: null,
  format: (n) => `€${n}`,
  toTRY: (n) => n * 40,
});

const LOCALES: Record<Currency, string> = {
  EUR: "de-DE",
  USD: "en-US",
  TRY: "tr-TR",
};

const FALLBACK_RATES: Rates = { USD: 1.08, TRY: 55.0 };

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EUR");
  const [rates, setRates] = useState<Rates | null>(null);

  useEffect(() => {
    // Restore saved currency
    try {
      const stored = localStorage.getItem("kz_currency") as Currency;
      if (["EUR", "USD", "TRY"].includes(stored)) setCurrencyState(stored);
    } catch {}

    // open.er-api.com — hourly updates, no API key needed
    fetch("https://open.er-api.com/v6/latest/EUR")
      .then((r) => r.json())
      .then((data) => {
        if (data?.result === "success" && data?.rates?.USD && data?.rates?.TRY) {
          setRates({ USD: data.rates.USD, TRY: data.rates.TRY });
        } else {
          setRates(FALLBACK_RATES);
        }
      })
      .catch(() => setRates(FALLBACK_RATES));
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("kz_currency", c);
    } catch {}
  };

  const convert = (eurAmount: number): number => {
    if (currency === "EUR") return eurAmount;
    const r = rates ?? FALLBACK_RATES;
    if (currency === "USD") return eurAmount * r.USD;
    if (currency === "TRY") return eurAmount * r.TRY;
    return eurAmount;
  };

  const format = (eurAmount: number): string => {
    const amount = convert(eurAmount);
    return new Intl.NumberFormat(LOCALES[currency], {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "EUR" ? 0 : currency === "USD" ? 0 : 0,
    }).format(amount);
  };

  const toTRY = (eurAmount: number): number => {
    const r = rates ?? FALLBACK_RATES;
    return eurAmount * r.TRY;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, format, toTRY }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
