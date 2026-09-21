import { useState, useEffect } from "react";

import type { RegisterType, RegisterDataMap } from "@/form-config/types";
import { REGISTER_FIELDS, TITLE_MAP } from "@/form-config/fields";

import { formatCPF, formatPhone } from "@/utils/formatters";

import CustomSelect from "../../CustomSelect/CustomSelect";

import classes from "./Register.module.css";

interface RegisterProps<T extends RegisterType>{
    isOpen: boolean;
    onClose: () => void;
    type: T;
    onSubmit: (data: RegisterDataMap[T]) => void;
    isSubmitting?: boolean;
    dynamicOptions?: Partial<Record<keyof RegisterDataMap[T], 
        string[] | 
        { label: string; value: string; [key: string]: unknown }[] |
        ((selectedId: string) => { label: string; value: string; [key: string]: unknown }[])
    >>;
    initialValues?: Partial<RegisterDataMap[T]> | null;
}

function isSessionData(
    type: RegisterType,
    data: unknown
): data is Partial<RegisterDataMap["session"]> {
    return type === "session" && data !== null;
}

const Register = <T extends RegisterType>({isOpen, 
    onClose, 
    type, 
    onSubmit, 
    isSubmitting = false, 
    dynamicOptions,
    initialValues}: RegisterProps<T>) => {

    const [formData, setFormData] = useState<Partial<RegisterDataMap[T]>>({});

    useEffect(() => {
        if (isOpen) {
            if (initialValues) {
                setFormData(initialValues);
            } else {
                const initialData = {} as Partial<RegisterDataMap[T]>;
                REGISTER_FIELDS[type].forEach((field) => {
                    initialData[field.name] = "" as unknown as RegisterDataMap[T][keyof RegisterDataMap[T]];
                });
                setFormData(initialData);
            }
        }
    }, [isOpen, type, initialValues]);

    const selectedSpecialtyId = isSessionData(type, formData)
        ? String((formData as Partial<RegisterDataMap["session"]>).specialtyId || "")
        : "";

    const selectedProcedureIds = isSessionData(type, formData)
        ? (formData as Partial<RegisterDataMap["session"]>).procedureIds
        : undefined;

    useEffect(() => {
        const rawData: unknown = formData;
        if (isSessionData(type, rawData)) {
            const selectedProcedures = rawData.procedureIds;
            const rawOpts = dynamicOptions as Record<string, unknown> | undefined;
            const rawProcOpts = rawOpts?.procedureIds;
            const currentSpecialtyId = rawData.specialtyId ? String(rawData.specialtyId) : "";
            const resolvedProcOpts = typeof rawProcOpts === "function"
                ? (rawProcOpts as (id: string) => unknown)(currentSpecialtyId)
                : rawProcOpts;

            if (selectedProcedures && Array.isArray(selectedProcedures) && Array.isArray(resolvedProcOpts)) {
                const total = selectedProcedures.reduce((sum, id) => {
                    const proc = (resolvedProcOpts as { value: string; price?: number | string }[]).find(p => p.value === id);
                    return sum + Number(proc?.price || 0);
                }, 0);

                if (rawData.price !== total) {
                    setFormData(prev => ({
                        ...prev,
                        price: total
                    } as unknown as Partial<RegisterDataMap[T]>));
                }
            } else {
                if (rawData.price !== 0) {
                    setFormData(prev => ({
                        ...prev,
                        price: 0
                    } as unknown as Partial<RegisterDataMap[T]>));
                }
            }
        }
    }, [selectedSpecialtyId, selectedProcedureIds, dynamicOptions, type]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (isSubmitting) return;

        const { name } = e.target;
        let value = e.target.value;

        if (name === "cpf") {
            value = formatCPF(value);
        } else if (name === "phone") {
            value = formatPhone(value);
        }

        if (name === "price") {
            value = value.replace(",", ".");
            value = value.replace(/[^0-9.]/g, "");
            const parts = value.split(".");
            if (parts.length > 2) {
                value = `${parts[0]}.${parts.slice(1).join("")}`;
            }
        }

        if (name === "name") {
            value = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
        }

        if (name === "specialtyId") {
            setFormData(prev => ({
                ...prev,
                specialtyId: value,
                procedureIds: [],
                employeeId: "",
            } as unknown as Partial<RegisterDataMap[T]>));
            return;
        }

        if (name === "customerCpf") {
            const formattedCpf = formatCPF(value);
            const rawCustomerOpts = (dynamicOptions as Record<string, unknown>)?.customerCpf;
            const resolvedCustomerOpts = typeof rawCustomerOpts === "function"
                ? (rawCustomerOpts as (id: string) => unknown)("")
                : rawCustomerOpts;
            const cleanInputCpf = formattedCpf.replace(/\D/g, "");

            let foundCustomer: { value: string; label: string; name?: string; cpf?: string } | undefined;
            if (Array.isArray(resolvedCustomerOpts) && cleanInputCpf.length > 0) {
                foundCustomer = (resolvedCustomerOpts as { value: string; label: string; name?: string; cpf?: string }[]).find((opt) => {
                    const rawOptCpf = (opt.cpf || opt.label || "").replace(/\D/g, "");
                    return rawOptCpf === cleanInputCpf || rawOptCpf.includes(cleanInputCpf);
                });
            }

            setFormData(prev => ({
                ...prev,
                customerCpf: formattedCpf,
                customerId: foundCustomer ? foundCustomer.value : "",
                customerName: foundCustomer
                    ? (foundCustomer.name || foundCustomer.label.split("-")[0].trim())
                    : (cleanInputCpf.length === 11 ? "Cliente não encontrado" : ""),
            } as unknown as Partial<RegisterDataMap[T]>));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        onSubmit(formData as RegisterDataMap[T]);
    };

    return (
        <div className={classes.overlay} onClick={isSubmitting ? undefined : onClose}>
            <div className={classes.modal_content} onClick={(e) => e.stopPropagation()}>
                <header className={classes.modal_header}>
                    <h2>{initialValues ? "Editar" : "Cadastrar"} {TITLE_MAP[type]}</h2>
                </header>
                <form onSubmit={handleSubmit} className={classes.form}>
                    <div className={classes.fields_container}>
                        {REGISTER_FIELDS[type].map((field) => {
                            const fieldName = String(field.name);
                            const rawValue = formData[field.name];
                            const value = String(rawValue ?? "");

                            const dynamicOpts = dynamicOptions?.[field.name as keyof RegisterDataMap[T]];
                            const currentSpecialtyId = String((formData as Record<string, unknown>)?.specialtyId || "");
                            const resolvedOpts = typeof dynamicOpts === "function"
                                ? dynamicOpts(currentSpecialtyId)
                                : dynamicOpts;

                            const rawOptions = resolvedOpts !== undefined
                                ? resolvedOpts
                                : (field.option && field.option.length > 0 ? field.option : []);

                            const selectOptions = (rawOptions as (string | { label: string; value: string })[]).map(opt =>
                                typeof opt === "string" ? { label: opt, value: opt } : { label: opt.label, value: opt.value }
                            );

                            return (
                                <div key={fieldName} className={classes.form_group}>
                                    <label htmlFor={fieldName}>{field.label}</label>

                                    {field.type === "select" ? (
                                        fieldName === "procedureIds" ? (
                                            <CustomSelect
                                                options={selectOptions}
                                                selectedValues={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]) : []}
                                                onChange={(values) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        [field.name]: values
                                                    }));
                                                }}
                                                placeholder="Selecione os procedimentos..."
                                            />
                                        ) : (
                                            <select
                                                id={fieldName}
                                                name={fieldName}
                                                value={value}
                                                required={field.required}
                                                onChange={handleChange}
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Selecione uma opção..</option>
                                                {selectOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        )
                                    ) : (
                                        <input
                                            id={fieldName}
                                            name={fieldName}
                                            type={field.type}
                                            value={value}
                                            placeholder={field.placeholder || ""}
                                            required={field.required}
                                            onChange={handleChange}
                                            maxLength={field.maxLength}
                                            disabled={field.disabled || isSubmitting}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <footer className={classes.modal_footer}>
                        <button
                            type="button"
                            className={classes.btn_cancel}
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={classes.btn_submit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Salvando" : "Salvar"}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default Register;