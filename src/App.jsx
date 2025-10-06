import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PasswordReset from './pages/PasswordReset';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/DashboardHome';
import UIKits from './components/Products/UIKits';
import Code from './components/Products/Code';
import Icons from './components/Products/Icons';
import Illustrations from './components/Products/Illustrations';
import Fonts from './components/Products/Fonts';
import Users from './components/Users';
import EmptyPlaceholder from './components/EmptyPlaceholder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="ui-kits" element={<UIKits />} />
          <Route path="code" element={<Code />} />
          <Route path="icons" element={<Icons />} />
          <Route path="illustrations" element={<Illustrations />} />
          <Route path="fonts" element={<Fonts />} />
          <Route path="pricing" element={<EmptyPlaceholder title="Pricing" />} />
          <Route path="contact-us" element={<EmptyPlaceholder title="Contact Us" />} />
          <Route path="ux-camp/pricing" element={<EmptyPlaceholder title="UX Camp Pricing" />} />
          <Route path="ux-camp/status" element={<EmptyPlaceholder title="UX Camp Status" />} />
          <Route path="ux-camp/sessions" element={<EmptyPlaceholder title="UX Camp Sessions" />} />
          <Route path="ux-camp/users" element={<EmptyPlaceholder title="UX Camp Users" />} />
          <Route path="ux-camp/materials" element={<EmptyPlaceholder title="UX Camp Materials" />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;