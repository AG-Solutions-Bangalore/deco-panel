import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { Edit, Visibility } from "@mui/icons-material";

import moment from "moment";
import QuotationsFilter from "../../../components/QuotationsFilter";
import { toast } from "sonner";

const AllQuotationsList = () => {
  const [brandListData, setBrandListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-submit-quotation-processing-list`,
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
  const handleOpen = (id, data) => {
    setSelectedId(id);
    setSelectedData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
    setSelectedData(null);
    setStatus("");
  };

  const QuotationProceed = () => {
    axios({
      url: BASE_URL + "/api/web-update-quotation-completed/" + selectedId,
      method: "PUT",
      data: {
        id: selectedId,
        quotation_status: status,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        toast.success("Quotation Updated Sucessfully");
        setBrandListData(res.data.quotation);
        handleClose();
      } else {
        toast.error("Failed to update Quotation ");
      }
    });
  };

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
        customBodyRender: (id, tableMeta) => {
          return (
            // <div className="flex items-center space-x-2">
            //   {/* <Tooltip title="View" placement="top">
            //       <IconButton aria-label="View">
            //         <Link
            //           to={`/view-quotions/${id}`}
            //         >
            //           <Visibility />
            //         </Link>
            //       </IconButton>
            //     </Tooltip> */}
            //   <Tooltip title="View" placement="top">
            //     <IconButton aria-label="View" size="small">
            //       <Link to={`/view-quotions/${id}`}>
            //         <Visibility fontSize="small" />
            //       </Link>
            //     </IconButton>
            //   </Tooltip>
            // </div>
            <div className="flex items-center space-x-1">
              {localStorage.getItem("user_type_id") != 1 && (
                <>
                  <Tooltip title="Completed/Cancel Quotation" placement="top">
                    <IconButton
                      aria-label="Completed/Cancel Quotation"
                      size="small"
                      onClick={() =>
                        handleOpen(id, brandListData[tableMeta.rowIndex])
                      }
                    >
                      <ConfirmationNumberIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
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
          title="Processing Quotation"
          data={brandListData ? brandListData : []}
          columns={columns}
          options={options}
        />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{"Update Status"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please select the status for this quotation.
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancel">Cancel</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={QuotationProceed}
            color="primary"
            disabled={!status}
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default AllQuotationsList;
