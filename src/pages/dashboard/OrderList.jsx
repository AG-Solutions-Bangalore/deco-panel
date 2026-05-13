import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../../base/BaseUrl";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import MUIDataTable from "mui-datatables";
import Layout from "../../layout/Layout";
import CreateOrderFilter from "../../components/CreateOrderFilter";
import { Visibility } from "@mui/icons-material";
import moment from "moment";
import { toast } from "sonner";

const OrderList = () => {
  const [orderList, setOrderList] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-order-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOrderList(response.data.orders);
      } catch (error) {
        toast.error(error.response.data.message, error);
        console.error(error.response.data.message, error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderList();
  }, []);

  const handleCreateOrder = () => {
    navigate("/home");
  };

  const handleOrderList = () => {
    navigate("/order-list");
  };

  const columns = useMemo(
    () => [
      {
        name: "orders_date",
        label: "Order date",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (orders_date) => {
            return moment(orders_date).format("DD-MM-YYYY");
          },
        },
      },
      {
        name: "orders_no",
        label: "order no",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "full_name",
        label: "user",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "orders_status",
        label: "Status",
        options: {
          filter: true,
          sort: true,
        },
      },

      {
        name: "id",
        label: "ACTION",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (id) => {
            return (
              <div className="flex items-center space-x-2">
                <Tooltip title="View" placement="top">
                  <IconButton aria-label="View" size="small">
                    <Link to={`/view-order/${id}`}>
                      <Visibility fontSize="small" />
                    </Link>
                  </IconButton>
                </Tooltip>
              </div>
            );
          },
        },
      },
    ],
    [orderList],
  );

  const options = {
    selectableRows: "none",
    elevation: 0,
    // rowsPerPage: 5,
    // rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress />
        ) : (
          "Sorry, there is no matching data to display"
        ),
      },
    },
  };
  const data = useMemo(() => (orderList ? orderList : []), [orderList]);
  return (
    <Layout>
      {!pathname.includes("/order-list-nav") && <CreateOrderFilter />}

      <div className="mt-1">
        <MUIDataTable
          title={"Processed Order"}
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default OrderList;
