import React, { useState } from "react";
import { useTable, useSortBy } from "react-table";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

import { formatName } from "../../helpers/format";

import "./Table.scss";

const Table = ({
  data,
  columns,
  columnsEqualSize = false,
  hasHeaders = true,
  tableStyles = {},
  hasFilterValue = true,
  hasSortBy = true,
  hasRowHeader,
}) => {
  const tableInstance = useTable({ columns, data }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    const hasName =
      row.values.name &&
      formatName(row.values.name)
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    const hasPreEvolvedName =
      row.values.preEvolvedName &&
      row.values.preEvolvedName
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    const hasEvolvedName =
      row.values.evolvedName &&
      row.values.evolvedName.toLowerCase().includes(filterValue.toLowerCase());
    const hasGameName =
      row.values.game &&
      row.values.game.toLowerCase().includes(filterValue.toLowerCase());
    const hasMethod =
      row.values.method &&
      row.values.method.toLowerCase().includes(filterValue.toLowerCase());
    return hasFilterValue && filterValue
      ? hasName ||
          hasPreEvolvedName ||
          hasEvolvedName ||
          hasGameName ||
          hasMethod
      : true;
  });

  return (
    <>
      {hasFilterValue && (
        <input
          className="table-filter-input"
          type="text"
          value={filterValue}
          onChange={handleFilterChange}
          placeholder="Search by name..."
        />
      )}
      <div className="table-container">
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
                        className={
                          hasRowHeader && column.id === "rowHeader"
                            ? "empty-cell"
                            : ""
                        }
                        style={
                          columnsEqualSize
                            ? {
                                width:
                                  hasRowHeader && column.id === "rowHeader"
                                    ? "8%"
                                    : `${100 / headerGroup.headers.length}%`,
                              }
                            : {}
                        }
                      >
                        <span className="table-header-content">
                          <span className="table-header-name">
                            {formatName(column.render("Header"))}
                          </span>
                          {hasSortBy && (
                            <span
                              {...column.getSortByToggleProps()}
                              className="table-sort-icon"
                            >
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <FaSortDown />
                                ) : (
                                  <FaSortUp />
                                )
                              ) : (
                                <FaSort />
                              )}
                            </span>
                          )}
                        </span>
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
      </div>
    </>
  );
};

export default Table;
