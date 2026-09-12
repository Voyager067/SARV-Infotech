import { CURRENCY, LOCALE } from "../constants";

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

export const formatPrice = (amount: number): string => currencyFormatter.format(amount);
