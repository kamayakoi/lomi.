// Styles for the checkout page
export const checkoutStyles = `
  /* Force light mode colors for the checkout interface */
  .checkout-container {
    --bg-color: white;
    --text-color: #1f2937;
    --border-color: #d1d5db;
    --input-bg: white;
    --input-text: #1f2937;
    --input-placeholder: #9ca3af;
    --input-border: #d1d5db;
    --button-primary-bg: #2563eb;
    --button-primary-text: white;
  }

  .checkout-container .card {
    background-color: var(--bg-color) !important;
    color: var(--text-color) !important;
    border-color: var(--border-color) !important;
  }

  .checkout-container input,
  .checkout-container select,
  .checkout-container textarea {
    background-color: var(--input-bg) !important;
    color: var(--input-text) !important;
    border-color: var(--input-border) !important;
  }

  .checkout-container input::placeholder,
  .checkout-container textarea::placeholder {
    color: var(--input-placeholder) !important;
  }

  .checkout-container .rounded-sm,
  .checkout-container .rounded {
    border-color: #d1d5db !important;
  }

  /* Fix for flags and UI elements */
  .checkout-container .flag,
  .checkout-container .react-phone-number-input__icon,
  .checkout-container .react-phone-number-input__country-icon {
    background-color: transparent !important;
  }

  /* Fix any promo code inputs */
  .checkout-container .promo-input input,
  .checkout-container .promo-input button {
    background-color: white !important;
    color: #1f2937 !important;
    border-color: #d1d5db !important;
  }
`;

export default checkoutStyles; 