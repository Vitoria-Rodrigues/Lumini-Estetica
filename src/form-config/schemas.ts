import { z, ZodType } from "zod";
import type { RegisterDataMap, RegisterType } from "./types";

export const customerSchema: ZodType<RegisterDataMap["customer"]> = z.object({
    name: z.string().min(3, "Nome deve ter no minimo 3 caracteres."),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato 000.000.000-00."),
    phone: z.string().min(10, "Telefone invalido"),
    birthdate: z.string().optional(),
});

export const employeeSchema: ZodType<RegisterDataMap["employee"]> = z.object({
    name: z.string().min(2, "Nome é obrigatório."),
    cpf: z.string().min(11, "CPF deve conter 11 digítos."),
    phone: z.string().optional(),
    role: z.string().min(1, "Função é obrigatória"),
    specialtyId: z.string().optional(),
    specialty: z.string().optional(),
    salary: z.coerce.number().optional(),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    app_role: z.string().optional(),
    user_id: z.string().optional(),
    funcionario_especialidade: z.array(z.object({
        id_especialidade: z.number(),
        especialidade: z.object({
        id_especialidade: z.number(),
        nome: z.string(),
    }).nullable().optional(),
  })).optional(),
});

export const procedureSchema: ZodType<RegisterDataMap["procedure"]> = z.object({
    name: z.string().min(2, "Nome do procedimento é obrigatório."),
    description: z.string().min(5, "Descrição deve ter no minimo 5 caracteres."),
    price: z.coerce.number().positive("Preço deve ser maior que zero."),
    duration: z.string().min(1, "Duração é obrigatória."),
    category: z.string().min(1, "Selecione uma categoria."),
    specialtyId: z.string().min(1, "Selecione uma especialidade."),
});

export const sessionSchema: ZodType<RegisterDataMap["session"]> = z.object({
  customerId: z.string().min(1, "CPF do cliente é obrigatório e deve corresponder a um cliente cadastrado."),
  customerCpf: z.string().min(11, "Informe o CPF completo do cliente."),
  customerName: z.string().optional(),
  specialtyId: z.string().min(1, "Selecione uma especialidade."),
  employeeId: z.string().min(1, "Selecione o profissional."),
  procedureIds: z.array(z.string()).min(1, "Selecione ao menos um procedimento."),
  date: z.string().min(1, "Data da consulta é obrigatória."),
  time: z.string().min(1, "Horário é obrigatório."),
  notes: z.string().optional(),
  price: z.number(),
});

export const schemasMap: { [K in RegisterType]: ZodType<RegisterDataMap[K]> } = {
  customer: customerSchema,
  employee: employeeSchema,
  procedure: procedureSchema,
  session: sessionSchema,
};