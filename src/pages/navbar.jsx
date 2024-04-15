import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Loading from "./loading";
// db password Qymbg5QhNbAzRn!
import "@flaticon/flaticon-uicons/css/all/all.css";
function NavBar() {
  const navigate = useNavigate();

  const [activeLink, setActiveLink] = useState("");
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  let navLinkClassName = "nav-link text-dark";

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    localStorage.clear();

    setLoading(false);
    navigate("/login", { replace: true });
  }

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
        className="collapse d-lg-block sidebar collapse bg-white"
      >
        <div className="position-sticky">
          <div className="list-group list-group-flush mx-3 mt-1">
            <ul className="navbar-nav">
              <li className="nav-item rounded m-1">
                <Link
                  onClick={() => handleLinkClick("vendors")}
                  className={`${navLinkClassName} ${
                    activeLink === "vendors" ? "active-link" : ""
                  }`}
                  to="/vendors"
                  style={{ fontSize: "20px", color: "red" }}
                >
                  <i className="fi fi-rs-bells"></i>
                </Link>
              </li>
              <li className="nav-item rounded m-1">
                <Link
                  onClick={() => handleLinkClick("vendors")}
                  className={`${navLinkClassName} ${
                    activeLink === "vendors" ? "active-link" : ""
                  }`}
                  to="/vendors"
                >
                  <h5>Vendors</h5>
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
                  <h5>Logs</h5>
                </Link>
              </li>
              <li className="nav-item rounded m-1">
                <Link className={navLinkClassName} to="/payments">
                  <h5>Create Payment</h5>
                </Link>
              </li>
              <li className="nav-item rounded m-1">
                <Link className={navLinkClassName} to="/paid_vendors">
                  <h5>Payments</h5>
                </Link>
              </li>

              <li className="nav-item   text-start m-1 p-2 ">
                <b className="text-dark">{localStorage.getItem("username")}</b>
              </li>
              <li className="nav-item rounded m-1">
                <Link
                  className="nav-link text-light bg-danger rounded p-2 border border-3 border-danger"
                  to="/login"
                  onClick={handleLogout}
                >
                  <b>Sign Out</b>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* nav bar */}
      <nav
        id="main-navbar"
        className="navbar navbar-expand-lg navbar-light bg-white fixed-top"
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
<nav
  className="navbar navbar-expand-sm bg-dark  navbar-dark  text-center rounded p-2"
  id="no-print"
>
  <div
    className="container-fluid"
    style={{
      display: "flex",
      color: "white",
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "end",
      margin: "0px",
      padding: "0px",
    }}
  >
    {/* Start of the main navbar content */}
    <div className="contaier-fluid">
      <button
        className="navbar-toggler bg-dark text-end"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
    </div>
    <div className="collapse navbar-collapse" id="navbarNav"></div>
  </div>
</nav>;
