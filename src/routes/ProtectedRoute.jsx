import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("token"); // مثال بسيط، غيّره حسب الـ login logic
  return isAuth ? children : <Navigate to="/login" replace />;
}
