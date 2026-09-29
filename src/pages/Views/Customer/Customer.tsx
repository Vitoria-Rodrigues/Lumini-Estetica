import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

//Service
import { customerService, type CustomerDbRow } from "@/services/customerService";
import type { CustomerData } from "@/form-config/types";
import { formatCPF, formatPhone } from "@/utils/formatters";

//Components
import { ViewLayout, Search } from "@/components/layout";
import { Button,
  IconButton,
  Table, 
  Register, 
  TableSkeleton,
  ConfirmModal } from "@/components/ui";
import type { Column } from "@/components/ui/Table/Table";

//Context
import { useToaster } from "@/contexts/ToasterContext/useToaster";
import { useAuth } from "@/contexts/AuthContext/useAuth";

//Icon
import { RiAddFill } from "react-icons/ri";
import { BsBrushFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

const Customer = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToaster();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDbRow | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const canModify = user?.role === "admin" || user?.role === "recepcionista";

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerService.listCustomers,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      addToast("Cliente excluido com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsConfirmOpen(false);
      setCustomerToDelete(null);
    },
    onError: (error) => {
      console.error("Erro ao excluir cliente:", error);
      addToast("Erro ao excluir cliente", "error");
      setIsConfirmOpen(false);
      setCustomerToDelete(null);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, data}: {id?: string, data: CustomerData}) => {
      if(id) {
        return customerService.updateCustomer(id, data);
      }
      return customerService.createCustomer(data);
    },
    onSuccess: (_, variables) => {
      addToast(
        variables.id ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsModalOpen(false);
      setEditingCustomer(null);
    },
    onError: (err) => {
      console.error("Erro ao salvar cliente:", err);
      addToast("Erro ao cadastrar ou atualizar o cliente.", "error");
    },
  });

  
  const filteredCustomers = useMemo(() => {
    if(!searchQuery.trim()) return customers;

    const term = searchQuery.trim().toLowerCase();
    const termDigits = searchQuery.replace(/\D/g, "");

    return customers.filter((c) => {
      const nameMatch = c.name?.toLowerCase().includes(term);
      const rawCpf = c.cpf?.replace(/\D/g, "") || "";
      const cpfMatch = termDigits ? rawCpf.includes(termDigits) : false;
      
      return nameMatch  || cpfMatch;
    })
  }, [customers, searchQuery]);

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
    if(customerToDelete){
      deleteMutation.mutate(customerToDelete);
    }
  };

  const handleRegisterSubmit = async (data: CustomerData) => {
    saveMutation.mutate({
      id: editingCustomer?.id_cliente,
      data,
    });
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
      key: "birthdate", 
      render: (customer) => {
        if (!customer.birthdate) return "";
        const parts = customer.birthdate.split("-");
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return customer.birthdate;
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
              <IconButton 
              variant="edit"
              title="Editar Cliente"
              icon={<BsBrushFill size={16} />}
              onClick={() => handleEditClick(customer)}
              />
              <IconButton
              variant="delete"
              title="Excluir Cliente"
              icon={<FaTrashAlt size={16} />}
              onClick={() => handleDeleteClick(customer.id_cliente)}
              />
            </div>
          ),
        },
    ] : baseColumns;


  return (
    <ViewLayout
      title="Cliente"
      actionButton={
        canModify ? (
          <Button 
            title={"Cliente"} 
            icon={RiAddFill} 
            padding=".6rem" 
            width="15%"
            onClick={() => { 
              setEditingCustomer(null); 
              setIsModalOpen(true);
            }}
          />
        ) : undefined
      }
      searchComponent={
        <Search 
          placeholder="Buscar por nome ou CPF do cliente"
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
        />
      }
    >

    {isLoading ? (
      <TableSkeleton rows={5} columns={columns.length} />
    ) : (
      <Table columns={columns} data={filteredCustomers} />
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
    isSubmitting={saveMutation.isPending} 
    initialValues={editingCustomer}/>
    </ViewLayout>
  );
};

export default Customer;
