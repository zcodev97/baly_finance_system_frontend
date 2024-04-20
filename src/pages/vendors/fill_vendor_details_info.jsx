import { useEffect, useState } from "react";
import { SYSTEM_URL, formatDate, randomInt } from "../../global";
import NavBar from "../navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import Select from "react-select";
import Loading from "../loading";
import swal from "sweetalert";

function FillVendorDetailsInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [vendorName, setVendorName] = useState("");
  const [number, setNumber] = useState("");
  const [receiverName, setPaymentReceiverName] = useState("");
  const [oldPaymentCycle, setOldPaymentCycle] = useState("");
  const [oldPaymentMethod, setOldPaymentMethod] = useState("");
  const [oldAccountManager, setOldAccountManager] = useState("");

  const [penalized, setPenalized] = useState(false);
  const [fully_refunded, set_fully_refunded] = useState(false);
  const [commission_after_discount, setcommission_after_discount] =
    useState(false);

  const setPenalizedCheckBoxButton = (e) => {
    const { name, checked } = e.target;
    setPenalized(checked);
  };

  const setFullyRefendedCheckBoxButton = (e) => {
    const { name, checked } = e.target;
    set_fully_refunded(checked);
  };
  const setCommissionAfterDiscountCheckBoxButton = (e) => {
    const { name, checked } = e.target;
    setcommission_after_discount(checked);
  };

  const [rows, setRows] = useState([]);

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

        setpaymentCycleDropDown(dropdownMenupaymentcyclesTemp);
      })
      .catch((e) => {
        alert(e);
        // console.log(e);
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

        setAccountManagersDropDown(dropdownaccountManagersTemp);
      })
      .catch((e) => {
        alert(e);
        // console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

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
      setLoading(true);
      fetch(SYSTEM_URL + "add_vendor_details_info/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          vendor_id: location.state.id,
          number: number,
          pay_period: selectedPaymentCycle.value,
          pay_type: selectedPaymentMethod.value,
          account_manager: selectedAccountManager.value,
          payment_receiver_name: receiverName,
          owner_email_json: emails,
          fully_refunded: fully_refunded,
          penalized: penalized,
          commission_after_discount: commission_after_discount,
        }),
      })
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          } else {
            return {};
          }
        })
        .then(async (response) => {
          if (Object.values(response).length > 0) {
            swal("Data Saved !", {
              text: `Data Saved and Email Sent For creating new Vendor`,
              dangerMode: false,
            });
            await SaveDataToLogsTableAndSendEmail(emails);
            navigate("/vendors", { replace: true });
          } else {
            swal("Failed To Save Data to DB !", {
              text: `Data not saved and Email is not Sent`,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            });
          }
        })
        .catch((e) => {
          alert(e);
        });
    }

    setLoading(false);
  }

  async function SaveDataToLogsTableAndSendEmail(emails) {
    setLoading(true);
    fetch(SYSTEM_URL + "create_vendor_update_log/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        vendor_id: location.state.id,
        vendor_name: location.state.arName,
        old_payment_method: "no old_payment_method ",
        new_payment_method: selectedPaymentMethod?.label,
        old_payment_cycle: "no old_payment_cycle",
        new_payment_cycle: selectedPaymentCycle?.label,
        old_account_manager: "no old_account_manager",
        new_account_manager: selectedAccountManager?.label,
        old_number: "no old_number",
        new_number: number?.length > 0 ? number : "0",
        old_receiver_name: "no old receiver name",
        new_receiver_name: receiverName,
        old_owner_phone: "string",
        new_owner_phone: "string",

        old_fully_refended: "no old_fully_refended",
        new_fully_refended: fully_refunded.toString(),
        old_penalized: "no old_penalized",
        new_panelized: penalized.toString(),
        old_commission_after_discount: "no old_commission_after_discount",
        new_commission_after_discount: commission_after_discount.toString(),
        old_emails: "no old_emails",
        new_emails:
          Object.values(emails)?.length > 0
            ? emails?.map((i) => i.title)?.toString()
            : "no emails",
        created_by: localStorage.getItem("user_id"),
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          return {};
        }
      })
      .then((response) => {
        if (Object.values(response).length > 0) {
          swal("Done!", {
            text: "Email Updates Sent",
            icon: "success",
            // buttons: true,
            // dangerMode: true,
          });
        } else {
          swal("Failed To Send Email !", {
            text: "Failed To Send Email",
            icon: "warning",
            // buttons: true,
            dangerMode: true,
          });
        }
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 15;

  useEffect(() => {
    setLoading(true);
    loadPaymentsMethod();
    loadPaymentsCycle();
    loadAccountManagers();

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
                        defaultValue={location.state.id}
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
                        defaultValue={location.state.arName}
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
                        isDisabled={
                          localStorage.getItem("is_superuser") === "true"
                            ? false
                            : true
                        }
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
                  <tr>
                    <td>Commission After Discount </td>
                    <td>
                      <div>
                        <input
                          checked={commission_after_discount}
                          className="form-check-input"
                          type="checkbox"
                          name="fully_refended"
                          id="fully_refended"
                          onChange={setCommissionAfterDiscountCheckBoxButton}
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
                    text: `Are You Sure to Update ${location.state.arName} Vendor`,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  }).then((willDelete) => {
                    if (willDelete) {
                      if (selectedPaymentMethod.length === 0) {
                        swal("Error!", {
                          text: "Please Fill Payment Method",
                          icon: "warning",
                          // buttons: true,
                          dangerMode: true,
                        });
                        return;
                      }

                      if (selectedPaymentCycle.length === 0) {
                        swal("Error!", {
                          text: "Please Fill Payment Cycle",
                          icon: "warning",
                          // buttons: true,
                          dangerMode: true,
                        });
                        return;
                      }

                      if (selectedAccountManager.length === 0) {
                        swal("Error!", {
                          text: "Please Fill Account Manager",
                          icon: "warning",
                          // buttons: true,
                          dangerMode: true,
                        });
                        return;
                      }

                      if (number.length === 0) {
                        swal("Error!", {
                          text: "Please Fill Payment Method Number",
                          icon: "warning",
                          // buttons: true,
                          dangerMode: true,
                        });
                        return;
                      }

                      if (receiverName.length === 0) {
                        swal("Error!", {
                          text: "Please Fill Payment Receiver Name",
                          icon: "warning",
                          // buttons: true,
                          dangerMode: true,
                        });
                        return;
                      }

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
export default FillVendorDetailsInfoPage;
