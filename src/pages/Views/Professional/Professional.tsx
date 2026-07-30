import { useState, useEffect } from "react";

// Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table, Register } from "@/components/ui";

// Services
import { employeeService } from "@/services/employeeService";

//Context
import { Toaster } from "@/components/ui";

//Utils
import { formatCPF, formatPhone } from "@/utils/formatters";

// Types
import type { EmployeeData } from "@/form-config/types";
import type { Column } from "@/components/ui/Table/Table";

// Icons
import { RiAddFill } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsBrush } from "react-icons/bs";
import { useToaster } from "@/contexts/ToasterContext/useToaster";

const Professional = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeData | null>(null);
  const { addToast } = useToaster();

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.listEmployees();
      if (data) {
        setEmployees(data as EmployeeData[]);
      }
    } catch (error) {
      console.error("Erro ao carregar funcionarios: ", error);
      addToast("Erro ao carregar os clientes", "error");
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
    if (window.confirm("Tem certeza que deseja excluir este profissional?")) {
      try {
        await employeeService.deletEmployee(userId);
        addToast("Profissional excluido com sucesso!", "success");
        fetchEmployees();
      } catch (error) {
        console.error("Erro ao excluir: ", error);
        addToast("Erro ao excluir profissional", "error");
      }
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
              background: "#B25E21",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              padding: ".5rem 1.2rem",
              borderRadius: "1rem",
            }}
            title="Editar profissional"
          >
            <BsBrush size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(employee.user_id)}
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
            title="Excluir profissional"
          >
            <FaRegTrashAlt size={16} />
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
      searchComponent={<Search placeholder="Digite o nome do profissional.." />}
    >
      <Table columns={columns} data={employees} />

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
