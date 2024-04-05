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

  useEffect(() => {
    loadPaymentsMethod();
    loadPaymentsCycle();
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
            <table className="table">
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
                  <td>Owner Email </td>
                  <td>
                    <input
                      onChange={(e) => {
                        setOwnerEmail(e.target.value);
                      }}
                      type="text"
                      className="form-control text-center"
                      id="username"
                      style={{ fontSize: "20px" }}
                      defaultValue={location.state.owner_email}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="container-fluid" style={{ overflowX: "auto" }}></div>
        </div>
      )}
    </>
  );
}
export default VendorDetailsPage;
