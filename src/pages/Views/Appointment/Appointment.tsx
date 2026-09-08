import { useState, useEffect, useMemo } from "react";

// Components
import { ViewLayout, Search } from "@/components/layout";
import { Table, TableSkeleton, DescriptionPopover, Register } from "@/components/ui";
import type { Column } from "@/components/ui/Table/Table";
import { RescheduleModal } from "@/components/ui/Modal/RescheduleModal/RescheduleModal";

// Services
import { sessionService, type SessionDbRow, type SessionStatus } from "@/services/sessionService";
import { employeeService, type EmployeeDbRow } from "@/services/employeeService";
import { type CustomerDbRow, customerService } from "@/services/customerService";
import { type ProcedureDbRow, procedureService } from "@/services/procedureService";
import type { SessionData as FormSessionData } from "@/form-config/types";

// Context
import { useAuth } from "@/contexts/AuthContext/useAuth";
import { useToaster } from "@/contexts/ToasterContext/useToaster";

// Utils
import { formatHour, formatCPF } from "@/utils/formatters";

//Icons
import { BsBrush } from "react-icons/bs";
import { HiX } from "react-icons/hi";

const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  
  const [customers, setCustomers] = useState<CustomerDbRow[]>([]);
  const [procedures, setProcedures] = useState<ProcedureDbRow[]>([]);
  const [sessions, setSessions] = useState<SessionDbRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeDbRow[]>([]);
  const [rescheduleSession, setRescheduleSession] = useState<SessionDbRow | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<SessionDbRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { user } = useAuth();
  const { addToast } = useToaster();

  const canManage = user?.role === "admin" || user?.role === "recepcionista";
  const isOperational = ["esteticista", "massagista", "depiladora"].includes(user?.role || "");

  const statusConfig: Record<SessionStatus, { label: string; color: string; bgColor: string }> = {
    Pendente: { label: "Pendente", color: "#d29a00", bgColor: "#F5EBCE" },
    Realizada: { label: "Realizada", color: "#199400", bgColor: "#E3F3DB" },
    Cancelada: { label: "Cancelada", color: "#d00404", bgColor: "#ffe7e7" },
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [sessionsData, employeesData, customersData, proceduresData] = await Promise.all([
        sessionService.listSessions(),
        employeeService.listEmployees(),
        customerService.listCustomers(),
        procedureService.listProcedures(),
      ]);
      setSessions(sessionsData);
      setEmployees(employeesData);
      setCustomers(customersData);
      setProcedures(proceduresData);
    } catch (error) {
      console.error(error);
      addToast("Erro ao carregar agenda", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesDate = session.data === selectedDate;
      if(!matchesDate) return false;

      if(isOperational){
        if(String(session.id_funcionario) !== String(user?.employeeId)) return false;
      } else if(selectedEmployeeId) {
        if(String(session.id_funcionario) !== selectedEmployeeId) return false;
      }

      if(searchQuery.trim()){
        const term = searchQuery.trim().toLowerCase();
        const termCleanDigits = searchQuery.replace(/\D/g, "");

        const customerName = session.Cliente?.name?.toLowerCase() || "";
        const employeeName = session.Funcionario?.name?.toLowerCase() || "";
        const rawCpf = session.Cliente?.cpf || "";
        const cleanCpf = rawCpf.replace(/\D/g, "");
        const formattedCpf = formatCPF(rawCpf);

        const matchesCustomerName = customerName.includes(term);
        const matchesEmployeeName = employeeName.includes(term);
        const matchesCleanCpf = termCleanDigits.length > 0 && cleanCpf.includes(termCleanDigits);
        const matchesFormattedCpf = formattedCpf.includes(term);

        if (!matchesCustomerName && !matchesEmployeeName && !matchesCleanCpf && !matchesFormattedCpf) {
          return false;
        }
      }

      return true;
    });
  }, [sessions, selectedDate, isOperational, user?.employeeId, selectedEmployeeId, searchQuery]);

  const handleEditClick = (session: SessionDbRow) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSession(null);
  }

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
    setIsRescheduleOpen(false);
    setRescheduleSession(null);
    await loadData();
  } catch (err) {
    console.error("Erro ao reagendar consulta:", err);
    addToast("Erro ao reagendar consulta.", "error");
  }
};

