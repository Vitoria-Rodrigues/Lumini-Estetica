const cleanDigits = (value: string): string => {
    return value.replace(/\D/g, "");
};

export const formatCPF = (cpf: string | undefined | null): string => {
    if(!cpf) return "";
    const digits = cleanDigits(cpf);

    if(digits.length !== 11) return cpf;

    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

}

export const formatPhone = (phone: string | undefined | null): string => {
    if(!phone) return "";
    const digits = cleanDigits(phone);

    if(digits.length === 11){
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if(digits.length === 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return phone;
}

export const formatHour = (hour: string | undefined | null): string => {
    if (!hour) return "";

    const digits = hour.replace(/\D/g, "");

    if (digits.length === 4) {
        return digits.replace(/(\d{2})(\d{2})/, "$1:$2");
    }

    if (digits.length === 6) {
        return digits.replace(/(\d{2})(\d{2})\d{2}/, "$1:$2");
    }

    if (/^\d{2}:\d{2}$/.test(hour)) {
        return hour;
    }

    if (/^\d{2}:\d{2}:\d{2}$/.test(hour)) {
        return hour.slice(0, 5);
    }

    return hour;
};