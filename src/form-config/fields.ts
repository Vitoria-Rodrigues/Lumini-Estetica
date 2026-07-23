import type { FieldConfig, RegisterType } from "./types";

export const REGISTER_FIELDS: { [K in RegisterType]: FieldConfig<K>[] } = {
    customer: [
        { name: "name", label: "Nome:", type: "text", required: true },
        { name: "cpf", label: "CPF:", type: "text", placeholder: "111.111.111-11", required: true, maxLength: 14},
        { name: "phone", label: "Telefone:", type: "tel", required: true, maxLength: 14 },
        { name: "birthDate", label: "Date de Nascimento:", type: "date" },
    ],
    employee: [
        { name: "name", label: "Nome:", type: "text", required: true },
        { name: "cpf", label: "CPF:", type: "text", placeholder: "111.111.111-11",required: true, maxLength: 14 },
        { name: "phone", label: "Telefone:", type: "tel", placeholder: "(11)91111-11110", required: true, maxLength: 14 },
        { name: "role", label: "Função:", type: "select", required: true, option: ["esteticista", "recepcionista", "massagista", "depiladora", "admin"]},
        { name: "specialty", label: "Especialidade:", type: "text", required: true },
        { name: "salary", label: "Salario:", type: "number", required: true },
        { name: "email", label: "Email:", type: "email", placeholder: "email@exemple.com", required: true },
        { name: "password", label: "Senha:", type: "password", required: true },
    ],

    procedure: [
        { name: "name", label: "Nome do Procedimento:", type: "text", required: true },
        { name: "description", label: "Descrição:", type: "text", placeholder: "Explique brevemente sobre o procedimento", required: true },
        { name: "price", label: "Preço:", type: "number", required: true },
        { name: "duration", label: "Duração:", type: "text", required: true },
        { name: "category", label: "Categoria:", type: "select", required: true },
    ],
};

export const TITLE_MAP: Record<RegisterType, String> = {
    customer: "Cliente",
    employee: "Funcionário",
    procedure: "Procedimento",
};

