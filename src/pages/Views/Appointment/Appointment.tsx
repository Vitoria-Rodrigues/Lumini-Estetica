//Css
import classes from "./Appointment.module.css";

//Components
import { Sidebar, Search } from "@/components/layout";
import { Table } from "@/components/ui";


const Appointment = () => {
  return (
    <div className={classes.appointment_container}>
      <Sidebar />
      <div className={classes.appointment_content}>
        <div className={classes.employee}>
            <p className={classes.employee_name}>Olá, Nicole</p>
            <p className={classes.employee_role}>Atendente</p>
        </div>
        <span className={classes.title}>
          <h3>Agendamento</h3>
        </span>
        <div className={classes.search_container}>
          <Search />
        </div>
        <Table />
      </div>
    </div>
  )
}

export default Appointment
