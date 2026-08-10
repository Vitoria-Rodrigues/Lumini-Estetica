import { useState, useEffect } from "react";

//Components
import { Button, Table, TableSkeleton, Register, DescriptionPopover } from "@/components/ui";
import { ViewLayout, Search } from "@/components/layout";
import type { Column } from "@/components/ui/Table/Table";

// Services
import { type SessionDbRow, sessionService } from "@/services/sessionService";
import { type CustomerDbRow, customerService } from "@/services/customerService";
import { employeeService, type EmployeeDbRow } from "@/services/employeeService";
import { type ProcedureDbRow, procedureService } from "@/services/procedureService";
import type { SessionData as FormSessionData } from "@/form-config/types";

//Context
import { useToaster } from "@/contexts/ToasterContext/useToaster";

//Utils
import { formatHour } from "@/utils/formatters";

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
  const [editingSession, setEditingSession] = useState<SessionDbRow | null>(null);

  const { addToast } = useToaster();

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

  const handleEditClick = (session: SessionDbRow) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (idConsulta?: string) => {
    if (!idConsulta) {
      addToast("Erro ao identificar a consulta.", "error");
      return;
    }
    if (window.confirm("Tem certeza que deseja excluir esta consulta?")) {
      try {
        await sessionService.deleteSession(idConsulta);
        addToast("Consulta excluída com sucesso!", "success");
        loadInitialData();
      } catch (error) {
        console.error("Erro ao excluir consulta:", error);
        addToast("Erro ao excluir consulta.", "error");
      }
    }
  };

  const handleRegisterSubmit = async (data: FormSessionData) => {
    try {
      setIsSubmitting(true);

      if (editingSession) {
        if (!editingSession.id_consulta) {
          addToast("Erro ao editar a consulta.", "error");
          return;
        }

        const selectedProcedureId = data.procedureIds[0] || editingSession.id_procedimento;
        const proc = procedures.find(p => p.id_prodecimento === selectedProcedureId);
        const price = proc ? proc.price : undefined;

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
      } else {
        const promises = data.procedureIds.map((procedureId) => {
          const proc = procedures.find(p => p.id_prodecimento === procedureId);
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
      }

      setIsModalOpen(false);
      setEditingSession(null);
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
    setEditingSession(null);
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
      label: "Valor Total",
      key: "id_procedimento",
      render: (item) => {
        const price = item.Procedimento?.price;
        return typeof price === "number"
          ? `R$ ${price.toFixed(2).replace(".", ",")}`
          : "R$ 0,00";
      },
    },
    {
      label: "Ações",
      key: "actions",
      render: (item) => (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
          <button
            onClick={() => handleEditClick(item)}
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
          <button
            onClick={() => handleDeleteClick(item.id_consulta)}
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
            title="Cancelar Consulta"
          >
            <HiX size={17} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <ViewLayout
      title="Consulta"
      actionButton={
        <Button
          title={"Consulta"}
          icon={RiAddFill}
          padding=".6rem"
          width="15%"
          onClick={() => {
            setEditingSession(null);
            setIsModalOpen(true);
          }}
        />
      }
      searchComponent={<Search placeholder="Digite o nome do cliente..." />}
    >
      {isLoading ? (
        <TableSkeleton rows={5} columns={columns.length} />
      ) : (
        <Table columns={columns} data={sessions} />
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
    </ViewLayout>
  );
};

export default Session;
