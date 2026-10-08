import classes from './TableSkeleton.module.css';

interface TableSkeletonProps{
    rows?: number;
    columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
    rows = 5,
    columns = 4
}) => {
    return(
    <div className={classes.tableContainer}>
        <table className={classes.table}>
            <thead className={classes.thead}>
                <tr>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <th key={colIndex} className={classes.th}>
                            <div className={classes.skeletonBlock} style={{width: '60%'}}></div>
                        </th>
                    )) }
                </tr>
            </thead>

            <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <tr key={rowIndex} className={classes.tr}>
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <td key={colIndex} className={classes.td}>
                                <div className={classes.skeletonBlock} style={{ width: '60%' }}> </div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}

export default TableSkeleton