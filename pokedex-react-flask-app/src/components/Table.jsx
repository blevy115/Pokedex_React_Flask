import React from "react";
import { useTable } from "react-table";

const Table = ({ data, columns, columnsEqualSize = false }) => {
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table className="table" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr key={i} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, j) => (
              <th
                key={j}
                {...column.getHeaderProps()}
                style={
                  columnsEqualSize
                    ? {
                        // set the width of each column to a fraction of the total grid width
                        width: `${100 / headerGroup.headers.length}%`,
                      }
                    : {}
                }
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr key={i} {...row.getRowProps()}>
              {row.cells.map((cell, j) => {
                return (
                  <td key={j} {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
