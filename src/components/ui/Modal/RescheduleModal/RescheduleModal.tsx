import { useState } from "react";
import type { SessionDbRow } from "@/services/sessionService";

import classes from './RescheduleModal.module.css';

interface RescheduleModalProps {
    isOpen: boolean;
    session: SessionDbRow | null;
    onClose: () => void;
    onReschedule: (sessionId: string, newDate: string,
         newtime: string) => Promise<void>;
    onCancelDefinitive: (sessionId: string) => Promise<void>;
}

export const RescheduleModal = ({
    isOpen,
    session,
    onClose, 
    onReschedule,
    onCancelDefinitive,
}: RescheduleModalProps) => {
    if(!isOpen || !session) return null;

    const today = new Date();
    const minDate = today.toISOString().split("T")[0];

    const maxDateObj = new Date(today);
    maxDateObj.setDate(today.getDate() + 3);
    const maxDate = maxDateObj.toISOString().split("T")[0];

    const [newDate, setNewDate] = useState(session.data || minDate);
    const [newTime, setNewTime] = useState(session. horario || "09:00");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirmReschedule = async () => {
        if(!session.id_consulta) return;

        try {
            setIsSubmitting(true);
            await onReschedule(session.id_consulta, newDate, newTime);
            onClose;
        } finally{
            setIsSubmitting(false);
        }
    };

    const handleDefinitiveCancel = async () => {
        if(!session.id_consulta) return;
        if(window.confirm("Tem certeza que deseja cancelar esta consulta definitivamente sem reagendar?")){
            try{
                setIsSubmitting(true);
                await onCancelDefinitive(session.id_consulta);
                onClose();
            } finally{
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className={classes.overlay}>
            <div className={classes.modal}>
                <h3 className={classes.title}>Cancelar / Reagendar Consulta</h3>
                <p className={classes.clientText}>Cliente: <span>{session.Cliente?.name}</span></p>

                <div className={classes.formGroup}>
                    <label className={classes.label}>
                        Nova Data (Até 3 dias a partir de hoje):
                    </label>
                    <input type="date"
                    min={minDate}
                    max={maxDate}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className={classes.input} 
                    />

                    <label className={classes.labelTime}>
                        Novo Horario:
                    </label>
                    <input type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)} 
                    className={classes.input_hour} />
                </div>
                <div className={classes.actions}>
                    <button onClick={onClose}
                    disabled={isSubmitting}
                    className={classes.buttonBack}>
                        Voltar
                    </button>
                    <button onClick={handleDefinitiveCancel}
                    disabled={isSubmitting}
                    className={classes.buttonCancel}>
                        Cancelar Definitivo
                    </button>
                    <button onClick={handleConfirmReschedule} 
                    disabled={isSubmitting} 
                    className={classes.buttonReschedule}
                    >
                        Reagendar
                    </button>
                </div>
            </div>
        </div>
    );

}

export default RescheduleModal;