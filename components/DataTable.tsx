type DataTableProps = {
  headers: string[];
  rows: string[][];
};

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead className="sticky top-0 bg-gradient-subtle text-text backdrop-blur">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-2.5 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={`${row.join('-')}-${i}`}
                className="hover:bg-accent/8 odd:bg-surface even:bg-surfaceRaised"
              >
                {row.map((cell, j) => (
                  <td key={`${cell}-${j}`} className="px-4 py-2.5 text-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
