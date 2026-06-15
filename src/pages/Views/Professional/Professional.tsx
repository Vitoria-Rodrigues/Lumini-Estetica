//css
import classes from "./Professional.module.css";

//Components
import { Sidebar, Search } from "@/components/layout";
import { Button, Table } from "@/components/ui";

//Icon
import { RiAddFill } from "react-icons/ri";

const Professional = () => {
  return (
    <div className={classes.professional_container}>
      <Sidebar />
      <div className={classes.professional_content}>
        <div className={classes.employee}>
            <p className={classes.employee_name}>Olá, Nicole</p>
            <p className={classes.employee_role}>Atendente</p>
        </div>
        <span className={classes.title_and_button}>
          <h3>Funcionário</h3>
          <Button title={"Funcionário"} icon={RiAddFill} padding=".6rem" width="15%"/>
        </span>
        <div className={classes.search_container}>
          <Search placeholder="Digite o nome do profissional.." />
        </div>
        <Table />
      </div>
    </div>
  )
}

export default Professional
