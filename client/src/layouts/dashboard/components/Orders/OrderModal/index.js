import { useCreateOrder } from "hooks/useOrders";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CreateOrderForm from "../CreateOrderForm";
import PropTypes from "prop-types";
import { useNotification } from "hooks/useNotifications";
import { useForm } from "react-hook-form";
import { useDeleteOrder } from "hooks/useOrders";
import DeleteMessage from "components/DeleteMessage";
import { useUpdateOrder } from "hooks/useOrders";
import UpdateOrderForm from "../UpdateOrderForm";
import { useEffect } from "react";

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

const emptyOrderValues = {
  customerId: "",
  productName: "",
  price: "",
  orderDate: "",
  quantity: "",
};

const OrderModal = ({
  open,
  onClose,
  onOperationFinished,
  modalMode,
  selectedOrder,
  onClearSelection,
}) => {
  const { notifyError, notifySuccess } = useNotification();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { mutate: deleteOrder, isPending: isDeletingOrder } = useDeleteOrder();
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateOrder();
  const { register, handleSubmit, reset, setError, formState, control } = useForm({
    defaultValues: emptyOrderValues,
  });

  const handleClose = () => {
    onClose();
  };

  const onCreateOrder = (data) => {
    createOrder(data, {
      onSuccess: () => {
        onOperationFinished();
        handleClose();
        notifySuccess("Заказ успешно добавлен");
      },
      onError: (error) => {
        error.fieldErrors?.forEach(({ field, message }) => {
          setError(field, { type: "server", message });
        });
        notifyError(error.message);
      },
    });
  };

  const onDeleteOrder = () => {
    if (!selectedOrder) return;

    deleteOrder(selectedOrder.id, {
      onSuccess: () => {
        onOperationFinished();
        handleClose();
        onClearSelection();
        notifySuccess("Заказ успешно удалён");
      },
      onError: (error) => {
        notifyError(error.message);
      },
    });
  };

  const onUpdateOrder = (data) => {
    if (!selectedOrder) return;
    updateOrder(
      { id: selectedOrder.id, ...data },
      {
        onSuccess: () => {
          onOperationFinished();
          handleClose();
          onClearSelection();
          notifySuccess("Данные заказа успешно обновлены");
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
        <CreateOrderForm
          errors={formState.errors}
          onSubmit={handleSubmit(onCreateOrder)}
          register={register}
          control={control}
        />
      );
    }
    if (modalMode === "delete")
      return <DeleteMessage onAgree={onDeleteOrder} onDisagree={handleClose} />;

    if (modalMode === "edit")
      return (
        <UpdateOrderForm
          errors={formState.errors}
          register={register}
          onSubmit={handleSubmit(onUpdateOrder)}
          control={control}
        />
      );
  };

  useEffect(() => {
    if (!open) return;

    if (modalMode === "edit" && selectedOrder) {
      reset({
        customerId: selectedOrder.customerId,
        productName: selectedOrder.productName,
        price: selectedOrder.price,
        orderDate: selectedOrder.orderDate ?? "",
        quantity: selectedOrder.quantity,
      });
    } else {
      reset(emptyOrderValues);
    }
  }, [open, modalMode, selectedOrder, reset]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Backdrop
          open={isCreatingOrder || isDeletingOrder || isUpdatingOrder}
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {showContent()}
      </Box>
    </Modal>
  );
};

OrderModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOperationFinished: PropTypes.func.isRequired,
  modalMode: PropTypes.string,
  selectedOrder: PropTypes.object,
  onClearSelection: PropTypes.func,
};

export default OrderModal;
