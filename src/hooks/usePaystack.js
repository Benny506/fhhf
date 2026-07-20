import { useEffect, useState, useCallback } from 'react';

const SCRIPT_ID = 'paystack-inline-js';
const SCRIPT_URL = 'https://js.paystack.co/v1/inline.js';

export default function usePaystack(config) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If the script is already loaded and ready
    if (window.PaystackPop) {
      setIsReady(true);
      return;
    }

    // Check if the script tag is already in the document but still loading
    const existingScript = document.getElementById(SCRIPT_ID);
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.id = SCRIPT_ID;
      script.async = true;

      script.onload = () => {
        setIsReady(true);
      };

      script.onerror = () => {
        console.error('Failed to load Paystack inline script');
      };

      document.body.appendChild(script);
    } else {
      // If it exists but hasn't fired onload yet
      existingScript.addEventListener('load', () => setIsReady(true));
    }
  }, []);

  const initializePayment = useCallback(
    ({ onSuccess, onClose }) => {
      if (!isReady || !window.PaystackPop) {
        console.warn('Paystack inline script not loaded yet.');
        return;
      }

      const handler = window.PaystackPop.setup({
        ...config,
        callback: (response) => {
          if (onSuccess) onSuccess(response);
        },
        onClose: () => {
          if (onClose) onClose();
        },
      });

      handler.openIframe();
    },
    [config, isReady]
  );

  return initializePayment;
}
