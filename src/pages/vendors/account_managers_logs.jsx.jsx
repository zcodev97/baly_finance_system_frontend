import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SYSTEM_URL, formatDate, randomInt } from "../../global";
import Loading from "../loading";
import NavBar from "../navbar";
import axios from "axios";
import Select from "react-select";

function AccountManagersLogsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 15;

  async function loadData(page = 1) {
    setLoading(true);
    await fetch(SYSTEM_URL + `vendor_update_logs/?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "token_not_valid") {
          navigate("/login", { replace: true });
        }

        setData(data);
        setPaginatedData(data.results);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [selectedVendor, setSelectedVendor] = useState({});
  const [vendorsDropDownMenu, setVendorsDropDownMenu] = useState([]);
  let vendorTempDropDownMenu = [];
  async function loadVendors() {
    setLoading(true);

    fetch(SYSTEM_URL + "get_vendor_id_name/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.code === "token_not_valid") {
          navigate("/login", { replace: true });
        }
        response.forEach((i) => {
          vendorTempDropDownMenu.push({
            label: i.name,
            value: i.vendor_id,
          });
        });
        setVendorsDropDownMenu(vendorTempDropDownMenu);
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function getSingleVendor(vendor_id) {
    setLoading(true);

    fetch(SYSTEM_URL + "vendor/" + vendor_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.code === "token_not_valid") {
          navigate("/login", { replace: true });
        }
        // console.log(response.results[0]);
        navigate("/vendor_details", { state: response.results[0] });
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    loadData();
    // loadVendors();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setLoading(false);
  }, []);

  const totalPages = Math.ceil(data.count / itemsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadData(page);

      setCurrentPage(page);
    }
  };

  return (
    <>
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <div
          className="container-fluid"
          style={{ margin: "0px", padding: "0px" }}
        >
          <div className="container-fluid">
            <p style={{ fontSize: "16px", fontWeight: "bold" }}>
              {data.count} Vendors Logs
            </p>
            {/* <div className="container-fluid mt-4 mb-4 text-start">
              <div style={{ width: "300px" }}>
                Search By Vendor
                <Select
                  defaultValue={selectedVendor}
                  options={vendorsDropDownMenu}
                  onChange={(opt) => {
                    setSelectedVendor(opt);
                    // get selected vendor info and navigate to vendor details page
                    getSingleVendor(opt.value);
                  }}
                  value={selectedVendor}
                />
              </div>
            </div> */}
            <button
              className="btn btn-primary m-1"
              onClick={() => changePage(1)}
            >
              &laquo; First
            </button>
            <button
              className="btn btn-primary m-1"
              onClick={() => changePage(currentPage - 1)}
            >
              &lsaquo; Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-primary m-1"
              onClick={() => changePage(currentPage + 1)}
            >
              Next &rsaquo;
            </button>
            <button
              className="btn btn-primary m-1"
              onClick={() => changePage(totalPages)}
            >
              Last &raquo;
            </button>
          </div>

          <div
            className="container-fluid text-center"
            style={{
              overflowX: "auto",
              width: "100%",
              fontSize: "14px",
            }}
          >
            <div className="container-fluid mt-2 mb-2">
              <p className="text-danger mt-2 mb-2">
                <b>Vendor Log</b>
              </p>

              <div className="container-fluid" style={{ overflowX: "auto" }}>
                <table
                  className="table table-sm table-striped table-hover text-center"
                  style={{ fontSize: "16px" }}
                >
                  <thead>
                    <tr className="align-middle">
                      {/* <th>Old Name</th>
                  <th>New Name</th> */}
                      <th>Index</th>
                      <th>Vendor ID</th>
                      <th>Vendor Name</th>
                      <th>Old Payment Method</th>
                      <th>New Payment Method </th>
                      <th>Old Payment Cycle</th>
                      <th>New Payment Cycle </th>
                      <th>Old Number</th>
                      <th>New Number </th>
                      <th>Old Payment Receiver Name</th>
                      <th>New Payment Receiver Name </th>
                      {/* <th>Old Owner Phone</th>
                  <th>New Owner Phone </th> */}
                      <th>Old Account Manager</th>
                      <th>New Account Manager </th>
                      <th>Old Fully Refended</th>
                      <th>New Fully Refended </th>
                      <th>Old Penalized</th>
                      <th>New Penalized </th>
                      <th>Old Commission After Discount</th>
                      <th>New Commission After Discount </th>
                      <th>Old Emails</th>
                      <th>New Emails </th>
                      <th>Created At </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, index) => (
                      <tr
                        className="align-middle"
                        key={randomInt(1, 100000000)}
                      >
                        <td>{index + 1}</td>
                        <td>{item.vendor_id}</td>
                        <td>{item.vendor_name}</td>
                        <td>{item.old_payment_method}</td>
                        <td>{item.new_payment_method}</td>
                        <td>{item.old_payment_cycle}</td>
                        <td>{item.new_payment_cycle}</td>
                        <td>{item.old_number}</td>
                        <td>{item.new_number}</td>
                        <td>{item.old_receiver_name}</td>
                        <td>{item.new_receiver_name}</td>
                        <td>{item.old_account_manager}</td>
                        <td>{item.new_account_manager}</td>
                        <td>{item.old_fully_refended}</td>
                        <td>{item.new_fully_refended}</td>
                        <td>{item.old_penalized}</td>
                        <td>{item.new_panelized}</td>
                        <td>{item.old_commission_after_discount}</td>
                        <td>{item.new_commission_after_discount}</td>
                        <td>
                          {item.old_emails.split(",").map((i, index) => (
                            <tr className="text-center">
                              <td>{i}</td>
                            </tr>
                          ))}
                        </td>
                        <td>
                          {item.new_emails.split(",").map((i) => (
                            <tr className="text-center">
                              <td>{i}</td>
                            </tr>
                          ))}
                        </td>
                        <td>{formatDate(item.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AccountManagersLogsPage;
