export default function DataTable({ columns = [], data = [] }) {
  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={row.id ?? index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(row)
                    : (row[column.key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
