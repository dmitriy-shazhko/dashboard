import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useCreateCustomer } from "hooks/useCustomers";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import CreateCustomerForm from "../CreateCustomerForm";
import { useDeleteCustomer } from "hooks/useCustomers";
import { useUpdateCustomer } from "hooks/useCustomers";
import UpdateCustomerForm from "../UpdateCustomerForm";
import DeleteMessage from "components/DeleteMessage";
import { useNotification } from "hooks/useNotifications";
import { useDataRefresh } from "hooks/useDataRefresh";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

const emptyCustomerValues = {
  name: "",
  balance: "",
  birthDate: "",
};

const CustomerModal = ({
  open,
  onClose,
  onOperationFinished,
  modalMode,
  selectedCustomer,
  onClearSelection,
}) => {
  const { notifyError, notifySuccess } = useNotification();
  const { mutate: createCustomer, isPending: isCreatingCustomer } = useCreateCustomer();
  const { mutate: deleteCustomer, isPending: isDeletingCustomer } = useDeleteCustomer();
  const { mutate: updateCustomer, isPending: isUpdatingCustomer } = useUpdateCustomer();
  const { register, handleSubmit, reset, setError, formState } = useForm({
    defaultValues: emptyCustomerValues,
  });
  const { trigger } = useDataRefresh();

  const handleClose = () => {
    onClose();
  };

  const onCreateCustomer = (data) => {
    createCustomer(
      {
        ...data,
        birthDate: data.birthDate || null,
      },
      {
        onSuccess: () => {
          onOperationFinished();
          handleClose();
          notifySuccess("Покупатель успешно добавлен");
        },
        onError: (error) => {
          error.fieldErrors?.forEach(({ field, message }) => {
            setError(field, { type: "server", message });
          });
          notifyError(error.message);
        },
      }
    );
  };

  const onDeleteCustomer = () => {
    if (!selectedCustomer) return;

    deleteCustomer(selectedCustomer.id, {
      onSuccess: () => {
        onOperationFinished();
        trigger("orders");
        handleClose();
        onClearSelection();
        notifySuccess("Покупатель успешно удалён");
      },
      onError: (error) => {
        notifyError(error.message);
      },
    });
  };

  const onUpdateCustomer = (data) => {
    if (!selectedCustomer) return;
    updateCustomer(
      { ...data, id: selectedCustomer.id, birthDate: data.birthDate || null },
      {
        onSuccess: () => {
          onOperationFinished();
          handleClose();
          onClearSelection();
          notifySuccess("Данные покупателя успешно обновлены");
        },
        onError: (error) => {
          error.fieldErrors?.forEach(({ field, message }) => {
            setError(field, { type: "server", message });
          });
          notifyError(error.message);
        },
      }
    );
  };

  const showContent = () => {
    if (modalMode === "create") {
      return (
        <CreateCustomerForm
          errors={formState.errors}
          onSubmit={handleSubmit(onCreateCustomer)}
          register={register}
        />
      );
    }
    if (modalMode === "delete")
      return <DeleteMessage onAgree={onDeleteCustomer} onDisagree={handleClose} />;

    if (modalMode === "edit")
      return (
        <UpdateCustomerForm
          errors={formState.errors}
          register={register}
          onSubmit={handleSubmit(onUpdateCustomer)}
        />
      );
  };

  useEffect(() => {
    if (!open) return;

    if (modalMode === "edit" && selectedCustomer) {
      reset({
        name: selectedCustomer.name,
        balance: selectedCustomer.balance,
        birthDate: selectedCustomer.birthDate ?? "",
      });
    } else {
      reset(emptyCustomerValues);
    }
  }, [open, modalMode, selectedCustomer, reset]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Backdrop
          open={isCreatingCustomer || isDeletingCustomer || isUpdatingCustomer}
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {showContent()}
      </Box>
    </Modal>
  );
};

CustomerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOperationFinished: PropTypes.func.isRequired,
  modalMode: PropTypes.string,
  selectedCustomer: PropTypes.object,
  onClearSelection: PropTypes.func,
};

export default CustomerModal;
