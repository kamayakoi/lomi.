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

  /* Phone and WhatsApp Input Styles */
  .phone-input-container, 
  .whatsapp-input-container {
    box-sizing: border-box;
    width: 100%;
  }
  
  .phone-input-container *, 
  .whatsapp-input-container * {
    border-radius: 0 !important;
    box-sizing: border-box;
  }
  
  /* Ensure WhatsApp input allows for absolute positioning of the icon */
  .whatsapp-input-container input {
    padding-right: 2.5rem !important;
  }
  
  .whatsapp-toggle {
    border-top: 1px solid #d1d5db;
    border-top-width: 1px !important;
    margin-top: -1px;
  }
  
  /* Add spacing after WhatsApp section */
  .billing-address-section {
    margin-top: 0.75rem !important;
  }
  
  /* Exclude specific elements from the no-radius rule */
  .allow-rounded {
    border-radius: 0.375rem !important; /* rounded-md equivalent */
  }
  
  /* Allow specific corners to be rounded */
  .rounded-br {
    border-bottom-right-radius: 0.375rem !important;
  }
  
  .rounded-bl {
    border-bottom-left-radius: 0.375rem !important;
  }
`;

export default checkoutStyles;