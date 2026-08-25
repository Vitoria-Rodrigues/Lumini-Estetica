import { useState, useEffect } from "react";

//Service
import type { ProcedureData } from "@/form-config/types";
import { procedureService, type ProcedureDbRow } from "@/services/procedureService";
import { categoryService, type categoryDbRow } from "@/services/categoryService";

//Context
import { useToaster } from "@/contexts/ToasterContext/useToaster";
import { useAuth } from "@/contexts/AuthContext/useAuth";

//Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table, Register, TableSkeleton, DescriptionPopover } from "@/components/ui";
import type { Column } from "@/components/ui/Table/Table";

//icon
import { RiAddFill } from "react-icons/ri";
import { BsBrush } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";

const Procedure = () => {
  const [procedure, setProcedure] = useState<ProcedureDbRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<categoryDbRow[]>([]);
  const [editingProcedure, setEditingProcedure] = useState<ProcedureDbRow | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { addToast } = useToaster();
  const { user } = useAuth();

  const canModify = user?.role === "admin";

  const filteredProcedure = procedure.filter((procedure) => {
    if(!searchQuery.trim()) return true;

    const term = searchQuery.trim().toLowerCase();
    const procedureName = procedure.name?.toLowerCase();

    const matchesName = procedureName.includes(term);

    return matchesName;

  });

  useEffect(() => {
    categoryService.listCategories().then(setCategories);
  }, []);

  const loadProcedure = async () => {
    try {
      setIsLoading(true);
      const data = await procedureService.listProcedures();
      if (data) {
        setProcedure(data);
      }
    } catch (error) {
      console.error("Erro: ", error);
      addToast("Erro ao carregar os procedimentos", "error");
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
      addToast("Erro ao carregar os procedimentos", "error");
      return;
    }
    if (window.confirm("Tem certeza que deseja excluir este procedimento?")) {
      try {
        await procedureService.deleteProcedure(idProcedure);
        addToast("Procedimento excluído com sucesso!", "success");
        loadProcedure();
      } catch (err) {
        console.error("Erro ao excluir: ", err);
        addToast("Erro ao excluir procedimento", "error");
      }
    }
  };

  const handleRegisterSubmit = async (data: ProcedureData) => {
    try {
      setIsSubmitting(true);
      if (editingProcedure) {
        if (!editingProcedure.id_prodecimento) {
          addToast("ID do procedimento não encontrado", "error");
          return;
        }
        await procedureService.updateProcedure(editingProcedure.id_prodecimento, data);
        addToast("Procedimento atualizado com sucesso!", "success");
      } else {
        await procedureService.createProcedure(data);
        addToast("Procedimento cadastrado com sucesso!", "success");
      }
      setIsModalOpen(false);
      setEditingProcedure(null);
      loadProcedure();
    } catch (error) {
      console.error("Erro ao salvar o procedimento:", error);
      addToast("Erro ao salvar o procedimento.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProcedure(null);
  };

  const baseColumns: Column<ProcedureDbRow>[] = [
    { label: "Nome", key: "name" },
    { label: "Descrição", key: "description", render: (item) => <DescriptionPopover text={item.description} /> },
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
    const columns: Column<ProcedureDbRow>[] = canModify
  ? [
      ...baseColumns,
      {
        label: "Ações",
        key: "actions" as keyof ProcedureDbRow | "actions", // Garante o tipo exato da chave
        render: (proc: ProcedureDbRow) => (
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
    ] : baseColumns;


  return (
    <ViewLayout
      title="Procedimento"
      actionButton={
        canModify ? (
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
      ) : undefined
      }
      searchComponent={<Search placeholder="Digite o nome do procedimento.." 
      value={searchQuery}
      onChange={(val) => setSearchQuery(val)}
      />
      }
        >

    {isLoading ? (
      <TableSkeleton rows={5} columns={columns.length} />
    ) : (
      <Table columns={columns} data={filteredProcedure} />
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

