import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Navbar_white from "./components/Navbar_white";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Feature from "./components/Feature";
import Qr_Sticker from "./components/Qr_Sticker";
import Testimonial from "./components/Testimonial";
import Contactus from "./components/Contactus";
import Addtoproduct from "./Innerpage/Addtoproduct";
import Checkout from "./Innerpage/Checkout";
import Payment from "./Innerpage/Payment";
import Qrcode_process from "./Innerpage/Qrcode_process";
import PostpaidCheckout from "./Innerpage/PostpaidCheckout";
import TermsCondition from "./Footerpages/TermsCondition";
import RefundPolicy from "./Footerpages/RefundPolicy";
import PrivacyPolicy from "./Footerpages/PrivacyPolicy";
import ShippingDelivery from "./Footerpages/ShippingDelivery";
import Login from "./login_register/Login";
import Register from "./login_register/Register";
import ProfileDetail from "./login_register/ProfileDetail";
import LoginDetail from "./login_register/LoginDetail";
import ProductDetail from "./Innerpage/ProductDetail";
import Failed from "./Innerpage/Failed";
import Payment_failed from "./Innerpage/Payment_failed";
import Inactive_qr from "./Innerpage/Inactive_qr";
// Update profile section
import UserLogin from "./UserSection (Update)/UserLogin";
import UserProfile from "./UserSection (Update)/UserProfile";
import MyQr from "./UserSection (Update)/MyQr";
import EditNavbar from "./UserSection (Update)/EditNavbar";
import UpdateLoginDetail from "./UserSection (Update)/UpdateLoginDetail";
import UserDetail from "./UserSection (Update)/UserDetail";
// Reseller section
import ResellerLogin from "./Reseller/ResellerLogin";
import MyOrder from "./Reseller/MyOrder";
import MyQrcode from "./Reseller/MyQrcode";
import NewOrder from "./Reseller/NewOrder";
import MyAccount from "./Reseller/MyAccount";
import ResellerNavbar from "./Reseller/ResellerNavbar";
import PaymentList from "./Reseller/PaymentList";
import Aboutus from "./components/Aboutus";
import HowitWork from "./components/HowitWork";
import MainContactus from "./components/MainContactus";
import ScrollToTop from "./components/ScrollToTop";
// Thank you
import ThankYouPage from "./Thankyou page/ThankYouPage";
import ThankuCheckout from "./Thankyou page/ThankuCheckout";
import ThankuPostpaid from "./Thankyou page/ThankuPostpaid";
import ThankuReseller from "./Thankyou page/ThankuReseller";
import QuickContact from "./Innerpage/QuickContact";
import RequireAuth from "./components/RequireAuth"; // Import RequireAuth
import Footer_end from "./Innerpage/Footer_end";
import ThankuFinal from "./Thankyou page/ThankuFinal";
import Warning from "./Thankyou page/Warning";
// import User_registration_detail from './login_register/User_registration_detail';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="App">
      <BrowserRouter>
        {/* Conditionally render the Navbar */}
        <NavbarWrapper />
        <ScrollToTop />
        <Routes>
          {/* Main Routes */}
          <Route
            exact
            path="/"
            element={
              <>
                <div id="home">
                  <Home />
                </div>
                <div id="aboutus">
                  <Aboutus />
                </div>
                <div id="feature">
                  <Feature />
                </div>
                <div id="howitwork">
                  <HowitWork />
                </div>
                <div id="qr-sticker">
                  <Qr_Sticker />
                </div>
                <div id="testimonial">
                  <Testimonial />
                </div>
                <div id="contact">
                  <Contactus />
                </div>
              </>
            }
          />
          <Route path="/navbarwhite" element={<Navbar_white />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/howitwork" element={<HowitWork />} />
          <Route path="/qr_stickers" element={<Qr_Sticker />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/maincontactus" element={<MainContactus />} />
          <Route
            path="/addtoproduct"
            element={<Addtoproduct addToCart={addToCart} />}
          />
          <Route path="/checkout" element={<Checkout cart={cart} />} />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="/qrcode_process/:dynamicContent"
            element={<Qrcode_process />}
          />
          <Route path="/postpaidcheckout" element={<PostpaidCheckout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quickcontact" element={<QuickContact />} />
          <Route path="/termscondition" element={<TermsCondition />} />
          <Route path="/refundpolicy" element={<RefundPolicy />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/shippingdelivery" element={<ShippingDelivery />} />
          <Route path="/productdetail" element={<ProductDetail />} />
          <Route path="/failed" element={<Failed />} />
          <Route path="/payment_failed" element={<Payment_failed />} />
          <Route path="/inactiveqr" element={<Inactive_qr />} />
          <Route path="/userlogin" element={<UserLogin />} />
          <Route path="/updatelogindetail" element={<UpdateLoginDetail />} />
          <Route path="/resellerlogin" element={<ResellerLogin />} />
          <Route path="/resellernavbar" element={<ResellerNavbar />} />
          {/* Thank You pages */}
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/thank-you-checkout" element={<ThankuCheckout />} />
          <Route path="/thank-you-postpaid" element={<ThankuPostpaid />} />
          <Route path="/thank-you-reseller" element={<ThankuReseller />} />
          <Route path="/thank-you-final" element={<ThankuFinal />} />
          {/* Protected Route */}
          <Route path="/logindetail" element={<LoginDetail />} />
          <Route
            path="/myorder"
            element={
              <RequireAuth>
                {" "}
                <MyOrder />{" "}
              </RequireAuth>
            }
          />
          <Route
            path="/myqrcode"
            element={
              <RequireAuth>
                {" "}
                <MyQrcode />{" "}
              </RequireAuth>
            }
          />
          <Route
            path="/neworder"
            element={
              <RequireAuth>
                {" "}
                <NewOrder />{" "}
              </RequireAuth>
            }
          />
          <Route
            path="/myaccount"
            element={
              <RequireAuth>
                {" "}
                <MyAccount />{" "}
              </RequireAuth>
            }
          />
          <Route
            path="/paymentlist"
            element={
              <RequireAuth>
                {" "}
                <PaymentList />{" "}
              </RequireAuth>
            }
          />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/myqr" element={<MyQr />} />
          <Route path="/profiledetail" element={<ProfileDetail />} />
          <Route path="/userdetail" element={<UserDetail />} />
          <Route path="/warning" element={<Warning />} />
          <Route path="/updatelogindetail" element={<UpdateLoginDetail />} />
        </Routes>
        {/* Conditionally render the Footer */}
        <FooterWrapper />
      </BrowserRouter>
    </div>
  );
}

// Wrapper to handle conditional Navbar rendering
const NavbarWrapper = () => {
  const location = useLocation();

  if (
    location.pathname === "/quickcontact" ||
    location.pathname === "/register" ||
    location.pathname === "/login"
  ) {
    return null; // Do not render Navbar for QuickContact
  }

  if (location.pathname === "/") {
    return <Navbar />;
  }

  if (
    location.pathname.startsWith("/myorder") ||
    location.pathname.startsWith("/myqrcode") ||
    location.pathname.startsWith("/neworder") ||
    location.pathname.startsWith("/thank-you-reseller") ||
    location.pathname.startsWith("/myaccount") ||
    location.pathname.startsWith("/paymentlist")
  ) {
    return <ResellerNavbar />;
  }

  if (
    location.pathname === "/myqr" ||
    location.pathname === "/userprofile" ||
    location.pathname === "/userdetail"
  ) {
    return <EditNavbar />;
  }

  return <Navbar_white />;
};

// Wrapper to handle conditional Footer rendering
// Wrapper to handle conditional Footer rendering
const FooterWrapper = () => {
  const location = useLocation();

  // Conditionally render Footer_end for specific routes
  if (
    location.pathname === "/userlogin" ||
    location.pathname === "/myqr" ||
    location.pathname === "/userdetail" ||
    location.pathname === "/userprofile"
  ) {
    return (
      <>
        <Footer /> <Footer_end />
      </>
    ); // Render Footer_end for these routes
  }

  // Conditionally skip footer rendering for some routes
  if (
    location.pathname === "/quickcontact" ||
    location.pathname === "/register" ||
    location.pathname === "/login"
  ) {
    return null; // Do not render any footer for these routes
  }

  return (
    <>
      <Footer /> {/* Render the default footer */}
      <Footer_end /> {/* Render Footer_end below the default footer */}
    </>
  );
};

export default App;
