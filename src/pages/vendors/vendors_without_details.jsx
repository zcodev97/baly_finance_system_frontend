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

function VendorsWithoutDetailsPage() {
  const navigate = useNavigate();

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

  const [selectedVendor, setSelectedVendor] = useState({});
  const [vendorsDropDownMenu, setVendorsDropDownMenu] = useState([]);
  let vendorTempDropDownMenu = [];
  async function loadVendorsDropDownMenu() {
    setLoading(true);

    fetch(SYSTEM_URL + "api/unmatched-vendors/", {
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
            label: i.arName,
            value: i.id,
          });
        });
        setVendorsDropDownMenu(vendorTempDropDownMenu);
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

    fetch(SYSTEM_URL + "vendor/" + vendor_id, {
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
        // console.log(response.results[0]);
        navigate("/vendor_details", { state: response.results[0] });
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
          <div className="container-fluid">
            <p style={{ fontSize: "16px", fontWeight: "bold" }}>
              {data.length} Vendors Need Actions
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
            <div className="container-fluid " style={{ overflowX: "auto" }}>
              <table className="table table-striped table-sm table-hover">
                <thead>
                  <tr className="align-middle">
                    <th>Vendor ID</th>
                    <th>Vendor Name</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr className="align-middle" key={randomInt(1, 100000000)}>
                      <td>{item.id}</td>
                      <td>{item.arName}</td>

                      <td>
                        <button
                          className="btn btn-light text-primary"
                          onClick={() => {
                            console.log(item);
                            navigate("/fill_vendors_details", { state: item });
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
        </div>
      )}
    </>
  );
}

export default VendorsWithoutDetailsPage;
