import classes from "./Table.module.css";

export interface Column<T>{
    label: string;
    key: keyof T | 'actions';
    render?: (item: T) => React.ReactNode;
}

export interface TableProps<T>  {
    columns: Column<T>[];
    data: T[];
}

const Table = () => {
  return (
    <div className={classes.table_container}>
       <table className={classes.table}>
        <thead className={classes.table_head}>
            <tr>
                <td>...</td>
                <td>...</td>
                <td>...</td>
            </tr>
        </thead>
        <tbody className={classes.table_body}>
            <tr className={classes.table_line}>
                <td>...</td>
                <td>...</td>
                <td>...</td>
            </tr>
        </tbody>
        </table> 
    </div>
  )
}

export default Table
