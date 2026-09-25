export interface CustomerData{
    name: string;
    cpf: string;
    phone: string;
    birthdate?: string;
    birthDate?: string;
}

export interface EmployeeData{
    user_id?: string;
    name: string;
    cpf: string;
    phone?: string;
    role: string;
    specialtyId?: string;
    specialty?: string;
    salary?: number;
    email: string;
    password: string;
    app_role?: string;
    funcionario_especialidade?: {
        id_especialidade: number;
        especialidade?: {
            id_especialidade: number;
            nome: string;
        } | null;
    }[];
}

export interface ProcedureData{
    name: string;
    description: string;
    price: number;
    duration: string;
    category: string;
    specialtyId: string;
    employeeId?: string; 
}

export interface SessionData {
    customerCpf?: string;
    customerName?: string;
    specialtyId: string;
    customerId: string;
    employeeId: string;
    procedureIds: string[];
    date: string;
    time: string;
    notes?: string;
    price: number;
}

export interface RegisterDataMap{
    customer: CustomerData;
    employee: EmployeeData;
    procedure: ProcedureData;
    session: SessionData;
}

export type RegisterType = keyof RegisterDataMap;

export interface SelectOption {
    label: string;
    value: string;
    price?: number;
    cpf?: string;
    name?: string;
}

export type DynamicOptionResolver = SelectOption[] | ((dependencyId: string) => SelectOption[]);

export type DynamicOptionsConfig<T extends RegisterType = RegisterType> = Partial<{
  [K in keyof RegisterDataMap[T]]: DynamicOptionResolver;
}> & Record<string, DynamicOptionResolver | undefined>;

export interface FieldConfig<T extends RegisterType> {
  name: keyof RegisterDataMap[T];
  label: string;
  type: "text" | "number" | "email" | "tel" | "select" | "date" | "password" | "time";
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  option?: string[] | SelectOption[];
}


