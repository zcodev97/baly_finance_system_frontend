import { useEffect, useState } from "react";
import { SYSTEM_URL, formatDate, isFirstWeek, randomInt } from "../../global";
import NavBar from "../navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import Select from "react-select";
import Loading from "../loading";
import swal from "sweetalert";

function VendorDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // console.log(location.state);
  const [vendorName, setVendorName] = useState("");
  const [number, setNumber] = useState("");
  const [receiverName, setPaymentReceiverName] = useState("");
  const [phoneNumber, setOwnerPhoneNumber] = useState("");
  const [oldPaymentCycle, setOldPaymentCycle] = useState("");
  const [oldPaymentMethod, setOldPaymentMethod] = useState("");
  const [oldAccountManager, setOldAccountManager] = useState("");

  const [penalized, setPenalized] = useState(location.state.penalized);
  const [fully_refunded, set_fully_refunded] = useState(
    location.state.fully_refunded
  );
  const [commission_after_discount, setcommission_after_discount] = useState(
    location.state.commission_after_discount
  );

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

  // console.log(location.state)

  const [rows, setRows] = useState(

    (location.state?.owner_email_json === 'no emails' || location.state?.owner_email_json[0] === 'n' || location.state?.owner_email_json[0]?.title === '') ?
      [] : [...Object.values(location.state?.owner_email_json)],
  );

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

        setSelectedPaymentMethod(
          dropdownMenupaymentmethodTemp.find(
            (i) => i.label === location.state.pay_type.title
          )
        );

        setOldPaymentMethod(
          dropdownMenupaymentmethodTemp.filter(
            (i) => i.label === location.state.pay_type.title
          )[0]?.label
        );

        setpaymentMethodDropDown(dropdownMenupaymentmethodTemp);
      })
      .catch((e) => {
        // alert(e);
        console.log(e);
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
          dropdownMenupaymentcyclesTemp.find(
            (i) => i.label === location.state.pay_period.title
          )
        );

        setOldPaymentCycle(
          dropdownMenupaymentcyclesTemp.filter(
            (i) => i.label === location.state.pay_period.title
          )[0]?.label
        );

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

        setSelecetedAccountManager(
          dropdownaccountManagersTemp.find(
            (i) => i.label === location.state.account_manager_name
          )
        );

        setOldAccountManager(
          dropdownaccountManagersTemp.filter(
            (i) => i.label === location.state.account_manager_name
          )[0]?.label
        );

        setAccountManagersDropDown(dropdownaccountManagersTemp);
      })
      .catch((e) => {
        // alert(e);
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function ValidateEmail(input) {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input === undefined) return;
    if (input.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  async function updateVendorInfo() {



    if (location.state?.owner_email_json === 'no emails' || location.state?.owner_email_json[0] === 'n') {
      setLoading(true);
      let emails = rows?.filter((obj) => Object.keys(obj).length > 0);



      await fetch(SYSTEM_URL + "update_vendor/" + location.state.vendor_id.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: location.state.vendor_id.arName,

          pay_period: selectedPaymentCycle.value,
          pay_type: selectedPaymentMethod.value,
          account_manager: selectedAccountManager.value,
          number: (selectedPaymentMethod.label === 'ZainCash' || selectedPaymentMethod.label === 'Qi Card') ? number : 'NA',
          payment_receiver_name: selectedPaymentMethod.label === 'Cash' ? receiverName : 'NA',
          owner_phone: "1111",
          owner_email_json: emails,
          fully_refunded: fully_refunded,
          penalized: penalized,
          commission_after_discount: commission_after_discount,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return {};
          }
        })
        .then(async (response) => {
          if (Object.values(response).length > 0) {
            await SaveDataToLogsTableAndSendEmail(emails);
            navigate("/vendors", { replace: true });
            loadVendorUpdatesLogs();
          } else {
            swal("Failed To Save Data to DB !", {
              text: "Data not saved and Email is not Sent",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            });
          }
        })
        .catch((e) => {
          // alert(e);
          console.log(e);

        }).finally(() => {
          setLoading(false);

        });
    } else {


      setLoading(true);


      let emails = rows?.filter((obj) => Object.keys(obj).length > 0);

      let d = {
        name: location.state.vendor_id.arName,
        number: (selectedPaymentMethod.label === 'ZainCash' || selectedPaymentMethod.label === 'Qi Card') ? number : 'NA',
        payment_receiver_name: selectedPaymentMethod.label === 'Cash' ? receiverName : 'NA',
        pay_period: selectedPaymentCycle.value,
        pay_type: selectedPaymentMethod.value,
        account_manager: selectedAccountManager.value,
        owner_phone: "1111",
        owner_email_json: emails,
        fully_refunded: fully_refunded,
        penalized: penalized,
        commission_after_discount: commission_after_discount,
      };

      let areValidEmails = emails?.map((i) => ValidateEmail(i.title));

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

        await fetch(SYSTEM_URL + "update_vendor/" + location.state.vendor_id.id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: location.state.vendor_id.arName,

            pay_period: selectedPaymentCycle.value,
            pay_type: selectedPaymentMethod.value,
            account_manager: selectedAccountManager.value,
            number: (selectedPaymentMethod.label === 'ZainCash' || selectedPaymentMethod.label === 'Qi Card') ? number : 'NA',
            payment_receiver_name: selectedPaymentMethod.label === 'Cash' ? receiverName : 'NA',
            owner_phone: "1111",
            owner_email_json: emails,
            fully_refunded: fully_refunded,
            penalized: penalized,
            commission_after_discount: commission_after_discount,
          }),
        })
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else {
              return {};
            }
          })
          .then(async (response) => {
            if (Object.values(response).length > 0) {
              await SaveDataToLogsTableAndSendEmail(emails);
              navigate("/vendors", { replace: true });
              loadVendorUpdatesLogs();
            } else {
              swal("Failed To Save Data to DB !", {
                text: "Data not saved and Email is not Sent",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              });
            }
          })
          .catch((e) => {
            // alert(e);
            console.log(e);

          }).finally(() => {
            setLoading(false);

          });
      }



    }


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
        vendor_id: location.state.vendor_id.id,
        vendor_name: location.state.vendor_id.arName,
        old_payment_method: oldPaymentMethod,
        new_payment_method: selectedPaymentMethod?.label,
        old_payment_cycle: oldPaymentCycle,
        new_payment_cycle: selectedPaymentCycle?.label,
        old_account_manager: oldAccountManager,
        new_account_manager: selectedAccountManager?.label,
        old_number:
          location.state.number?.length > 0 ? location.state.number : "0",
        new_number: number?.length > 0 ? number : "0",
        old_receiver_name:
          location.state.owner_name?.length > 0
            ? location.state.owner_name
            : "no old receiver name",
        new_receiver_name:
          receiverName?.length > 0 ? receiverName : "no new receiver name",
        old_owner_phone: "string",
        new_owner_phone: "string",

        old_fully_refended: location.state.fully_refunded.toString(),
        new_fully_refended: fully_refunded.toString(),
        old_penalized: location.state.penalized.toString(),
        new_panelized: penalized.toString(),
        old_commission_after_discount:
          location.state.commission_after_discount.toString(),
        new_commission_after_discount: commission_after_discount.toString(),
        old_emails:
          Object.values(location.state.owner_email_json)?.length > 0
            ? location.state.owner_email_json?.map((i) => i.title)?.toString()
            : "no emails",
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
            buttons: true,
            // dangerMode: true,
          });
        } else {
          swal("Failed To Send Email !", {
            text: "Failed To Send Email",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          });
        }
      })
      .catch((e) => {
        // alert(e);
        console.log(e);

      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 5;
  async function loadVendorUpdatesLogs(page = 1) {
    setLoading(true);
    await fetch(
      SYSTEM_URL +
      `vendor_single_update_logs/${location.state.vendor_id.id}?page=${page}`,
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
        // alert(error);
        console.log(error);

      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    loadVendorUpdatesLogs();
    loadPaymentsMethod();
    loadPaymentsCycle();
    loadAccountManagers();
    setPaymentReceiverName(location.state.payment_receiver_name);
    setNumber(location.state.number);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setLoading(false);
  }, []);

  const totalPages = Math.ceil(data.count / itemsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadVendorUpdatesLogs(page);
      setCurrentPage(page);
    }
  };

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
                <b>
                  <i class="fi fi-rr-arrow-small-left">back</i>
                </b>
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
                        defaultValue={location.state?.vendor_id?.id}
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
                        defaultValue={location.state.vendor_id.arName}
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
                    <td>Payment Cycle


                    </td>
                    <td>
                      <Select
                        isDisabled={
                          isFirstWeek() ?
                            false :
                            selectedPaymentCycle.label === "NA" ? false : true
                        }
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
                          localStorage.getItem("user_type") === "ams" ||
                            localStorage.getItem("user_type") === "admin"
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
                  <tr
                    style={{
                      display:
                        selectedPaymentMethod.label === 'ZainCash' || selectedPaymentMethod.label === 'Qi Card' || selectedPaymentMethod.label === 'Taif'
                          ? "table-row"
                          : "none",
                    }}
                  >
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
                  <tr
                    style={{
                      display:
                        selectedPaymentMethod.label === 'Cash' || selectedPaymentMethod.label === 'Taif'
                          ? "table-row"
                          : "none",
                    }}>
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
                        defaultValue={location.state.payment_receiver_name}
                      />
                    </td>
                  </tr>

                  <tr
                    style={{
                      display:
                        localStorage.getItem("user_type") === "admin"
                          ? "table-row"
                          : "none",
                    }}
                  >
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

                  <tr
                    style={{
                      display:
                        localStorage.getItem("user_type") === "admin"
                          ? "table-row"
                          : "none",
                    }}
                  >
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
                  <tr
                    style={{
                      display:
                        localStorage.getItem("user_type") === "admin"
                          ? "table-row"
                          : "none",
                    }}
                  >
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
                  {/* <tr>
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

                            {
                              rows?.length === 0 ? null :
                                rows?.map((row, index) => (
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
                    </tr> */}
                  <tr>
                    <td className="text-center" colSpan={2}>
                      <button
                        className="btn btn-success  mt-2 mb-2"
                        onClick={() => {
                          swal({
                            text: `Are You Sure to Update ${location.state.vendor_id.arName} Vendor`,
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                          }).then((willDelete) => {
                            if (willDelete) {

                              if (selectedPaymentMethod.label === 'NA') {
                                swal("Please Fill Payment Method!");
                                return
                              }


                              if (selectedPaymentCycle.label === 'NA') {
                                swal("Please Fill Payment Cycle!");
                                return
                              }


                              if (selectedPaymentMethod.label !== 'ZainCash' &&

                                selectedPaymentMethod.label !== 'Qi Card'
                              ) {
                                if (receiverName === 'NA' || receiverName === undefined || receiverName === null) {
                                  swal("Please Fill Payment Receiver Name!");
                                  return
                                }


                              }



                              if (selectedPaymentMethod.label !== 'Cash') {

                                if (number === 'NA' || number === undefined || number === null) {
                                  swal("Please Fill Payment Method Number!");
                                  return
                                }
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
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="container-fluid">
            <p style={{ fontSize: "16px", fontWeight: "bold" }}>
              {data.count} Vendors Logs
            </p>

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
                  style={{ fontSize: "12px" }}
                >
                  <thead>
                    <tr>
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
                      {/* <th>Old Emails</th>
                      <th>New Emails </th> */}
                      <th>Created At </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData?.map((item, index) => (
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
                        {/* <td>
                          {item.old_emails.split(",")?.map((i, index) => (
                            <tr className="text-center">
                              <td>{i}</td>
                            </tr>
                          ))}
                        </td>
                        <td>
                          {item.new_emails.split(",")?.map((i) => (
                            <tr className="text-center">
                              <td>{i}</td>
                            </tr>
                          ))}
                        </td> */}
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
export default VendorDetailsPage;
