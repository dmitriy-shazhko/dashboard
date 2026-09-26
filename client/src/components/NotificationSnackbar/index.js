import MDSnackbar from "components/MDSnackbar";
import { useNotification } from "hooks/useNotifications";

const PRESETS = {
  success: { icon: "check", title: "Готово", color: "success" },
  error: { icon: "warning", title: "Ошибка", color: "error" },
  info: { icon: "notifications", title: "Уведомление", color: "info" },
};

const NotificationSnackbar = () => {
  const { state, handleClose } = useNotification();
  const preset = PRESETS[state.type] ?? PRESETS.info;

  return (
    <MDSnackbar
      color={preset.color}
      icon={preset.icon}
      title={preset.title}
      content={state.message}
      dateTime=""
      open={state.open}
      onClose={handleClose}
      close={handleClose}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    />
  );
};

export default NotificationSnackbar;
