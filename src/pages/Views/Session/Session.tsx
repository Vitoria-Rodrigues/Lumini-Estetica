import { useState, useEffect, useMemo } from "react";

//Components
import { Button, Table, TableSkeleton, Register, DescriptionPopover } from "@/components/ui";
import { ConfirmModal } from "@/components/ui/Modal/ConfirmModal/ConfirmModal";
import { ViewLayout, Search } from "@/components/layout";
import type { Column } from "@/components/ui/Table/Table";
import { PaymentModal } from "@/components/ui/Modal/PaymentModal/PaymentModal";

// Services
import { type SessionDbRow, sessionService } from "@/services/sessionService";
import { type CustomerDbRow, customerService } from "@/services/customerService";
import { employeeService, type EmployeeDbRow } from "@/services/employeeService";
import { type ProcedureDbRow, procedureService } from "@/services/procedureService";
import { type SpecialtyDbRow, specialtyService } from "@/services/specialtyService";
import type { SessionData as FormSessionData } from "@/form-config/types";
import type{ SessionData, SessionStatus } from "@/services/sessionService";
import type { PaymentStatus } from "@/services/sessionService";

//Context
import { useToaster } from "@/contexts/ToasterContext/useToaster";
import { useAuth } from "@/contexts/AuthContext/useAuth";

//Utils
import { formatHour, formatCPF } from "@/utils/formatters";

