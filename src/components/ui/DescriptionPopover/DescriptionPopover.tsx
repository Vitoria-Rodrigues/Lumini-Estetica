import { useState, useRef, useEffect } from "react";
import classes from "./DescriptionPopover.module.css";

interface DescriptionPopoverProps{
    text: string;
    maxLength?: number;
}

const DescriptionPopover = ({ text, maxLength = 40}: DescriptionPopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if(text.length <= maxLength){
        return <span>{text}</span>
    }
    
    const truncatedText = `${text.slice(0, maxLength)}...`;

    return(
        <div className={classes.container} ref={containerRef}>
            <span className={classes.trigger} onClick={() => setIsOpen(!isOpen)} title="Clique para ver mais">
                {truncatedText}
            </span>

            {isOpen && (
                <div className={classes.popover}>
                <p className={classes.popoverTitle}>Descrição completa</p>
                <p className={classes.popoverBody}>{text}</p>
                </div>
            )}
        </div>
    );

};

export default DescriptionPopover;