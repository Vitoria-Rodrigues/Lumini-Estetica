import { useContext } from "react";
import { ToasterContext } from ".";
import type { ToastContextProps } from "./types";

export const useToaster = ():ToastContextProps => {
    const context = useContext(ToasterContext);

    if(!context) {
        throw new Error("useToaster must be used within a ToasterProvider");
    }

    return context;
};

