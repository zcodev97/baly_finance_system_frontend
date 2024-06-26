import NoPage from "./pages/NoPage";
import LoginPage from "./pages/login";
import VendorsPage from "./pages/vendors/records";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ContainerDetailsPage from "./pages/vendors/details";
import PaymentsPage from "./pages/payments/records";
import PaymentDetialsPage from "./pages/payments/details";
import PaidVendorsPage from "./pages/paid vendors/records";
import PaidVendorOrdersPage from "./pages/paid vendors/details";
import VendorDetailsPage from "./pages/vendors/details";
import AccountManagersLogsPage from "./pages/vendors/account_managers_logs.jsx";
import VendorsWithoutAccountManagersPage from "./pages/vendors/vendors_without_account_managers.jsx";
import FillVendorDetailsInfoPage from "./pages/vendors/fill_vendor_details_info.jsx";
import FilteredVendorsPage from "./pages/vendors/filtered_vendors.jsx";
import VendorsWithoutDetailsPage from "./pages/vendors/vendors_without_details.jsx";

function App() {
  return (
    <main>
      <div className="App">
        <div className="container-fluid bg-white" style={{ height: "100vh" }}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  localStorage.getItem("token") === null ||
                  localStorage.getItem("token") === undefined ? (
                    <LoginPage />
                  ) : (
                    <VendorsPage />
                  )
                }
              />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/vendors" element={<VendorsPage />} />
              <Route
                path="/filtered_vendors"
                element={<FilteredVendorsPage />}
              />
              <Route
                path="/vendors_without_account_managers"
                element={<VendorsWithoutAccountManagersPage />}
              />
              <Route
                path="/vendors_without_details"
                element={<VendorsWithoutDetailsPage />}
              />
              <Route
                path="/fill_vendors_details"
                element={<FillVendorDetailsInfoPage />}
              />
              <Route
                path="/account_managers_vendors_logs"
                element={<AccountManagersLogsPage />}
              />
              <Route path="/paid_vendors" element={<PaidVendorsPage />} />
              <Route
                path="/paid_vendor_orders_details"
                element={<PaidVendorOrdersPage />}
              />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/payment_details" element={<PaymentDetialsPage />} />
              <Route
                path="/container_details"
                element={<ContainerDetailsPage />}
              />
              <Route path="/vendor_details" element={<VendorDetailsPage />} />

              <Route path="*" element={<NoPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </main>
  );
}

export default App;
