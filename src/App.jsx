import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordReset from "./pages/PasswordReset";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ProductList from "./pages/Products/ProductList";
import CreateProduct from "./pages/Products/CreateProduct";
import EditProduct from "./pages/Products/EditProduct.jsx";
import Pricing from "./pages/Pricing/Pricing";
import Contacts from "./pages/Contacts/Contacts";
import YearlyAccess from "./pages/YearlyAccess/YearlyAccess";
import OurTeam from "./pages/OurTeam/OurTeam";
import Status from "./pages/UxCamp/Status";
import Materials from "./pages/UxCamp/Materials";
import Camp from "./pages/UxCamp/Camp";
import AuthRoute from "./utils/AuthRoute.jsx";
import { useSelector } from "react-redux";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import Users from "./pages/Users";
import EmptyPlaceholder from "./components/EmptyPlaceholder";
import "./assets/styles/main.css";

function App() {
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = user;
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <Signup />
            </AuthRoute>
          }
        />
        <Route
          path="/password-reset"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <PasswordReset />
            </AuthRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={true}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="ui-kits" element={<ProductList productType="ui-kits" />} />
          <Route path="ui-kits/:id" element={<EditProduct />} />
          <Route path="ui-kits/new" element={<CreateProduct productType="ui-kits" />} />
          <Route path="code" element={<ProductList productType="code" />} />
          <Route path="code/:id" element={<EditProduct />} />
          <Route path="code/new" element={<CreateProduct productType="code" />} />
          <Route path="illustrations" element={<ProductList productType="illustrations" />} />
          <Route path="illustrations/:id" element={<EditProduct />} />
          <Route path="illustrations/new" element={<CreateProduct productType="illustrations" />} />
          <Route path="icons" element={<ProductList productType="icons" />} />
          <Route path="icons/:id" element={<EditProduct />} />
          <Route path="icons/new" element={<CreateProduct productType="icons" />} />
          <Route path="fonts" element={<ProductList productType="fonts" />} />
          <Route path="fonts/:id" element={<EditProduct />} />
          <Route path="fonts/new" element={<CreateProduct productType="fonts" />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact-us" element={<Contacts />} />
          {/* <Route path="ux-camp/pricing" element={<EmptyPlaceholder title="UX Camp Pricing" />} /> */}
          <Route path="ux-camp/status" element={<Status />} />
          <Route path="ux-camp/status/:id" element={<Camp />} />
          {/* <Route path="ux-camp/sessions" element={<EmptyPlaceholder title="UX Camp Sessions" />} /> */}
          {/* <Route path="ux-camp/users" element={<EmptyPlaceholder title="UX Camp Users" />} /> */}
          <Route path="ux-camp/materials" element={<Materials />} />
          <Route path="yearly-access" element={<YearlyAccess />} />
          <Route path="our-team" element={<OurTeam />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;