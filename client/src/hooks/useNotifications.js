import { useContext } from "react";
import { NotificationContext } from "context/NotificationContext";

export const useNotification = () => {
  const ctx = useContext(NotificationContext);

  if (!ctx)
    throw new Error("useNotifiuseNotification must be used within NotificationProvidercation");

  return ctx;
};
