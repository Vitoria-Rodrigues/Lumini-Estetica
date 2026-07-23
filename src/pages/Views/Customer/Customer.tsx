import { useState, useEffect } from "react";

//Service
import { customerService, type CustomerDbRow } from "@/services/customerService";
import type { CustomerData } from "@/form-config/types";
import { formatCPF, formatPhone } from "@/utils/formatters";

//Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table, Register } from "@/components/ui";
import type { Column } from "@/components/ui/Table/Table";

//Icon
import { RiAddFill } from "react-icons/ri";
import { BsBrush } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";

const Customer = () => {
  const [customers, setCustomers] = useState<CustomerDbRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDbRow | null>(null);

  const loadCustomer = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await customerService.listCustomers();
        if (data) {
          setCustomers(data);
        }
    } catch (err) {
      console.error("Erro ao carregar clientes: ", err);
      setError("Erro ao carregar clientes.");
    } finally {
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
      alert("Erro: ID do cliente não encontrado");
      return
    }
    if(window.confirm("Tem certeza que deseja excluir este cliente?")){
      try {
        await customerService.deleteCustomer(idCliente);
        alert("Cliente excluido com sucesso")
        loadCustomer();
      } catch (error) {
        console.error("Erro ao excluir: ", error);
        alert("Erro ao excluir cliente.");
      }
    }
  };

  const handleRegisterSubmit = async (data: CustomerData) => {
    try {
      setIsSubmitting(true);
      if(editingCustomer){
        if(!editingCustomer.id_cliente){
          alert("Erro: ID do cliente nao encontrado");
          return;
        }
        await customerService.updateCustomer(editingCustomer.id_cliente, data);
        alert("Cliente atualizado com sucesso!");
      } else {
        await customerService.createCustomer(data);
        alert("Cliente cadastrado com sucesso!");
      }
      setIsModalOpen(false);
      setEditingCustomer(null);
      loadCustomer();
    } catch (err) {
      console.error("Erro ao cadastrar cliente:", err);
      const errorMessage = err instanceof Error ? err.message : "Não foi possível salvar.";
      alert(`Erro: ${errorMessage}`);
    } finally{
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  }

  const columns: Column<CustomerDbRow>[] = [
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
    {
        label: "Ações",
        key: "actions",
        render: (customer) => (
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <button
              onClick={() => handleEditClick(customer)}
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
              title="Editar Cliente"
            >
              <BsBrush size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(customer.id_cliente)}
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
              title="Excluir Cliente"
            >
              <FaRegTrashAlt size={16} />
            </button>
          </div>
        ),
      },
  ];

  return (
    <ViewLayout
      title="Cliente"
      actionButton={
      <Button title={"Cliente"} 
      icon={RiAddFill} 
      padding=".6rem" width="15%"
      onClick={() => { setEditingCustomer(null); 
        setIsModalOpen(true);
      }}
      />
    }
      searchComponent={<Search />}
    >
      {isLoading ? 
      ( <p>Carregando clientes..</p>) : 
      error ? (<p style={{ color: "red"}}>{error}</p>) :
       (<Table columns={columns} data={customers} />)
    }
    
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
