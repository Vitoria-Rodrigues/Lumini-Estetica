//Components
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table } from "@/components/ui";

//Icon
import { RiAddFill } from "react-icons/ri";

const Professional = () => {
  return (
    <ViewLayout
      title="Funcionário"
      actionButton={<Button title={"Funcionário"} icon={RiAddFill} padding=".6rem" width="15%"/>}
      searchComponent={<Search placeholder="Digite o nome do profissional.." />}
    >
      <Table />
    </ViewLayout>
  );
};

export default Professional;
