import { useEffect, useRef, useState } from "react";
import { SYSTEM_URL, formatDate } from "../../global";
import NavBar from "../navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";

function PaidVendorOrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const previousData = location.state.data;
  const start_date = location.state.startDate;
  const end_date = location.state.endDate;

  console.log(location.state);

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: location.state.row.orders?.length,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    alwaysShowAllBtns: true,
  });

  const vendorPaymentsColumns = [
    {
      dataField: "order_id",
      text: "order_id",
      sort: true,
      // filter: textFilter(),
    },

    {
      dataField: "order_date",
      text: "order_date",
      sort: true,
      // filter: textFilter(),
    },

    {
      dataField: "subtotal",
      text: "subtotal",
      sort: true,
      // filter: textFilter(),
    },

    // {
    //   dataField: "total_discount",
    //   text: "total_discount",
    //   sort: true,
    //   // filter: textFilter(),
    // },
    // {
    //   dataField: "vendor_discount",
    //   text: "vendor_discount ",
    //   sort: true,
    //   // filter: textFilter(),
    // },
    // {
    //   dataField: "vendor_discount_cap",
    //   text: "vendor_discount_cap",
    //   sort: true,
    //   filter: textFilter(),
    // },
    // {
    //   dataField: "to_be_paid",
    //   text: "to_be_paid",
    //   sort: true,
    //   // filter: textFilter(),
    // },
  ];

  location.state.row.orders?.map((i) => {
    i.subtotal = i.subtotal?.toLocaleString("en-US", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    // Create a new Date object from the string
    const dateObject = new Date(i.order_date);

    i.order_date = dateObject.toISOString().slice(0, 10);
    // i.date_from = formatDate(new Date(i.date_from));
    // i.date_to = formatDate(new Date(i.date_to));
    // i.payment_cycle = i.payment_cycle.title;
    // i.payment_method = i.payment_method.title;
  });

  return (
    <>
      <NavBar />

      <div className="container-fluid" style={{ overflowX: "auto" }}>
        <div
          className="container-fluid text-center"
          style={{ overflowX: "auto" }}
        >
          <div className="container text-center" style={{ fontSize: "20px" }}>
            <p>
              Paid Orders For Vendor <b> {location.state.row.vendor} </b>{" "}
            </p>
            <hr />
            <p>
              {location.state.row.start_date} <b>to </b>{" "}
              {location.state.row.end_date}
            </p>
          </div>
          <hr />

          <BootstrapTable
            className="text-center"
            hover={true}
            bordered={false}
            bootstrap4
            keyField="id"
            columns={vendorPaymentsColumns}
            data={location.state.row.orders}
            pagination={pagination}
            // rowEvents={rowEvents}
            filter={filterFactory()}
          />
        </div>
      </div>
    </>
  );
}
export default PaidVendorOrdersPage;
