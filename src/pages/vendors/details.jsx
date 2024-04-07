import { useEffect, useState } from "react";
import { SYSTEM_URL, formatDate } from "../../global";
import NavBar from "../navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import Select from "react-select";
import Loading from "../loading";

function VendorDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [vendorName, setVendorName] = useState("");
  const [number, setNumber] = useState("");
  const [receiverName, setPaymentReceiverName] = useState("");
  const [phoneNumber, setOwnerPhoneNumber] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const [penalized, setPenalized] = useState(
    location.state.penalized === "no" ? false : true
  );
  const [fully_refunded, set_fully_refunded] = useState(
    location.state.fully_refunded === "no" ? false : true
  );
  // console.log(location.state);

  const setPenalizedCheckBoxButton = (e) => {
    const { name, checked } = e.target;
    setPenalized(checked);
    console.log(name);
    console.log(checked);
  };

  const setFullyRefendedCheckBoxButton = (e) => {
    const { name, checked } = e.target;
    set_fully_refunded(checked);
    console.log(name);
  };
  console.log(location.state);

  const [rows, setRows] = useState([{ title: "" }]);

  const addRow = () => {
    setRows([...rows, { title: "", count: "", price: "", total: "" }]);
  };

  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleChange = (index, key, value) => {
    const newRows = [...rows];
    newRows[index][key] = value;

    // // Update the total price when count or price changes
    // if (key === "count" || key === "price") {
    //   const count = parseInt(newRows[index]["count"]) || 0;
    //   const price = parseFloat(newRows[index]["price"]) || 0;
    //   newRows[index]["total"] = (count * price).toFixed(2);
    // }

    setRows(newRows);
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentMethodDropDown, setpaymentMethodDropDown] = useState([]);
  let dropdownMenupaymentmethodTemp = [];
  async function loadPaymentsMethod() {
    setLoading(true);

    fetch(SYSTEM_URL + "payment_methods/", {
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
        response.results?.forEach((i) => {
          dropdownMenupaymentmethodTemp.push({
            label: i.title,
            value: i.id,
          });
        });

        setSelectedPaymentMethod(
          dropdownMenupaymentmethodTemp.filter(
            (i) => i.label === location.state.pay_type
          )
        );
        setpaymentMethodDropDown(dropdownMenupaymentmethodTemp);
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [selectedPaymentCycle, setSelectedPaymentCycle] = useState("");
  const [paymentCycleDropDown, setpaymentCycleDropDown] = useState([]);
  let dropdownMenupaymentcyclesTemp = [];
  async function loadPaymentsCycle() {
    setLoading(true);

    fetch(SYSTEM_URL + "payment_cycles/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        response.results?.forEach((i) => {
          dropdownMenupaymentcyclesTemp.push({
            label: i.title,
            value: i.id,
          });
        });

        setSelectedPaymentCycle(
          dropdownMenupaymentcyclesTemp.filter(
            (i) => i.label === location.state.pay_period
          )
        );
        setpaymentCycleDropDown(dropdownMenupaymentcyclesTemp);
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [selectedAccountManager, setSelecetedAccountManager] = useState("");
  const [accountManagersDropDown, setAccountManagersDropDown] = useState([]);
  let dropdownaccountManagersTemp = [];
  async function loadAccountManagers() {
    setLoading(true);

    fetch(SYSTEM_URL + "account_managers/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        response?.forEach((i) => {
          dropdownaccountManagersTemp.push({
            label: i.username,
            value: i.id,
          });
        });

        setSelecetedAccountManager(
          dropdownaccountManagersTemp.filter(
            (i) => i.label === location.state.account_manager_name
          )
        );
        console.log(dropdownaccountManagersTemp);
        setAccountManagersDropDown(dropdownaccountManagersTemp);
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadPaymentsMethod();
    loadPaymentsCycle();
    loadAccountManagers();
  }, []);

  return (
    <>
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <div>
          <div
            className="container text-center p-2 "
            style={{ fontSize: "20px" }}
          >
            <p style={{ fontWeight: "bold" }}>{location.state.name} </p>
          </div>

          <div className="container text-center">
            <table className="table table-sm table-striped">
              <thead>
                <tr>
                  <td></td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b> Vendor Name</b>
                  </td>
                  <td>
                    <input
                      disabled={true}
                      onChange={(e) => {
                        setVendorName(e.target.value);
                      }}
                      type="text"
                      className="form-control text-center"
                      id="username"
                      style={{ fontSize: "20px" }}
                      defaultValue={location.state.name}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Payment Method</td>
                  <td>
                    <Select
                      defaultValue={selectedPaymentMethod}
                      options={paymentMethodDropDown}
                      onChange={(opt) => {
                        setSelectedPaymentMethod(opt);
                      }}
                      value={selectedPaymentMethod}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Payment Cycle</td>
                  <td>
                    <Select
                      defaultValue={selectedPaymentCycle}
                      options={paymentCycleDropDown}
                      onChange={(opt) => {
                        setSelectedPaymentCycle(opt);
                      }}
                      value={selectedPaymentCycle}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Account Manager</td>
                  <td>
                    <Select
                      defaultValue={selectedAccountManager}
                      options={accountManagersDropDown}
                      onChange={(opt) => {
                        setSelecetedAccountManager(opt);
                      }}
                      value={selectedAccountManager}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Number</td>
                  <td>
                    <input
                      onChange={(e) => {
                        setNumber(e.target.value);
                      }}
                      type="text"
                      className="form-control text-center"
                      id="username"
                      style={{ fontSize: "20px" }}
                      defaultValue={location.state.number}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Payment Receiver Name </td>
                  <td>
                    <input
                      onChange={(e) => {
                        setPaymentReceiverName(e.target.value);
                      }}
                      type="text"
                      className="form-control text-center"
                      id="username"
                      style={{ fontSize: "20px" }}
                      defaultValue={location.state.owner_name}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Owner Phone </td>
                  <td>
                    <input
                      onChange={(e) => {
                        setOwnerPhoneNumber(e.target.value);
                      }}
                      type="text"
                      className="form-control text-center"
                      id="username"
                      style={{ fontSize: "20px" }}
                      defaultValue={location.state.owner_phone}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Account Manager </td>
                  <td>
                    <input
                      onChange={(e) => {
                        setOwnerPhoneNumber(e.target.value);
                      }}
                      type="text"
                      className="form-control text-center"
                      id="username"
                      style={{ fontSize: "20px" }}
                      defaultValue={location.state.owner_phone}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Penalized </td>
                  <td>
                    <div>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="penalized"
                        id="penalized"
                        onChange={setPenalizedCheckBoxButton}
                        checked={penalized}
                      />

                      <div className="p-2"></div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Fully Refended </td>
                  <td>
                    <div>
                      <input
                        checked={fully_refunded}
                        className="form-check-input"
                        type="checkbox"
                        name="fully_refended"
                        id="fully_refended"
                        onChange={setFullyRefendedCheckBoxButton}
                      />

                      <div className="p-2"></div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <table className="table text-center">
                      <tfoot>
                        <tr>
                          <th></th>
                          <th>
                            <button
                              className="btn btn-light text-primary"
                              onClick={addRow}
                            >
                              <b>Add Owner Email Field</b>
                            </button>
                          </th>
                        </tr>
                      </tfoot>
                      <tbody>
                        {rows.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <button
                                className="btn btn-light text-danger"
                                onClick={() => deleteRow(index)}
                              >
                                <b> Delete</b>
                              </button>
                            </td>

                            <td>
                              <input
                                className="form-control text-center"
                                type="text"
                                // dir="rtl"
                                value={row.title}
                                onChange={(e) =>
                                  handleChange(index, "title", e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="container text-center">
            <button className="btn btn-light text-success">
              <b> Update Vendor</b>
            </button>
          </div>

          <div className="container-fluid ">
            <p className="text-danger mt-2 mb-2">
              <b>Vendor Log</b>
            </p>
            <table
              className="table table-sm text-center mt-2 mb-4"
              style={{ fontSize: "12px" }}
            >
              <thead>
                <tr>
                  <th>Old Name</th>
                  <th>New Name</th>
                  <th>Old Payment Method</th>
                  <th>New Payment Method </th>
                  <th>Old Payment Cycle</th>
                  <th>New Payment Cycle </th>
                  <th>Old Number</th>
                  <th>New Number </th>
                  <th>Old Payment Receiver Name</th>
                  <th>New Payment Receiver Name </th>
                  <th>Old Owner Phone</th>
                  <th>New Owner Phone </th>
                  <th>Old Account Manager</th>
                  <th>New Account Manager </th>
                  <th>Old Fully Refended</th>
                  <th>New Fully Refended </th>
                  <th>Old Penalized</th>
                  <th>New Penalized </th>
                  <th>Old Emails</th>
                  <th>New Emails </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
export default VendorDetailsPage;
