//icon
import { RiAddFill } from "react-icons/ri";

//Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table } from "@/components/ui";

const Procedure = () => {
  return (
    <ViewLayout
      title="Procedimento"
      actionButton={<Button title={"Procedimento"} icon={RiAddFill} padding=".6rem" width="15%"/>}
      searchComponent={<Search placeholder="Digite o nome do procedimento.." />}
    >
      <Table />
    </ViewLayout>
  );
};

export default Procedure;
