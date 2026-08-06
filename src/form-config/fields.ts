import type { FieldConfig, RegisterType } from "./types";

export const REGISTER_FIELDS: { [K in RegisterType]: FieldConfig<K>[] } = {
    customer: [
        { name: "name", label: "Nome:", type: "text", required: true },
        { name: "cpf", label: "CPF:", type: "text", placeholder: "111.111.111-11", required: true, maxLength: 14},
        { name: "phone", label: "Telefone:", type: "tel", placeholder: "(11)91111-1111", required: true, maxLength: 14 },
        { name: "birthDate", label: "Data de Nascimento:", type: "date" },
    ],
    employee: [
        { name: "name", label: "Nome:", type: "text", required: true },
        { name: "cpf", label: "CPF:", type: "text", placeholder: "111.111.111-11",required: true, maxLength: 14 },
        { name: "phone", label: "Telefone:", type: "tel", placeholder: "(11)91111-1111", required: true, maxLength: 14 },
        { name: "role", label: "Função:", type: "select", required: true, option: ["esteticista", "recepcionista", "massagista", "depiladora", "admin"]},
        { name: "specialty", label: "Especialidade:", type: "text", required: true },
        { name: "salary", label: "Salário:", type: "number", required: true },
        { name: "email", label: "Email:", type: "email", placeholder: "email@exemple.com", required: true },
        { name: "password", label: "Senha:", type: "password", required: true },
    ],

    procedure: [
        { name: "name", label: "Nome do Procedimento:", type: "text", required: true },
        { name: "description", label: "Descrição:", type: "text", placeholder: "Explique brevemente sobre o procedimento", required: true },
        { name: "price", label: "Preço:", type: "number", required: true },
        { name: "duration", label: "Duração:", type: "text", required: true },
        { name: "category", label: "Categoria:", type: "select", required: true, option:["corporal", "facial"]},
    ],

    session: [
        { name: "customerId", label: "Cliente:", type: "select", required: true },
        { name: "employeeId", label: "Funcionário:", type: "select", required: true },
        { name: "procedureIds", label: "Procedimentos:", type: "select", required: true },
        { name: "date", label: "Data da Consulta:", type: "date", required: true },
        { name: "time", label: "Horário:", type: "text", placeholder: "Ex: 14:00", required: true },
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

