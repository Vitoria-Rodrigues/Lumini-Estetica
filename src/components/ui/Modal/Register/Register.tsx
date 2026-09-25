import React, { useState, useEffect, useCallback } from "react";

import type {
  RegisterType,
  RegisterDataMap,
  SelectOption,
  DynamicOptionsConfig,
  DynamicOptionResolver,
  FieldConfig,
} from "@/form-config/types";
import { REGISTER_FIELDS, TITLE_MAP } from "@/form-config/fields";
import { schemasMap } from "@/form-config/schemas";
import { formatCPF, formatPhone } from "@/utils/formatters";

import CustomSelect from "../../CustomSelect/CustomSelect";
import classes from "./Register.module.css";

interface RegisterProps<T extends RegisterType> {
  isOpen: boolean;
  onClose: () => void;
  type: T;
  onSubmit: (data: RegisterDataMap[T]) => void;
  isSubmitting?: boolean;
  dynamicOptions?: DynamicOptionsConfig<T>;
  initialValues?: Partial<RegisterDataMap[T]> | null;
}

function isSelectOptionArray(options: unknown[]): options is SelectOption[] {
  return options.every(
    (opt) => typeof opt === "object" && opt !== null && "label" in opt && "value" in opt
  );
}

function calculateTotalPrice(
  procedureIds: string[],
  options: SelectOption[]
): number {
  return procedureIds.reduce((sum, id) => {
    const foundProc = options.find((p) => String(p.value) === String(id));
    if (!foundProc || foundProc.price === undefined || foundProc.price === null) return sum;
    const numericPrice = typeof foundProc.price === "number" ? foundProc.price : Number(foundProc.price);
    return sum + (isNaN(numericPrice) ? 0 : numericPrice);
  }, 0);
}

