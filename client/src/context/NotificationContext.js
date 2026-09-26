import MDSnackbar from "components/MDSnackbar";
import PropTypes from "prop-types";
import { createContext, useCallback, useContext, useState } from "react";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [state, setState] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const notify = useCallback((message, type = "info") => {
    console.log(message);
    setState({
      open: true,
      message,
      type,
    });
  }, []);

  const notifySuccess = useCallback((message) => notify(message, "success"), [notify]);
  const notifyError = useCallback((message) => notify(message, "error"), [notify]);

  const handleClose = () => setState((prev) => ({ ...prev, open: false }));

  const value = {
    notify,
    notifyError,
    notifySuccess,
    state,
    handleClose,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

NotificationProvider.propTypes = { children: PropTypes.node.isRequired };
