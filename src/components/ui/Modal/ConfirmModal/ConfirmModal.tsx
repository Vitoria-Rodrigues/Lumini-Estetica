import React from 'react';
import classes from './ConfirmModal.module.css';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    description,
    onConfirm,
    onClose,
}) => {
    if(!isOpen) return null;

    return(
        <div className={classes.overlay} onClick={onClose}>
            <div className={classes.modal}>
                <h3 className={classes.title}>{title}</h3>
                <p className={classes.description}>{description}</p>

                <div className={classes.actions}>
                    <button className={classes.cancel}>Cancelar</button>
                    <button className={classes.confirm} onClick={onConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    )


}

export default ConfirmModal;