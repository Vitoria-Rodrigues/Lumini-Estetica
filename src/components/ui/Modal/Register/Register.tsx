import { useState, useEffect } from "react";
import type { RegisterType, RegisterDataMap } from "@/form-config/types";
import { REGISTER_FIELDS, TITLE_MAP } from "@/form-config/fields";
import classes from "./Register.module.css";

interface RegisterProps<T extends RegisterType>{
    isOpen: boolean;
    onClose: () => void;
    type: T;
    onSubmit: (data: RegisterDataMap[T]) => void;
    isSubmitting?: boolean;
    dynamicOptions?: Partial<Record<keyof RegisterDataMap[T], string[]>>;
    initialValues?: Partial<RegisterDataMap[T]> | null;
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
}, [isOpen, type]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if(isSubmitting) return;

        const { name, value, type: inputType } = e.target;
 
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

                    const selectOptions = (dynamicOptions?.[field.name as keyof RegisterDataMap[T]])
                    || field.option || [];

                    return (
                        <div key={fieldName} className={classes.form_group}>
                            <label htmlFor={fieldName}>{field.label}</label>

                            {field.type === "select" ? (
                                <select id={fieldName}
                                name={fieldName} value={value}
                                required={field.required} onChange={handleChange}
                                disabled={isSubmitting}>
                                    <option value="">Selecione uma opção..</option>
                                    {selectOptions.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select> 
                            ) : (
                                <input id={fieldName}
                                name={fieldName}
                                type={field.type}
                                value={value}
                                placeholder={field.placeholder || ""}
                                required={field.required}
                                onChange={handleChange}
                                disabled={isSubmitting}/>
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
