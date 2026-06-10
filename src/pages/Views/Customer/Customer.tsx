//CSS
import classes from "./Customer.module.css";

//Components and Layouts
import { Sidebar, Search } from "@/components/layout";
import { Button, Table } from "@/components/ui";


//Icon
import { RiAddFill } from "react-icons/ri";

const Customer = () => {
  return (
    <div className={classes.client_container}>
      <Sidebar />
      <div className={classes.client_content}>
        <div className={classes.employee}>
            <p className={classes.employee_name}>Olá, Nicole</p>
            <p className={classes.employee_role}>Atendente</p>
        </div>
        <span className={classes.title_and_button}>
          <h3>Cliente</h3>
          <Button title={"Cliente"} icon={RiAddFill} padding=".6rem" width="15%"/>
        </span>
        <div className={classes.search_container}>
          <Search />
        </div>
        <Table />
      </div>
    </div>
  )
}

export default Customer

