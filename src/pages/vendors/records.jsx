import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SYSTEM_URL, formatDate } from "../../global";
import Loading from "../loading";
import NavBar from "../navbar";
import axios from "axios";
import Select from "react-select";

function VendorsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 15;

  const [totalDinar, setTotalDinar] = useState(0);
  const [totalDollar, setTotalDollar] = useState(0);

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await axios.post(
  //       SYSTEM_URL + "upload_vendors_as_excel/",

  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     // console.log(response.data);
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };

  async function loadData(page = 1) {
    setLoading(true);
    await fetch(SYSTEM_URL + `vendors/?page=${page}`, {
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
        data.results?.map((i) => {
          i.pay_period = i.pay_period.title;
          i.pay_type = i.pay_type.title;
          i.fully_refunded = i.fully_refunded ? "yes" : "no";
          i.penalized = i.penalized ? "yes" : "no";
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

  const [selectedVendor, setSelectedVendor] = useState({});
  const [vendorsDropDownMenu, setVendorsDropDownMenu] = useState([]);
  let vendorTempDropDownMenu = [];
  async function loadVendors() {
    setLoading(true);

    fetch(SYSTEM_URL + "get_vendor_id_name/", {
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
            label: i.name,
            value: i.vendor_id,
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

  useEffect(() => {
    setLoading(true);
    loadData();
    loadVendors();
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

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate("/container_details", {
        state: {
          id: row.id,
          name: row.name,
          total_dinar: row.total_dinar,
          total_dollar: row.total_dollar,
        },
      });
    },
  };

  return (
    <>
      <NavBar />
      <div className="container-fluid">
        <p style={{ fontSize: "16px", fontWeight: "bold" }}>
          {data.count} Vendors
        </p>
        <div className="container ">
          Vendor
          <Select
            defaultValue={selectedVendor}
            options={vendorsDropDownMenu}
            onChange={(opt) => {
              setSelectedVendor(opt);
            }}
            value={selectedVendor}
          />
        </div>
        <button className="btn btn-primary m-1" onClick={() => changePage(1)}>
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
      {loading ? (
        <Loading />
      ) : (
        <div
          className="container-fluid"
          style={{ margin: "0px", padding: "0px" }}
        >
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
                  <tr>
                    <th>Vendor ID</th>
                    <th>Vendor Name</th>
                    <th>Payment Cycle </th>
                    <th>Payment Method</th>
                    <th>Payment Method Number </th>
                    <th>Payment Receiver Name </th>
                    <th>Fully Refended</th>
                    <th>Penalized</th>
                    <th>Created At</th>
                    <th>Account Manager</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.vendor_id + Math.random() * 10}>
                      <td>{item.vendor_id}</td>
                      <td>{item.name}</td>
                      <td>{item.pay_period}</td>
                      <td>{item.pay_type}</td>
                      <td>{item.number}</td>
                      <td>{item.owner_name}</td>
                      <td>{item.fully_refunded}</td>
                      <td>{item.penalized}</td>
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
        </div>
      )}
    </>
  );
}

export default VendorsPage;
