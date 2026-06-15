//Components and Layouts
import { ViewLayout, Search } from "@/components/layout";
import { Button, Table } from "@/components/ui";

//Icon
import { RiAddFill } from "react-icons/ri";

const Customer = () => {
  return (
    <ViewLayout
      title="Cliente"
      actionButton={<Button title={"Cliente"} icon={RiAddFill} padding=".6rem" width="15%"/>}
      searchComponent={<Search />}
    >
      <Table />
    </ViewLayout>
  );
};

export default Customer;
