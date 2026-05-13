import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import {
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { Edit, Visibility } from "@mui/icons-material";

import moment from "moment";
import QuotationsFilter from "../../../components/QuotationsFilter";
import { toast } from "sonner";

const CompletedQuation = () => {
  const [brandListData, setBrandListData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-quotation-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const res = response.data?.quotation;
        setBrandListData(res);
      } catch (error) {
        toast.error(error.response.data.message, error);
        console.error(error.response.data.message, error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountryData();
  }, []);

  const columns = [
    {
      name: "quotation_date",
      label: "Quotation Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (quotation_date) => {
          return moment(quotation_date).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "quotation_no",
      label: "Quotation No",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "full_name",
      label: "User",
      options: {
        filter: true,
        sort: true,
      },
    },
    // {
    //   name: "quotation_status",
    //   label: "Status",
    //   options: {
    //     filter: true,
    //     sort: false,
    //     customBodyRender: (quotation_status) => {
    //       return quotation_status === "Quotation" ? (
    //         <Stack>
    //           <Chip className="md:w-[40%]" label="Quotation" color="primary" />
    //         </Stack>
    //       ) : quotation_status === "Cancel" ? (
    //         <Stack>
    //           <Chip
    //             className="md:w-[40%]"
    //             sx={{ background: "yellow", color: "black" }}
    //             label="Cancel"
    //           />
    //         </Stack>
    //       ) : (
    //         <Stack>
    //           <Chip
    //             className="md:w-[40%]"
    //             sx={{ background: "lightblue", color: "black" }}
    //             label="Processing"
    //           />
    //         </Stack>
    //       );
    //     },

    //   },
    // },
    {
      name: "quotation_status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (quotation_status) => {
          let bgColor = "";
          let textColor = "text-black";

          if (quotation_status === "Quotation") {
            bgColor = "bg-blue-100 text-blue-800";
          } else if (quotation_status === "Cancel") {
            bgColor = "bg-yellow-200 text-black";
          } else {
            // Processing
            bgColor = "bg-red-200 text-black";
          }

          return (
            <div
              className={`w-fit px-2 py-1 text-sm font-medium rounded-md text-center  ${bgColor} ${textColor}`}
            >
              {quotation_status}
            </div>
          );
        },
      },
    },

    {
      name: "id",
      label: "VIEW",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              {/* <Tooltip title="View" placement="top">
                  <IconButton aria-label="View">
                    <Link
                      to={`/view-quotions/${id}`}
                    >
                      <Visibility />
                    </Link>
                  </IconButton>
                </Tooltip> */}
              <Tooltip title="View" placement="top">
                <IconButton aria-label="View" size="small">
                  <Link to={`/view-quotions/${id}`}>
                    <Visibility fontSize="small" />
                  </Link>
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
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

  return (
    <Layout>
      <QuotationsFilter />

      <div className="mt-1">
        <MUIDataTable
          title="Completed Quotation"
          data={brandListData ? brandListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default CompletedQuation;
