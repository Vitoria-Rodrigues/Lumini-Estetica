import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

//Constants
import { QUERY_KEYS } from "@/constants/queryKeys";

// Context
import { useAuth } from "@/contexts/AuthContext/useAuth";
import { useToaster } from "@/contexts/ToasterContext/useToaster";

//hooks
import { useAppointmentFilter } from "@/hooks/useAppointmentFilter";

// Utils
import { formatHour } from "@/utils/formatters";
import { getLocalDateString } from "@/utils/formatters";

//Icons
import { BsBrushFill } from "react-icons/bs";
import { HiX } from "react-icons/hi";

const Appointment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { addToast } = useToaster();

  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [rescheduleSession, setRescheduleSession] = useState<SessionDbRow | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionDbRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const canManage = user?.role === "admin" || user?.role === "recepcionista";
  const isOperational = ["esteticista", "massagista", "depiladora"].includes(user?.role || "");

  const statusConfig: Record<SessionStatus, { label: string; color: string; bgColor: string }> = {
    Pendente: { label: "Pendente", color: "#d29a00", bgColor: "#F5EBCE" },
    Realizada: { label: "Realizada", color: "#199400", bgColor: "#E3F3DB" },
    Cancelada: { label: "Cancelada", color: "#d00404", bgColor: "#ffe7e7" },
  };

  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery<SessionDbRow[]>({
    queryKey: QUERY_KEYS.SESSIONS.ALL,
    queryFn: sessionService.listSessions,
  });

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery<EmployeeDbRow[]>({
    queryKey: QUERY_KEYS.EMPLOYEES.ALL,
    queryFn: employeeService.listOperationalEmployees,
    staleTime: 1000 * 60 * 5,
  });

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<CustomerDbRow[]>({
    queryKey: QUERY_KEYS.CUSTOMERS.ALL,
    queryFn: customerService.listCustomers,
    staleTime: 1000 * 60 * 5,
  });

  const { data: procedures = [], isLoading: isLoadingProcedures } = useQuery<ProcedureDbRow[]>({
    queryKey: QUERY_KEYS.PROCEDURES.ALL,
    queryFn: procedureService.listProcedures,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isLoadingSessions || isLoadingEmployees 
  || isLoadingCustomers || isLoadingProcedures;

  const rescheduleMutation = useMutation({
    mutationFn: async ({ id, date, time }: { id: string; date: string; time: string }) => {
      return sessionService.updateSession(id, {
        data: date,
        horario: time,
        status: "Pendente",
      });
    },
    onSuccess: () => {
      addToast("Consulta reagendada com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.ALL });
      setIsRescheduleOpen(false);
      setRescheduleSession(null);
    },
    onError: (err) => {
      console.error("Erro ao reagendar consulta:", err);
      addToast("Erro ao reagendar consulta.", "error");
    },
  });

  const cancelDefinitiveMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return sessionService.deleteSession(sessionId);
    },
    onSuccess: () => {
      addToast("Consulta cancelada com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.ALL });
      setIsRescheduleOpen(false);
      setRescheduleSession(null);
    },
    onError: (err) => {
      console.error("Erro ao cancelar consulta:", err);
      addToast("Erro ao cancelar consulta.", "error");
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async (data: FormSessionData) => {
      if (!editingSession || !editingSession.id_consulta) return;

      const selectedProcedureId = data.procedureIds[0] || editingSession.id_procedimento;
      const proc = procedures.find((p) => p.id_procedimento === selectedProcedureId);
      const price = proc ? proc.price : editingSession.valor_cobrado;

      return sessionService.updateSession(editingSession.id_consulta, {
        id_cliente: data.customerId,
        id_funcionario: data.employeeId,
        id_procedimento: selectedProcedureId,
        data: data.date,
        horario: data.time,
        observacoes: data.notes || "",
        valor_cobrado: price,
      });
    },
    onSuccess: () => {
      addToast("Consulta atualizada com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.ALL });
      setIsModalOpen(false);
      setEditingSession(null);
    },
    onError: (err) => {
      console.error("Erro ao atualizar consulta:", err);
      addToast("Erro ao atualizar consulta.", "error");
    },
  });

  const filteredSessions = useAppointmentFilter({
    sessions,
    selectedDate,
    isOperational,
    userEmployeeId: user?.employeeId,
    selectedEmployeeId,
    searchQuery,
  });

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
    rescheduleMutation.mutate({ id: sessionId, date: newDate, time: newTime });
  };

  const handleDefinitiveCancelSubmit = async (sessionId: string) => {
    cancelDefinitiveMutation.mutate(sessionId);
  };

  const handleRegisterSubmit = async (data: FormSessionData) => {
    updateSessionMutation.mutate(data);
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
    value: p.id_procedimento,
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
      render: (item) => item.cliente?.name || "Não informado",
    },
    {
      label: "Procedimento",
      key: "id_procedimento",
      render: (item) => item.procedimento?.name || "Não informado",
    },
    ...(canManage
      ? [
          {
            label: "Atendente",
            key: "id_funcionario" as keyof SessionDbRow,
            render: (item: SessionDbRow) => item.funcionario?.name || "Não informado",
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
              <BsBrushFill size={16} />
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
    actionButtonPosition="title"
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
        isSubmitting={updateSessionMutation.isPending}
        dynamicOptions={sessionDynamicOptions}
        initialValues={initialValues}
      />
    </ViewLayout>
  );
};

export default Appointment;