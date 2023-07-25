import React, { useState } from "react";
import { useTable } from "react-table";

import { formatName } from "../../helpers/format";

import "./Table.scss";

const Table = ({
  data,
  columns,
  columnsEqualSize = false,
  hasHeaders = true,
  tableStyles = {},
  hasFilterValue = true,
}) => {
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const filteredRows =
    hasFilterValue && filterValue
      ? rows.filter((row) =>
          row.values.name.toLowerCase().includes(filterValue.toLowerCase())
        )
      : rows;

  return (
    <>
      {hasFilterValue && (
        <input
          type="text"
          value={filterValue}
          onChange={handleFilterChange}
          placeholder="Search by name..."
        />
      )}
      {filteredRows.length > 0 ? (
        <table className="table" {...getTableProps()}>
          {hasHeaders && (
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
          )}
          <tbody {...getTableBodyProps()} style={tableStyles}>
            {filteredRows.map((row, i) => {
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
      ) : (
        <p>No Results</p>
      )}
    </>
  );
};

export default Table;
