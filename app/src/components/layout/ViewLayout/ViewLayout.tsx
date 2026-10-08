import React from "react";
import classes from "./ViewLayout.module.css";

interface ViewLayoutProps {
  title: string;
  actionButton?: React.ReactNode;
  searchComponent?: React.ReactNode;
  children?: React.ReactNode;
  actionButtonPosition?: "title" | "search";
}

const ViewLayout: React.FC<ViewLayoutProps> = ({
  title,
  actionButton,
  searchComponent,
  children,
  actionButtonPosition = "search",
}) => {
  return (
    <>
        <span className={classes.title_container}>
          <h3>{title}</h3>
          {actionButtonPosition === "title" && actionButton}
        </span>
        {searchComponent && (
          <div className={classes.search_container}>
            {searchComponent}
            {actionButtonPosition === "search" && actionButton}
          </div>
        )}
        {children}
    </>
  );
};

export default ViewLayout;
