import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface StatsCardData{
  id: string;
  title: string;
  valueCard: number;
  message: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [todaySessions, setTodaySessions] = useState<SessionDbRow[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionDbRow[]>([]);
  const [stats, setStats] = useState<StatsCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const recentColumns: Column<SessionDbRow>[] = [
    {
      label: "Cliente",
      key: "id_cliente",
      render: (session) => session.cliente?.name || "Cliente não informado",
    },
    {
      label: "Data da Consulta",
      key: "data",
      render: (session) => {
        if (!session.data) return "-";
        const parts = session.data.split("-");
        return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : session.data;
      },
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

  const todayColumns: Column<SessionDbRow>[] = [
  {
    label: "Cliente",
    key: "id_cliente",
    render: (session) => (
      <DescriptionPopover text={session.cliente?.name || "Cliente não informado"} maxLength={15}/>
    ),
  },
  {
    label: "Horario",
    key: "horario",
    render: (session) => formatHour(session.horario),
  },
];

useEffect(() => {
  async function fetchData() {
    try {
      setIsLoading(true);

      const now = new Date();
      const [today, recent, monthlyStats] = await Promise.all([
        sessionService.getTodaySession(),
        sessionService.getRecentSessions(10),
        sessionService.getMonthlyStats(now.getFullYear(), now.getMonth()),
      ]); 

      setStats([
        { id: "realizados", title: "Procedimentos realizados", valueCard: monthlyStats.realizadosMes, message: "Sessões concluídas" },
        { id: "vendas", title: "Total de Vendas", valueCard: monthlyStats.vendasMes, message: "Pagamentos confirmados" },
        { id: "hoje", title: "Atendimentos", valueCard: today.length, message: "Agendados para hoje" },
      ]);

      setTodaySessions(today);
      setRecentSessions(recent);
    } catch (error) {
      console.error("Erro ao buscar dados da dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }

  fetchData();
}, []);

   return (
    <>
      <span className={classes.title}>Dashboard</span>
      <div className={classes.tables_container}>
        <div className={classes.tables}>
          <div className={classes.stats}>
            {stats.map((stat) => (
              <Card
              key={stat.id}
              title={stat.title}
              valueCard={stat.valueCard}
              message={stat.message} />
            ))}
          </div>
          <div className={classes.table}>
            <div className={classes.home_table_wrapper}>
              <Table title="Consultas recentes" columns={recentColumns} data={recentSessions} />
            </div>
          </div>
        </div>

        <div className={classes.next_client}>
          {isLoading ? (
            <p className={classes.loading_text}>Carregando horários...</p>
          ) : (
            <div className={classes.next_sessions}>
              <Table 
                title="Próximos atendimentos" 
                columns={todayColumns} 
                data={todaySessions} 
              />
            </div>
          )}
          <Button title="Consulta" icon={RiAddFill} padding=".6rem" width="100%" onClick={() => navigate("/session")}/>
        </div>
      </div>
    </>
  );
};

export default Home