const handleDefinitiveCancelSubmit = async (sessionId: string) => {
  try {
    await sessionService.deleteSession(sessionId);
    addToast("Consulta cancelada com sucesso!", "success");
    setIsRescheduleOpen(false);
    setRescheduleSession(null);
    await loadData();
  } catch (err) {
    console.error("Erro ao cancelar consulta:", err);
    addToast("Erro ao cancelar consulta.", "error");
  }
};

  const handleRegisterSubmit = async (data: FormSessionData) => {
    if(!editingSession || !editingSession.id_consulta) return;

    try {
      setIsSubmitting(true);

      const selectedProcedureId = data.procedureIds[0] || editingSession.id_procedimento;
      const proc = procedures.find((p) => p.id_prodecimento === selectedProcedureId);
      const price = proc ? proc.price : editingSession.valor_cobrado;

      await sessionService.updateSession(editingSession.id_consulta, {
        id_cliente: data.customerId,
        id_funcionario: data.employeeId,
        id_procedimento: selectedProcedureId,
        data: data.date,
        horario: data.time,
        observacoes: data.notes || "",
        valor_cobrado: price,
      });

      addToast("Consulta atualizada com sucesso!", "success");
      setIsModalOpen(false);
      setEditingSession(null);
      loadData();
    } catch (err) {
      console.error("Erro ao atualizar consulta:", err);
      addToast("Erro ao atualizar consulta.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

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

const initialValues = editingSession
  ? {
      customerId: editingSession.id_cliente,
      employeeId: editingSession.id_funcionario,
      procedureIds: [editingSession.id_procedimento],
      date: editingSession.data,
      time: editingSession.horario,
      notes: editingSession.observacoes || "",
    }
  : null;

  const columns: Column<SessionDbRow>[] = [
    {
      label: "Cliente",
      key: "id_cliente",
      render: (item) => item.Cliente?.name || "Não informado",
    },
    {
      label: "Procedimento",
      key: "id_procedimento",
      render: (item) => item.Procedimento?.name || "Não informado",
    },
    ...(canManage
      ? [
          {
            label: "Atendente",
            key: "id_funcionario" as keyof SessionDbRow,
            render: (item: SessionDbRow) => item.Funcionario?.name || "Não informado",
          },
        ]
      : []),
    {
      label: "Observações",
      key: "observacoes",
      render: (item) => <DescriptionPopover text={item.observacoes ?? ""} />,
    },
    {
      label: "Horário",
      key: "horario",
      render: (item) => formatHour(item.horario),
    },
    {
      label: "Status",
      key: "status",
      render: (item) => {
        const currentStatus = (item.status || "Pendente") as SessionStatus;
        const config = statusConfig[currentStatus] || {
          label: currentStatus,
          color: "#333",
          bgColor: "#eee",
        };

        return (
          <span
            style={{
              color: config.color,
              backgroundColor: config.bgColor,
              padding: "0.25rem 0.75rem",
              borderRadius: "1rem",
              fontWeight: 600,
              fontSize: "0.85rem",
              display: "inline-block",
            }}
          >
            {config.label}
          </span>
        );
      },
    },
    ...(canManage
  ? [
      {
        label: "Ações",
        key: "actions" as keyof SessionDbRow,
        render: (item: SessionDbRow) => {
          if(item.status !== "Pendente"){
            return null;
          }
          return (
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <button
              onClick={() => handleEditClick(item)}
              style={{
                background: "#fff",
                  border: "1px solid #000",
                  cursor: "pointer",
                  color: "#000000",
                  display: "flex",
                  alignItems: "center",
                  padding: ".5rem .9rem",
                  borderRadius: "1rem",
              }}
              title="Editar Consulta"
            >
              <BsBrush size={16} />
            </button>
            
            {canManage && (
              <button
                onClick={() => handleOpenCancelModal(item)}
                style={{
                  background: "#fff",
                  border: "1px solid #9D1806",
                  cursor: "pointer",
                  color: "#9D1806",
                  display: "flex",
                  alignItems: "center",
                  padding: ".5rem .9rem",
                  borderRadius: "1rem",
                }}
                title="Cancelar / Reagendar Consulta"
                 >
                <HiX size={17} />
              </button>
            )}
          </div>
          )
        }
      },
    ]
  : []),
  ];

  return (
    <ViewLayout
    title="Agenda do Dia"
    actionButton={
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "0.4rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            fontSize: "0.9rem",
            outline: "none",
          }}
        />

        {canManage && (
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              fontSize: "0.9rem",
              outline: "none",
            }}
          >
            <option value="">Todos os Funcionários</option>
            {employees.map((e) => (
              <option key={e.id_funcionario} value={String(e.id_funcionario)}>
                {e.name}
              </option>
            ))}
          </select>
        )}
      </div>
      }
        searchComponent={
        <Search placeholder="Filtrar por nome do profissional ou CPF do cliente..." 
        value={searchQuery}
        onChange={(val) => setSearchQuery(val)}
        />
      }
        >
      {isLoading ? (
        <TableSkeleton rows={5} columns={columns.length} />
      ) : (
        <Table columns={columns} data={filteredSessions} />
      )}

      <RescheduleModal
        isOpen={isRescheduleOpen}
        session={rescheduleSession}
        onClose={() => setIsRescheduleOpen(false)}
        onReschedule={handleRescheduleSubmit}
        onCancelDefinitive={handleDefinitiveCancelSubmit}
      />

      <Register
        type="session"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleRegisterSubmit}
        isSubmitting={isSubmitting}
        dynamicOptions={sessionDynamicOptions}
        initialValues={initialValues}
      />
    </ViewLayout>
  );
};

export default Appointment;