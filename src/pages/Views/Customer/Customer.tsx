import { useState, useEffect } from "react";

//Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table } from "@/components/ui";

//Icon
import { RiAddFill } from "react-icons/ri";

//Service
import { customerService, type CustomerDbRow } from "@/services/customerService";

const Customer = () => {
  const [customers, setCustomers] = useState<CustomerDbRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      try{
        setIsLoading(true);
        const data = await customerService.listCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Error ao carregar clientes:", err);
        setError("Nao foi possivel carregar os clientes.");
      } finally{
        setIsLoading(false);
      }
    }

    loadCustomers();

  }, []);


  return (
    <ViewLayout
      title="Cliente"
      actionButton={<Button title={"Cliente"} icon={RiAddFill} padding=".6rem" width="15%"/>}
      searchComponent={<Search />}
    >
      {isLoading ? 
      ( <p>Carregando clientes..</p>) : 
      error ? (<p style={{ color: "red"}}>{error}</p>) :
       (<Table data={customers} />)
    }
    </ViewLayout>
  );
};

export default Customer;
