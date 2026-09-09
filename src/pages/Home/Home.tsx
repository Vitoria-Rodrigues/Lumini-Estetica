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

interface StatsCardData{
  id: string;
  title: string;
  valueCard: number;
  message: string;
}

const Home = () => {
  const [todaySessions, setTodaySessions] = useState<SessionDbRow[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionDbRow[]>([]);
  const [stats, setStats] = useState<StatsCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const recentColumns: Column<SessionDbRow>[] = [
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

  const todayColumns: Column<SessionDbRow>[] = [
  {
    label: "Cliente",
    key: "id_cliente",
    render: (session) => (
      <DescriptionPopover text={session.Cliente?.name || "Cliente não informado"} maxLength={15}/>
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
    try{
      const [today, recent] = await Promise.all([
        sessionService.getTodaySession(),
        sessionService.listSessions(),
      ]);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const realizadosMes = recent.filter((session) => {
        if(!session.data || session.status !== "Realizada") return false;
        const d = new Date(session.data);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
      }).length;

      const vendasMesCount = recent.filter((session) => {
        if(!session.data || session.status_pagamento !== "Pago") return false;
        const v = new Date(session.data);
        return v.getMonth() === currentMonth && v.getFullYear() === currentYear
      }).length;

      setStats([
        {
          id: "realizados",
          title: "Procedimentos realizados",
          valueCard: realizadosMes,
          message: "Sessões concluidas",
        }, 
        {
          id: "vendas",
          title: "Total de Vendas",
          valueCard: vendasMesCount,
          message: "Pagamentos confirmados",
        },
        {
          id: "hoje",
          title: "Atendimentos",
          valueCard: today.length,
          message: "Agendados para hoje"
        }
      ]);

      setTodaySessions(today);
      setRecentSessions(recent);
    } catch (error) {
      console.error("Erro ao buscar dados: ", error);
    } finally{
      setIsLoading(false);
    }
  }
    fetchData();
  }, []);
  
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
          <Button title="Consulta" icon={RiAddFill} padding=".6rem" width="100%"/>
        </div>
      </div>
    </>
  );
};

export default Home
