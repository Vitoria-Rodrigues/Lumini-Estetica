import { useState, useEffect } from "react";

//Service
import type { ProcedureData } from "@/form-config/types";
import { procedureService, type ProcedureDbRow } from "@/services/procedureService";
import { categoryService, type categoryDbRow } from "@/services/categoryService";

//Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table, Register } from "@/components/ui";
import type { Column } from "@/components/ui/Table/Table";

//icon
import { RiAddFill } from "react-icons/ri";

const Procedure = () => {
  const [procedure, setProcedure] = useState<ProcedureDbRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<categoryDbRow[]>([]);

  useEffect(() => {
    categoryService.listCategories().then(setCategories);
  }, []);

  const loadProcedure = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await procedureService.listProcedures();
      if (data) {
        setProcedure(data);
      }
    } catch (error) {
      console.error("Erro ao carregar os procedimentos: ", error);
      setError("Erro ao carregar procedimentos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProcedure();
  }, []);

  const handleRegisterSubmit = async (data: ProcedureData) => {
    try {
      setIsSubmitting(true);
        await procedureService.createProcedure(data);
        alert("Procedimento cadastrado com sucesso!");
        setIsModalOpen(false);
        loadProcedure();
    } catch (error) {
      console.error("Erro ao salvar o procedimento:", error);
      alert("Erro ao salvar o procedimento. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const columns: Column<ProcedureDbRow>[] = [
    { label: "Nome", key: "name" },
    { label: "Descrição", key: "description" },
    { 
      label: "Preço", 
      key: "price", 
      render: (proc) => `R$ ${Number(proc.price).toFixed(2).replace(".", ",")}`
    },
    { label: "Duração", key: "duration" },
    { 
      label: "Categoria", 
      key: "category", 
      render: (proc) => {
        const cat = categories.find(c => c.id_category === proc.category);
        return cat ? cat.descricao : (proc.category || "");
      }
    },
  ];

  return (
    <ViewLayout
      title="Procedimento"
      actionButton={
        <Button 
          title={"Procedimento"} 
          icon={RiAddFill} 
          padding=".6rem" 
          width="15%"
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
      }
      searchComponent={<Search placeholder="Digite o nome do procedimento.." />}
    >
      {isLoading ? (
        <p>Carregando procedimentos..</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <Table columns={columns} data={procedure} />
      )}

      <Register 
        type="procedure"
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSubmit={handleRegisterSubmit}
        isSubmitting={isSubmitting} 
        dynamicOptions={{category: categories.map(c => ({ label: c.descricao, value: c.id_category }))}}
      />
    </ViewLayout>
  );
};

export default Procedure;

