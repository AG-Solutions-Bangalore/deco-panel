import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import Fields from "../../../common/TextField/TextField";
import BASE_URL from "../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";
import { Card, CardContent, Dialog, Tooltip } from "@mui/material";
import { HighlightOff } from "@mui/icons-material";

const CreateCaterogy = ({open,onClick , populateCategoryName}) => {
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    product_category: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
  }, []);
  
 

  const onInputChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = {
      product_category: category.product_category,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-create-category`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.code == 200) {
        
        toast.success("Caterogies Added Successfully");
        onClick()
        populateCategoryName("hi")
      } else {
        if (response.data.code == 401) {
          toast.error("Caterogies Duplicate Entry");
        } else if (response.data.code == 402) {
          toast.error("Caterogies Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Caterogies:", error);
      toast.error("Error  updating Caterogies");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        // className="m-3  rounded-lg shadow-xl"
      >
        <form autoComplete="off" onSubmit={onSubmit}>
          <Card className="p-6 space-y-1 w-[400px]">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-slate-800 text-xl font-semibold">
                  Create Category
                </h1>
                <div className="flex">
                  <Tooltip title="Close">
                    <button
                      className="ml-3 pl-2 hover:bg-gray-200 rounded-full"
                      onClick={onClick}
                    >
                      <HighlightOff />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="mt-2">
                <div>
                  <Fields
                    required={true}
                    title="Category"
                    type="textField"
                    autoComplete="Name"
                    name="product_category"
                    value={category.product_category}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div className="mt-5 flex justify-center">
                  <button
                    disabled={isButtonDisabled}
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    {isButtonDisabled ? "Submiting..." : "Submit"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateCaterogy;