import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import classes from "./RootLayout.module.css";
import { useAuth } from "@/contexts/AuthContext/useAuth";


const RootLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className={classes.container}>
      <Sidebar/>
      <div className={classes.content}>
        <div className={classes.employee}>
          <p className={classes.employee_name}>
            Olá, {user?.name || "Usuário"}
          </p>
          <p className={classes.employee_role}>
            {user?.role || "Cargo não informado"}
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout
