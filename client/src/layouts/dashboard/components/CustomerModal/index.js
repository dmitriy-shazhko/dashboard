import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useCreateCustomer } from "hooks/useCustomers";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import CreateCustomerForm from "../CreateCustomerForm";
import DeleteCustomer from "../DeleteCustomer";
import { useDeleteCustomer } from "hooks/useCustomers";
import { useUpdateCustomer } from "hooks/useCustomers";
import UpdateCustomerForm from "../UpdateCustomerForm";

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

const CustomerModal = ({
  open,
  onClose,
  onOperationFinished,
  modalMode,
  selectedCustomer,
  onClearSelection,
}) => {
  const { mutate: createCustomer, isPending: isCreatingCustomer } = useCreateCustomer();
  const { mutate: deleteCustomer, isPending: isDeletingCustomer } = useDeleteCustomer();
  const { mutate: updateCustomer, isPending: isUpdatingCustomer } = useUpdateCustomer();
  const { register, handleSubmit, reset } = useForm();

  const handleClose = () => {
    reset();
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
        },
      }
    );
  };

  const onDeleteCustomer = () => {
    if (!selectedCustomer) return;

    deleteCustomer(selectedCustomer.id, {
      onSuccess: () => {
        onOperationFinished();
        handleClose();
        onClearSelection();
      },
    });
  };

  const onUpdateCustomer = (data) => {
    if (!selectedCustomer) return;
    updateCustomer(
      { id: selectedCustomer.id, ...data },
      {
        onSuccess: () => {
          onOperationFinished();
          handleClose();
          onClearSelection();
        },
      }
    );
  };

  const showContent = () => {
    if (modalMode === "create") {
      return <CreateCustomerForm onSubmit={handleSubmit(onCreateCustomer)} register={register} />;
    }
    if (modalMode === "delete")
      return <DeleteCustomer onAgree={onDeleteCustomer} onDisagree={handleClose} />;

    if (modalMode === "edit")
      return <UpdateCustomerForm register={register} onSubmit={handleSubmit(onUpdateCustomer)} />;
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
      reset();
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
