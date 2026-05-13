import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";

import NotFound from "../pages/errors/NotFound";
import SignIn from "../pages/auth/SignIn";
import ForgetPassword from "../pages/auth/ForgetPassword";
import Maintenance from "../pages/maintenance/Maintenance";
import LoadingBar from "../components/loadingBar/LoadingBar";
import CompletedQuation from "../pages/quotations/quotationsSubmitted/CompletedQuation";

// import Home from "../pages/dashboard/Home";
// import ChangePassword from "../pages/profile/ChangePassword";
// import Profile from "../pages/profile/Profile";
// import TeamList from "../pages/users/team/TeamList";
// import AppUserList from "../pages/users/appUser/AppUserList";
// import ProductReportList from "../pages/reports/Product/ProductReportList";
// import CreateOrders from "../pages/createOrders/CreateOrders";
// import OrderList from "../pages/dashboard/OrderList";
// import PendingOrdersList from "../pages/createOrders/PendingOrdersList";
// import ViewList from "../pages/createOrders/ViewList";
// import ViewQuotions from "../pages/quotations/quotationsSubmitted/ViewQuotions";
// import EditOrder from "../pages/createOrders/EditOrder";
// import CaterogyList from "../pages/master/caterogies/CaterogyList";
// import AddCaterogies from "../pages/master/caterogies/AddCaterogies";
// import EditCaterogy from "../pages/master/caterogies/EditCaterogy";
// import SubCategoriesList from "../pages/master/subCategories/SubCategoriesList";
// import AddSubCategory from "../pages/master/subCategories/AddSubCategory";
// import EditSubCategory from "../pages/master/subCategories/EditSubCategory";
// import BrandList from "../pages/master/brands/BrandList";
// import AddBrand from "../pages/master/brands/AddBrand";
// import EditBrand from "../pages/master/brands/EditBrand";
// import ProductsList from "../pages/master/products/ProductsList";
// import AddProduct from "../pages/master/products/AddProduct";
// import EditProduct from "../pages/master/products/EditProduct";
// import AddQuotation from "../pages/quotations/AddQuotation";
// import QuotationsSubmittedList from "../pages/quotations/quotationsSubmitted/QuotationsSubmitted";
// import AllQuotationsList from "../pages/quotations/allQuotations/AllQuotations";
// import EditQuotation from "../pages/quotations/quotationsSubmitted/EditQuotation";
// import FormOrderDetails from "../pages/reports/order/FormOrderDetails";
// import FormQuotationDetails from "../pages/reports/quotations/FormQuotationDetails";
// import ReportOrderDetails from "../pages/reports/order/ReportOrderDetails";
// import ReportQuotationDetails from "../pages/reports/quotations/ReportQuotationDetails";

