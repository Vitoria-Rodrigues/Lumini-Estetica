import { useEffect, useState } from "react";
import classes from "./Home.module.css";

//Components
import { Card, Table, Button, DescriptionPopover } from "@/components/ui";
import type { Column } from "@/components/ui/Table/Table";

// Services
import { sessionService } from "@/services/sessionService";
import type { SessionDbRow } from '@/services/sessionService';

//Utils
import { formatHour } from "@/utils/formatters";

//Icons
import { RiAddFill } from "react-icons/ri";


const Home = () => {
  const [todaySessions, setTodaySessions] = useState<SessionDbRow[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionDbRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns: Column<SessionDbRow>[] = [
    {
      label: "Cliente",
      key: "id_cliente",
      render: (session) => session.Cliente?.name || "Cliente não informado",
    },
    {
      label: "Data da Consulta",
      key: "data",
      render: (session) => session.data ? new Date(session.data).toLocaleDateString("pt-BR") : "-",
    },
    {
      label: "Status de Pagamento",
      key: "status_pagamento",
      render: (session) => {
        const rawStatus = session.status_pagamento || "Pendente";
        const formattedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
        return (
          <span className={classes[rawStatus.toLowerCase()]}>
            {formattedStatus}
          </span>
        );
      },
    },
  ];
  
  useEffect(() => {
  async function fetchData() {
    try {
      const [today, recent] = await Promise.all([
        sessionService.getTodaySession(),
        sessionService.listSessions(),
      ]);

      const todayStr = new Date().toISOString().split("T")[0];
      const sortedRecent = [...recent].sort((a, b) => {
        const isAToday = a.data === todayStr;
        const isBToday = b.data === todayStr;

        if (isAToday && !isBToday) return -1;
        if (!isAToday && isBToday) return 1;

        return new Date(b.data).getTime() - new Date(a.data).getTime();
      });

      setTodaySessions(today);
      setRecentSessions(sortedRecent);
    } catch (error) {
      console.error("Erro ao buscar consultas: ", error);
    } finally {
      setIsLoading(false);
    }
  }
  fetchData();
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
              <div className={classes.home_table_wrapper}>
              <Table title={"Consultas recentes"} columns={columns} data={recentSessions} />
              </div>
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
