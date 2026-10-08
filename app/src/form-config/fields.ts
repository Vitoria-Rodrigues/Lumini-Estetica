import type { FieldConfig, RegisterType } from "./types";

export const REGISTER_FIELDS: { [K in RegisterType]: FieldConfig<K>[] } = {
    customer: [
        { name: "name", label: "Nome:", type: "text", required: true },
        { name: "cpf", label: "CPF:", type: "text", placeholder: "111.111.111-11", required: true, maxLength: 14},
        { name: "phone", label: "Telefone:", type: "tel", placeholder: "(11)91111-1111", required: true, maxLength: 14 },
        { name: "birthdate", label: "Data de Nascimento:", type: "date" },
    ],
    employee: [
        { name: "name", label: "Nome:", type: "text", required: true },
        { name: "cpf", label: "CPF:", type: "text", placeholder: "111.111.111-11",required: true, maxLength: 14 },
        { name: "phone", label: "Telefone:", type: "tel", placeholder: "(11)91111-1111", required: true, maxLength: 14 },
        { name: "role", label: "Função:", type: "select", required: true, option: ["esteticista", "recepcionista", "massagista", "depiladora"]},
        { name: "specialty", label: "Especialidade:", type: "text", required: false },
        { name: "salary", label: "Salário:", type: "text", required: true },
        { name: "email", label: "Email:", type: "email", placeholder: "email@exemple.com", required: true },
        { name: "password", label: "Senha:", type: "password", required: true },
    ],

    procedure: [
        { name: "name", label: "Nome do Procedimento:", type: "text", required: true },
        { name: "description", label: "Descrição:", type: "text", placeholder: "Explique brevemente sobre o procedimento", required: true },
        { name: "category", label: "Categoria:", type: "select", required: true},
        { name: "specialtyId", label: "Especialidade:", type: "select", required: true},
        { name: "employeeId", label: "Funcionário Responsável / Habilitado:", type: "select" },
        { name: "price", label: "Preço:", type: "text", required: true },
        { name: "duration", label: "Duração:", type: "text", placeholder: "Ex: 45 min", required: true },
    ],

    session: [
        { name: "customerCpf", label: "CPF do Cliente:", type: "text", placeholder: "000.000.000-00", maxLength: 14, required: true },
        { name: "customerName", label: "Nome do Cliente:", type: "text", disabled: true },
        { name: "specialtyId", label: "Especialidade:", type: "select", required: true },
        { name: "employeeId", label: "Funcionário:", type: "select", required: true },
        { name: "procedureIds", label: "Procedimentos:", type: "select", required: true },
        { name: "date", label: "Data da Consulta:", type: "date", required: true },
        { name: "time", label: "Horário:", type: "time", required: true },
        { name: "notes", label: "Observações:", type: "text" },
        { name: "price", label: "Valor Total (R$):", type: "number", disabled: true },
    ],
};

export const TITLE_MAP: Record<RegisterType, string> = {
    customer: "Cliente",
    employee: "Funcionário",
    procedure: "Procedimento",
    session: "Consulta"
};
