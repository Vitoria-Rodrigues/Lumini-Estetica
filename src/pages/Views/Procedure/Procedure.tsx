//css
import classes from "./Procedure.module.css";

//icon
import { RiAddFill } from "react-icons/ri";

//Component
import { Sidebar, Search } from "@/components/layout";
import { Button, Table } from "@/components/ui";

const Procedure = () => {
  return (
    <div className={classes.procedure_container}>
        <Sidebar />
      <div className={classes.procedure_content}>
        <div className={classes.employee}>
            <p className={classes.employee_name}>Olá, Nicole</p>
            <p className={classes.employee_role}>Atendente</p>
        </div>
        <span className={classes.title_and_button}>
          <h3>Procedimento</h3>
          <Button title={"Procedimento"} icon={RiAddFill} padding=".6rem" width="15%"/>
        </span>
        <div className={classes.search_container}>
          <Search placeholder="Digite o nome do procedimento.." />
        </div>
        <Table />
      </div>
        </div>
  )
}

export default Procedure
