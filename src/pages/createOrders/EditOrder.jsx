import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import { Input, Button } from "@material-tailwind/react";
import Select from "react-select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const statusOptions = [
  { value: "Order", label: "Order" },
  { value: "Cancel", label: "Cancel" },
];

const EditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState({
    orders_user_id: "",
    orders_date: "",
    orders_status: "",
    orders_count: "",
    order_sub_data: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const useTemplate = {
    orders_sub_product_id: "",
    orders_sub_quantity: "",
    orders_sub_design_no: "",
    id: "",
  };
  const [users, setUsers] = useState([useTemplate]);
  const [profile, setProfile] = useState([]);
  const [product, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  // Format product options for react-select
  useEffect(() => {
    if (product.length > 0) {
      const options = product.map((item) => ({
        value: item.id,
        label: `${item.product_category}-${item.product_sub_category}-${item.products_brand}-${item.products_thickness}-${item.products_unit}-${item.products_size1}x${item.products_size2}`,
      }));
      setProductOptions(options);
    }
  }, [product]);

  const onChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      index === i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : user,
    );
    setUsers(updatedUsers);
  };

  const onProductChange = (selectedOption, index) => {
    const updatedUsers = users.map((user, i) =>
      index === i
        ? { ...user, orders_sub_product_id: selectedOption.value }
        : user,
    );
    setUsers(updatedUsers);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/web-fetch-order-by-Id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setOrder(res.data.order);
        setUsers(res.data.orderSub);
      } catch (error) {
        toast.error(error.response.data.message, error);
        console.error(error.response.data.message, error);
      }
    };

    fetchData();
  }, [id]);

  const onInputChange = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setProfile(res.data?.profile);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-product`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setProducts(res.data?.products);
      });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = {
      orders_status: order.orders_status,
      order_sub_data: users,
      orders_count: order.orders_count,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/api/web-update-order/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.code == 200) {
        toast.success("Order Updated Successfully");
        navigate("/pending-order-list");
      } else {
        if (response.data.code == 401) {
          toast.error(response.data.msg);
        } else if (response.data.code == 402) {
          toast.error(response.data.msg);
        } else {
          toast.error(response.data.msg);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message, error);
      console.error(error.response.data.message, error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "40px",
      height: "40px",
      borderRadius: "0.375rem",
      borderColor: "#e5e7eb",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "40px",
      padding: "0 8px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "40px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : "white",
      color: state.isSelected ? "white" : "#1f2937",
      "&:hover": {
        backgroundColor: "#e5e7eb",
      },
    }),
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="bg-white rounded-t-lg shadow-lg p-1 mx-auto w-full">
          <div className="flex items-center gap-3 px-4 py-2">
            <Link to="/pending-order-list">
              <ArrowLeft className="text-white bg-blue-500 p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-blue-600 transition-colors" />
            </Link>
            <h2 className="text-gray-800 text-xl font-semibold">
              {" "}
              Edit Pending Order
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-b-lg mt-1 p-6">
          <form onSubmit={onSubmit} autoComplete="off" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Input */}
              <div className="w-full">
                <Input
                  label="User"
                  name="orders_user_id"
                  value={
                    profile.find((p) => p.id === order.orders_user_id)
                      ?.full_name ||
                    profile.find((p) => p.id === order.orders_user_id)
                      ?.user_name ||
                    ""
                  }
                  readOnly
                  className="cursor-not-allowed"
                />
              </div>

              {/* Date Input */}
              <div>
                <Input
                  readOnly
                  type="date"
                  label="Date"
                  name="orders_date"
                  value={order.orders_date}
                  onChange={onInputChange}
                  className="cursor-not-allowed"
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <Select
                  required
                  name="orders_status"
                  value={statusOptions.find(
                    (opt) => opt.value === order.orders_status,
                  )}
                  options={statusOptions}
                  onChange={(selectedOption) =>
                    onInputChange({
                      target: {
                        name: "orders_status",
                        value: selectedOption.value,
                      },
                    })
                  }
                  styles={customStyles}
                  placeholder="Select Status"
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>
            </div>

            {/* Product Items */}
            {users.map((user, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Product Dropdown */}
                <div>
                  <Select
                    required
                    name="orders_sub_product_id"
                    value={productOptions.find(
                      (opt) => opt.value === user.orders_sub_product_id,
                    )}
                    options={productOptions}
                    onChange={(selectedOption) =>
                      onProductChange(selectedOption, index)
                    }
                    styles={customStyles}
                    placeholder="Select Product"
                    className="basic-single"
                    classNamePrefix="select"
                    isSearchable
                  />
                </div>

                {/* Quantity Input */}
                <div>
                  <Input
                    required
                    label="Quantity"
                    name="orders_sub_quantity"
                    value={user.orders_sub_quantity}
                    onChange={(e) => onChange(e, index)}
                    maxLength={6}
                  />
                </div>
                <div>
                  <Input
                    label="Design No"
                    name="orders_sub_design_no"
                    value={user.orders_sub_design_no}
                    onChange={(e) => onChange(e, index)}
                  />
                </div>
              </div>
            ))}

            {/* Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <Button
                type="submit"
                color="blue"
                className="px-6 py-2 rounded-md"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Updating..." : "Update"}
              </Button>
              <Link to="/pending-order-list">
                <Button color="gray" className="px-6 py-2 rounded-md">
                  Back
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditOrder;
