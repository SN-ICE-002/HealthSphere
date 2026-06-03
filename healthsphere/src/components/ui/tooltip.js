import React, { createContext, useContext } from 'react';

/**
 * Tooltip Provider Context
 * Provides tooltip functionality to child components
 */
const TooltipContext = createContext();

export function TooltipProvider({ children }) {
  return (
    <TooltipContext.Provider value={{}}>
      {children}
    </TooltipContext.Provider>
  );
}

export function useTooltip() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within TooltipProvider');
  }
  return context;
}
