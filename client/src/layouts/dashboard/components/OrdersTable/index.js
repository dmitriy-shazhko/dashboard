import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useMemo, useCallback } from "react";

import { ModuleRegistry, InfiniteRowModelModule } from "ag-grid-community";
import { getCustomers } from "api/customers";
import { getOrders } from "api/orders";

ModuleRegistry.registerModules([InfiniteRowModelModule]);

export const createOrdersDatasource = (setisLodaing) => ({
  getRows: async (params) => {
    const { startRow, endRow } = params;

    const limit = endRow - startRow;
    const offset = startRow;

    try {
      setisLodaing(true);
      const result = await getOrders({
        limit,
        offset,
      });

      params.successCallback(result.data, result.total);
      setisLodaing(false);
    } catch (error) {
      console.error(error);
      params.failCallback();
      setisLodaing(false);
    }
  },
});

const OrdersTable = () => {
  const gridApiRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const datasource = useMemo(() => createOrdersDatasource(setIsLoading), []);
  const onGridReady = useCallback(
    (params) => {
      gridApiRef.current = params.api;

      params.api.setGridOption("datasource", datasource);
    },
    [datasource]
  );

  return (
    <div style={{ height: "300px" }}>
      <AgGridReact
        columnDefs={colDefs}
        rowModelType="infinite"
        cacheBlockSize={10}
        onGridReady={onGridReady}
        rowSelection="single"
        loading={isLoading}
      />
    </div>
  );
};

export default OrdersTable;
