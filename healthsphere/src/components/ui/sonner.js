import React from 'react';

/**
 * Sonner Toast Component
 * Displays toast notifications at the bottom right of the screen
 */
export function Toaster() {
  return (
    <div 
      id="sonner-toaster" 
      className="fixed bottom-0 right-0 z-50 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    />
  );
}
