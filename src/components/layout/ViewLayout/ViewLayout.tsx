import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import classes from "./ViewLayout.module.css";

interface ViewLayoutProps {
  title: string;
  actionButton?: React.ReactNode;
  searchComponent?: React.ReactNode;
  children?: React.ReactNode;
}

const ViewLayout: React.FC<ViewLayoutProps> = ({
  title,
  actionButton,
  searchComponent,
  children,
}) => {
  return (
    <div className={classes.container}>
      <Sidebar />
      <div className={classes.content}>
        <div className={classes.employee}>
          <p className={classes.employee_name}>Olá, Nicole</p>
          <p className={classes.employee_role}>Atendente</p>
        </div>
        <span className={classes.title_container}>
          <h3>{title}</h3>
          {actionButton}
        </span>
        {searchComponent && (
          <div className={classes.search_container}>
            {searchComponent}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ViewLayout;
