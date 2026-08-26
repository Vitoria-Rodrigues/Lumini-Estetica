import { useState, useEffect } from "react";

//Components
import { Button, Table, TableSkeleton, Register, DescriptionPopover } from "@/components/ui";
import { ConfirmModal } from "@/components/ui/Modal/ConfirmModal/ConfirmModal";
import { ViewLayout, Search } from "@/components/layout";
import type { Column } from "@/components/ui/Table/Table";
import { RescheduleModal } from "@/components/ui/Modal/RescheduleModal/RescheduleModal";

// Services
import { type SessionDbRow, sessionService } from "@/services/sessionService";
import { type CustomerDbRow, customerService } from "@/services/customerService";
import { employeeService, type EmployeeDbRow } from "@/services/employeeService";
import { type ProcedureDbRow, procedureService } from "@/services/procedureService";
import type { SessionData as FormSessionData } from "@/form-config/types";
import type{ SessionData, SessionStatus } from "@/services/sessionService";

//Context
import { useToaster } from "@/contexts/ToasterContext/useToaster";
import { useAuth } from "@/contexts/AuthContext/useAuth";

//Utils
import { formatHour, formatCPF } from "@/utils/formatters";

//Icons
import { RiAddFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { HiX } from "react-icons/hi";


const Session = () => {
  const [sessions, setSessions] = useState<SessionDbRow[]>([]);
  const [customers, setCustomers] = useState<CustomerDbRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeDbRow[]>([]);
  const [procedures, setProcedures] = useState<ProcedureDbRow[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [rescheduleSession, setRescheduleSession] = useState<SessionDbRow | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sessionToComplete, setSessionToComplete] = useState<SessionDbRow | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { addToast } = useToaster();
  const { user } = useAuth();

  const canManage = user?.role === "admin" || user?.role === "recepcionista";
  const isOperational = ["esteticista", "massagista", "depiladora"];
  const statusConfig: Record<SessionStatus, { label: string; color: string; bgColor: string }> = {   
   Pendente:  { label: 'Pendente',  color: '#d29a00', bgColor: '#F5EBCE' },
   Realizada: { label: 'Realizada', color: '#199400', bgColor: '#E3F3DB' },
   Cancelada: { label: 'Cancelada', color: '#d00404', bgColor: '#ffe7e7' },
 };

  const filteredSessions = sessions.filter((session) => {
    if(!searchQuery.trim()) return true;

    const term = searchQuery.trim().toLowerCase();
    const termCleanDigits = searchQuery.replace(/\D/g, "");
    
    const customerName = session.Cliente?.name?.toLowerCase() || "";
    const rawCpf = session.Cliente?.cpf || "";
    const cleanCpf = rawCpf.replace(/\D/g, ""); 
    const formattedCpf = formatCPF(rawCpf);
  
    const matchesName = customerName.includes(term);
    const matchesCleanCpf = termCleanDigits.length > 0 && cleanCpf.includes(termCleanDigits);
  
    const matchesFormattedCpf = formattedCpf.includes(term);
  
    return matchesName || matchesCleanCpf || matchesFormattedCpf;
  });

  
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [sessionsData, customersData, employeesData, proceduresData] =
        await Promise.all([
          sessionService.listSessions(),
          customerService.listCustomers(),
          employeeService.listEmployees(),
          procedureService.listProcedures(),
        ]);

      setSessions(sessionsData);
      setCustomers(customersData);
      setEmployees(employeesData);
      setProcedures(proceduresData);
    } catch (err) {
      console.error(err);
      addToast("Erro ao carregar dados da agenda.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleConfirmSession = async (session: SessionDbRow) => {
    if (!session.id_consulta) return;
    setSessionToComplete(session);
    setIsConfirmOpen(true);
  };

  const executeConfirmSession = async () => {
    if(!sessionToComplete || !sessionToComplete.id_consulta) return;

    try{
      await sessionService.updateSession(sessionToComplete.id_consulta, {
        ...sessionToComplete,
        status: "Realizada",
      } as unknown as Partial<SessionData>);
      addToast("Consulta confirmada com sucesso!", "success");
      loadInitialData();
    } catch (error) {
      console.error("Erro ao confirmar consulta: ", error);
      addToast("Erro ao confirmar consulta", "error");
    } finally {
      setIsConfirmOpen(false);
      setSessionToComplete(null);
    }
  };

  const handleOpenCancelModal = (session: SessionDbRow) => {
     setRescheduleSession(session);
     setIsRescheduleOpen(true);
   };

   const handleRescheduleSubmit = async (sessionId: string, newDate: string, newTime: string) => {
     try {
       await sessionService.updateSession(sessionId, {
         data: newDate,
         horario: newTime,
         status: "Pendente",
       });
       addToast("Consulta reagendada com sucesso!", "success");
       loadInitialData();
     } catch (err) {
       addToast("Erro ao reagendar consulta.", "error");
     }
   };

   const handleDefinitiveCancelSubmit = async (sessionId: string) => {
     try {
       await sessionService.deleteSession(sessionId);
       addToast("Consulta cancelada com sucesso!", "success");
       loadInitialData();
     } catch (err) {
       addToast("Erro ao cancelar consulta.", "error");
     }
   };

  const handleRegisterSubmit = async (data: FormSessionData) => {
  try {
    setIsSubmitting(true);

    const promises = data.procedureIds.map((procedureId) => {
      const proc = procedures.find((p) => p.id_prodecimento === procedureId);
      const price = proc ? proc.price : 0;

      return sessionService.createSession({
        id_cliente: data.customerId,
        id_funcionario: data.employeeId,
        id_procedimento: procedureId,
        data: data.date,
        horario: data.time,
        observacoes: data.notes || "",
        valor_cobrado: price,
      });
    });

    await Promise.all(promises);
    addToast("Consulta(s) agendada(s) com sucesso!", "success");

    setIsModalOpen(false);
    loadInitialData();
  } catch (err) {
    console.error("Erro ao salvar consulta:", err);
    addToast("Erro ao salvar a consulta.", "error");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const customerOptions = customers.map((c) => ({
    label: c.name,
    value: c.id_cliente,
  }));

  const employeeOptions = employees.map((e) => ({
    label: e.name,
    value: String(e.id_funcionario),
  }));

  const procedureOptions = procedures.map((p) => ({
    label: p.name,
    value: p.id_prodecimento,
    price: p.price,
  }));

  const sessionDynamicOptions = {
    customerId: customerOptions,
    employeeId: employeeOptions,
    procedureIds: procedureOptions,
  };

  const initialValues = null;

  const columns: Column<SessionDbRow>[] = [
    {
      label: "Cliente",
      key: "id_cliente",
      render: (item) => item.Cliente?.name || "Não informado",
    },
    {
      label: "Funcionário",
      key: "id_funcionario",
      render: (item) => item.Funcionario?.name || "Não informado",
    },
    {
      label: "Procedimento",
      key: "id_procedimento",
      render: (item) => {
    const nomeProcedimento = item.Procedimento?.name || "Não informado";
    if (nomeProcedimento === "Não informado") {
      return nomeProcedimento;
    }
    return <DescriptionPopover text={nomeProcedimento} maxLength={30} />;
  },
    },
    {
      label: "Data",
      key: "data",
      render: (item) => {
        if (!item.data) return "";
        const parts = item.data.split("-");
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return item.data;
      },
    },
    {
      label: "Horário",
      key: "horario", render: (session) => formatHour(session.horario)
    },
    {
      label: "Status",
      key: "status", 
      render: (item) => {
      const config = statusConfig[item.status] || statusConfig.Pendente;
      return (
        <span
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: config.color,
            backgroundColor: config.bgColor,
          }}
        >
          {config.label}
        </span>
      );
      }
    },
    {
      label: "Valor Total",
      key: "id_procedimento",
      render: (item) => {
        const price = item.Procedimento?.price;
        return typeof price === "number"
          ? `R$ ${price.toFixed(2).replace(".", ",")}`
          : "R$ 0,00";
      },
    },
    ...(canManage || isOperational
      ? [
          {
            label: "Ações",
            key: "actions" as keyof SessionDbRow,
            render: (item: SessionDbRow) => {
              const isActionAllowed = item.status === "Pendente" || 
              item.status === "Cancelada";

              if (!isActionAllowed) {
                return null;
              }
              
              return(
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                {isOperational && (
                  <button
                  onClick={() => handleConfirmSession(item)}
                  style={{
                    background: "#06a120",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    padding: ".5rem 1.2rem",
                    borderRadius: "1rem",
                  }}
                  title="Confirmar Consulta"
                >
                  <FaCheck size={16} />
                </button>
                )}

                {canManage && (
                <button
                  onClick={() => handleOpenCancelModal(item)}
                  style={{
                    background: "#9D1806",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    padding: ".5rem 1.2rem",
                    borderRadius: "1rem",
                  }}
                  title="Cancelar / Reagendar Consulta"
                >
                  <HiX size={17} />
                </button>
                )}
              </div>
              )
            },
          },
        ]
      : []),
  ];

  return (
     <ViewLayout
      title="Consulta"
      actionButton={
        canManage ? (
          <Button
            title={"Consulta"}
            icon={RiAddFill}
            padding=".6rem"
            width="15%"
            onClick={() => {
              setIsModalOpen(true);
            }}
          />
        ) : undefined
      }
      searchComponent={<Search placeholder="Buscar por um nome ou CPF.."
      value={searchQuery}
      onChange={(val) => setSearchQuery(val)} />}
    >
      {isLoading ? (
        <TableSkeleton rows={5} columns={columns.length} />
      ) : (
        <Table columns={columns} data={filteredSessions} />
      )}

      <Register
        type="session"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleRegisterSubmit}
        isSubmitting={isSubmitting}
        dynamicOptions={sessionDynamicOptions}
        initialValues={initialValues}
      />

    <ConfirmModal
     isOpen={isConfirmOpen}
     title="Concluir Consulta"
     description="Deseja confirmar que esta consulta foi realizada?"
     onConfirm={executeConfirmSession}
     onClose={() => setIsConfirmOpen(false)}
    />

      <RescheduleModal
        isOpen={isRescheduleOpen}
        session={rescheduleSession}
        onClose={() => setIsRescheduleOpen(false)}
        onReschedule={handleRescheduleSubmit}
        onCancelDefinitive={handleDefinitiveCancelSubmit}
      />

    </ViewLayout>
  );
};

export default Session;
