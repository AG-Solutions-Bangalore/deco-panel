import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import { Input, Button } from "@material-tailwind/react";
import Select from "react-select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const statusOptions = [
  { value: "Quotation", label: "Quotation" },
  { value: "Cancel", label: "Cancel" },
];

const EditQuotation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [quotation, setQuotation] = useState({
    order_user_id: "",
    quotation_date: "",
    quotation_status: "",
    quotation_count: "",
    quotation_sub_data: "",
    quotation_remarks: "",
    quotation_delivery: "",
    quotation_shipping: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const useTemplate = {
    quotation_sub_product_id: "",
    quotation_sub_rate: "",
    quotation_sub_quantity: "",
    quotation_sub_design_no: "",
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
        ? { ...user, quotation_sub_product_id: selectedOption.value }
        : user,
    );
    setUsers(updatedUsers);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/web-fetch-quotation-by-Id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setQuotation(res.data.quotation);
        setUsers(res.data.quotationSub);
      } catch (error) {
        toast.error(error.response.data.message, error);
        console.error(error.response.data.message, error);
      }
    };

    fetchData();
  }, [id]);

  const onInputChange = (e) => {
    setQuotation({
      ...quotation,
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
      quotation_status: quotation.quotation_status,
      quotation_sub_data: users,
      quotation_count: quotation.quotation_count,
      quotation_remarks: quotation.quotation_remarks,
      quotation_delivery: quotation.quotation_delivery,
      quotation_shipping: quotation.quotation_shipping,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/api/web-update-quotation/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.code == 200) {
        toast.success(response.data.msg);
        navigate("/quotations");
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
      <div className="container mx-auto ">
        <div className="bg-white rounded-t-lg shadow-lg p-1 mx-auto w-full">
          <div className="flex items-center gap-3 px-4 py-2">
            <Link to="/quotations">
              <ArrowLeft className="text-white bg-blue-500 p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-blue-600 transition-colors" />
            </Link>
            <h2 className="text-gray-800 text-xl font-semibold">
              {" "}
              Edit Quotation
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-b-lg mt-1 p-6">
          <form onSubmit={onSubmit} autoComplete="off" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Dropdown */}

              {/* User Dropdown */}

              <div className="w-full">
                <Input
                  label="User"
                  name="order_user_id"
                  value={
                    profile.find((p) => p.id === quotation.order_user_id)
                      ?.full_name ||
                    profile.find((p) => p.id === quotation.order_user_id)
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
                  name="quotation_date"
                  value={quotation.quotation_date}
                  onChange={onInputChange}
                  className="cursor-not-allowed"
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <Select
                  required
                  name="quotation_status"
                  value={statusOptions.find(
                    (opt) => opt.value === quotation.quotation_status,
                  )}
                  options={statusOptions}
                  onChange={(selectedOption) =>
                    onInputChange({
                      target: {
                        name: "quotation_status",
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

            {/* Remark, Delivery, Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Input
                  label="Remark"
                  name="quotation_remarks"
                  value={quotation.quotation_remarks}
                  onChange={onInputChange}
                  maxLength={200}
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  label="Delivery"
                  name="quotation_delivery"
                  value={quotation.quotation_delivery}
                  onChange={onInputChange}
                  maxLength={200}
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  label="Shipping"
                  name="quotation_shipping"
                  value={quotation.quotation_shipping}
                  onChange={onInputChange}
                  maxLength={200}
                />
              </div>
            </div>

            {/* Product Items */}
            {users.map((user, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
              >
                {/* Product Dropdown */}
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label> */}
                  <Select
                    required
                    name="quotation_sub_product_id"
                    value={productOptions.find(
                      (opt) => opt.value === user.quotation_sub_product_id,
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
                    name="quotation_sub_quantity"
                    value={user.quotation_sub_quantity}
                    onChange={(e) => onChange(e, index)}
                    maxLength={10}
                    // className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  />
                </div>
                {/* Rate Input */}
                <div>
                  <Input
                    required
                    label="Rate"
                    type="number"
                    name="quotation_sub_rate"
                    value={user.quotation_sub_rate}
                    onChange={(e) => onChange(e, index)}
                    // className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  />
                </div>
                <div>
                  <Input
                    required
                    label="Design No"
                    name="quotation_sub_design_no"
                    value={user.quotation_sub_design_no}
                    onChange={(e) => onChange(e, index)}
                    // className="!border-t-blue-gray-200 focus:!border-t-gray-900"
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
              <Link to="/quotations">
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

export default EditQuotation;
