import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext/useAuth";

//Logo
import LogoM from "../../../assets/lumini-mulher.png";

//Icons
import { FaRegUser, FaRegCalendarAlt, FaStethoscope, FaSyringe } from "react-icons/fa";
import { FiLogOut, FiUsers } from "react-icons/fi";
import { TfiLayoutGrid2 } from "react-icons/tfi";

import classes from "./Sidebar.module.css";

const Sidebar = () => {
  const { signOut } = useAuth();
  const getLink = ({ isActive } : {isActive: boolean }) => isActive ? `${classes.link_item} ${classes.active}` : classes.link_item;
  const { user } = useAuth();

  const canSee = user?.role === "admin";

  const handleLogout = async () => {
  await signOut();
};

  return (
    <div className={classes.sidebar_container}>
      <img src={LogoM} alt="logoM" />
        <div className={classes.nav_link}>
          <ul>
            <li>
              <NavLink to="/" className={getLink}>
                <span className={classes.side_icon}><TfiLayoutGrid2 /></span>
                <span className={classes.side_text}>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/customer" className={getLink}>
                <span className={classes.side_icon}><FaRegUser /></span>
                <span className={classes.side_text}>Cliente</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/appointment" className={getLink}>
                <span className={classes.side_icon}><FaRegCalendarAlt /></span>
                <span className={classes.side_text}>Agendamento</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/procedure" className={getLink}>
                <span className={classes.side_icon}><FaSyringe /></span>
                <span className={classes.side_text}>Procedimento</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/session" className={getLink}>
                <span className={classes.side_icon}><FaStethoscope /></span>
                <span className={classes.side_text}>Consulta</span>
              </NavLink>
            </li>
            <li>
              { canSee ?
              <NavLink to="/professional" className={getLink}>
                <span className={classes.side_icon}><FiUsers /></span>
                <span className={classes.side_text}>Funcionario</span>
              </NavLink> : undefined
               }
            </li>
          </ul>
        <div className={classes.log_out}>
          <button onClick={handleLogout} className={classes.link_item}>
            <span className={classes.side_icon}><FiLogOut /></span>
            <span className={classes.side_text_log}>Logout</span>
          </button>
        </div>
        </div>
    </div>
  )
}

export default Sidebar
