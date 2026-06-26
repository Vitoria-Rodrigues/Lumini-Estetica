import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import classes from "./RootLayout.module.css"


const RootLayout = () => {
  return (
    <div className={classes.container}>
      <Sidebar/>
      <div className={classes.content}>
        <div className={classes.employee}>
          <p className={classes.employee_name}>Olá, Nicole</p>
          <p className={classes.employee_role}>Atendente</p>
        </div>

        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout
