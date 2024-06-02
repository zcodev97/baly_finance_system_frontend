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

function VendorsPage() {
  const navigate = useNavigate();

  // check box
  const [penalized, setPenalized] = useState('undefined');
  const [fully_refunded, set_fully_refunded] = useState('undefined');
  const [commission_after_discount, setcommission_after_discount] =
    useState('undefined');
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

  //
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 10;

  const [totalDinar, setTotalDinar] = useState(0);
  const [totalDollar, setTotalDollar] = useState(0);

  const [file, setFile] = useState(null);

  const [selectedFullyRefunded, setselectedFullyRefunded] = useState({});

  const fully_refended_options = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
    { value: 'undefined', label: 'Do not Include' },
  ];

  const [selectedPenalized, setselectedPenalized] = useState({});

  const penalized_options = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
    { value: 'undefined', label: 'Do not Include' },
  ];


  const [selectedComissionAfterDiscount, setselectedComissionAfterDiscount] = useState({});

  const comission_after_discount_options = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
    { value: 'undefined', label: 'Do not Include' },
  ];

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // drop down for payment cycle
  const [selectedPaymentCycle, setSelectedPaymentCycle] = useState({});
  const paymentCyclesDropDownMenu = [
    { value: "chocolate", label: "2 Weeks" },
    { value: "strawberry", label: "Weekly" },
    { value: "vanilla", label: "Monthly" },
  ];

  // drop down for payment method
  const [selectePaymentMethod, setSelectedPaymentMethod] = useState({});
  const paymentMethodDropDownMenu = [
    { value: "chocolate", label: "Cash" },
    { value: "strawberry", label: "Qi Card" },
    { value: "vanilla", label: "ZainCash" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        SYSTEM_URL + "upload_vendors_as_excel/",

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  async function loadData(page = 1) {
    setLoading(true);
    let requestUrl = `get_vendors_details_info/?page=${page}`;
    await fetch(SYSTEM_URL + requestUrl, {
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
        // alert(error);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [selectAccoutnManager, setSelectedAccountManager] = useState({});
  const [accountManagersDropDownMenu, setAccountManagersDropDownMenu] =
    useState([]);
  let accountManagersTempDropDownMenu = [];
  async function loadAccountManagersDropDownMenu() {
    setLoading(true);

    await fetch(SYSTEM_URL + "account_managers/", {
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
          accountManagersTempDropDownMenu.push({
            label: i.username,
            value: i.id,
          });
        });
        setAccountManagersDropDownMenu(accountManagersTempDropDownMenu);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [selectedVendor, setSelectedVendor] = useState({});
  const [vendorsDropDownMenu, setVendorsDropDownMenu] = useState([]);
  let vendorTempDropDownMenu = [];
  async function loadVendorsDropDownMenu() {
    setLoading(true);

    await fetch(SYSTEM_URL + "vendors_id_name_dropdown/", {
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
            label: i.vendor_id.arName,
            value: i.vendor_id.id,
          });
        });
        setVendorsDropDownMenu(vendorTempDropDownMenu);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function getFilteredVendors() {
    setLoading(true);

    await fetch(
      SYSTEM_URL +
      "vendor/?" +
      `pay_period=${selectedPaymentCycle.label}&pay_type=${selectePaymentMethod.label
      }&account_manager=${selectAccoutnManager.label
      }&fully_refended=${selectedFullyRefunded.value}&penalized=${selectedPenalized.value}&commision_after_discount=${selectedComissionAfterDiscount.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.code === "token_not_valid") {
          navigate("/login", { replace: true });
        }
        console.log(response);
        navigate("/filtered_vendors", { state: response });
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

    await fetch(SYSTEM_URL + "vendor/?" + `vendor_id=${vendor_id}`, {
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
        navigate("/vendor_details", { state: response[0] });
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [vendorsWIthoutInfo, setVendorsWithoutInfo] = useState([]);

  async function loadVendorsWithoutDetails(page = 1) {
    setLoading(true);

    await fetch(SYSTEM_URL + `api/unmatched-vendors/?page=${page}`, {
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

        setVendorsWithoutInfo(data);
      })
      .catch((error) => {
        // alert(error);
        console.log(error);
      }).finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadData();
    loadVendorsDropDownMenu();
    loadAccountManagersDropDownMenu();
    loadVendorsWithoutDetails();

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
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
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {data.count} Vendors
            </p>

            <div
              className="container-fluid mt-4 mb-4 text-start"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <div
                style={{
                  width: "300px",
                }}
              >
                Vendor
                <Select
                  defaultValue={selectedVendor}
                  options={vendorsDropDownMenu}
                  onChange={(opt) => {
                    setSelectedVendor(opt);
                    getSingleVendor(opt.value);
                  }}
                  value={selectedVendor}
                />
              </div>
              <div
                style={{
                  width: "300px",
                  display:
                    localStorage.getItem("user_type") === "ams" ||
                      localStorage.getItem("user_type") === "admin"
                      ? "inline-block"
                      : "none",
                }}
              >
                Account Manager
                <Select
                  defaultValue={selectAccoutnManager}
                  options={accountManagersDropDownMenu}
                  onChange={(opt) => {
                    setSelectedAccountManager(opt);
                  }}
                  value={selectAccoutnManager}
                />
              </div>

              <div
                style={{
                  width: "300px",
                }}
              >
                Payment Cycle
                <Select
                  defaultValue={selectedPaymentCycle}
                  options={paymentCyclesDropDownMenu}
                  onChange={(opt) => {
                    setSelectedPaymentCycle(opt);
                  }}
                  value={selectedPaymentCycle}
                />
              </div>
              <div
                style={{
                  width: "300px",
                }}
              >
                Payment Method
                <Select
                  defaultValue={selectePaymentMethod}
                  options={paymentMethodDropDownMenu}
                  onChange={(opt) => {
                    setSelectedPaymentMethod(opt);
                  }}
                  value={selectePaymentMethod}
                />
              </div>
            </div>
            <div
              className="container-fluid mt-4 mb-4 text-start"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              <div
                style={{
                  width: "300px",
                }}
              >
                Fully Refended
                <Select
                  defaultValue={selectedFullyRefunded}
                  options={fully_refended_options}
                  onChange={(opt) => {
                    setselectedFullyRefunded(opt);
                  }}
                  value={selectedFullyRefunded}
                />
              </div>

              <div
                style={{
                  width: "300px",
                }}
              >
                Penalized
                <Select
                  defaultValue={selectedPenalized}
                  options={penalized_options}
                  onChange={(opt) => {
                    setselectedPenalized(opt);
                  }}
                  value={selectedPenalized}
                />
              </div>
              <div
                style={{
                  width: "300px",
                }}
              >
                Commission After Discount
                <Select
                  defaultValue={selectedComissionAfterDiscount}
                  options={comission_after_discount_options}
                  onChange={(opt) => {
                    setselectedComissionAfterDiscount(opt);
                  }}
                  value={selectedComissionAfterDiscount}
                />
              </div>

              <div>
                <button
                  className="btn btn-primary m-1"
                  onClick={() => {
                    getFilteredVendors();
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          {/* <div className="container mt-2 mb-2 text-center d-flex">
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
              />
            </form>
            <button
              className="btn btn-light rounded"
              type="submit"
              onClick={handleSubmit}
            >
              Upload
            </button>
          </div> */}

          <div
            className="container-fluid text-center"
            style={{
              overflowX: "auto",
              width: "100%",
              fontSize: "14px",
            }}
          >
            <div className="container-fluid " style={{ overflowX: "auto" }}>
              <table className="table table-striped table-sm table-hover">
                <thead>
                  <tr className="align-middle">
                    <th>Vendor ID</th>
                    <th>Vendor Name</th>
                    <th>Payment Cycle </th>
                    <th>Payment Method</th>
                    <th>Payment Method Number </th>
                    <th>Payment Receiver Name </th>
                    <th>Fully Refended</th>
                    <th>Penalized</th>
                    <th>Commission After Discount</th>
                    <th>Created At</th>
                    <th>Account Manager</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData?.map((item) => (
                    <tr className="align-middle" key={randomInt(1, 100000000)}>
                      <td>{item.vendor_id.id}</td>
                      <td>{item.vendor_id.arName}</td>
                      <td>{item.pay_period.title}</td>
                      <td>{item.pay_type.title}</td>
                      <td>{item.number}</td>
                      <td>{item.payment_receiver_name}</td>
                      <td>{item.fully_refunded.toString()}</td>
                      <td>{item.penalized.toString()}</td>
                      <td>{item.commission_after_discount.toString()}</td>
                      <td>
                        {new Date(item.created_at).toISOString().slice(0, 10)}
                      </td>
                      <td>{item.account_manager_name}</td>

                      {/* {Object.values(item).map((i) => {
                        return <td>{i}</td>;
                      })} */}
                      <td>
                        <button
                          className="btn btn-light text-primary"
                          onClick={() => {
                            console.log(item);
                            navigate("/vendor_details", { state: item });
                          }}
                        >
                          <b>Details</b>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="btn btn-light text-primary m-1"
              onClick={() => changePage(1)}
            >
              <b>&laquo;</b>
            </button>
            <button
              className="btn btn-light text-primary m-1"
              onClick={() => changePage(currentPage - 1)}
            >
              <b>&lsaquo;</b>
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-light text-primary m-1"
              onClick={() => changePage(currentPage + 1)}
            >
              <b>&rsaquo;</b>
            </button>
            <button
              className="btn btn-light text-primary m-1"
              onClick={() => changePage(totalPages)}
            >
              <b>&raquo;</b>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default VendorsPage;
