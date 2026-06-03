import React from 'react';

/**
 * Toast Notification Component
 * Displays toast notifications (alternative toaster)
 */
export function Toaster() {
  return (
    <div 
      id="toast-container" 
      className="fixed bottom-0 right-0 z-40 pointer-events-none"
      aria-live="assertive"
      aria-atomic="true"
    />
  );
}
