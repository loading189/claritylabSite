type DataTableProps = {
  headers: string[];
  rows: string[][];
};

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-input border border-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead className="sticky top-0 bg-slate-100/90 text-muted backdrop-blur">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-3 py-2 font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${row.join('-')}-${i}`} className="odd:bg-white even:bg-slate-50/70">
                {row.map((cell, j) => (
                  <td key={`${cell}-${j}`} className="px-3 py-2 text-muted">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
