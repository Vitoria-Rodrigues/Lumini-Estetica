import { useState, useEffect } from "react";

//Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table, Register } from "@/components/ui";
import type { Column } from "@/components/ui/Table/Table";

//Icon
import { RiAddFill } from "react-icons/ri";

//Service
import { customerService, type CustomerDbRow } from "@/services/customerService";
import type { CustomerData } from "@/form-config/types";
import { formatCPF, formatPhone } from "@/utils/formatters";

const Customer = () => {
  const [customers, setCustomers] = useState<CustomerDbRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function loadCustomers() {
      try{
        setIsLoading(true);
        const data = await customerService.listCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Error ao carregar clientes:", err);
        setError("Nao foi possivel carregar os clientes.");
      } finally{
        setIsLoading(false);
      }
    }

    loadCustomers();

  }, []);

  const handleRegisterSubmit = async (data: CustomerData) => {
    try {
      setIsSubmitting(true);
      const newCustomer = await customerService.createCustomer(data);
      
      setCustomers((prev) => [...prev, newCustomer]);

      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao cadastrar cliente:", err);
      alert("Erro ao cadastrar o cliente. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
  ];

  return (
    <>
    <ViewLayout
      title="Cliente"
      actionButton={
      <Button title={"Cliente"} 
      icon={RiAddFill} 
      padding=".6rem" width="15%"
      onClick={() => setIsModalOpen(true)}/>}
      searchComponent={<Search />}
    >
      {isLoading ? 
      ( <p>Carregando clientes..</p>) : 
      error ? (<p style={{ color: "red"}}>{error}</p>) :
       (<Table columns={columns} data={customers} />)
    }
    </ViewLayout>

    <Register isOpen={isModalOpen} 
    onClose={() => setIsModalOpen(false)}
    type="customer"
    onSubmit={handleRegisterSubmit}
    isSubmitting={isSubmitting} />
    </>
  );
};

export default Customer;
