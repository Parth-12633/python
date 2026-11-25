import { createContext, useContext } from 'react';

/** `true` once the intro preloader has finished (or was skipped). Hero animations wait for it. */
export const ReadyContext = createContext(true);
export const useReady = () => useContext(ReadyContext);
