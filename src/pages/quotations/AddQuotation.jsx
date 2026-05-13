import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import { Input, Button } from "@material-tailwind/react";
import Select from "react-select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AddQuotation = () => {
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

  const [users, setUsers] = useState([
    {
      orders_sub_product_id: "",
      orders_sub_quantity: "",
      orders_sub_rate: "",
      orders_sub_design_no: "",
      id: "",
    },
  ]);

  const [profile, setProfile] = useState([]);
  const [product, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  // Format product options
  useEffect(() => {
    if (product.length > 0) {
      const options = product.map((item) => ({
        value: item.id,
        label: `${item.product_category}-${item.product_sub_category}-${item.products_brand}-${item.products_thickness}-${item.products_unit}-${item.products_size1}x${item.products_size2}`,
      }));
      setProductOptions(options);
    }
  }, [product]);

  // Handle input change
  const onChange = (e, index) => {
    const { name, value } = e.target;

    setUsers((prev) =>
      prev.map((user, i) => (i === index ? { ...user, [name]: value } : user)),
    );
  };

  // ✅ FIXED LAST RATE FUNCTION
  const fetchLastRate = async (userId, productId, index) => {
    if (!userId || !productId) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-fetch-quotation-last-rate`,
        {
          orders_user_id: userId,
          orders_sub_product_id: productId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // ✅ correct response path
      const lastRate = response?.data?.data?.quotation_sub_rate ?? null;

      setUsers((prev) => {
        const updated = [...prev];

        updated[index] = {
          ...updated[index],
          last_rate: lastRate,
          orders_sub_rate:
            !updated[index].orders_sub_rate && lastRate
              ? lastRate
              : updated[index].orders_sub_rate,
        };

        return updated;
      });
    } catch (error) {
      console.error("Error fetching last rate:", error);
    }
  };

  // Product change
  const onProductChange = (selectedOption, index) => {
    const productId = selectedOption.value;

    setUsers((prev) =>
      prev.map((user, i) =>
        i === index ? { ...user, orders_sub_product_id: productId } : user,
      ),
    );

    fetchLastRate(order.orders_user_id, productId, index);
  };

  // Fetch order by ID
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

        const quotationData = res.data.order;
        const subData = res.data.orderSub;

        setOrder(quotationData);
        setUsers(subData);

        subData.forEach((item, index) => {
          if (item.orders_sub_product_id) {
            fetchLastRate(
              quotationData.orders_user_id,
              item.orders_sub_product_id,
              index,
            );
          }
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error");
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  // Input change for order
  const onInputChange = (e) => {
    setOrder((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Fetch users
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setProfile(res.data?.profile));
  }, []);

  // Fetch products
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-product`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setProducts(res.data?.products));
  }, []);

  // Submit
  const onSubmit = async (e) => {
    e.preventDefault();

    setIsButtonDisabled(true);

    try {
      const response = await axios.put(
        `${BASE_URL}/api/web-create-quotation-indirect/${id}`,
        {
          orders_status: order.orders_status,
          order_sub_data: users,
          orders_count: order.orders_count,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg);
        navigate("/quotations");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="bg-white p-4 shadow rounded">
          <div className="flex items-center gap-3">
            <Link to="/pending-order-list">
              <ArrowLeft className="bg-blue-500 text-white p-1 w-8 h-8 rounded-full" />
            </Link>
            <h2 className="text-xl font-semibold">Add Quotation</h2>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-white p-6 mt-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="User"
              value={
                profile.find((p) => p.id === order.orders_user_id)?.full_name ||
                ""
              }
              readOnly
            />

            <Input
              type="date"
              label="Date"
              value={order.orders_date}
              readOnly
            />
          </div>

          {users.map((user, index) => (
            <div key={index} className="grid md:grid-cols-4 gap-4">
              <div>
                <Select
                  options={productOptions}
                  value={productOptions.find(
                    (opt) => opt.value === user.orders_sub_product_id,
                  )}
                  onChange={(opt) => onProductChange(opt, index)}
                />
              </div>

              <Input
                label="Quantity"
                name="orders_sub_quantity"
                value={user.orders_sub_quantity}
                onChange={(e) => onChange(e, index)}
              />

              <div>
                <Input
                  label="Rate"
                  name="orders_sub_rate"
                  value={user.orders_sub_rate}
                  onChange={(e) => onChange(e, index)}
                />

                {user.last_rate != null && (
                  <p className="text-xs text-red-500">
                    Last Rate: {user.last_rate}
                  </p>
                )}
              </div>
              <Input
                label="Design No"
                name="orders_sub_design_no"
                value={user.orders_sub_design_no}
                onChange={(e) => onChange(e, index)}
              />
            </div>
          ))}

          <div className="flex gap-4 justify-center">
            <Button type="submit" disabled={isButtonDisabled}>
              {isButtonDisabled ? "Submitting..." : "Submit"}
            </Button>

            <Link to="/pending-order-list">
              <Button color="gray">Back</Button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddQuotation;
