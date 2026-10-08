import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table, Register, TableSkeleton, IconButton } from "@/components/ui";
import { ConfirmModal } from "@/components/ui";

// Services
import { employeeService } from "@/services/employeeService";
import type { EmployeeDbRow } from "@/services/employeeService";

//Context
import { useToaster } from "@/contexts/ToasterContext/useToaster";
import { useAuth } from "@/contexts/AuthContext/useAuth";

//Utils
import { formatCPF, formatPhone } from "@/utils/formatters";

// Types
import type { EmployeeData } from "@/form-config/types";
import type { Column } from "@/components/ui/Table/Table";

// Icons
import { RiAddFill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import { BsBrushFill } from "react-icons/bs";
import { QUERY_KEYS } from "@/constants/queryKeys";

const Professional = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToaster();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeDbRow | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const { data: employees = [], isLoading} = useQuery<EmployeeDbRow[]>({
    queryKey: QUERY_KEYS.EMPLOYEES.OPERATIONAL,
    queryFn: employeeService.listOperationalEmployees,    
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      return employeeService.deleteEmployee(userId);
    },
    onSuccess: () => {
      addToast("Profissional excluido com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES.OPERATIONAL });
      setIsConfirmOpen(false);
      setEmployeeToDelete(null);
    },
    onError: (error) => {
      console.error("Erro ao excluir profissional", error);
      addToast("Erro ao excluir profissional", "error");
      setIsConfirmOpen(false);
      setEmployeeToDelete(null);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: EmployeeData) => {
      if (editingEmployee) {
        if (!editingEmployee.user_id) {
          throw new Error("ID do profissional não encontrado");
        }
        return employeeService.updateEmployee(editingEmployee.user_id, data);
      }
      return employeeService.createEmployee(data);
    },
    onSuccess: () => {
      addToast(
        editingEmployee
          ? "Profissional atualizado com sucesso!"
          : "Profissional cadastrado com sucesso!",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES.OPERATIONAL });
      setIsModalOpen(false);
      setEditingEmployee(null);
    },
    onError: (error) => {
      console.error("Erro ao salvar profissional:", error);
      addToast("Erro ao salvar profissional", "error");
    },
  });

  const filteredEmployees = useMemo(() => {
    if(!searchQuery.trim()) return employees;

    const term = searchQuery.trim().toLowerCase();
    const termCleanDigits = searchQuery.replace(/\D/g, "");

    return employees.filter((employee) => {
      const employeeName = employee.name?.toLowerCase() || "";
      const rawCpf = employee.cpf || "";
      const cleanCpf = rawCpf.replace(/\D/g, "");
      const formattedCpf = formatCPF(rawCpf);

      const matchesName = employeeName.includes(term);
      const matchesCleanCpf = termCleanDigits.length > 0 && cleanCpf.includes(termCleanDigits);
      const matchesFormattedCpf = formattedCpf.includes(term);

      return matchesName || matchesCleanCpf || matchesFormattedCpf;
    });
  }, [employees, searchQuery]);

  const handleEditClick = (employee: EmployeeDbRow) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (userId?: string) => {
    if (!userId) {
      addToast("Erro: ID do profissional não encontrado", "error");
      return;
    }
    setEmployeeToDelete(userId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () =>{
    if(!employeeToDelete) return;
    deleteMutation.mutate(employeeToDelete);
  };

  const handleRegisterSubmit = async (data: EmployeeData) => {
    saveMutation.mutate(data);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const formInitialValues: Partial<EmployeeData> | 
  null = editingEmployee ? {
    user_id: editingEmployee.user_id,
    name: editingEmployee.name,
    cpf: editingEmployee.cpf || "",
    phone: editingEmployee.phone || "",
    role: editingEmployee.app_role,
    specialty: editingEmployee.specialty || "",
    salary: editingEmployee.salary,
  } : null;

  const baseColumns: Column<EmployeeDbRow>[] = [
    { label: "Nome", key: "name" },
    { label: "CPF", key: "cpf", render: (employee) => formatCPF(employee.cpf)},
    { label: "Telefone", key: "phone", render: (employee) => formatPhone(employee.phone)},
    { label: "Função", key: "app_role" },
    { label: "Especialidade", key: "specialty", render: (employee) => employee.specialty || "-" },
  ];

  const columns: Column<EmployeeDbRow>[] = isAdmin
    ? [
        ...baseColumns,
        {
          label: "Ações",
          key: "actions",
          render: (employee) => (
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
              <IconButton 
                variant="edit"
                title="Editar Profissional"
                icon={<BsBrushFill size={16} />}
                onClick={() => handleEditClick(employee)}
              />
              <IconButton
                variant="delete"
                title="Excluir Profissional"
                icon={<FaTrashAlt size={16} />}
                onClick={() => handleDeleteClick(employee.user_id)}
              />
            </div>
          ),
        },
      ]
    : baseColumns;

  return (
    <ViewLayout
      title="Funcionário"
      actionButton={
        isAdmin ? (
          <Button
            title={"Funcionário"}
            icon={RiAddFill}
            padding=".6rem"
            width="15%"
            onClick={() => {
              setEditingEmployee(null);
              setIsModalOpen(true);
            }}
          />
        ) : undefined
      }
      searchComponent={<Search placeholder="Digite o nome ou CPF do profissional" 
      value={searchQuery}
      onChange={(val) => setSearchQuery(val)}
      />}
    >
    {isLoading ? (
      <TableSkeleton rows={5} columns={columns.length} />
    ) : (
      <Table columns={columns} data={filteredEmployees} />
    )}

    <ConfirmModal
     isOpen={isConfirmOpen}
     title="Excluir Profissional"
     description="Tem certeza que deseja excluir este profissional?"
     onConfirm={handleConfirmDelete}
     onClose={() => setIsConfirmOpen(false)}
    />

      <Register
        type="employee"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleRegisterSubmit}
        isSubmitting={saveMutation.isPending
        }
        initialValues={formInitialValues}
      />
    </ViewLayout>
  );
};

export default Professional; 
