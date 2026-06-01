import classes from "./Sidebar.module.css";

//Logo
import LogoM from "../../../assets/lumini-mulher.png";

//Icons
import { FaRegUser, FaRegCalendarAlt, FaStethoscope, FaSyringe } from "react-icons/fa";
import { FiLogOut, FiUsers,  } from "react-icons/fi";
import { TfiLayoutGrid2 } from "react-icons/tfi";


const Sidebar = () => {
  return (
    <div className={classes.sidebar_container}>
      <img src={LogoM} alt="logoM" />
        <div className={classes.nav_link}>
          <ul>
            <li>
              <span className={classes.side_icon}><TfiLayoutGrid2 /></span>
              <span className={classes.side_text}>Dashboard</span>
            </li>
            <li>
              <span className={classes.side_icon}><FaRegUser /></span>
              <span className={classes.side_text}>Cliente</span>
            </li>
            <li>
              <span className={classes.side_icon}><FaRegCalendarAlt /></span>
              <span className={classes.side_text}>Agendamento</span>
            </li>
            <li>
              <span className={classes.side_icon}><FaSyringe /></span>
              <span className={classes.side_text}>Procedimento</span>
            </li>
            <li>
              <span className={classes.side_icon}><FaStethoscope /></span>
              <span className={classes.side_text}>Consulta</span>
            </li>
            <li>
              <span className={classes.side_icon}><FiUsers /></span>
              <span className={classes.side_text}>Funcionario</span>
            </li>
          </ul>
        </div>
        <div className={classes.log_out}>
              <span className={classes.side_icon}><FiLogOut /></span>
              <span className={classes.side_text_log}>Logout</span>
        </div>
    </div>
  )
}

export default Sidebar
