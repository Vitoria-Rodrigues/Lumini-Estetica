const cleanDigits = (value: string): string => {
    return value.replace(/\D/g, "");
};

export const formatCPF = (cpf: string | undefined | null): string => {
    if(!cpf) return "";
    const digits = cleanDigits(cpf);

    if(digits.length !== 11) return cpf;

    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

}

export const isValidCPF = (cpf: string | undefined | null): boolean => {
     if (!cpf) return false;
     const clean = cpf.replace(/\D/g, "");
     if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) return false;

     let sum = 0;
     for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i)) * (10 - i);
     let rev = 11 - (sum % 11);
     if (rev === 10 || rev === 11) rev = 0;
     if (rev !== parseInt(clean.charAt(9))) return false;

     sum = 0;
     for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i)) * (11 - i);
     rev = 11 - (sum % 11);
     if (rev === 10 || rev === 11) rev = 0;
     return rev === parseInt(clean.charAt(10));
   };

export const formatPhone = (phone: string | undefined | null): string => {
    if(!phone) return "";
    const digits = cleanDigits(phone);

    if(digits.length === 11){
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3");
    } else if(digits.length === 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1)$2-$3");
    }

    return phone;
}

export const getLocalDateString = (date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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