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
import { BsBrush } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";

const Procedure = () => {
  const [procedure, setProcedure] = useState<ProcedureDbRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<categoryDbRow[]>([]);
  const [editingProcedure, setEditingProcedure] = useState<ProcedureDbRow | null>(null);

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

  const handleEditClick = (proc: ProcedureDbRow) => {
    setEditingProcedure(proc);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (idProcedure?: string) => {
    if (!idProcedure) {
      alert("Erro: ID do procedimento não encontrado");
      return;
    }
    if (window.confirm("Tem certeza que deseja excluir este procedimento?")) {
      try {
        await procedureService.deleteProcedure(idProcedure);
        alert("Procedimento excluído com sucesso!");
        loadProcedure();
      } catch (err) {
        console.error("Erro ao excluir: ", err);
        alert("Erro ao excluir procedimento.");
      }
    }
  };

  const handleRegisterSubmit = async (data: ProcedureData) => {
    try {
      setIsSubmitting(true);
      if (editingProcedure) {
        if (!editingProcedure.id_prodecimento) {
          alert("Erro: ID do procedimento não encontrado");
          return;
        }
        await procedureService.updateProcedure(editingProcedure.id_prodecimento, data);
        alert("Procedimento atualizado com sucesso!");
      } else {
        await procedureService.createProcedure(data);
        alert("Procedimento cadastrado com sucesso!");
      }
      setIsModalOpen(false);
      setEditingProcedure(null);
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
    setEditingProcedure(null);
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
    {
      label: "Ações",
      key: "actions",
      render: (proc) => (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
          <button
            onClick={() => handleEditClick(proc)}
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
            title="Editar procedimento"
          >
            <BsBrush size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(proc.id_prodecimento)}
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
            title="Excluir procedimento"
          >
            <FaRegTrashAlt size={16} />
          </button>
        </div>
      ),
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
            setEditingProcedure(null);
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
        initialValues={editingProcedure}
      />
    </ViewLayout>
  );
};

export default Procedure;

