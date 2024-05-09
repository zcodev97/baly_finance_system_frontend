import { useEffect, useState } from "react";
import { SYSTEM_URL, formatDate, randomInt } from "../../global";
import NavBar from "../navbar";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../loading";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
const FilteredVendorsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <NavBar />
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

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="container text-start mt-2 mb-2">
            <b className="text-danger" style={{ fontSize: "24px" }}>
              {location.state.length} Filtered Vendors
            </b>
          </div>

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
                  {location.state?.map((item) => (
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
          </div>
        </>
      )}
    </>
  );
};
export default FilteredVendorsPage;
