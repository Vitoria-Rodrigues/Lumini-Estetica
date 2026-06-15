//Components
import { Button, Table } from "@/components/ui";
import { ViewLayout, Search } from "@/components/layout";

//icon
import { RiAddFill } from "react-icons/ri";

const Session = () => {
  return (
    <ViewLayout
      title="Consulta"
      actionButton={<Button title={"Consulta"} icon={RiAddFill} padding=".6rem" width="15%"/>}
      searchComponent={<Search placeholder="Digite o nome do cliente..." />}
    >
      <Table />
    </ViewLayout>
  );
};

export default Session;
