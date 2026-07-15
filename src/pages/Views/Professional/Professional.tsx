import { useState } from "react";

//Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table, Register } from "@/components/ui";

//Services
import { employeeService } from "@/services/employeeService";

//Types
import type { EmployeeData } from "@/form-config/types";

//Icon
import { RiAddFill } from "react-icons/ri";

const Professional = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (data: EmployeeData) => {
    try{
      setIsSubmitting(true);
      await employeeService.createEmployee(data);
      alert("Profissional cadastrar com sucesso!");
      setIsModalOpen(false);

    } catch (error) {
      console.error("Erro ao cadastrar profissional:", error);
      const errorMessage = error instanceof Error ? error.message : "Não foi possível cadastrar.";
      alert(`Erro: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ViewLayout
      title="Funcionário"
      actionButton={
        <Button 
          title={"Funcionário"} 
          icon={RiAddFill} 
          padding=".6rem" 
          width="15%"
          onClick={() => setIsModalOpen(true)}
        />
      }
      searchComponent={<Search placeholder="Digite o nome do profissional.." />}
    >
      <Table />

      <Register
        type="employee"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegisterSubmit}
        isSubmitting={isSubmitting}
      />
    </ViewLayout>
  );
};

export default Professional;