const Home = lazy(() => import("../pages/dashboard/Home"));
const ChangePassword = lazy(() => import("../pages/profile/ChangePassword"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const TeamList = lazy(() => import("../pages/users/team/TeamList"));
const AppUserList = lazy(() => import("../pages/users/appUser/AppUserList"));
const ProductReportList = lazy(
  () => import("../pages/reports/Product/ProductReportList"),
);
const CreateOrders = lazy(() => import("../pages/createOrders/CreateOrders"));
const OrderList = lazy(() => import("../pages/dashboard/OrderList"));
const PendingOrdersList = lazy(
  () => import("../pages/createOrders/PendingOrdersList"),
);
const ViewList = lazy(() => import("../pages/createOrders/ViewList"));
const ViewQuotions = lazy(
  () => import("../pages/quotations/quotationsSubmitted/ViewQuotions"),
);
const EditOrder = lazy(() => import("../pages/createOrders/EditOrder"));
const CaterogyList = lazy(
  () => import("../pages/master/caterogies/CaterogyList"),
);
const AddCaterogies = lazy(
  () => import("../pages/master/caterogies/AddCaterogies"),
);
const EditCaterogy = lazy(
  () => import("../pages/master/caterogies/EditCaterogy"),
);
const SubCategoriesList = lazy(
  () => import("../pages/master/subCategories/SubCategoriesList"),
);
const AddSubCategory = lazy(
  () => import("../pages/master/subCategories/AddSubCategory"),
);
const EditSubCategory = lazy(
  () => import("../pages/master/subCategories/EditSubCategory"),
);
const BrandList = lazy(() => import("../pages/master/brands/BrandList"));
const AddBrand = lazy(() => import("../pages/master/brands/AddBrand"));
const EditBrand = lazy(() => import("../pages/master/brands/EditBrand"));
const ProductsList = lazy(
  () => import("../pages/master/products/ProductsList"),
);
const AddProduct = lazy(() => import("../pages/master/products/AddProduct"));
const EditProduct = lazy(() => import("../pages/master/products/EditProduct"));
const AddQuotation = lazy(() => import("../pages/quotations/AddQuotation"));
const QuotationsSubmittedList = lazy(
  () => import("../pages/quotations/quotationsSubmitted/QuotationsSubmitted"),
);
const AllQuotationsList = lazy(
  () => import("../pages/quotations/allQuotations/AllQuotations"),
);
const EditQuotation = lazy(
  () => import("../pages/quotations/quotationsSubmitted/EditQuotation"),
);
const FormOrderDetails = lazy(
  () => import("../pages/reports/order/FormOrderDetails"),
);
const FormQuotationDetails = lazy(
  () => import("../pages/reports/quotations/FormQuotationDetails"),
);
const ReportOrderDetails = lazy(
  () => import("../pages/reports/order/ReportOrderDetails"),
);
const ReportQuotationDetails = lazy(
  () => import("../pages/reports/quotations/ReportQuotationDetails"),
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute />}>
        <Route path="/" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Route>
      <Route path="/" element={<ProtectedRoute />}>
        <Route
          path="/home"
          element={
            <Suspense fallback={<LoadingBar />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/change-password"
          element={
            <Suspense fallback={<LoadingBar />}>
              <ChangePassword />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<LoadingBar />}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="/user-team"
          element={
            <Suspense fallback={<LoadingBar />}>
              <TeamList />
            </Suspense>
          }
        />
        <Route
          path="/user-app"
          element={
            <Suspense fallback={<LoadingBar />}>
              <AppUserList />
            </Suspense>
          }
        />
        <Route
          path="/product-report"
          element={
            <Suspense fallback={<LoadingBar />}>
              <ProductReportList />
            </Suspense>
          }
        />
        <Route
          path="/create-order"
          element={
            <Suspense fallback={<LoadingBar />}>
              <CreateOrders />
            </Suspense>
          }
        />
        <Route
          path="/order-list"
          element={
            <Suspense fallback={<LoadingBar />}>
              <OrderList />
            </Suspense>
          }
        />
        <Route
          path="/order-list-nav"
          element={
            <Suspense fallback={<LoadingBar />}>
              <OrderList />
            </Suspense>
          }
        />
        <Route
          path="/pending-order-list"
          element={
            <Suspense fallback={<LoadingBar />}>
              <PendingOrdersList />
            </Suspense>
          }
        />
        <Route
          path="/view-order/:id"
          element={
            <Suspense fallback={<LoadingBar />}>
              <ViewList />
            </Suspense>
          }
        />
        <Route
          path="/view-quotions/:id"
          element={
            <Suspense fallback={<LoadingBar />}>
              <ViewQuotions />
            </Suspense>
          }
        />
        <Route
          path="/edit-order/:id"
          element={
            <Suspense fallback={<LoadingBar />}>
              <EditOrder />
            </Suspense>
          }
        />
        <Route
          path="/categories"
          element={
            <Suspense fallback={<LoadingBar />}>
              <CaterogyList />
            </Suspense>
          }
        />
        <Route
          path="/add-categories"
          element={
            <Suspense fallback={<LoadingBar />}>
              <AddCaterogies />
            </Suspense>
          }
        />
        <Route
          path="/edit-categories/:id"
          element={
            <Suspense fallback={<LoadingBar />}>
              <EditCaterogy />
            </Suspense>
          }
        />
        <Route
          path="/sub-categories"
          element={
            <Suspense fallback={<LoadingBar />}>
              <SubCategoriesList />
            </Suspense>
          }
        />
        <Route
          path="/add-sub-categories"
          element={
            <Suspense fallback={<LoadingBar />}>
              <AddSubCategory />
            </Suspense>
          }
        />
        <Route
          path="/edit-sub-categories/:id"
          element={
            <Suspense fallback={<LoadingBar />}>
              <EditSubCategory />
            </Suspense>
          }
        />
        <Route
          path="/brand"
          element={
            <Suspense fallback={<LoadingBar />}>
              <BrandList />
            </Suspense>
          }
        />
        <Route
          path="/add-brand"
          element={
            <Suspense fallback={<LoadingBar />}>
              <AddBrand />
            </Suspense>
          }
        />
        <Route
          path="/edit-brand/:id"
          element={
            <Suspense fallback={<LoadingBar />}>
              <EditBrand />
            </Suspense>
          }
        />
        <Route
          path="/products"
          element={
            <Suspense fallback={<LoadingBar />}>
              <ProductsList />
            </Suspense>
          }
        />
        <Route
          path="/add-product"
          element={
            <Suspense fallback={<LoadingBar />}>
              <AddProduct />
            </Suspense>
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            <Suspense fallback={<LoadingBar />}>
              <EditProduct />
            </Suspense>
          }
        />
        <Route
          path="/add-quotations/:id"
          element={
            <Suspense fallback={<LoadingBar />}>
              <AddQuotation />
            </Suspense>
          }
        />
        <Route
          path="/quotations"
          element={
            <Suspense fallback={<LoadingBar />}>
              <QuotationsSubmittedList />
            </Suspense>
          }
        />
        <Route
          path="/all-quotations"
          element={
            <Suspense fallback={<LoadingBar />}>
              <AllQuotationsList />
            </Suspense>
          }
        />
        <Route
          path="/edit-quotations/:id"
          element={
            <Suspense fallback={<LoadingBar />}>
              <EditQuotation />
            </Suspense>
          }
        />
        <Route
          path="/order-report"
          element={
            <Suspense fallback={<LoadingBar />}>
              <FormOrderDetails />
            </Suspense>
          }
        />
        <Route
          path="/quotation-report"
          element={
            <Suspense fallback={<LoadingBar />}>
              <FormQuotationDetails />
            </Suspense>
          }
        />
        <Route
          path="/order-view-report"
          element={
            <Suspense fallback={<LoadingBar />}>
              <ReportOrderDetails />
            </Suspense>
          }
        />
        <Route
          path="/quotation-view-report"
          element={
            <Suspense fallback={<LoadingBar />}>
              <ReportQuotationDetails />
            </Suspense>
          }
        />
        <Route
          path="/completed-quotation"
          element={
            <Suspense fallback={<LoadingBar />}>
              <CompletedQuation />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
