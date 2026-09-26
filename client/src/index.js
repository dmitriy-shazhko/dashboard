/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import { AgGridProvider } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "context/NotificationContext";
import { DataRefreshProvider } from "context/DataRefreshContext";

const container = document.getElementById("app");
const root = createRoot(container);
const agModules = [AllCommunityModule];
const queryClient = new QueryClient();

root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <NotificationProvider>
        <AgGridProvider modules={agModules}>
          <QueryClientProvider client={queryClient}>
            <DataRefreshProvider>
              <App />
            </DataRefreshProvider>
          </QueryClientProvider>
        </AgGridProvider>
      </NotificationProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
