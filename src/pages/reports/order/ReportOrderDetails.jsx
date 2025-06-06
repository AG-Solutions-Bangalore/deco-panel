import React, {  useEffect, useRef, useState } from "react";
import Layout from "../../../layout/Layout";
import ReportFilter from "../../../components/ReportFilter";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { IconButton } from "@material-tailwind/react";
import { FaRegFilePdf } from "react-icons/fa";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";

const ReportOrderDetails = () => {
  const [orderData, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const tableRef = useRef(null);
  useEffect(() => {
    const fetchReprotOrder = async () => {
      try {
       
        setLoading(true);
        const data = {
          order_user_id: localStorage.getItem("order_user_id"),
          order_from_date: localStorage.getItem("order_from_date"),
          order_to_date: localStorage.getItem("order_to_date"),
          order_status: localStorage.getItem("order_status"),
        };
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${BASE_URL}/api/web-fetch-order-report-list`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(response.data?.order);
     
      } catch (error) {
        toast.error(error.response.data.message, error);
        console.error(error.response.data.message, error);
      } finally {
        setLoading(false);
      }
    };
    fetchReprotOrder();
  
  }, []);

  const handleSavePDF = () => {
    const input = tableRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("order-report.pdf");
    });
  };

  const columns = [
    {
      name: "orders_date",
      label: "Order Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (orders_date) => {
          return moment(orders_date).format("DD-MM-YYYY");
        }
        
      },
    },
    {
      name: "full_name",
      label: "Client",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "orders_no",
      label: "Order No",
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
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    pagination: false,
    search: false,
    filter: false,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: false,
    customToolbar: () => {
      return (
        <IconButton
          onClick={handleSavePDF}
          title="Save as PDF"
          className="bg-white text-black"
        >
          <FaRegFilePdf className="w-5 h-5" />
        </IconButton>
      );
    },
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
  return (
    <Layout>
      <ReportFilter />
     

      <div className="mt-1" ref={tableRef}>
        <MUIDataTable
        title="Orders Detailed Report"
          data={orderData ? orderData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ReportOrderDetails;