//Icons
import { RiAddFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";


const Session = () => {
  const [sessions, setSessions] = useState<SessionDbRow[]>([]);
  const [customers, setCustomers] = useState<CustomerDbRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeDbRow[]>([]);
  const [procedures, setProcedures] = useState<ProcedureDbRow[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyDbRow[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sessionToComplete, setSessionToComplete] = useState<SessionDbRow | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);

  const { addToast } = useToaster();
  const { user } = useAuth();

  const canManage = user?.role === "admin" || user?.role === "recepcionista";
  const isOperational = ["esteticista", "massagista", "depiladora"];
  
  const statusConfig: Record<SessionStatus, { label: string; color: string; bgColor: string }> = {   
   Pendente:  { label: 'Pendente',  color: '#d29a00', bgColor: '#F5EBCE' },
   Realizada: { label: 'Realizada', color: '#199400', bgColor: '#E3F3DB' },
   Cancelada: { label: 'Cancelada', color: '#d00404', bgColor: '#ffe7e7' },
 };

 const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string; bgColor: string}> = {
  Pendente: { label: 'Pendente', color: '#d29a00', bgColor: '#F5EBCE' },
  Processando: { label: 'Processando', color: '#0077b6', bgColor: '#e0f2fe' },
  Pago: { label: 'Pago', color: '#199400', bgColor: '#E3F3DB' },
  Recusado: { label: 'Recusado', color: '#d00404', bgColor: '#ffe7e7' },
};

  const filteredSessions = useMemo(() => {
    if(!searchQuery.trim()) return sessions;

    const term = searchQuery.trim().toLowerCase();
    const termCleanDigits = searchQuery.replace(/\D/g, "");

    return sessions.filter((s) => {
      const customerName = s.cliente?.name?.toLowerCase() || "";
      const rawCpf = s.cliente?.cpf || "";
      const cleanCpf = rawCpf.replace(/\D/g, "");
      const formattedCpf = formatCPF(rawCpf);

      const matchesName = customerName.includes(term);
      const matchesCleanCpf = termCleanDigits ? cleanCpf.includes(termCleanDigits) : false;
      const matchesFormattedCpf = formattedCpf.includes(term);

      return matchesName || matchesCleanCpf || matchesFormattedCpf;
    });

  }, [sessions, searchQuery]);

  
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [sessionsData, customersData, employeesData, proceduresData, specialtiesData] =
        await Promise.all([
          sessionService.listSessions(),
          customerService.listCustomers(),
          employeeService.listEmployees(),
          procedureService.listProcedures(),
          specialtyService.listSpecialties(),
        ]);

      setSessions(sessionsData);
      setCustomers(customersData);
      setEmployees(employeesData);
      setProcedures(proceduresData);
      setSpecialties(specialtiesData);
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

    const confirmedId = sessionToComplete.id_consulta;

    try{
      await sessionService.updateSession(confirmedId, {
        ...sessionToComplete,
        status: "Realizada",
      } as unknown as Partial<SessionData>);

      addToast("Consulta confirmada com sucesso!", "success");
      loadInitialData();

      setIsConfirmOpen(false);
      setSessionToComplete(null);

      setPaymentSessionId(confirmedId);
      setIsPaymentOpen(true);

    } catch (error) {
      console.error("Erro ao confirmar consulta: ", error);
      addToast("Erro ao confirmar consulta", "error");
      setIsConfirmOpen(false);
      setSessionToComplete(null);
    }
  };

  const handleRegisterSubmit = async (data: FormSessionData) => {
  try {
    setIsSubmitting(true);

    const isBusy = await sessionService.hasScheduleConflict(data.employeeId, data.date, data.time);
    if(isBusy) {
      addToast("Este profissional já possui uma consulta neste horário!", "error");
      return;
    }

    const sessionPayloads = data.procedureIds.map((procedureId) => {
      const proc = procedures.find((p) => p.id_procedimento === procedureId);
      return{
        id_cliente: data.customerId,
        id_funcionario: data.employeeId,
        id_procedimento: procedureId,
        data: data.date,
        horario: data.time,
        observacoes: data.notes || "",
        valor_cobrado: proc ? proc.price : 0,
      };
    });

    await sessionService.createMultiple(sessionPayloads);
    addToast("Consulta(s) agendada(s) com sucesso", "success");
    setIsModalOpen(false);
    loadInitialData();
  } catch(err) {
    addToast("Error ao salvar consulta", "error");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const specialtyOptions = specialties.map((s) => ({
    label: s.nome,
    value: String(s.id_especialidade),
  }));

  const customerOptions = customers.map((c) => ({
    label: `${c.name} - ${formatCPF(c.cpf)}`,
    value: c.id_cliente,
    name: c.name,
    cpf: c.cpf,
  }));

  const sessionDynamicOptions = {
    customerCpf: customerOptions,
    customerId: customerOptions,
    specialtyId: specialtyOptions,

    procedureIds: (selectedSpecialtyId: string) => procedures
    .filter((p) => !selectedSpecialtyId ||
     String(p.id_especialidade) === selectedSpecialtyId)
     .map((p) => ({ 
      label: p.name, 
      value: p.id_procedimento, 
      price: p.price })),

     employeeId: (selectedSpecialtyId: string) => employees
     .filter((e) =>
        !selectedSpecialtyId ||
        e.especialidades?.some((esp) => String(esp.id_especialidade) === selectedSpecialtyId)
      ).map((e) => ({
         label: e.name, 
         value: String(e.id_funcionario) 
      })),
  };

  const initialValues = null;

  const columns: Column<SessionDbRow>[] = [
    {
      label: "Cliente",
      key: "id_cliente",
      render: (item) => item.cliente?.name || "Não informado",
    },
    {
      label: "Funcionário",
      key: "id_funcionario",
      render: (item) => {
        const nomeFuncionario = item.funcionario?.name || "Não informado";
        if (nomeFuncionario === "Não informado") {
        return nomeFuncionario;
      }
      return <DescriptionPopover text={nomeFuncionario} maxLength={10} />;
      },
    },
    {
      label: "Procedimento",
      key: "id_procedimento",
      render: (item) => {
    const nomeProcedimento = item.procedimento?.name || "Não informado";
    if (nomeProcedimento === "Não informado") {
      return nomeProcedimento;
    }
    return <DescriptionPopover text={nomeProcedimento} maxLength={10} />;
  },
  },
    {
    label: "Data e Horário",
    key: "data",
      render: (item) => {
      let formattedDate = "";
      if (item.data) {
        const parts = item.data.split("-");
        formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : item.data;
      }
      const formattedTime = item.horario ? formatHour(item.horario) : "";

      if (!formattedDate && !formattedTime) return "Não informado";

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontWeight: 500 }}>{formattedDate || "—"}</span>
          <span style={{ fontSize: "0.8rem", color: "#666" }}>
            {formattedTime ? `${formattedTime}h` : "—"}
          </span>
        </div>
      );
    },
  },
    {
      label: "Status Consulta",
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
        const price = item.procedimento?.price;
        return typeof price === "number"
          ? `R$ ${price.toFixed(2).replace(".", ",")}`
          : "R$ 0,00";
      },
    },
    {
      label: "Status Pagamento",
      key: "status_pagamento" as keyof SessionDbRow,
      render: (item: SessionDbRow) => {
      const config = paymentStatusConfig[item.status_pagamento] || paymentStatusConfig.Pendente;
      return (
      <span style={{ padding: '0.25rem 0.75rem', 
      borderRadius: '9999px', 
      fontSize: '0.8rem', 
      fontWeight: 600, 
      color: config.color, 
      backgroundColor: config.bgColor }}>
        {config.label}
      </span>
    );
  }
},
    ...(canManage || isOperational
      ? [
          {
            label: "Ações",
            key: "actions" as keyof SessionDbRow,
            render: (item: SessionDbRow) => {
              const isPaymentApproved = item.status_pagamento === "Pago";
              const isActionAllowed = item.status === "Pendente" || item.status === "Cancelada";

              return (
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                  {isOperational && isActionAllowed && (
                    <button
                      onClick={() => handleConfirmSession(item)}
                      style={{
                        background: "#fff",
                        border: "1px solid #13950f",
                        cursor: "pointer",
                        color: "#12960d",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        padding: ".5rem .9rem",
                        borderRadius: "1rem",
                      }}
                      title="Confirmar Consulta"
                    >
                      <FaCheck size={16} />
                    </button>
                  )}

                  {!isPaymentApproved && (
                    <button
                      onClick={() => {
                        setPaymentSessionId(item.id_consulta);
                        setIsPaymentOpen(true);
                      }}
                      style={{
                        background: "#fff",
                        border: item.status_pagamento === "Recusado" ? "1px solid #d00404" : "1px solid #9c4427",
                        cursor: "pointer",
                        color: item.status_pagamento === "Recusado" ? "#d00404" : "#9c4427",
                        display: "flex",
                        alignItems: "center",
                        padding: ".5rem .9rem",
                        borderRadius: "1rem",
                        fontWeight: 600,
                      }}
                      title={item.status_pagamento === "Recusado" ? "Tentar Pagamento Novamente" : "Realizar Pagamento"}
                    >
                      <FaCreditCard size={16} />
                    </button>
                  )}
                </div>
              );
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

    <PaymentModal
      isOpen={isPaymentOpen}
      idConsulta={paymentSessionId}
      onClose={() => {
        setIsPaymentOpen(false);
        setPaymentSessionId(null);
      }}
    />

    </ViewLayout>
  );
};

export default Session;