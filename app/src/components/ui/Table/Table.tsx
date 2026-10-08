import classes from "./Table.module.css";

export interface Column<T>{
    label: string;
    key: keyof T | "actions";
    render?: (item: T) => React.ReactNode;
}

export interface TableProps<T>  {
    title?: string | React.ReactNode;
    columns?: Column<T>[];
    data?: T[];
}

const Table = <T,>({ title, columns = [], data = []}: TableProps<T>) => {
  return (
    <div className={classes.table_container}>
        {title && (
        typeof title === "string" ? (
          <h2 className={classes.table_title}>{title}</h2>
        ) : (
          title
        )
      )}
       <table className={classes.table}>
        <thead className={classes.table_head}>
            <tr>
                {columns.map((col, idx) => (
                    <th key={idx}>{col.label}</th>
                ))}
            </tr>
        </thead>
        <tbody className={classes.table_body}>
            {data.length === 0 ? (
                <tr>
                    <td colSpan={columns.length} style={ {textAlign: "center", padding: "2rem"}}></td>
                </tr>
            ) : (
                data.map((item, rowIdx) => (
                    <tr key={rowIdx} className={classes.table_line}>
                        {columns.map((col, colIdx) => (
                            <td key={colIdx}>
                                {col.render ? col.render(item) : String(item[col.key as keyof T] ?? "")}
                            </td>
                        ))}
                    </tr>
                ))
            )}
        </tbody>
        </table> 
    </div>
  )
}

export default Table
