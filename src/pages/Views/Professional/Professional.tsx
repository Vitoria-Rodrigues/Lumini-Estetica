import { useState, useEffect } from "react";

// Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table, Register, TableSkeleton } from "@/components/ui";
import { ConfirmModal } from "@/components/ui";

// Services
import { employeeService } from "@/services/employeeService";

//Context
import { useToaster } from "@/contexts/ToasterContext/useToaster";

//Utils
import { formatCPF, formatPhone } from "@/utils/formatters";

// Types
import type { EmployeeData } from "@/form-config/types";
import type { Column } from "@/components/ui/Table/Table";

// Icons
import { RiAddFill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import { BsBrushFill } from "react-icons/bs";

const Professional = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const { addToast } = useToaster();

  const filteredEmployees = employees.filter((employees) => {
      if(!searchQuery.trim()) return true;
  
      const term = searchQuery.trim().toLowerCase();
      const termCleanDigits = searchQuery.replace(/\D/g, "");
  
      const customerName = employees.name?.toLowerCase();
      const rawCpf = employees.cpf || "";
      const cleanCpf = rawCpf.replace(/\D/g, "");
      const formattedCpf = formatCPF(rawCpf);
  
      const matchesName = customerName.includes(term);
      const matchesCleanCpf = termCleanDigits.length > 0 && cleanCpf.includes(termCleanDigits);
  
      const matchesFormattedCpf = formattedCpf.includes(term);
  
      return matchesName || matchesCleanCpf || matchesFormattedCpf;
    });
  
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await employeeService.listEmployees();
      if (data) {
        setEmployees(data as unknown as EmployeeData[]);
      }
    } catch (error) {
      console.error("Erro ao carregar funcionarios: ", error);
      addToast("Erro ao carregar os clientes", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEditClick = (employee: EmployeeData) => {
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
    try {
      await employeeService.deletEmployee(employeeToDelete);
      addToast("Profissional excluido com sucesso!", "success");
      fetchEmployees();
    } catch (error) {
      console.error("Erro ao excluir: ", error);
      addToast("Erro ao excluir profissional", "error");
    } finally {
      setIsConfirmOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleRegisterSubmit = async (data: EmployeeData) => {
    try {
      setIsSubmitting(true);
      if (editingEmployee) {
        // Editing
        if (!editingEmployee.user_id) {
          addToast("ID do profissional não encontrado", "error");
          return;
        }
        await employeeService.updateEmployee(editingEmployee.user_id, data);
        addToast("Profissional atualizado com sucesso!", "success");
      } else {
        // Creating
        await employeeService.createEmployee(data);
        addToast("Profissional cadastrado com sucesso!", "success");
      }

      setIsModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees();

    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
      addToast("Erro ao salvar profissional", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const columns: Column<EmployeeData>[] = [
    { label: "Nome", key: "name" },
    { label: "CPF", key: "cpf", render: (employee) => formatCPF(employee.cpf)},
    { label: "Telefone", key: "phone", render: (employee) => formatPhone(employee.phone)},
    { label: "Função", key: "app_role" },
    { label: "Especialidade", key: "specialty" },
    {
      label: "Ações",
      key: "actions",
      render: (employee) => (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
          <button
            onClick={() => handleEditClick(employee)}
            style={{
              background: "#fff",
                border: "1px solid #000000",
                cursor: "pointer",
                color: "#1e1e1e",
                display: "flex",
                alignItems: "center",
                padding: ".5rem .9rem",
                borderRadius: "1rem",
            }}
            title="Editar profissional"
          >
            <BsBrushFill size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(employee.user_id)}
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
            title="Excluir profissional"
          >
            <FaTrashAlt size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <ViewLayout
      title="Funcionário"
      actionButton={
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
        isSubmitting={isSubmitting}
        initialValues={editingEmployee}
      />
    </ViewLayout>
  );
};

export default Professional; 
