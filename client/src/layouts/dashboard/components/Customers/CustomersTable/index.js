import { Button, Stack } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useRef, useState } from "react";
import CustomerModal from "../CustomerModal";
import { ModuleRegistry, InfiniteRowModelModule } from "ag-grid-community";
import { getCustomers } from "api/customers";
import { useNotification } from "hooks/useNotifications";
import { getErrorMessage } from "utils/getErrorMessage";

ModuleRegistry.registerModules([InfiniteRowModelModule]);

export const createCustomersDatasource = (notifyError, gridApiRef) => ({
  getRows: async (params) => {
    const { startRow, endRow } = params;

    const limit = endRow - startRow;
    const offset = startRow;

    gridApiRef.current?.setGridOption("loading", true);

    try {
      const result = await getCustomers({
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

const CustomersTable = () => {
  const gridApiRef = useRef(null);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [modalMode, setModalMode] = useState(null);
  const { notifyError } = useNotification();

  const [colDefs] = useState([
    { headerName: "Имя", field: "name", flex: 1 },
    {
      headerName: "Баланс",
      field: "balance",
      valueFormatter: (i) => (i.value ? `${i.value}.00 ₽` : ""),
      flex: 1,
    },
    {
      headerName: "Дата рождения",
      field: "birthDate",
      valueFormatter: (i) => i.value?.split("-")?.reverse()?.join("."),
      flex: 1,
    },
  ]);

  const datasource = useMemo(() => createCustomersDatasource(notifyError, gridApiRef), []);
  const onGridReady = useCallback(
    (params) => {
      gridApiRef.current = params.api;

      params.api.setGridOption("datasource", datasource);
    },
    [datasource]
  );

  const refreshCustomers = useCallback(() => {
    gridApiRef.current?.refreshInfiniteCache();
  }, []);

  const clearSelection = useCallback(() => {
    gridApiRef.current?.deselectAll();
    setSelectedCustomer(null);
  }, []);

  const onCreateCallback = () => {
    setModalMode("create");
  };

  const onEditCallback = () => {
    if (!selectedCustomer) return;

    setModalMode("edit");
  };

  const onDeleteCallback = () => {
    if (!selectedCustomer) return;

    setModalMode("delete");
  };

  const onCloseModal = () => {
    setModalMode(null);
  };

  const onSelectionChanged = (params) => {
    const [selectedRow] = params.api.getSelectedRows();

    setSelectedCustomer(selectedRow ?? null);
  };

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
          disabled={!selectedCustomer}
        >
          Редактировать
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onDeleteCallback}
          disabled={!selectedCustomer}
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
          rowSelection="single"
          onSelectionChanged={onSelectionChanged}
          overlayNoRowsTemplate="<span>Нет данных для отображения</span>"
        />
      </div>
      <CustomerModal
        modalMode={modalMode}
        open={modalMode !== null}
        onClose={onCloseModal}
        onOperationFinished={refreshCustomers}
        selectedCustomer={selectedCustomer}
        onClearSelection={clearSelection}
      />
    </Stack>
  );
};

export default CustomersTable;
