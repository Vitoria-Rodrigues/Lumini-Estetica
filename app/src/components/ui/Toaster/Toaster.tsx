import { useToaster } from "@/contexts/ToasterContext/useToaster";
import classes from "./Toaster.module.css";

export default function Toaster() {
    const { toasts, removeToast } = useToaster();

    if(toasts.length === 0) return null;

    return(
      <div className={classes.toaster_container}>
        {toasts.map((toast) => (
            <div key={toast.id} className={`${classes.toast} ${classes[`toast--${toast.type}`] || ""}`}
            onClick={() => removeToast(toast.id)}> 
            
            <span className={classes.toast_message}>
                {toast.message}
            </span>

            <button className={classes.toast_close} onClick={(e) => {
                e.stopPropagation(); removeToast(toast.id);
            }}>
                
            </button>
            
            </div>
        ))}
      </div>  
    );
}


