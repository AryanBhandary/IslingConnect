import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  // any other fields you added in token
}

interface Props {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let role = "";
  try {
    const decoded: DecodedToken = jwtDecode(token);
    role = decoded.role;
  } catch (err) {
    console.error("Token decode error", err);
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