const Register = <T extends RegisterType>({
  isOpen,
  onClose,
  type,
  onSubmit,
  isSubmitting = false,
  dynamicOptions,
  initialValues,
}: RegisterProps<T>) => {
  const [formData, setFormData] = useState<Partial<RegisterDataMap[T]>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const rawDynamicOptions = dynamicOptions as Record<string, DynamicOptionResolver | undefined> | undefined;

  useEffect(() => {
    if (isOpen) {
      setFieldErrors({});
      if (initialValues) {
        setFormData({ ...initialValues });
      } else {
        const initialData: Partial<RegisterDataMap[T]> = {};
        const fields = REGISTER_FIELDS[type] as FieldConfig<T>[];
        fields.forEach((field) => {
          if (field.name === "procedureIds") {
            (initialData[field.name] as unknown) = [];
          } else if (field.name === "price" && type === "session") {
            (initialData[field.name] as unknown) = 0;
          } else {
            (initialData[field.name] as unknown) = "";
          }
        });
        setFormData(initialData);
      }
    } else {
      setFormData({});
      setFieldErrors({});
    }
  }, [isOpen, type, initialValues]);

  const runValidation = useCallback((): { isValid: boolean; data?: RegisterDataMap[T] } => {
    const schema = schemasMap[type];
    if (!schema) return { isValid: true, data: formData as RegisterDataMap[T] };

    const result = schema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        let fieldKey = String(issue.path[0] ?? "");
        if (fieldKey === "customerId" && type === "session") {
          fieldKey = "customerCpf";
        }
        if (fieldKey) {
          errors[fieldKey] = issue.message;
        }
      });
      setFieldErrors(errors);
      return { isValid: false };
    }

    setFieldErrors({});
    return { isValid: true, data: result.data as RegisterDataMap[T] };
  }, [formData, type]);

  if (!isOpen) return null;

  const updateFieldValue = <K extends keyof RegisterDataMap[T]>(
    fieldName: K,
    value: RegisterDataMap[T][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    const fieldKey = String(fieldName);
    if (fieldErrors[fieldKey]) {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldKey]: "",
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldName: keyof RegisterDataMap[T]
  ) => {
    if (isSubmitting) return;

    let value = e.target.value;

    if (fieldName === "cpf") {
      value = formatCPF(value);
    } else if (fieldName === "phone") {
      value = formatPhone(value);
    } else if (fieldName === "name") {
      value = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    } else if (fieldName === "price") {
      value = value.replace(",", ".").replace(/[^0-9.]/g, "");
      const parts = value.split(".");
      if (parts.length > 2) {
        value = `${parts[0]}.${parts.slice(1).join("")}`;
      }
    }

    if (fieldName === "specialtyId" && type === "session") {
      setFormData((prev) => ({
        ...prev,
        specialtyId: value,
        procedureIds: [],
        employeeId: "",
        price: 0,
      } as unknown as Partial<RegisterDataMap[T]>));

      setFieldErrors((prev) => ({
        ...prev,
        specialtyId: "",
        procedureIds: "",
        employeeId: "",
      }));
      return;
    }

    if (fieldName === "customerCpf") {
      const formattedCpf = formatCPF(value);
      const rawCustomerOpts = rawDynamicOptions?.customerCpf;
      const resolvedCustomerOpts = typeof rawCustomerOpts === "function" ? rawCustomerOpts("") : rawCustomerOpts;

      const cleanInputCpf = formattedCpf.replace(/\D/g, "");
      let foundCustomer: SelectOption | undefined;

      if (Array.isArray(resolvedCustomerOpts) && cleanInputCpf.length === 11) {
        foundCustomer = resolvedCustomerOpts.find((opt) => {
          const rawOptCpf = (opt.cpf || opt.label || "").replace(/\D/g, "");
          return rawOptCpf === cleanInputCpf;
        });
      }

      setFormData((prev) => ({
        ...prev,
        customerCpf: formattedCpf,
        customerId: foundCustomer ? foundCustomer.value : "",
        customerName: foundCustomer
          ? foundCustomer.name || foundCustomer.label.split("-")[0]?.trim() || ""
          : cleanInputCpf.length === 11
          ? "Cliente não encontrado"
          : "",
      } as unknown as Partial<RegisterDataMap[T]>));

      if (fieldErrors.customerCpf) {
        setFieldErrors((prev) => ({ ...prev, customerCpf: "" }));
      }
      return;
    }

    updateFieldValue(fieldName, value as unknown as RegisterDataMap[T][typeof fieldName]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validation = runValidation();
    if (!validation.isValid || !validation.data) return;

    onSubmit(validation.data);
  };

  const fields = REGISTER_FIELDS[type] as FieldConfig<T>[];

  return (
    <div className={classes.overlay} onClick={isSubmitting ? undefined : onClose}>
      <div className={classes.modal_content} onClick={(e) => e.stopPropagation()}>
        <header className={classes.modal_header}>
          <h2>
            {initialValues ? "Editar" : "Cadastrar"} {TITLE_MAP[type]}
          </h2>
        </header>
        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.fields_container}>
            {fields.map((field) => {
              const fieldName = field.name;
              const fieldKey = String(fieldName);
              const rawValue = formData[fieldName];
              const value = typeof rawValue === "string" || typeof rawValue === "number" ? String(rawValue) : "";

              const dynamicResolver = rawDynamicOptions?.[fieldKey];
              const currentSpecialtyId = String(
                (formData as Record<string, unknown>).specialtyId ?? ""
              );

              let selectOptions: SelectOption[] = [];

              if (typeof dynamicResolver === "function") {
                selectOptions = dynamicResolver(currentSpecialtyId);
              } else if (Array.isArray(dynamicResolver)) {
                selectOptions = dynamicResolver;
              } else if (field.option && Array.isArray(field.option)) {
                if (isSelectOptionArray(field.option)) {
                  selectOptions = field.option;
                } else {
                  selectOptions = (field.option as string[]).map((opt) => ({
                    label: opt,
                    value: opt,
                  }));
                }
              }

              return (
                <div key={fieldKey} className={classes.form_group}>
                  <label htmlFor={fieldKey}>{field.label}</label>

                  {field.type === "select" ? (
                    fieldKey === "procedureIds" ? (
                      <CustomSelect
                        options={selectOptions}
                        selectedValues={
                          Array.isArray(formData[fieldName])
                            ? (formData[fieldName] as string[])
                            : []
                        }
                        onChange={(selectedValues: string[]) => {
                          const procOptsResolver = rawDynamicOptions?.procedureIds;
                          const resolvedProcOpts =
                            typeof procOptsResolver === "function"
                              ? procOptsResolver(currentSpecialtyId)
                              : Array.isArray(procOptsResolver)
                              ? procOptsResolver
                              : [];

                          const totalPrice = calculateTotalPrice(selectedValues, resolvedProcOpts);

                          setFormData((prev) => ({
                            ...prev,
                            procedureIds: selectedValues,
                            price: totalPrice,
                          } as unknown as Partial<RegisterDataMap[T]>));

                          if (fieldErrors[fieldKey]) {
                            setFieldErrors((prev) => ({ ...prev, [fieldKey]: "" }));
                          }
                        }}
                        placeholder="Selecione os procedimentos..."
                      />
                    ) : (
                      <select
                        id={fieldKey}
                        name={fieldKey}
                        value={value}
                        required={field.required}
                        onChange={(e) => handleInputChange(e, fieldName)}
                        disabled={isSubmitting || field.disabled}
                      >
                        <option value="">Selecione uma opção..</option>
                        {selectOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )
                  ) : (
                    <input
                      id={fieldKey}
                      name={fieldKey}
                      type={field.type}
                      value={value}
                      placeholder={field.placeholder || ""}
                      required={field.required}
                      onChange={(e) => handleInputChange(e, fieldName)}
                      maxLength={field.maxLength}
                      disabled={field.disabled || isSubmitting}
                    />
                  )}

                  {fieldErrors[fieldKey] && (
                    <span
                      style={{
                        color: "#e53e3e",
                        fontSize: "0.8rem",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {fieldErrors[fieldKey]}
                    </span>
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
            <button type="submit" className={classes.btn_submit} disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default Register;