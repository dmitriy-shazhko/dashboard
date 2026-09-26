import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";

import { ModuleRegistry, InfiniteRowModelModule } from "ag-grid-community";
import { getOrders } from "api/orders";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import OrderModal from "../OrderModal";
import { useDataRefresh } from "hooks/useDataRefresh";
import { useNotification } from "hooks/useNotifications";
import { getErrorMessage } from "utils/getErrorMessage";

ModuleRegistry.registerModules([InfiniteRowModelModule]);

export const createOrdersDatasource = (notifyError, gridApiRef) => ({
  getRows: async (params) => {
    const { startRow, endRow } = params;

    const limit = endRow - startRow;
    const offset = startRow;

    gridApiRef.current?.setGridOption("loading", true);

    try {
      const result = await getOrders({
        limit,
        offset,
      });

      params.successCallback(result.data, result.total);
      gridApiRef.current?.setGridOption("loading", false);

      if (result.total === 0) {
        gridApiRef.current?.showNoRowsOverlay();
      } else {
        gridApiRef.current?.hideOverlay();
      }
    } catch (error) {
      console.error(error);
      notifyError(getErrorMessage(error));
      params.successCallback([], 0);
      gridApiRef.current?.setGridOption("loading", false);
      gridApiRef.current?.showNoRowsOverlay();
    }
  },
});

const OrdersTable = () => {
  const gridApiRef = useRef(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const { subscribe } = useDataRefresh();
  const { notifyError } = useNotification();

  const [colDefs] = useState([
    { headerName: "Пользователь", field: "customerName", flex: 1 },
    { headerName: "Товар", field: "productName", flex: 1 },
    {
      headerName: "Цена",
      field: "price",
      flex: 1,
      valueFormatter: (i) => (i.value ? `${i.value}.00 ₽` : ""),
    },
    {
      headerName: "Дата заказа",
      field: "orderDate",
      flex: 1,
      valueFormatter: (i) => i.value?.split("-")?.reverse()?.join("."),
    },
    { headerName: "Количество", field: "quantity", flex: 1 },
  ]);

  const datasource = useMemo(() => createOrdersDatasource(notifyError, gridApiRef), []);
  const onGridReady = useCallback(
    (params) => {
      gridApiRef.current = params.api;

      params.api.setGridOption("datasource", datasource);
    },
    [datasource]
  );

  const refreshOrders = useCallback(() => {
    gridApiRef.current?.refreshInfiniteCache();
  }, []);

  const clearSelection = useCallback(() => {
    gridApiRef.current?.deselectAll();
    setSelectedOrder(null);
  }, []);

  const onCloseModal = () => {
    setModalMode(null);
  };

  const onCreateCallback = () => {
    setModalMode("create");
  };
  const onEditCallback = () => {
    if (!selectedOrder) return;

    setModalMode("edit");
  };
  const onDeleteCallback = () => {
    if (!selectedOrder) return;

    setModalMode("delete");
  };

  const onSelectionChanged = (params) => {
    const [selectedRow] = params.api.getSelectedRows();

    setSelectedOrder(selectedRow ?? null);
  };

  useEffect(() => {
    return subscribe("orders", refreshOrders);
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={2} direction="row">
        <Button variant="contained" color="success" onClick={onCreateCallback}>
          Добавить
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onEditCallback}
          disabled={!selectedOrder}
        >
          Редактировать
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onDeleteCallback}
          disabled={!selectedOrder}
        >
          Удалить
        </Button>
      </Stack>
      <div style={{ height: "300px" }}>
        <AgGridReact
          columnDefs={colDefs}
          rowModelType="infinite"
          cacheBlockSize={10}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          rowSelection="single"
          overlayNoRowsTemplate="<span>Нет данных для отображения</span>"
        />
      </div>
      <OrderModal
        modalMode={modalMode}
        open={modalMode !== null}
        onClose={onCloseModal}
        onOperationFinished={refreshOrders}
        selectedOrder={selectedOrder}
        onClearSelection={clearSelection}
      />
    </Stack>
  );
};

export default OrdersTable;
