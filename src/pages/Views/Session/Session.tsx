import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

//Components
import { Button, 
  IconButton,
  Table, 
  TableSkeleton, 
  Register, 
  DescriptionPopover,
  ConfirmModal,
  PaymentModal } from "@/components/ui";
import { ViewLayout, Search } from "@/components/layout";
import type { Column } from "@/components/ui/Table/Table";

// Services
import {
  sessionService,
  type SessionDbRow,
  type SessionStatus,
  type PaymentStatus,
} from "@/services/sessionService";
import { customerService, type CustomerDbRow } from "@/services/customerService";
import { employeeService, type EmployeeDbRow } from "@/services/employeeService";
import { procedureService, type ProcedureDbRow } from "@/services/procedureService";
import { specialtyService, type SpecialtyDbRow } from "@/services/specialtyService";
import type { SessionData as FormSessionData } from "@/form-config/types";

//Context
import { useToaster } from "@/contexts/ToasterContext/useToaster";
import { useAuth } from "@/contexts/AuthContext/useAuth";

//Utils
import { formatHour, formatCPF } from "@/utils/formatters";

//Icons
import { RiAddFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";

const getSessionPriority = (session: SessionDbRow): number => {
    if(session.status === "Pendente") return 1;
    if(session.status === "Realizada" && session.status_pagamento !== "Pago") return 2;
    if(session.status === "Realizada" && session.status_pagamento === "Pago") return 3;
    return 4;
  };

const Session = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToaster();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sessionToComplete, setSessionToComplete] = useState<SessionDbRow | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);

  const canManage = user?.role === "admin" || user?.role === "recepcionista";
  const isOperational = ["esteticista", "massagista", "depiladora"].includes(user?.role || "");
  const canConfirm = canManage || isOperational;

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

  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery<SessionDbRow[]>({
    queryKey: ["sessions"],
    queryFn: sessionService.listSessions,
  });

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<CustomerDbRow[]>({
    queryKey: ["customers"],
    queryFn: customerService.listCustomers,
    staleTime: 1000 * 60 * 5,
  });

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery<EmployeeDbRow[]>({
    queryKey: ["employees"],
    queryFn: employeeService.listEmployees,
    staleTime: 1000 * 60 * 5,
  });

  const { data: procedures = [], isLoading: isLoadingProcedures } = useQuery<ProcedureDbRow[]>({
    queryKey: ["procedures"],
    queryFn: procedureService.listProcedures,
    staleTime: 1000 * 60 * 5,
  });

  const { data: specialties = [], isLoading: isLoadingSpecialties } = useQuery<SpecialtyDbRow[]>({
    queryKey: ["specialties"],
    queryFn: specialtyService.listSpecialties,
    staleTime: 1000  * 60 * 10,
  });

  const isPageLoading = isLoadingSessions || 
  isLoadingCustomers ||
  isLoadingEmployees ||
  isLoadingProcedures ||
  isLoadingSpecialties;

  const completeSessionMutation = useMutation({
    mutationFn: async (session: SessionDbRow) => {
      if (!session.id_consulta) throw new Error("ID da consulta não encontrado.");
      return sessionService.updateSession(session.id_consulta, {
        status: "Realizada",
      });
    },
    onSuccess: (_, session) => {
      addToast("Consulta confirmada com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setIsConfirmOpen(false);
      setSessionToComplete(null);

      if(session.id_consulta){
        setPaymentSessionId(session.id_consulta);
        setIsPaymentOpen(true);
      }
    },
    onError: (error) => {
      console.error("Erro ao confirmar consulta:", error);
      addToast("Erro ao confirmar consulta.", "error");
      setIsConfirmOpen(false);
      setSessionToComplete(null);
    },
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: FormSessionData) =>{
      const isBusy = await sessionService.hasScheduleConflict(
        data.employeeId,
        data.date,
        data.time
      );

      if(isBusy) throw new Error("CONFLICT");

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

      return sessionService.createMultiple(sessionPayloads);
    },
    onSuccess: () => {
      addToast("Consulta(s) agendada(s) com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      setIsModalOpen(false);
    },
    onError: (err: Error) => {
      if(err.message === "CONFLICT") {
        addToast("Este profissional já possui uma consulta neste horário!", "error");
      } else {
        console.error("Erro ao agendar consulta:", err);
        addToast("Erro ao salvar consulta.", "error");
      }
    },
  });

  const filteredSessions = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    const termCleanDigits = searchQuery.replace(/\D/g, "");

    const filtered = term ? sessions.filter((s) => {
      const customerName = s.cliente?.name?.toLowerCase() || "";
      const rawCpf = s.cliente?.cpf || "";
      const cleanCpf = rawCpf.replace(/\D/g, "");
      const formattedCpf = formatCPF(rawCpf);

      const matchesName = customerName.includes(term);
      const matchesCleanCpf = termCleanDigits ? cleanCpf.includes(termCleanDigits) : false;
      const matchesFormattedCpf = formattedCpf.includes(term);

      return matchesName || matchesCleanCpf || matchesFormattedCpf;
    }) : [...sessions];

    return filtered.sort((a, b) => {
      const priorityDiff = getSessionPriority(a) - getSessionPriority(b);
      if(priorityDiff !== 0) return priorityDiff;

      const dateComparison = (a.data || "").localeCompare(b.data || "");
      if(dateComparison !== 0) return dateComparison;

      return (a.horario || "").localeCompare(b.horario || "");
    });
  }, [sessions, searchQuery]);

  const handleConfirmSessionClick = (session: SessionDbRow) => {
    if(!session.id_consulta) return;
    setSessionToComplete(session);
    setIsConfirmOpen(true);
  };

  const handleExecuteConfirm = () => {
    if(sessionToComplete) {
      completeSessionMutation.mutate(sessionToComplete);
    }
  };

  const handleRegisterSubmit = (data: FormSessionData) => {
    createSessionMutation.mutate(data);
  };

  const specialtyOptions = useMemo(() => specialties.map((s) => ({
    label: s.nome,
    value: String(s.id_especialidade),
  })),
  [specialties]
);

  const customerOptions = useMemo(() => 
    customers.map((c) => ({
    label: `${c.name} - ${formatCPF(c.cpf)}`,
    value: String(c.id_cliente),
    name: c.name,
    cpf: c.cpf,
  })),
  [customers]
);

  const sessionDynamicOptions = useMemo(
    () => ({
      customerCpf: customerOptions,
      customerId: customerOptions,
      specialtyId: specialtyOptions,
      procedureIds: (selectedSpecialtyId: string) =>
        procedures
          .filter((p) => !selectedSpecialtyId || String(p.id_especialidade) === selectedSpecialtyId)
          .map((p) => ({
            label: p.name,
            value: String(p.id_procedimento),
            price: p.price,
          })),
      employeeId: (selectedSpecialtyId: string) =>
        employees
          .filter((e) =>!selectedSpecialtyId || e.especialidades?.some((esp) => 
            String(esp.id_especialidade) === selectedSpecialtyId))
          .map((e) => ({
            label: e.name,
            value: String(e.id_funcionario),
          })),
    }),
    [customerOptions, specialtyOptions, procedures, employees]
  );

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
        if (nomeFuncionario === "Não informado") return nomeFuncionario;
        return <DescriptionPopover text={nomeFuncionario} maxLength={10} />;
      },
    },
    {
      label: "Procedimento",
      key: "id_procedimento",
      render: (item) => {
      const nomeProcedimento = item.procedimento?.name || "Não informado";
      if (nomeProcedimento === "Não informado")  return nomeProcedimento;
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
          }}>
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
            backgroundColor: config.bgColor 
            }}>
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
              const isRejected = item.status_pagamento === "Recusado";
              const isActionAllowed = item.status === "Pendente" || item.status === "Cancelada";


              return (
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                  {canConfirm && isActionAllowed && (
                    <IconButton 
                      variant="success"
                      title="Confirmar Consulta"
                      icon={<FaCheck size={16} />}
                      onClick={() => handleConfirmSessionClick(item)}
                    />
                  )}

                  {!isPaymentApproved && (
                    <IconButton 
                    variant={isRejected ? "danger" : "payment"}
                    title={isRejected ? "Tentar Pagamento Novamente" : "Realizar Pagamento"}
                    icon={<FaCreditCard size={16} />}
                    onClick={() => {
                      setPaymentSessionId(item.id_consulta);
                      setIsPaymentOpen(true);
                    }}
                    />
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
      {isPageLoading ? (
        <TableSkeleton rows={5} columns={columns.length} />
      ) : (
        <Table columns={columns} data={filteredSessions} />
      )}

      <Register
        type="session"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegisterSubmit}
        isSubmitting={createSessionMutation.isPending}
        dynamicOptions={sessionDynamicOptions}
        initialValues={null}
      />

    <ConfirmModal
     isOpen={isConfirmOpen}
     title="Concluir Consulta"
     description="Deseja confirmar que esta consulta foi realizada?"
     onConfirm={handleExecuteConfirm}
     onClose={() => setIsConfirmOpen(false)}
    />

    <PaymentModal
      isOpen={isPaymentOpen}
      idConsulta={paymentSessionId}
      onClose={() => {
        setIsPaymentOpen(false);
        setPaymentSessionId(null);
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
      }}
    />

    </ViewLayout>
  );
};

export default Session;