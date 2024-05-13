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
import swal from "sweetalert";
import { useLocation } from "react-router-dom";

function VendorsWithoutDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 15;

  async function loadData(page = 1) {
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

        setData(data);
        setPaginatedData(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [selectedAccountManagers, setSelectedAccountManagers] = useState({});

  const handleSelectChange = (vendorId, selectedOption) => {
    setSelectedAccountManagers({
      ...selectedAccountManagers,
      [vendorId]: selectedOption,
    });
  };

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

  async function updateVendorInfo(vendor_id, vendor_name, selectedManager) {
    setLoading(true);
    fetch(SYSTEM_URL + "add_vendor_details_info/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        vendor_id: vendor_id,
        number: "NA",
        pay_period: "3d83d103-84fc-42b0-a41b-b992d1e59402",
        pay_type: "1cfca47d-4ba8-4329-826d-bc04c11a1088",
        account_manager: selectedManager.value,
        payment_receiver_name: "NA",
        owner_email_json: "no emails",
        fully_refunded: "false",
        penalized: "false",
        commission_after_discount: "false",
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
          // swal("Data Saved !", {
          //   text: `Data Saved and Email Sent For creating new Vendor`,
          //   dangerMode: false,
          // });
          await SaveDataToLogsTableAndSendEmail(
            vendor_id,
            vendor_name,
            selectedManager
          );
          loadData();
          navigate("/vendors_without_details", { replace: true });
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
    // }

    setLoading(false);
  }

  async function SaveDataToLogsTableAndSendEmail(
    vendor_id,
    vendor_name,
    selectedManager
  ) {
    setLoading(true);
    fetch(SYSTEM_URL + "create_new_vendor_update_log/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        vendor_id: vendor_id,
        vendor_name: vendor_name,
        old_payment_method: "no old_payment_method ",
        new_payment_method: "NA",
        old_payment_cycle: "no old_payment_cycle",
        new_payment_cycle: "NA",
        old_account_manager: "no old_account_manager",
        new_account_manager: selectedManager?.label,
        old_number: "no old_number",
        new_number: "NA",
        old_receiver_name: "no old receiver name",
        new_receiver_name: "NA",
        old_owner_phone: "NA",
        new_owner_phone: "NA",
        old_fully_refended: "no old_fully_refended",
        new_fully_refended: "false",
        old_penalized: "no old_penalized",
        new_panelized: "false",
        old_commission_after_discount: "no old_commission_after_discount",
        new_commission_after_discount: "false",
        old_emails: "no old_emails",
        new_emails: "NA",
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

  useEffect(() => {
    setLoading(true);
    loadData();
    loadAccountManagers();

    // loadVendorsDropDownMenu();
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
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>
            {data.length} Vendors Needs Action
          </p>
          <div
            className="container-fluid text-center"
            style={{ overflowX: "auto", width: "100%", fontSize: "14px" }}
          >
            <div
              className="container-fluid"
              style={{ overflowX: "auto", fontSize: "14px" }}
            >
              <table className="table table-striped table-sm table-hover">
                <thead>
                  <tr className="align-middle">
                    <th>Vendor ID</th>
                    <th>Vendor Name</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr className="align-middle" key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.arName}</td>
                      <td>
                        <Select
                          id={`select-${item.id}`}
                          isDisabled={
                            localStorage.getItem("user_type") === "ams" ||
                            localStorage.getItem("user_type") === "admin"
                              ? false
                              : true
                          }
                          options={accountManagersDropDown}
                          onChange={(opt) => handleSelectChange(item.id, opt)}
                          value={selectedAccountManagers[item.id] || null}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-light text-primary mt-2 mb-2"
                          onClick={() => {
                            swal({
                              text: `Are You Sure to Update ${item.arName} Vendor`,
                              icon: "warning",
                              buttons: true,
                              dangerMode: true,
                            }).then((willDelete) => {
                              if (willDelete) {
                                const selectedManager =
                                  selectedAccountManagers[item.id];
                                if (
                                  !selectedManager ||
                                  selectedManager.length === 0
                                ) {
                                  swal("Error!", {
                                    text: "Please Fill Account Manager",
                                    icon: "warning",
                                  });
                                  return;
                                }
                                updateVendorInfo(
                                  item.id,
                                  item.arName,
                                  selectedManager
                                );
                              } else {
                                swal("You Cancelled the Operation!");
                              }
                            });
                          }}
                        >
                          <b>Assign</b>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VendorsWithoutDetailsPage;
