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
import swal from "sweetalert";

function VendorDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [vendorName, setVendorName] = useState("");
  const [number, setNumber] = useState("");
  const [receiverName, setPaymentReceiverName] = useState("");
  const [phoneNumber, setOwnerPhoneNumber] = useState("");

  const [penalized, setPenalized] = useState(
    location.state.penalized === "no" ? false : true
  );
  const [fully_refunded, set_fully_refunded] = useState(
    location.state.fully_refunded === "no" ? false : true
  );

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

  const [rows, setRows] = useState([
    ...Object.values(location.state.owner_email_json),
  ]);

  const addRow = () => {
    setRows([...rows, { title: "" }]);
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

        setAccountManagersDropDown(dropdownaccountManagersTemp);
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // let emails = location.state.owner_email_json;

  function ValidateEmail(input) {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (input.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  async function updateVendorInfo() {
    setLoading(true);

    let emails = rows.filter((obj) => Object.keys(obj).length > 0);

    let areValidEmails = emails.map((i) => ValidateEmail(i.title));

    if (areValidEmails.find((i) => i === false) === false) {
      swal("Error!", {
        title: "Check Email Input!",
        text: `Try to Correct Email address !`,
        icon: "warning",
        dangerMode: true,
      });
      setLoading(false);

      return;
    } else {
      fetch(SYSTEM_URL + "update_vendor/" + location.state.vendor_id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: location.state.name,
          number: number,
          pay_period: selectedPaymentCycle.value,
          pay_type: selectedPaymentMethod.value,
          account_manager: selectedAccountManager.value,
          owner_name: receiverName,
          owner_phone: "1111",
          owner_email_json: emails,
          fully_refunded: fully_refunded,
          penalized: penalized,
        }),
      })
        .then((response) => response.json())
        .then(async (response) => {
          fetch(SYSTEM_URL + "create_vendor_update_log/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              vendor_id: location.state.vendor_id,
              vendor_name: location.state.name,
              old_payment_method: location.state.pay_type,
              new_payment_method: selectedPaymentMethod[0].label,
              old_payment_cycle: location.state.pay_period,
              new_payment_cycle: selectedPaymentCycle[0].label,
              old_number:
                location.state.number?.length > 0
                  ? location.state.number
                  : "no previous number",
              new_number: number?.length > 0 ? number : "0",
              old_receiver_name:
                location.state.old_receiver_name?.toString().length > 0
                  ? location.state.old_receiver_name
                  : "no previous receiver name",
              new_receiver_name:
                receiverName?.toString().length > 0
                  ? receiverName
                  : "np previous one",
              old_owner_phone: "string",
              new_owner_phone: "string",
              old_account_manager: "string",
              new_account_manager: "string",
              old_fully_refended: "string",
              new_fully_refended: "string",
              old_penalized: "string",
              new_panelized: "string",
              old_emails:
                Object.values(location.state.owner_email_json)?.length > 0
                  ? location.state.owner_email_json
                      ?.map((i) => i.title)
                      ?.toString()
                  : "no previous emails",
              new_emails:
                Object.values(emails)?.length > 0
                  ? emails?.map((i) => i.title)?.toString()
                  : "no previous emails",
              created_by: localStorage.getItem("user_id"),
            }),
          })
            .then((response) => response.json())
            .then((response) => {
              // console.log(response);
              // navigate("/vendor_details", { replace: true, state: response });
              swal("Done!", {
                text: "Email Updates Sent",
                icon: "success",
                buttons: true,
                dangerMode: true,
              });
            })
            .catch((e) => {
              alert(e);
            })
            .finally(() => {
              setLoading(false);
            });

          navigate("/vendor_details", { replace: true, state: response });
          // loadVendorLogUpdates();

          // navigate("/vendors", { replace: true });
        })
        .catch((e) => {
          alert(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 15;
  async function loadData(page = 1) {
    setLoading(true);
    await fetch(
      SYSTEM_URL +
        `vendor_single_update_logs/${location.state.vendor_id}/?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
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

  useEffect(() => {
    setLoading(true);
    loadData();
    loadPaymentsMethod();
    loadPaymentsCycle();
    loadAccountManagers();
    setPaymentReceiverName(location.state.owner_name);
    setOwnerPhoneNumber(location.state.owner_phone);
    setNumber(location.state.number);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setLoading(false);
  }, []);

  return (
    <>
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="container-fluid d-flex ">
            <div>
              <div
                className="btn btn-primary mt-2 mb-2"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <b>Back To Vendors</b>
              </div>
            </div>
            <div className="container">
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
                      <b> Vendor ID</b>
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
                        defaultValue={location.state.vendor_id}
                      />
                    </td>
                  </tr>
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
                    <td>Payment Method Number</td>
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

                  {/* <tr>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((i) => {
                          return (
                            <tr>
                              <td>{i.title}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </tr> */}
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
                                <b>Add Another Email </b>
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
                                  type="email"
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
            <div>
              <button
                className="btn btn-success  mt-2 mb-2"
                onClick={() => {
                  swal({
                    text: `Are You Sure to Update ${location.state.name} Vendor`,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  }).then((willDelete) => {
                    if (willDelete) {
                      updateVendorInfo();
                    } else {
                      swal("You Cancelled the Operation!");
                    }
                  });
                }}
              >
                <b> Update</b>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default VendorDetailsPage;
