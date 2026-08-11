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
    dynamicOptions?: Partial<Record<keyof RegisterDataMap[T], string[] | { label: string; value: string; [key: string]: unknown }[]>>;
    initialValues?: Partial<RegisterDataMap[T]> | null;
}
function isSessionData(
    type: RegisterType,
    data: unknown
): data is Partial<RegisterDataMap["session"]> {
    return type === "session" && data !== null;
}

function isSessionOptions(
    type: RegisterType,
    options: unknown
): options is Partial<Record<keyof RegisterDataMap["session"], { value: string; price: number }[]>> {
    return type === "session" && options !== undefined;
}

const Register = <T extends RegisterType> ({isOpen, 
    onClose, 
    type, 
    onSubmit, 
    isSubmitting = false, 
    dynamicOptions,
    initialValues}: RegisterProps<T>) => {

const [formData, setFormaData] = useState<Partial<RegisterDataMap[T]>>({});

useEffect(() => {
    if(isOpen) {
        if(initialValues){
            setFormaData(initialValues);
        }
        else{
            const initialData = {} as Partial<RegisterDataMap[T]>;
    
            REGISTER_FIELDS[type].forEach((field) => {
                initialData[field.name] = "" as unknown as RegisterDataMap[T][keyof RegisterDataMap[T]];
            });
    
            setFormaData(initialData);
        }
    }
}, [isOpen, type, initialValues]);

useEffect(() => {
    const rawData: unknown = formData;
    const rawOpts: unknown = dynamicOptions;
    if (isSessionData(type, rawData) && isSessionOptions(type, rawOpts)) {
        const selectedProcedures = rawData.procedureIds;
        const availableProcedures = rawOpts.procedureIds;

        if (selectedProcedures && Array.isArray(selectedProcedures) && availableProcedures) {
            const total = selectedProcedures.reduce((sum, id) => {
                const proc = availableProcedures.find(p => p.value === id);
                return sum + (proc?.price || 0);
            }, 0);

            if (rawData.price !== total) {
                setFormaData(prev => ({
                    ...prev,
                    price: total
                } as unknown as Partial<RegisterDataMap[T]>));
            }
        } else {
            if (rawData.price !== 0) {
                setFormaData(prev => ({
                    ...prev,
                    price: 0
                } as unknown as Partial<RegisterDataMap[T]>));
            }
        }
    }
}, [formData, dynamicOptions, type]);


    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if(isSubmitting) return;

        let { name, value, type: inputType } = e.target;
 
        if (name === "cpf") {
        value = formatCPF(value);

        } else if (name === "phone"){
            value = formatPhone(value);
        } 

        if(name === "price") {
            value = value.replace(",", ".");
            value = value.replace(/[^0-9.]/g,"");
            const parts = value.split(".");
            if(parts.length > 2){
                value = `${parts[0]}.${parts.slice(1).join("")}`;
            }
        }

        if (name === "name") {
        value = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
        }

        setFormaData((prev) => ({
            ...prev,
            [name as keyof RegisterDataMap[T]]: inputType === "number" 
            ? (value === "" ? "" : Number(value)) : value,
        } as unknown as Partial<RegisterDataMap[T]>));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(isSubmitting) return;

        onSubmit(formData as RegisterDataMap[T]);
    };


    return (
    <div className={classes.overlay} onClick={isSubmitting ? undefined: onClose}>
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
                    const rawOptions = dynamicOpts !== undefined
                        ? dynamicOpts
                        : (field.option && field.option.length > 0 ? field.option : []);

                    const selectOptions = rawOptions.map(opt =>
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
                                    setFormaData((prev) => ({
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
                                <input id={fieldName}
                                name={fieldName}
                                type={field.type}
                                value={value}
                                placeholder={field.placeholder || ""}
                                required={field.required}
                                onChange={handleChange}
                                maxLength={field.maxLength}
                                disabled={field.disabled || isSubmitting}/>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <footer className={classes.modal_footer}>
                <button type="button"
                className={classes.btn_cancel} onClick={onClose} disabled={isSubmitting}>
                    Cancelar
                </button>
                <button type="submit"
                className={classes.btn_submit} disabled={isSubmitting}>
                    {isSubmitting ? "Salvando" : "Salvar"}
                </button>
            </footer>
        </form>
      </div>
    </div>
  )
}

export default Register
