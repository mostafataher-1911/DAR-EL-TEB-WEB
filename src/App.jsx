import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, useEffect } from "react"; 
import { Toaster } from 'react-hot-toast';
import Login from "./pages/Login";
import Loading from "./component/Loading";
import './App.css'
import Welcomepage from "./pages/Welcomepage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Confirmpassword from "./pages/Confirmpassword";
import Dashboardunion from "./pages/Dashboardunion";
import DashboardLabTests from "./pages/DashboardLabTests";
import Addads from "./pages/Addads";
import { disableDarkMode } from './utils/disableDarkMode'
import NotificationsPage from "./pages/NotificationsPage";
import { ThemeProvider } from "./Context/ThemeContext";

function App() {
  useEffect(() => {
    disableDarkMode()
  }, [])

  return (
    <BrowserRouter>
    <ThemeProvider>
      <Suspense fallback={<Loading/>}>
        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Welcomepage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/confirmpassword" element={<Confirmpassword/>} />

          {/* Protected Layout */}
          <Route path="/app" element={<Home/>}>
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<Dashboard/>} />
            <Route path="labtests" element={<DashboardLabTests/>} />
            <Route path="unions" element={<Dashboardunion/>} />
            <Route path="ads" element={<Addads/>} />
             <Route path="notifications" element={<NotificationsPage/>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;