//Components
import { ViewLayout, Search } from "@/components/layout";
import { Table } from "@/components/ui";

const Appointment = () => {
  return (
    <ViewLayout
      title="Agendamento"
      searchComponent={<Search />}>
      <Table />
    </ViewLayout>
  );
};

export default Appointment;
