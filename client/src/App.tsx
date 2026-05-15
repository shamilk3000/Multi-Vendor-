import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigate } from "./features/navigation";
import { ThemeProvider } from "@mui/material";
import customTheme from "./theme/customTheme";



import Home from "./user/pages/home/Home";
import ShopPage from "./user/pages/Shop/ShopPage";
import ProductPage from "./user/pages/productDetails/ProductDetailsPage";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./user/components/dashboardSlider/DashboardSlider";
import Dashboard from "./user/pages/dashboard/Dashboard";
import ChangePassword from "./user/pages/changePassword/ChangePassword";
import Logout from "./user/pages/logout/Logout";
import Orders from "./user/pages/orders/Orders";
import OrderDetails from "./user/pages/orderDetails/OrderDetails";
import Cart from "./user/pages/cart/Cart";
import Checkout from "./user/pages/checkout/Checkout";
import PaymentSuccess from "./user/pages/paymentSuccess/PaymentSuccess";
import PaymentFail from "./user/pages/paymentFail/PaymentFail";
import Login from "./user/pages/login/Login";
import Signup from "./user/pages/signup/SignUp";
import OTPVerification from "./user/pages/verifyOtp/VerifyOtp";
import CustomizeProduct from "./user/pages/customizeProduct/CustomizeProduct";
import EmailOTPPage from "./user/pages/emailOTPPage/EmailOTPPage";
import FpOTPVerification from "./user/pages/fpOTPpage/fpOTPpage";
import PasswordEnter from "./user/pages/passwordEnter/PasswordEnter";

import SellerDashboardList from "./seller/components/sellerDashboardSlider/SellerDashboardSlider";
import SellerAddProduct from "./seller/pages/sellerAddProduct/SellerAddProduct";
import SellerProducts from "./seller/pages/sellerProducts/SellerProducts";
import SellerProductDetails from "./seller/pages/sellerProductDetails/SellerProductDetails";
import SellerEditProduct from "./seller/pages/sellerEditProduct/SellerEditProduct";
import SellerCategoryList from "./seller/pages/sellerCategory/SellerCategory";
import SellerOrders from "./seller/pages/sellerOrders/SellerOrders";
import SellerOrderDetails from "./seller/pages/sellerOrderDetails/SellerOrderDetails";
import SellerChangePassword from "./seller/pages/sellerChangePassword/SellerChangePassword";
import SellerDashboard from "./seller/pages/sellerDashboard/SellerDashboard";
import SellerLogin from "./seller/pages/sellerLogin/SellerLogin";
import SellerSignup from "./seller/pages/sellerSignup/SellerSignup";
import SellerEmailOTPPage from "./seller/pages/sellerEmailOTPPage/SellerEmailOTPPage";
import SellerOTPVerification from "./seller/pages/sellerOTPVerification/SellerOTPVerification";
import SellerFpOTPVerification from "./seller/pages/sellerFpOTPpage/sellerFpOTPpage";
import SellerPasswordEnter from "./seller/pages/sellerPasswordEnter/sellerPasswordEnter";
import SellerSubscription from "./seller/pages/sellerSubscription/SellerSubscription";
import SellerDetailsEntry from "./seller/pages/sellerDetailsEntry/SellerDetailsEntry";
import SellerProfile from "./seller/pages/sellerProfile/SellerProfile";
import SellerEditProfile from "./seller/pages/sellerEditProfile/SellerEditProfile";

function App() {
  const nav = useNavigate();

  useEffect(() => {
    setNavigate(nav);
  }, [nav]);

  return (
    <ThemeProvider theme={customTheme}>
      <Routes>
        <Route path="/dashboard" element={<Sidebar />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/orders" element={<Orders />} />
          <Route path="/dashboard/orders/:id" element={<OrderDetails />} />
          <Route
            path="/dashboard/change-password"
            element={<ChangePassword />}
          />
          <Route path="/dashboard/logout" element={<Logout />} />
        </Route>

        <Route
          path="/:sellerId/:shopName/products/:productId"
          element={<ProductPage />}
        />
        
        <Route
          path="/:sellerId/:shopName/customize-product/:orderId"
          element={<CustomizeProduct />}
        />
        
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route
          path="/:sellerId/:shopName/email-otp"
          element={<EmailOTPPage />}
        />
        <Route
          path="/:sellerId/:shopName/fp-otp-verification"
          element={<FpOTPVerification />}
        />
        <Route
          path="/:sellerId/:shopName/forgot-password"
          element={<PasswordEnter />}
        />
        <Route path="/:sellerId/:shopName/signup" element={<Signup />} />
        <Route path="/:sellerId/:shopName/login" element={<Login />} />
        <Route path="/:sellerId/:shopName/payment-success" element={<PaymentSuccess />} />
        <Route path="/:sellerId/:shopName/payment-fail" element={<PaymentFail />} />
        <Route path="/:sellerId/:shopName/checkout" element={<Checkout />} />
        <Route path="/:sellerId/:shopName/cart" element={<Cart />} />
        <Route path="/:sellerId/:shopName" element={<Home />} />
        <Route path="/:sellerId/:shopName/shop" element={<ShopPage />} />

        {/* <CustomizeProduct/> */}
        {/* <OTPVerification/> */}
        {/* <EmailOTPPage/> */}
        {/* <Signup /> */}
        {/* <Login/> */}
        {/* <PaymentSuccess/> */}
        {/* <Checkout/> */}
        {/* <Cart/> */}
        {/* <Home /> */}
        {/* <ShopPage/> */}
        {/* <ProductPage/> */}

        <Route path="/seller" element={<SellerDashboardList />}>
          <Route index element={<SellerDashboard />} />
          <Route path="/seller/profile" element={<SellerProfile />} />
          <Route path="/seller/edit-profile" element={<SellerEditProfile />} />
          <Route path="/seller/add-product" element={<SellerAddProduct />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route
            path="/seller/products/:productId"
            element={<SellerProductDetails />}
          />
          <Route
            path="/seller/edit-product/:id"
            element={<SellerEditProduct />}
          />
          <Route path="/seller/category" element={<SellerCategoryList />} />
          <Route path="/seller/orders/" element={<SellerOrders />} />
          <Route path="/seller/orders/:id" element={<SellerOrderDetails />} />
          <Route
            path="/seller/change-password"
            element={<SellerChangePassword />}
          />
          {/* <Route path="/seller/logout" element={<sellerLogout />} /> */}
        </Route>

        <Route
          path="/seller/otp-verification"
          element={<SellerOTPVerification />}
        />
        <Route path="/seller/email-otp" element={<SellerEmailOTPPage />} />
        <Route
          path="/seller/fp-otp-verification"
          element={<SellerFpOTPVerification />}
        />
        <Route
          path="/seller/forgot-password"
          element={<SellerPasswordEnter />}
        />
        <Route path="/seller/signup" element={<SellerSignup />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/subscription" element={<SellerSubscription />} />
        <Route path="/seller/details-entry" element={<SellerDetailsEntry />} />
        <Route path="/seller/profile" element={<SellerProfile />} />
        <Route path="/seller/edit-profile" element={<SellerEditProfile />} />

        {/* <SellerOTPVerification/> */}
        {/* <SellerEmailOTPPage/> */}
        {/* <SellerSignup /> */}
        {/* <SellerLogin/> */}
        {/* <SellerSubscription/> */}
        {/* <SellerDetailsEntry/> */}
        {/* <SellerProfile/> */}
        {/* <SellerEditProfile/> */}
      </Routes>
      <Toaster containerStyle={{ top: 75 }} position="top-right" />
    </ThemeProvider>
  );
}

export default App;
