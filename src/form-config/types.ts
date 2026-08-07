export interface CustomerData{
    name: string;
    cpf: string;
    phone: string;
    birthDate: string;
}

export interface EmployeeData{
    user_id?: string;
    name: string;
    cpf: string;
    phone?: string;
    role: string;
    specialty: string;
    salary?: number;
    email: string;
    password: string;
    app_role: string;
}

export interface ProcedureData{
    name: string;
    description: string;
    price: number;
    duration: string;
    category: string;
}

export interface SessionData {
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

export interface FieldConfig<T extends RegisterType> {
    name: keyof RegisterDataMap[T];
    label: string;
    type: "text" | "number" | "email" | "tel" | "select" | "date" | "password";
    placeholder?: string;
    maxLength?: number;
    required?: boolean;
    disabled?: boolean; 
    option?: string[] | { label: string; value: string; [key: string]: unknown }[];
}



