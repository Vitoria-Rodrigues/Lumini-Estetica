import { useState } from "react";
import { Button } from "@/components/ui";
import classes from "./Search.module.css"; 

type SearchProps = {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
};


const Search = ({ 
  placeholder = "Buscar...",
  value,
  onChange,
  onSearch 
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

    const handleSearchClick = () => {
      if(onSearch){
        onSearch(query);
      }
  };

  return (
    <div className={classes.search_container}>
      <input 
        type="text" 
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className={classes.search_input}
      />
      <Button 
        title="Buscar" 
        onClick={handleSearchClick}
        padding=".6rem" 
        width="15%"
      />
    </div>
  )
}

export default Search
