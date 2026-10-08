import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import classes from "./Search.module.css"; 

type SearchProps = {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
};


const Search = ({ 
  placeholder = "Buscar...",
  value,
  onChange,
}: SearchProps) => {
  
  const [internalQuery, setInternalQuery] = useState("");

  const query = value !== undefined ? value : internalQuery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if(onChange){
      onChange(val);
    }else {
      setInternalQuery(val);
    }
  }

  return (
    <div className={classes.search_container}>
      <div className={classes.input_wrapper}>
      <RiSearchLine className={classes.search_icon} size={20} />
      <input 
        type="text" 
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className={classes.search_input}
      />
      </div>
    </div>
  )
}

export default Search
