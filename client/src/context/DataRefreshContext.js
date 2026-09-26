import PropTypes from "prop-types";
import { createContext, useCallback, useRef } from "react";

export const DataRefreshContext = createContext(null);

export const DataRefreshProvider = ({ children }) => {
  const listenerRef = useRef({});

  const subscribe = useCallback((key, fn) => {
    if (!listenerRef.current[key]) listenerRef.current[key] = new Set();

    listenerRef.current[key].add(fn);

    return () => listenerRef.current[key]?.delete(fn);
  }, []);

  const trigger = useCallback((key) => {
    listenerRef.current[key]?.forEach((fn) => fn());
  });

  return (
    <DataRefreshContext.Provider value={{ subscribe, trigger }}>
      {children}
    </DataRefreshContext.Provider>
  );
};

DataRefreshProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
