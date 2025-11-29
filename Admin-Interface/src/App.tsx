import "./App.css";

import { Route, Routes } from "react-router-dom";
import { Landing, Login } from "./components";
import Admin from "./components/Dashboard/Admin";
import SS_Admin from "./components/Dashboard/SS_Admin";
import IT_Admin from "./components/Dashboard/IT_Admin";
import PAT_Admin from "./components/Dashboard/PAT_Admin";
import LF_Admin from "./components/Dashboard/LF_Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />}></Route>


        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ss_admin"]} />}>
          <Route path="/ss_admin" element={<SS_Admin />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["it_admin"]} />}>
          <Route path="/it_admin" element={<IT_Admin />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["pat_admin"]} />}>
          <Route path="/pat_admin" element={<PAT_Admin />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["lf_admin"]} />}>
          <Route path="/lf_admin" element={<LF_Admin />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
