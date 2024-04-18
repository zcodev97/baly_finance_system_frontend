import { useEffect, useState } from "react";
import { SYSTEM_URL, formatDate, randomInt } from "../../global";
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
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import * as XLSX from "xlsx";
import swal from "sweetalert";

function PaymentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalToBePaid, setTotalTobePaid] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table

  const exportToPDF = () => {
    // Save the current document title
    const originalTitle = document.title;

    // Set the document title to the custom title
    document.title = ` حسابات مطاعم   -  ${formatDate(
      startDate
    )} - ${formatDate(endDate)}.pdf`;
    window.print();

    window.addEventListener("afterprint", () => {
      document.title = originalTitle;
    });
  };

  //convert json to excel
  const JSONToExcel = (jsonData, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
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

  const [selectedPaymentCycle, setSelectedPaymentCycle] = useState({});
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
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [selectedVendor, setSelectedVendor] = useState({});
  const [vendorsDropDownMenu, setVendorsDropDownMenu] = useState([]);
  let dropdownMenuVendorsTemp = [];

  async function payVendors() {
    setLoading(true);

    // console.log(filteredData);

    try {
      const response = await fetch(SYSTEM_URL + "create_payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(filteredData.length !== 0 ? filteredData : data),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Data saved successfully");
      } else {
        console.error("Failed to save data:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }

    setLoading(false);

    navigate("/paid_vendors", { replace: true });
  }

  async function paySingleVendor(data) {
    setLoading(true);

    // console.log(filteredData);

    try {
      const response = await fetch(SYSTEM_URL + "create_payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify([data]),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Data saved successfully");
      } else {
        console.error("Failed to save data:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }

    setLoading(false);

    // navigate("/paid_vendors", { replace: true });
  }

  async function loadPaymentForGivenDate() {
    console.log(startDate);
    console.log(endDate);
    setLoading(true);
    setFilteredData([]);
    setData([]);
    setSelectedPaymentCycle("");
    setSelectedVendor("");
    setSelectedPaymentMethod("");
    await fetch(
      SYSTEM_URL +
        `vendor-payments-summary/?start_date=${
          startDate.toISOString().split("T")[0]
        }&end_date=${endDate.toISOString().split("T")[0]}`,
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

        data = data.filter((i) => i.orders.length > 0);
        if (data.length > 0) {
          setTotalTobePaid(
            data.reduce(
              (accumulator, currentObject) =>
                accumulator + parseFloat(currentObject.to_be_paid),
              0
            )
          );
          setTotalOrders(
            data.reduce(
              (accumulator, currentObject) =>
                accumulator + parseFloat(currentObject.order_count),
              0
            )
          );

          setTotalVendors(data.length);

          data.map((i) => {
            i.to_be_paid = parseFloat(i.to_be_paid);
            i.is_paid = i.is_paid ? true : false;
            i.created_by = localStorage.getItem("user_id");

            dropdownMenuVendorsTemp.push({
              label: i.vendor,
              value: i.vendor_id,
            });
          });

          setVendorsDropDownMenu(dropdownMenuVendorsTemp);

          setData(data);
          setFilteredData(data);
        } else {
          alert("No Orders Found With Given Period");
        }
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadPaymentsMethod();
    loadPaymentsCycle();

    if (location?.state?.data.length > 0) {
      setLoading(true);
      setData(location?.state?.data);
      setStartDate(location?.state?.start_date);
      setEndDate(location?.state?.end_date);
      setTotalTobePaid(
        location?.state?.data.reduce(
          (accumulator, currentObject) =>
            accumulator + parseFloat(currentObject.to_be_paid),
          0
        )
      );
      setTotalOrders(
        location?.state?.data.reduce(
          (accumulator, currentObject) =>
            accumulator + parseFloat(currentObject.order_count),
          0
        )
      );
      setLoading(false);
    }
  }, []);

  function handleVendorFilter(opt) {
    setLoading(true);

    let filtered = data;

    filtered = filtered.filter((item) => item.vendor_id === opt.value);

    setTotalTobePaid(
      filtered.reduce(
        (accumulator, currentObject) =>
          accumulator + parseFloat(currentObject.to_be_paid),
        0
      )
    );

    setTotalOrders(
      filtered.reduce(
        (accumulator, currentObject) =>
          accumulator + parseFloat(currentObject.order_count),
        0
      )
    );

    setTotalVendors(filtered.length);

    setFilteredData(filtered);
    setLoading(false);
  }
  function handlePaymentMethodFilter(opt, selectedPaymentCycle) {
    setLoading(true);
    let filtered = data;

    if (selectedPaymentCycle) {
      filtered = data.filter(
        (item) =>
          item.pay_type === opt.label &&
          item.pay_period === selectedPaymentCycle.label
      );
      setTotalTobePaid(
        filtered.reduce(
          (accumulator, currentObject) =>
            accumulator + currentObject.to_be_paid,
          0
        )
      );

      setTotalOrders(
        filtered.reduce(
          (accumulator, currentObject) =>
            accumulator + parseFloat(currentObject.order_count),
          0
        )
      );
      setFilteredData(filtered);
      setTotalVendors(filtered.length);
      setLoading(false);
      return;
    }

    filtered = filtered.filter((item) => item.pay_type === opt.label);

    setTotalTobePaid(
      filtered.reduce(
        (accumulator, currentObject) => accumulator + currentObject.to_be_paid,
        0
      )
    );

    setTotalOrders(
      filtered.reduce(
        (accumulator, currentObject) =>
          accumulator + parseFloat(currentObject.order_count),
        0
      )
    );

    setFilteredData(filtered);
    setTotalVendors(filtered.length);
    setLoading(false);
  }

  //
  function handlePaymentCycleFilter(opt, selectedPaymentMethod) {
    setLoading(true);

    let filtered = data;

    if (selectedPaymentMethod) {
      // console.log(selectedPaymentMethod);
      filtered = data.filter(
        (item) =>
          item.pay_period === opt.label &&
          item.pay_type === selectedPaymentMethod.label
      );
      setTotalTobePaid(
        filtered.reduce(
          (accumulator, currentObject) =>
            accumulator + currentObject.to_be_paid,
          0
        )
      );
      setTotalOrders(
        filtered.reduce(
          (accumulator, currentObject) =>
            accumulator + parseFloat(currentObject.order_count),
          0
        )
      );
      setFilteredData(filtered);
      setTotalVendors(filtered.length);
      setLoading(false);
      return;
    }

    filtered = filtered.filter((item) => item.pay_period === opt.label);
    setTotalTobePaid(
      filtered.reduce(
        (accumulator, currentObject) => accumulator + currentObject.to_be_paid,
        0
      )
    );
    setTotalOrders(
      filtered.reduce(
        (accumulator, currentObject) =>
          accumulator + parseFloat(currentObject.order_count),
        0
      )
    );
    setFilteredData(filtered);
    setTotalVendors(filtered.length);
    setLoading(false);
  }

  return (
    <>
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="container text-start mt-2 mb-2" id="no-print">
            <b className="text-danger" style={{ fontSize: "24px" }}>
              Payments
            </b>
          </div>

          <div
            className=" d-flex justify-content-start align-items-end mt-2 mb-2"
            style={{ width: "500px" }}
            id="no-print"
          >
            <div className="container">
              Start Date
              <DateTimePicker
                key={1}
                clearIcon={null}
                format={"y-MM-dd"}
                onChange={setStartDate}
                value={startDate}
              />
            </div>

            <div className="container">
              End Date
              <DateTimePicker
                key={1}
                clearIcon={null}
                format={"y-MM-dd"}
                onChange={setEndDate}
                value={endDate}
              />
            </div>

            <div className="container-fluid d-flex" id="no-print">
              <button
                className="btn btn-primary m-1"
                onClick={loadPaymentForGivenDate}
              >
                <b> Get </b>
              </button>
            </div>
          </div>

          <div className="container-fluid d-flex mt-2 mb-2">
            <div
              className="container "
              style={{
                display: data?.length > 0 ? "inline" : "none",
              }}
            >
              Vendor
              <Select
                defaultValue={selectedVendor}
                options={vendorsDropDownMenu}
                onChange={(opt) => {
                  setSelectedVendor(opt);
                  handleVendorFilter(opt);
                }}
                value={selectedVendor}
              />
            </div>
            <div
              className="container "
              style={{
                display: data?.length > 0 ? "inline" : "none",
              }}
            >
              Payment Method
              <Select
                defaultValue={selectedPaymentMethod}
                options={paymentMethodDropDown}
                onChange={(opt) => {
                  handlePaymentMethodFilter(opt, selectedPaymentCycle);
                  setSelectedPaymentMethod(opt);
                }}
                value={selectedPaymentMethod}
              />
            </div>
            <div
              className="container "
              style={{
                display: data?.length > 0 ? "inline" : "none",
              }}
            >
              Payment Cycle
              <Select
                defaultValue={selectedPaymentCycle}
                options={paymentCycleDropDown}
                onChange={(opt) => {
                  handlePaymentCycleFilter(opt, selectedPaymentMethod);

                  setSelectedPaymentCycle(opt);
                }}
                value={selectedPaymentCycle}
              />
            </div>
            <div className="container  d-flex align-items-end justify-content-center">
              <div
                style={{
                  display: data?.length > 0 ? "inline" : "none",
                }}
                className="btn btn-danger"
                onClick={() => {
                  setLoading(true);
                  setFilteredData([]);
                  setSelectedPaymentCycle("");
                  setSelectedVendor("");
                  setSelectedPaymentMethod("");
                  setTotalTobePaid(
                    data.reduce(
                      (accumulator, currentObject) =>
                        accumulator + currentObject.to_be_paid,
                      0
                    )
                  );
                  setTotalOrders(
                    data.reduce(
                      (accumulator, currentObject) =>
                        accumulator + parseFloat(currentObject.order_count),
                      0
                    )
                  );
                  setTotalVendors(data.length);
                  setLoading(false);
                }}
                id="no-print"
              >
                Clear Filters
              </div>
            </div>
          </div>

          <div
            className="container-fluid text-center"
            style={{
              overflowX: "auto",
              width: "100%",
              fontSize: "12px",
            }}
          >
            <div
              className="container-fluid d-flex justfiy-content-between align-items-center text-dark text-start mt -2 mb-2"
              style={{ fontSize: "20px" }}
            >
              <div className="container">
                <div>
                  <b>{totalVendors} Vendors</b>
                </div>

                <div>
                  Total To Be Paid{" "}
                  <b>
                    {totalToBePaid.toLocaleString("en-US", {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </b>
                </div>
                <div>
                  Total Orders <b>{totalOrders}</b>
                </div>
              </div>

              <div className="container text-end">
                <button
                  className="btn btn-warning m-1"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are You Sure to Pay ${
                          filteredData.length > 0
                            ? filteredData.length
                            : data.length
                        } Vendors, Please Note that all orders for these vendors will marked as paid`
                      )
                    ) {
                      payVendors();
                    } else {
                      alert("You Cancelled the Operation");
                    }
                  }}
                  style={{
                    display: data?.length > 0 ? "inline" : "none",
                  }}
                >
                  <b> Pay All </b>
                </button>

                <button
                  className="btn btn-success m-1"
                  style={{
                    display: data?.length > 0 ? "inline" : "none",
                  }}
                  onClick={() => {
                    JSONToExcel(
                      filteredData.length > 0 ? filteredData : data,
                      `payments ${formatDate(startDate)} to ${formatDate(
                        endDate
                      )}`
                    );
                  }}
                >
                  <b> Export Excel</b>
                </button>
              </div>
            </div>
            <table className="table table-sm table-striped table-hover">
              <thead>
                <tr
                  className="bg-dark text-light"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  <td>Vendor ID</td>
                  <td>Vendor</td>
                  <td>To Be Paid</td>
                  <td>Order Count</td>
                  <td>Number</td>
                  <td>Penalized </td>
                  <td>Fully Refunded</td>
                  <td>Pay Period</td>
                  <td>Pay Type</td>
                  <td>Start Date</td>
                  <td>End Date</td>
                  <td></td>
                </tr>
              </thead>
              <tbody style={{ fontSize: "14px" }}>
                {(filteredData.length > 0 ? filteredData : data).legnth === 0
                  ? ""
                  : Object?.values(
                      filteredData.length > 0 ? filteredData : data
                    )?.map((i, rowIndex) => (
                      <tr key={randomInt(1, 100000000)}>
                        <td>{i.vendor_id}</td>
                        <td>{i.vendor}</td>
                        <td>
                          {i.to_be_paid.toLocaleString("en-US", {
                            style: "currency",
                            currency: "IQD",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td>{i.order_count}</td>
                        <td>{i.number}</td>
                        <td>{i.penalized ? "true" : "false"}</td>
                        <td>{i.fully_refunded ? "true" : "false"}</td>
                        <td>{i.pay_period}</td>
                        <td>{i.pay_type}</td>
                        <td>{i.start_date}</td>
                        <td>{i.end_date}</td>
                        {/* <td>
                          <button
                            className="btn btn-info"
                            onClick={() => {
                              navigate("/payment_details", {
                                state: {
                                  row: i,
                                  data:
                                    filteredData.length > 0
                                      ? filteredData
                                      : data,
                                  startDate: startDate,
                                  endDate: endDate,
                                },
                              });
                            }}
                          >
                            Details
                          </button>
                        </td> */}
                        <td>
                          <button
                            className="btn btn-warning"
                            onClick={() => {
                              swal({
                                text: `Are You Sure to Pay ${i.vendor} Vendor, Please Note that all orders for this vendor will marked as paid`,
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                              }).then((willDelete) => {
                                if (willDelete) {
                                  setLoading(true);
                                  if (filteredData.length > 0) {
                                    data.splice(rowIndex, 1);

                                    setFilteredData(data);
                                    // setData(data);

                                    setTotalTobePaid(
                                      data.reduce(
                                        (accumulator, currentObject) =>
                                          accumulator +
                                          currentObject.to_be_paid,
                                        0
                                      )
                                    );
                                    setTotalOrders(
                                      data.reduce(
                                        (accumulator, currentObject) =>
                                          accumulator +
                                          parseFloat(currentObject.order_count),
                                        0
                                      )
                                    );
                                    setTotalVendors(data.length);
                                  } else {
                                    data.splice(rowIndex, 1);

                                    setData(data);

                                    setTotalTobePaid(
                                      data.reduce(
                                        (accumulator, currentObject) =>
                                          accumulator +
                                          currentObject.to_be_paid,
                                        0
                                      )
                                    );
                                    setTotalOrders(
                                      data.reduce(
                                        (accumulator, currentObject) =>
                                          accumulator +
                                          parseFloat(currentObject.order_count),
                                        0
                                      )
                                    );
                                    setTotalVendors(data.length);

                                    // Filter out the deleted object
                                  }

                                  paySingleVendor(i);
                                  swal("Done!", {
                                    icon: "success",
                                  });

                                  setFilteredData([]);
                                  setSelectedPaymentCycle("");
                                  setSelectedVendor("");
                                  setSelectedPaymentMethod("");
                                  setTotalTobePaid(
                                    data.reduce(
                                      (accumulator, currentObject) =>
                                        accumulator + currentObject.to_be_paid,
                                      0
                                    )
                                  );
                                  setTotalOrders(
                                    data.reduce(
                                      (accumulator, currentObject) =>
                                        accumulator +
                                        parseFloat(currentObject.order_count),
                                      0
                                    )
                                  );
                                  setTotalVendors(data.length);

                                  setLoading(false);
                                } else {
                                  swal("You Cancelled the Operation!");
                                }
                              });
                              // if (
                              //   window.confirm(
                              //     `Are You Sure to Pay ${i.vendor} Vendor, Please Note that all orders for this vendor will marked as paid`
                              //   )
                              // ) {

                              // } else {
                              //   alert("You Cancelled the Operation");
                              // }
                            }}
                          >
                            <b> Pay</b>
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
export default PaymentsPage;
