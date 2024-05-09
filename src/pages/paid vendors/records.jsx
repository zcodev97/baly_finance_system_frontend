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
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Loading from "../loading";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
const PaidVendorsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 5;

  function loadPayments(page = 1) {
    setLoading(true);
    fetch(SYSTEM_URL + `payments/?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.results);
        if (data.code === "token_not_valid") {
          navigate("/login", { replace: true });
        }

        data?.results.map((i) => {
          i.to_be_paid = i.to_be_paid.toLocaleString("en-US", {
            style: "currency",
            currency: "IQD",
            minimumFractionDigits: 0,
            maximumFrwactionDigits: 2,
          });

          i.start_date = formatDate(i.start_date);
          i.end_date = formatDate(i.end_date);
          i.created_at = formatDate(i.created_at);

          i.is_paid = i.is_paid ? true : false;
        });

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
    loadPayments();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setLoading(false);
  }, []);

  const totalPages = Math.ceil(data.count / itemsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadPayments(page);

      setCurrentPage(page);
    }
  };

  return (
    <>
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="container text-start mt-2 mb-2">
            <b className="text-danger" style={{ fontSize: "24px" }}>
              Paid Vendors
            </b>
          </div>

          <div className="container-fluid " style={{ overflowX: "auto" }}>
            <table className="table table-striped table-sm table-hover">
              <thead>
                <tr>
                  <th>Vendor ID</th>
                  <th>Vendor</th>
                  <th>To Be Paid</th>
                  <th>Order Count</th>
                  <th>Number </th>
                  <th>Pay Period </th>
                  <th>Pay Type</th>

                  <th>Start Date</th>
                  <th>End Date</th>
                  {/* <th></th> */}
                </tr>
              </thead>
              <tbody>
                {paginatedData
                  .map(({ created_by, id, is_paid, ...rest }) => rest)
                  .map((i) => (
                    <tr key={randomInt(1, 100000000)}>
                      <td>{i.vendor_id}</td>
                      <td>{i.vendor}</td>
                      <td>
                        {Number(i.to_be_paid).toLocaleString("en-US", {
                          style: "currency",
                          currency: "IQD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>{i.order_count}</td>
                      <td>{i.number}</td>

                      <td>{i.pay_period}</td>
                      <td>{i.pay_type}</td>
                      <td>{i.start_date}</td>
                      <td>{i.end_date}</td>
                      <td>
                        <button
                          className="btn btn-info"
                          onClick={() => {
                            navigate("/paid_vendor_orders_details", {
                              state: {
                                row: i,
                                data: i,
                                startDate: i.start_date,
                                endDate: i.end_date,
                              },
                            });
                          }}
                        >
                          Details
                        </button>
                      </td>
                      {/* {Object.values(item).map((i) => {
                        return <td>{i}</td>;
                      })} */}
                      {/* <td>
                        <button className="btn btn-light text-success">
                          <b>edit</b>
                        </button>
                      </td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
            <div>
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
          </div>
        </>
      )}
    </>
  );
};
export default PaidVendorsPage;
