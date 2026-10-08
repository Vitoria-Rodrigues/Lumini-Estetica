import { useMemo } from "react";
import type { SessionDbRow } from "@/services/sessionService";
import { formatCPF } from "@/utils/formatters";

export interface UseAppointmentFilterParams {
    sessions: SessionDbRow[];
    selectedDate: string;
    isOperational: boolean;
    userEmployeeId?: string | number | null;
    selectedEmployeeId?: string;
    searchQuery?: string;
}

export const useAppointmentFilter = ({
    sessions,
    selectedDate,
    isOperational,
    userEmployeeId,
    selectedEmployeeId,
    searchQuery = "",
}: UseAppointmentFilterParams): SessionDbRow[] => {
    return useMemo(() => {
        return sessions.filter((session) => {
            const matchesDate = session.data === selectedDate;
            if(!matchesDate) return false;

            if(isOperational){
                if(!userEmployeeId || String(session.id_funcionario) !== String(userEmployeeId)) {
                    return false
                }
            } else if(selectedEmployeeId) {
                if(String(session.id_funcionario) !== selectedEmployeeId) {
                    return false;
                }
            }

            if(searchQuery.trim()) {
                const term = searchQuery.trim().toLowerCase();
                const termCleanDigits = searchQuery.replace(/\D/g, "");

                const customerName = session.cliente?.name?.toLowerCase() || "";
                const employeeName = session.funcionario?.name?.toLowerCase() || "";
                const rawCpf = session.cliente?.cpf || "";
                const cleanCpf = rawCpf.replace(/\D/g, "");
                const formattedCpf = formatCPF(rawCpf);

                const matchesCustomerName = customerName.includes(term);
                const matchesEmployeeName = employeeName.includes(term);
                const matchesCleanCpf = termCleanDigits.length >  0 && cleanCpf.includes(termCleanDigits);
                const matchesFormattedCpf = formattedCpf.includes(term);

                if(!matchesCustomerName && !matchesEmployeeName && !matchesCleanCpf && !matchesFormattedCpf){
                    return false;
                }
            }
            return true;
        });
    }, [
        sessions,
        selectedDate,
        isOperational,
        userEmployeeId,
        selectedEmployeeId,
        searchQuery,
    ]);
};