import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Loading from "./loading";
// db password Qymbg5QhNbAzRn!
import "@flaticon/flaticon-uicons/css/all/all.css";
import { SYSTEM_URL } from "../global";
function NavBar() {
  const navigate = useNavigate();

  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName); // Set the active link state
  };
  const [data, setData] = useState([]);

  async function loadData(page = 1) {
    setLoading(true);
    await fetch(SYSTEM_URL + `get_vendors_details_info/?page=${page}`, {
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
      })
      .catch((error) => {
        alert(error);
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
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  let navLinkClassName = "nav-link";

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    localStorage.clear();

    setLoading(false);
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    loadData();
    loadVendorsWithoutDetails();
  }, []);

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      {/* side bar. */}
      <nav
        id="sidebarMenu"
        className="collapse d-lg-block sidebar collapse"
        style={{
          backgroundColor: "#343A40",
          color: "#EFF0F0",
          margin: "0px",
        }}
      >
        <div className="position-sticky">
          <div className="list-group list-group-flush mx-3 mt-1">
            <ul
              className="navbar-nav"
              style={{ color: "#EFF0F0", fontWeight: "bold" }}
            >
              <li
                className="nav-item rounded m-1"
                style={{ marginBottom: "20px" }}
              >
                <Link
                  onClick={() => handleLinkClick("vendors")}
                  className={`${navLinkClassName} ${
                    activeLink === "vendors" ? "active-link" : ""
                  }`}
                  to="/vendors"
                >
                  <div
                    style={{
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <div>
                      <i class="fi fi-tr-dot-circle"></i>
                    </div>
                    <div style={{ marginLeft: "10px", fontWeight: "normal" }}>
                      Vendors System
                    </div>
                  </div>
                </Link>
              </li>
              <hr />
              <li className="nav-item rounded m-1">
                <Link
                  onClick={() => handleLinkClick("vendors")}
                  className={`${navLinkClassName} ${
                    activeLink === "vendors" ? "active-link" : ""
                  }`}
                  to="/vendors"
                >
                  <div
                    style={{
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <div></div>
                    <div style={{ marginLeft: "10px", fontWeight: "normal" }}>
                      <li className="nav-item text-start">
                        <b>{localStorage.getItem("username")}</b>
                        <p>{localStorage.getItem("user_type")}</p>
                      </li>
                    </div>
                  </div>
                </Link>
              </li>
              <hr />
              <li className="nav-item rounded m-1">
                <Link
                  onClick={() => handleLinkClick("vendors")}
                  className={`nav-link ${
                    activeLink === "vendors" ? "active-link" : ""
                  }`}
                  to="/vendors"
                >
                  <div
                    style={{
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <div>
                      <i class="fi fi-ss-circle"></i>
                    </div>
                    <div style={{ marginLeft: "10px", fontWeight: "normal" }}>
                      {data.count} Vendors
                    </div>
                  </div>
                </Link>
              </li>
              <li className="nav-item rounded m-1">
                <Link
                  onClick={() => handleLinkClick("vendors")}
                  className={`nav-link ${
                    activeLink === "vendors" ? "active-link" : ""
                  }`}
                  to="/vendors_without_details"
                >
                  <div
                    style={{
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <div>
                      <i class="fi fi-ss-circle"></i>
                    </div>
                    <div style={{ marginLeft: "10px", fontWeight: "normal" }}>
                      <b> {vendorsWIthoutInfo.length}</b> Vendors Need Actions
                    </div>
                  </div>
                </Link>
              </li>

              <li className="nav-item rounded m-1">
                <Link
                  onClick={() => handleLinkClick("vendors")}
                  className={`${navLinkClassName} ${
                    activeLink === "vendors" ? "active-link" : ""
                  }`}
                  to="/account_managers_vendors_logs"
                >
                  <div
                    style={{
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <div>
                      <i class="fi fi-ss-circle"></i>
                    </div>
                    <div style={{ marginLeft: "10px", fontWeight: "normal" }}>
                      Logs
                    </div>
                  </div>
                </Link>
              </li>
              <li className="nav-item rounded m-1">
                <Link className={navLinkClassName} to="/payments">
                  <div
                    style={{
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <div>
                      <i class="fi fi-ss-circle"></i>
                    </div>
                    <div style={{ marginLeft: "10px", fontWeight: "normal" }}>
                      Create Payment
                    </div>
                  </div>
                </Link>
              </li>
              <li className="nav-item rounded m-1">
                <Link className={navLinkClassName} to="/paid_vendors">
                  <div
                    style={{
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <div>
                      <i class="fi fi-ss-circle"></i>
                    </div>
                    <div style={{ marginLeft: "10px", fontWeight: "normal" }}>
                      Payments
                    </div>
                  </div>
                </Link>
              </li>

              <li className="nav-item rounded m-1">
                <Link className="nav-link" to="/login" onClick={handleLogout}>
                  <div
                    style={{
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <div>
                      <i class="fi fi-rs-arrow-alt-circle-left"></i>
                    </div>
                    <div style={{ marginLeft: "10px", fontWeight: "normal" }}>
                      Sign Out
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* nav bar */}
      <nav
        id="main-navbar"
        className="navbar navbar-expand-lg navbar-light fixed-top"
      >
        {/* Container wrapper */}
        <button
          className="navbar-toggler m-1 p-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <b>Menu</b>
        </button>
        {/* Container wrapper */}
      </nav>
      <Outlet />
    </>
  );
}

export default NavBar;
