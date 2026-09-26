import { useContext } from "react";
import { DataRefreshContext } from "context/DataRefreshContext";

export function useDataRefresh() {
  const ctx = useContext(DataRefreshContext);
  if (!ctx) throw new Error("useDataRefresh must be used within DataRefreshProvider");
  return ctx;
}
