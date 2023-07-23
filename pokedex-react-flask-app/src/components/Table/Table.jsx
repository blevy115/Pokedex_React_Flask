import React from "react";
import { useTable } from "react-table";

import { formatName } from "../../helpers/format";

import "./Table.scss";

const Table = ({
  data,
  columns,
  columnsEqualSize = false,
  hasHeaders = true,
  tableStyles = {},
}) => {
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table className="table" {...getTableProps()}>
      {hasHeaders ? (
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
                  {formatName(column.render("Header"))}
                </th>
              ))}
            </tr>
          ))}
        </thead>
      ) : (
        <></>
      )}
      <tbody {...getTableBodyProps()} style={tableStyles}>
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
