import classes from "./Home.module.css";

//Components
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import { Card, Table, Button } from "@/components/ui";


const Home = () => {
  return (
    <div className={classes.home_container}>
        <Sidebar />
        <div className={classes.inner_content}>
            <div className={classes.employee}>
                <p className={classes.employee_name}>Olá, Nicole</p>
                <p className={classes.employee_role}>Atendente</p>
            </div>
            <span className={classes.title}>Dashboard</span>
            <h3 className={classes.schedule_title}>Proximos atendimentos</h3>
              <div className={classes.tables_container}>
                <div className={classes.tables}>
                  <div className={classes.stats}>
                    <Card title="Procedimentos realizados" valueCard={140} message="+12% em relação ao mês anterior"/>
                    <Card title="Total de Vendas" valueCard={85} message="+15% em relação ao mês anterior" />
                  </div>
                  <div className={classes.table}>
                    <h2>Consultas Recentes</h2>
                    <Table />
                  </div>
                </div>
                <div className={classes.next_client}>
                  <div className={classes.clients}>
                    <div className={classes.clients_time}>
                      <p>Clientes</p>
                      <p>Horario</p>
                    </div>
                      <div className={classes.schedule_table}>
                        <p className={classes.client_name}>Leticia Evangelista Oliveira da Silva</p>
                        <p>08:30</p>
                      </div>
                  </div>
                  <Button title="Consulta"/>
                </div>
              </div>
        </div>
    </div>
  )
}

export default Home
