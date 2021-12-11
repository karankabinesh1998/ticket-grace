import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'


const Datatable = ({ data, columnHeading, filterable = true }) => {
  return (
    <ReactTable
      data={data}
      columns={columnHeading}
      filterable={filterable}
      defaultPageSize={10}
      className="-striped -highlight"
      minRows={1}
      defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row)}
    />
  );
};
function filterCaseInsensitive(filter, row) {
  const id = filter.pivotId || filter.id;
  if (row[id] !== undefined && row[id] !== null && row[id] !== '') {
    if (isNaN(filter.value)) {
      return String(row[id].toLowerCase()).startsWith(
        filter.value.toLowerCase()
      );
    } else {
      return String(row[id]).startsWith(filter.value);
    }
  } else {
    return true;
  }
}

export default Datatable;
