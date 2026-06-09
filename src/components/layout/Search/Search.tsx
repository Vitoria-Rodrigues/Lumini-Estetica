import { useState } from "react";
import { Button } from "@/components/ui";
import classes from "./Search.module.css"; 

type SearchProps = {
    placeholder?: string;
}

const Search = ({ placeholder = "Buscar..." }: SearchProps) => {
    const [query, setQuery] = useState("");

    const handleSearchClick = () => {

  };

  return (
    <div className={classes.search_container}>
      <input 
        type="text" 
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={classes.search_input}
      />
      <Button 
        title="Buscar" 
        onClick={handleSearchClick}
        padding=".6rem" 
        width="10%"
      />
    </div>
  )
}

export default Search
