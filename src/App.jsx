import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PasswordReset from './pages/PasswordReset';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import UIKits from './pages/Products/UIKits/UIKits';
import CreateUIKits from './pages/Products/UIKits/CreateUIKits';
import Code from './pages/Products/Code/Code';
import Icons from './pages/Products/Icons/Icons';
import Illustrations from './pages/Products/Illustrations/Illustrations';
import Fonts from './pages/Products/Fonts/Fonts';
import Users from './pages/Users';
import EmptyPlaceholder from './components/EmptyPlaceholder';
import './assets/styles/main.css'
import CreateCode from './pages/Products/Code/CreateCode';
import CreateIllustrations from './pages/Products/Illustrations/CreateIllustrations';
import CreateIcons from './pages/Products/Icons/CreateIcons';
import CreateFonts from './pages/Products/Fonts/CreateFonts';
import EditUIKits from './pages/Products/UIKits/EditUIKits';
import EditIllustrations from './pages/Products/Illustrations/EditIllustrations';
import EditIcons from './pages/Products/Icons/EditIcons';
import EditFonts from './pages/Products/Fonts/EditFonts';
import EditCodes from './pages/Products/Code/EditCodes';
import Pricing from './pages/Pricing/Pricing';
import Contacts from './pages/Contacts/Contacts';
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
          <Route path="ui-kits/:id" element={<EditUIKits />} />
          <Route path="ui-kits/new" element={<CreateUIKits />} />
          <Route path="code" element={<Code />} />
          <Route path="code/:id" element={<EditCodes />} />
          <Route path="code/new" element={<CreateCode />} />
          <Route path="illustrations" element={<Illustrations />} />
          <Route path="illustrations/:id" element={<EditIllustrations />} />
          <Route path="illustrations/new" element={<CreateIllustrations />} />
          <Route path="icons" element={<Icons />} />
          <Route path="icons/:id" element={<EditIcons />} />
          <Route path="icons/new" element={<CreateIcons />} />
          <Route path="fonts" element={<Fonts />} />
          <Route path="fonts/:id" element={<EditFonts />} />
          <Route path="fonts/new" element={<CreateFonts />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact-us" element={<Contacts />} />
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