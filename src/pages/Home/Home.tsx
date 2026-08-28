import { useEffect, useState } from "react";
import classes from "./Home.module.css";

//Components
import { Card, Table, Button, DescriptionPopover } from "@/components/ui";
import { RiAddFill } from "react-icons/ri";

// Services
import { sessionService } from "@/services/sessionService";
import type { SessionDbRow } from '@/services/sessionService';

//Utils
import { formatHour } from "@/utils/formatters";


const Home = () => {
  const [todaySessions, setTodaySessions] = useState<SessionDbRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTodaySession() {
      try {
        const sessions = await sessionService.getTodaySession();
        setTodaySessions(sessions);
      } catch (error) {
        console.error("Erro ao buscar consultas de hoje: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTodaySession();
  }, []);

  return (
      <>
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

                {isLoading ? (
                  <p className={classes.loading_text}>Carregando horários...</p>
                ) : todaySessions.length === 0 ? (
                  <p className={classes.empty_text}>Nenhuma consulta para hoje</p>
                ) : (
                  todaySessions.map((session) => (
                    <div key={session.id_consulta} className={classes.schedule_table}>
                      <p className={classes.client_name}>
                        <DescriptionPopover 
                          text={session.Cliente?.name || "Cliente não informado"} 
                          maxLength={25} 
                        />
                      </p>
                      <p className={classes.client_horario}>{formatHour(session.horario)}</p>
                    </div>
                  ))
                )}
                </div>
                <Button title="Consulta" icon={RiAddFill} padding=".6rem" width="100%"/>
              </div>
            </div>
      </>
  )
}

export default Home
