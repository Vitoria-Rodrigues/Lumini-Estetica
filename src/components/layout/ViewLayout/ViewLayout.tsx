import React from "react";
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
    <>
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
    </>
  );
};

export default ViewLayout;
