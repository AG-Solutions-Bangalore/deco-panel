import React, { useEffect, useRef, useState } from "react";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";
import { MdDelete, MdAdd, MdExpandMore, MdExpandLess } from "react-icons/md";
import SelectProduct from "../../components/SelectProduct";
import CreateOrderFilter from "../../components/CreateOrderFilter";
import { toast } from "sonner";

const CreateOrders = () => {
  const [showDetails, setShowDetails] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [dateyear, setDateYear] = useState("");
  const navigate = useNavigate();
  const quantityRefs = useRef([]);
  // Get current date
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayBackendFormat = yyyy + "-" + mm + "-" + dd;

  // Order state
  const [order, setOrder] = useState({
    orders_user_id: "",
    orders_date: todayBackendFormat,
    orders_year: dateyear,
    orders_count: "",
    order_sub_data: "",
  });

  const [order_sub_count, setCount] = useState(1);
  const [items, setItems] = useState([
    {
      orders_sub_product_id: "",
      orders_sub_design_no: "",
      orders_sub_catg_id: "",
      orders_sub_sub_catg_id: "",
      orders_sub_brand: "",
      orders_sub_thickness: "",
      orders_sub_unit: "",
      orders_sub_size1: "",
      orders_sub_size2: "",
      orders_sub_size_unit: "",
      orders_sub_quantity: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/web-fetch-year`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDateYear(res.data?.year?.current_year);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/web-fetch-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data.profile);
      } catch (error) {
        console.error("error while fetching select product ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleCreateOrder = () => navigate("/home");
  const handleOrderList = () => navigate("/order-list");

  const onInputChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const onChange = (e, index) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [e.target.name]: e.target.value,
    };
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        orders_sub_product_id: "",
        orders_sub_design_no: "",
        orders_sub_catg_id: "",
        orders_sub_sub_catg_id: "",
        orders_sub_brand: "",
        orders_sub_thickness: "",
        orders_sub_unit: "",
        orders_sub_size1: "",
        orders_sub_size2: "",
        orders_sub_size_unit: "",
        orders_sub_quantity: "",
      },
    ]);
    setCount(order_sub_count + 1);
    setShowDetails((prev) => ({ ...prev, [items.length]: false }));
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
    const updatedVisibility = { ...showDetails };
    delete updatedVisibility[index];
    setCount(order_sub_count - 1);
    setShowDetails(updatedVisibility);
  };

  const toggleDetails = (index) => {
    setShowDetails((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleOpenDialog = (index) => {
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSelectProduct = (product, index) => {
    if (index !== null) {
      const updatedItems = [...items];
      updatedItems[index] = {
        orders_sub_product_id: product.id,
        orders_sub_design_no: "",
        orders_sub_catg_id: product.product_category,
        orders_sub_sub_catg_id: product.product_sub_category,
        orders_sub_brand: product.products_brand,
        orders_sub_thickness: product.products_thickness,
        orders_sub_unit: product.products_unit,
        orders_sub_size1: product.products_size1,
        orders_sub_size2: product.products_size2,
        orders_sub_size_unit: product.products_size_unit,
        orders_sub_quantity: "",
      };
      setItems(updatedItems);
      setTimeout(() => {
        if (quantityRefs.current[index]) {
          quantityRefs.current[index].focus();
        }
      }, 0);
    }
    handleCloseDialog();
  };

  const onSumbit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let data = {
        orders_user_id: order.orders_user_id,
        orders_year: dateyear,
        orders_date: order.orders_date,
        orders_count: order_sub_count,
        order_sub_data: items,
      };

      const response = await axios.post(
        `${BASE_URL}/api/web-create-order`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(response.data.msg);
      setTimeout(() => {
        navigate("/order-list");
      }, 500);
    } catch (error) {
      toast.error(error.response.data.message, error);
      console.error(error.response.data.message, error);
    }
  };

  const isFormValid = () => {
    return (
      items.every(
        (item) => item.orders_sub_quantity && item.orders_sub_product_id,
      ) && items.length > 0
    );
  };

  const isAddMoreDisabled = () => {
    return items.some((item) => item.orders_sub_product_id === "");
  };

  return (
    <Layout>
      <CreateOrderFilter />

      <div className="bg-white rounded-lg shadow-sm p-6 mt-1">
        <h1 className="text-xl font-medium mb-4">Create New Order</h1>

        <form id="addIndiv" autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="orders_user_id"
                onChange={onInputChange}
                required
              >
                <option value="">Select User</option>
                {profileData && profileData.length > 0 ? (
                  profileData.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.full_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No profiles available</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="date"
                name="orders_date"
                value={order.orders_date}
                onChange={onInputChange}
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-200 my-2"></div>

          <h2 className="text-lg font-medium mb-2">Order Items</h2>

          {/* Order Items List */}
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-1">
                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="flex gap-1 mb-3">
                    <input
                      className="flex-1 px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                      placeholder="Select Product"
                      readOnly
                      value={
                        item.orders_sub_product_id
                          ? item.orders_sub_product_id
                          : ""
                      }
                      onClick={() => handleOpenDialog(index)}
                    />

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <MdDelete />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Design No"
                      name="orders_sub_design_no"
                      value={item.orders_sub_design_no}
                      onChange={(e) => onChange(e, index)}
                    />
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Quantity"
                      required
                      name="orders_sub_quantity"
                      value={item.orders_sub_quantity}
                      onChange={(e) => onChange(e, index)}
                      ref={(el) => (quantityRefs.current[index] = el)}
                      maxLength={6}
                    />
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-1 py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => toggleDetails(index)}
                  >
                    {showDetails[index] ? "Hide Details" : "Show Details"}
                    {showDetails[index] ? (
                      <MdExpandLess className="text-lg" />
                    ) : (
                      <MdExpandMore className="text-lg" />
                    )}
                  </button>

                  {showDetails[index] && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Category
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                          value={item.orders_sub_catg_id || ""}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Sub Category
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                          value={item.orders_sub_sub_catg_id || ""}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Brand
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                          value={item.orders_sub_brand || ""}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Thickness
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                          value={item.orders_sub_thickness || ""}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Unit
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                          value={item.orders_sub_unit || ""}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Length
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                          value={item.orders_sub_size1 || ""}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Breadth
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                          value={item.orders_sub_size2 || ""}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Size Unit
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                          value={item.orders_sub_size_unit || ""}
                          disabled
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-1">
                      <input
                        className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                        placeholder="Select Product"
                        readOnly
                        value={
                          item.orders_sub_product_id
                            ? item.orders_sub_product_id
                            : ""
                        }
                        onClick={() => handleOpenDialog(index)}
                      />
                    </div>

                    <div className="col-span-1">
                      <input
                        className="w-full px-2 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        placeholder="Category"
                        value={item.orders_sub_catg_id || ""}
                        disabled
                      />
                    </div>

                    <div className="col-span-1">
                      <input
                        className="w-full px-2 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        placeholder="Sub Category"
                        value={item.orders_sub_sub_catg_id || ""}
                        disabled
                      />
                    </div>

                    <div className="col-span-1">
                      <input
                        className="w-full px-2 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        placeholder="Brand"
                        value={item.orders_sub_brand || ""}
                        disabled
                      />
                    </div>

                    <div className="col-span-1">
                      <input
                        className="w-full px-2 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        placeholder="Thickness"
                        value={item.orders_sub_thickness || ""}
                        disabled
                      />
                    </div>

                    <div className="col-span-1">
                      <input
                        className="w-full px-2 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        placeholder="Unit"
                        value={item.orders_sub_unit || ""}
                        disabled
                      />
                    </div>

                    <div className="col-span-1">
                      <input
                        className="w-full px-2 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        placeholder="Length"
                        value={item.orders_sub_size1 || ""}
                        disabled
                      />
                    </div>

                    <div className="col-span-1">
                      <input
                        className="w-full px-2 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        placeholder="Breadth"
                        value={item.orders_sub_size2 || ""}
                        disabled
                      />
                    </div>

                    <div className="col-span-1">
                      <input
                        className="w-full px-2 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        placeholder="Size Unit"
                        value={item.orders_sub_size_unit || ""}
                        disabled
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Design No"
                        name="orders_sub_design_no"
                        value={item.orders_sub_design_no}
                        onChange={(e) => onChange(e, index)}
                      />
                    </div>

                    <div className="col-span-1">
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Quantity"
                        required
                        name="orders_sub_quantity"
                        value={item.orders_sub_quantity}
                        onChange={(e) => onChange(e, index)}
                        ref={(el) => (quantityRefs.current[index] = el)}
                        maxLength={6}
                      />
                    </div>

                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium 
                  ${
                    isAddMoreDisabled()
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  }`}
              onClick={addItem}
              disabled={isAddMoreDisabled()}
            >
              <MdAdd /> Add Item
            </button>

            <button
              type="submit"
              className={`px-5 py-2 rounded-lg font-medium min-w-[120px]
                  ${
                    !isFormValid()
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  }`}
              disabled={!isFormValid()}
              onClick={onSumbit}
            >
              Submit Order
            </button>
          </div>
        </form>
      </div>

      {/* Product Selection Dialog - Keep MUI for Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <SelectProduct itemIndex={editIndex} onSelect={handleSelectProduct} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <MuiButton
            variant="outlined"
            color="error"
            onClick={handleCloseDialog}
          >
            Cancel
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default CreateOrders;
