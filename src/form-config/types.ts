export interface CostumerData{
    name: string;
    email: string;
    phone: string;
    birthDate: string;
}

export interface EmployeeData{
    name: string;
    cpf: string;
    phone?: string;
    role: string;
    specialty: string;
    salary?: number;
    email: string;
    password: string;
}

export interface ProcedureData{
    name: string;
    description: string;
    price: number;
    duration: string;
    category: string;
}

export interface RegisterDataMap{
    costumer: CostumerData;
    employee: EmployeeData;
    procedure: ProcedureData;
}

export type RegisterType = keyof RegisterDataMap;

export interface FieldConfig<T extends RegisterType> {
    name: keyof RegisterDataMap[T];
    label: string;
    type: "text" | "number" | "email" | "tel" | "select" | "date";
    placeholder?: string;
    required?: boolean;
    option?: string[];
}



