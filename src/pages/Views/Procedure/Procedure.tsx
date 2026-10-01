import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

//Service
import type { ProcedureData } from "@/form-config/types";
import { procedureService, type ProcedureDbRow } from "@/services/procedureService";
import { categoryService } from "@/services/categoryService";
import { specialtyService } from "@/services/specialtyService";
import { employeeService } from "@/services/employeeService";

//Context
import { useToaster } from "@/contexts/ToasterContext/useToaster";
import { useAuth } from "@/contexts/AuthContext/useAuth";

//Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, IconButton, Table, Register, TableSkeleton, DescriptionPopover } from "@/components/ui";
import { ConfirmModal } from "@/components/ui";
import type { Column } from "@/components/ui/Table/Table";

// Contants
import { QUERY_KEYS } from "@/constants/queryKeys";

//icon
import { RiAddFill } from "react-icons/ri";
import { BsBrushFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

const Procedure = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToaster();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProcedure, setEditingProcedure] = useState<ProcedureDbRow | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [procedureToDelete, setProcedureToDelete] = useState<string | null>(null);

  const canModify = user?.role === "admin";

  const { data: procedures = [], isLoading } = useQuery<ProcedureDbRow[]>({
    queryKey: QUERY_KEYS.PROCEDURES.ALL,
    queryFn: procedureService.listProcedures,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.listCategories,
    staleTime: 1000 * 60 * 5,
  });

  const { data: specialties = [] } = useQuery({
    queryKey: QUERY_KEYS.SPECIALTIES.ALL,
    queryFn: specialtyService.listSpecialties,
    staleTime: 1000 * 60 * 5,
  });

  const { data: employees = [] } = useQuery({
    queryKey: QUERY_KEYS.EMPLOYEES.ALL,
    queryFn: employeeService.listEmployees,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
  mutationFn: (id: string) => procedureService.deleteProcedure(id),
  onSuccess: () => {
    addToast("Procedimento excluído com sucesso!", "success");
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROCEDURES.ALL });
    setIsConfirmOpen(false);
    setProcedureToDelete(null);
  },
  onError: (error) => {
    console.error("Erro ao excluir procedimento:", error);
    addToast("Erro ao excluir procedimento", "error");
    setIsConfirmOpen(false);
    setProcedureToDelete(null);
  },
});

const saveMutation = useMutation({
  mutationFn: async ({ id, data }: { id?: string; data: ProcedureData }) => {
    if (id) {
      return procedureService.updateProcedure(id, data);
    }
    return procedureService.createProcedure(data);
  },
  onSuccess: (_, variables) => {
    addToast(
      variables.id
        ? "Procedimento atualizado com sucesso!"
        : "Procedimento cadastrado com sucesso!",
      "success"
    );
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROCEDURES.ALL });
    setIsModalOpen(false);
    setEditingProcedure(null);
  },
  onError: (error) => {
    console.error("Erro ao salvar procedimento:", error);
    addToast("Erro ao salvar o procedimento.", "error");
  },
});

  const filteredProcedure = useMemo(() => {
    if (!searchQuery.trim()) return procedures;
    const term = searchQuery.trim().toLowerCase();
    return procedures.filter((p) => p.name?.toLowerCase().includes(term));
  }, [procedures, searchQuery]);

  const handleEditClick = (proc: ProcedureDbRow) => {
    setEditingProcedure(proc);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (idProcedure?: string) => {
    if (!idProcedure) {
      addToast("Erro: ID do procedimento não encontrado", "error");
      return;
    }
    setProcedureToDelete(idProcedure);
    setIsConfirmOpen(true);
  };;

  const handleConfirmDelete = () => {
    if (procedureToDelete) {
      deleteMutation.mutate(procedureToDelete);
    }
  };

  const handleRegisterSubmit = (data: ProcedureData) => {
    saveMutation.mutate({
      id: editingProcedure?.id_procedimento,
      data,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProcedure(null);
  };

  const procedureDynamicOptions = {
    category: categories.map((c) => ({
      label: c.descricao,
      value: String(c.id_category),
    })),
    specialtyId: specialties.map((s) => ({
      label: s.nome,
      value: String(s.id_especialidade),
    })),
    employeeId: (selectedSpecialtyId: string) =>
      employees
        .filter(
          (emp) =>
            !selectedSpecialtyId ||
            emp.especialidades?.some((esp) => String(esp.id_especialidade) === selectedSpecialtyId)
        )
        .map((emp) => ({
          label: emp.name,
          value: String(emp.id_funcionario),
        })),
  };

  const baseColumns: Column<ProcedureDbRow>[] = [
    { 
      label: "Nome", 
      key: "name" 
    },
    { 
      label: "Descrição", 
      key: "description", 
      render: (item) => <DescriptionPopover text={item.description} maxLength={15}/> 
    },
    { 
      label: "Preço", 
      key: "price", 
      render: (proc) => `R$ ${Number(proc.price).toFixed(2).replace(".", ",")}`
    },
    { label: "Duração", 
      key: "duration" 
    },
    { 
      label: "Categoria", 
      key: "category", 
      render: (proc) => {
        const cat = categories.find(c => String(c.id_category) === String(proc.category));
        return cat ? cat.descricao : (proc.category || "");
      }
    },
    {
      label: "Especialidade",
      key: "id_especialidade" as keyof ProcedureDbRow,
      render: (proc) => {
        const spec = specialties.find(s => s.id_especialidade === proc.id_especialidade);
        return spec ? spec.nome : "Não informado";
      }
    },
];
    const columns: Column<ProcedureDbRow>[] = canModify
  ? [
      ...baseColumns,
      {
        label: "Ações",
        key: "actions" as keyof ProcedureDbRow | "actions", 
        render: (proc: ProcedureDbRow) => (
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <IconButton 
              variant="edit"
              title="Editar Cliente"
              icon={<BsBrushFill size={16} />}
              onClick={() => handleEditClick(proc)}
              />
              <IconButton
              variant="delete"
              title="Excluir Cliente"
              icon={<FaTrashAlt size={16} />}
              onClick={() => handleDeleteClick(proc.id_procedimento)}
              />
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

    <ConfirmModal
     isOpen={isConfirmOpen}
     title="Excluir Procedimento"
     description="Tem certeza que deseja excluir este procedimento?"
     onConfirm={handleConfirmDelete}
     onClose={() => setIsConfirmOpen(false)}
    />

      <Register 
        type="procedure"
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSubmit={handleRegisterSubmit}
        isSubmitting={saveMutation.isPending} 
        dynamicOptions={procedureDynamicOptions}
        initialValues={
          editingProcedure
            ? {
                ...editingProcedure,
                specialtyId: editingProcedure.id_especialidade ? String(editingProcedure.id_especialidade) : "",
                category: String(editingProcedure.category ?? ""),
              }
            : null
        }
      />
    </ViewLayout>
  );
};

export default Procedure;

