import { useState, useEffect } from "react";

//Service
import { customerService, type CustomerDbRow } from "@/services/customerService";
import type { CustomerData } from "@/form-config/types";
import { formatCPF, formatPhone } from "@/utils/formatters";

//Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table, Register, TableSkeleton } from "@/components/ui";
import { ConfirmModal } from "@/components/ui";
import type { Column } from "@/components/ui/Table/Table";

//Context
import { useToaster } from "@/contexts/ToasterContext/useToaster";
import { useAuth } from "@/contexts/AuthContext/useAuth";

//Icon
import { RiAddFill } from "react-icons/ri";
import { BsBrushFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

const Customer = () => {
  const [customers, setCustomers] = useState<CustomerDbRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDbRow | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const { addToast } = useToaster();
  const { user } = useAuth();

  const canModify = user?.role === "admin" || user?.role === "recepcionista";

  const filteredCustomer = customers.filter((customers) => {
    if(!searchQuery.trim()) return true;

    const term = searchQuery.trim().toLowerCase();
    const termCleanDigits = searchQuery.replace(/\D/g, "");

    const customerName = customers.name?.toLowerCase();
    const rawCpf = customers.cpf || "";
    const cleanCpf = rawCpf.replace(/\D/g, "");
    const formattedCpf = formatCPF(rawCpf);

    const matchesName = customerName.includes(term);
    const matchesCleanCpf = termCleanDigits.length > 0 && cleanCpf.includes(termCleanDigits);

    const matchesFormattedCpf = formattedCpf.includes(term);

    return matchesName || matchesCleanCpf || matchesFormattedCpf;
  });

  const loadCustomer = async () => {
    try {
      setIsLoading(true);
      const data = await customerService.listCustomers();
        if (data) {
          setCustomers(data);
        }
    } catch (err) {
      console.error("Erro ao carregar clientes: ", err);
      addToast("Erro ao carregar os clientes", "error");
    } finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, []);

  const handleEditClick = (customer: CustomerDbRow) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  }

  const handleDeleteClick = async (idCliente?: string) => {
    if(!idCliente) {
      addToast("Erro ao editar dados.", "error");
      return;
    }
    setCustomerToDelete(idCliente);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if(!customerToDelete) return;

    try{
      await customerService.deleteCustomer(customerToDelete);
      addToast("Cliente excluido com sucesso", "success");
      loadCustomer();
    } catch(error) {
      console.error("Error ao excluir: ", error);
      addToast("Erro ao excluir cliente.", "error");
    } finally{
      setIsConfirmOpen(false);
      setCustomerToDelete(null);
    }

  };

  const handleRegisterSubmit = async (data: CustomerData) => {
    try {
      setIsSubmitting(true);
      if(editingCustomer){
        if(!editingCustomer.id_cliente){
          addToast("Erro ao editar dados.", "error");
          return;
        }
        await customerService.updateCustomer(editingCustomer.id_cliente, data);
        addToast("Cliente atualizado com sucesso!", "success");
      } else {
        await customerService.createCustomer(data);
        addToast("Cliente cadastrado com sucesso!.", "success");
      }
      setIsModalOpen(false);
      setEditingCustomer(null);
      loadCustomer();
    } catch (err) {
      addToast("Erro ao cadastrar o cliente.", "error");
      console.error("Erro ao cadastrar cliente:", err);
    } finally{
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  }

  const baseColumns: Column<CustomerDbRow>[] = [
    { label: "Nome", key: "name" },
    { label: "CPF", key: "cpf", render: (customer) => formatCPF(customer.cpf) },
    { label: "Telefone", key: "phone", render: (customer) => formatPhone(customer.phone) },
    { 
      label: "Data de Nascimento", 
      key: "birthDate", 
      render: (customer) => {
        if (!customer.birthDate) return "";
        const parts = customer.birthDate.split("-");
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return customer.birthDate;
      }
    },
  ];
    const columns: Column<CustomerDbRow>[] = canModify
    ? [
      ...baseColumns,
      {
          label: "Ações",
          key: "actions",
          render: (customer) => (
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
              <button
                onClick={() => handleEditClick(customer)}
                style={{
                  background: "#fff",
                  border: "1px solid #000000",
                  cursor: "pointer",
                  color: "#464646",
                  display: "flex",
                  alignItems: "center",
                  padding: ".5rem .9rem",
                  borderRadius: "1rem",
                }}
                title="Editar Cliente"
              >
                <BsBrushFill size={16} />
              </button>
              <button
                onClick={() => handleDeleteClick(customer.id_cliente)}
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
                title="Excluir Cliente"
              >
                <FaTrashAlt size={16} />
              </button>
            </div>
          ),
        },
    ] : baseColumns;


  return (
    <ViewLayout
      title="Cliente"
      actionButton={
        canModify ? (
      <Button title={"Cliente"} 
      icon={RiAddFill} 
      padding=".6rem" width="15%"
      onClick={() => { setEditingCustomer(null); 
        setIsModalOpen(true);
      }}
      />
    ) : undefined
    }
      searchComponent={<Search placeholder="Buscar por nome ou CPF do cliente"
        value={searchQuery}
        onChange={(val) => setSearchQuery(val)}
      />}
    >

    {isLoading ? (
      <TableSkeleton rows={5} columns={columns.length} />
    ) : (
      <Table columns={columns} data={filteredCustomer} />
    )}

    <ConfirmModal
     isOpen={isConfirmOpen}
     title="Excluir Cliente"
     description="Tem certeza que deseja excluir este cliente?"
     onConfirm={handleConfirmDelete}
     onClose={() => setIsConfirmOpen(false)}
    />
    
    <Register 
    type="customer"
    isOpen={isModalOpen} 
    onClose={handleCloseModal}
    onSubmit={handleRegisterSubmit}
    isSubmitting={isSubmitting} 
    initialValues={editingCustomer}/>
    </ViewLayout>
  );
};

export default Customer;
