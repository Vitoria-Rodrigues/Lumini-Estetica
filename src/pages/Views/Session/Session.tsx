//css
import classes from "./Session.module.css";

//Component
import { Button, Table } from "@/components/ui";
import { Sidebar, Search } from "@/components/layout";

//icon
import { RiAddFill } from "react-icons/ri";

const Session = () => {
  return (
    <div className={classes.session_container}>
        <Sidebar />
      <div className={classes.session_content}>
        <div className={classes.employee}>
            <p className={classes.employee_name}>Olá, Nicole</p>
            <p className={classes.employee_role}>Atendente</p>
        </div>
        <span className={classes.title_and_button}>
          <h3>Consulta</h3>
          <Button title={"Consulta"} icon={RiAddFill} padding=".6rem" width="15%"/>
        </span>
        <div className={classes.search_container}>
          <Search placeholder="Digite o nome do cliente..." />
        </div>
        <Table />
      </div>
    </div>
  )
}

export default Session
