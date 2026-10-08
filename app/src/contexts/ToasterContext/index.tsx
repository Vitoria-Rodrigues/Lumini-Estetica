import { createContext, useState, useCallback } from "react";
import type { Toast, ToastType, ToastContextProps, ToasterProviderProps } from "./types";

export const ToasterContext = createContext<ToastContextProps | undefined>(undefined);

export const ToasterProvider = ({ children }: ToasterProviderProps) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        const id = crypto.randomUUID();

        setToasts((prev) => [...prev, {id, message, type, duration}]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);

    const value: ToastContextProps = {
        toasts,
        addToast,
        removeToast,
    };

    return (
        <ToasterContext.Provider value={value}>
            {children}
        </ToasterContext.Provider>
    )
}







