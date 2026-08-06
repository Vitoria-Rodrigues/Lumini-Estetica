import { useState, useRef, useEffect } from "react";
import classes from "./CustomSelect.module.css";
import { RiCloseFill, RiArrowDownSLine } from "react-icons/ri";

interface Option{
    value: string;
    label: string;
    price?: number;
}

interface CustomSelectProps {
    options: Option[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
}

const CustomSelect = ({ options, selectedValues, onChange, placeholder} : CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(dropdownRef.current && !dropdownRef.current.contains(e.target as Node)){
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSelect = (value: string) => {
        if(selectedValues.includes(value)) {
            onChange(selectedValues.filter(v => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.
            toLocaleLowerCase())
        );

    return (
      <div className={classes.select_container} ref={dropdownRef}>
      <div className={classes.select_trigger} onClick={() => setIsOpen(!isOpen)}>
        <div className={classes.chips_container}>
          {selectedValues.length === 0 && <span className={classes.placeholder}>{placeholder}</span>}
          {selectedValues.map(val => {
            const opt = options.find(o => o.value === val);
            return (
              <span key={val} className={classes.chip}>
                {opt?.label}
                <button type="button" onClick={(e) => { e.stopPropagation(); toggleSelect(val); }}>
                  <RiCloseFill />
                </button>
              </span>
            );
          })}
        </div>
        <RiArrowDownSLine className={`${classes.arrow} ${isOpen ? classes.arrow_open : ""}`} />
      </div>

      {isOpen && (
        <div className={classes.dropdown}>
          <input
            type="text"
            className={classes.search_input}
            placeholder="Buscar procedimento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <ul className={classes.options_list}>
            {filteredOptions.map(opt => {
              const isSelected = selectedValues.includes(opt.value);
              return (
                <li
                  key={opt.value}
                  className={`${classes.option_item} ${isSelected ? classes.selected : ""}`}
                  onClick={() => toggleSelect(opt.value)}
                >
                  <input type="checkbox" className={classes.check} checked={isSelected} readOnly />
                  <span>{opt.label}</span>
                  {opt.price && <span className={classes.price}>R$ {opt.price.toFixed(2)}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
    ); 
};

export default CustomSelect;