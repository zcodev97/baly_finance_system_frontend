
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SYSTEM_URL, formatDate, randomInt } from "../../global";
import Loading from "../loading";
import NavBar from "../navbar";
import { useLocation } from "react-router-dom";

function VendorsWithoutDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 10;

  async function loadData(page = 1) {
    setLoading(true);
    await fetch(SYSTEM_URL + `get_vendors_without_details_info/?page=${page}`, {
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


  useEffect(() => {
    loadData();
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
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>
            {data.count} Vendors Needs Action
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
                  {paginatedData?.map((item) => (
                    <tr className="align-middle" key={item.vendor_id.id}>
                      <td>{item?.vendor_id.id}</td>
                      <td>{item?.vendor_id.arName}</td>

                      <td>
                        <button
                          className="btn btn-light text-primary"
                          onClick={() => {
                            // console.log(item);
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

export default VendorsWithoutDetailsPage;
