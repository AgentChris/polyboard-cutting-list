import React from 'react';
import { Table } from 'react-bootstrap';

class TablePrint extends React.Component {
  render() {
    return (
      <div className="mt-3 px-5 mb-5">
        <h1>Masuratori mobila</h1>
        <Table striped bordered>
          <thead>
          <tr>
            <th>Nume corp</th>
            <th>Nume si grosime</th>
            <th>Cantitate</th>
            <th>Lungime</th>
            <th>Latime</th>
            <th>Cant</th>
          </tr>
          </thead>
          <tbody>
          {this.props.table.sort((a,b)=>{
            const nameA = a.cabinetName.toUpperCase(); // ignore upper and lowercase
            const nameB = b.cabinetName.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          }).map((tableLine, index) => (
            <tr key={index}>
              <td>{tableLine.cabinetName}</td>
              <td>{tableLine.name}</td>
              <td>{tableLine.quantity}</td>
              <td>{tableLine.length}</td>
              <td>{tableLine.width}</td>
              <td>{tableLine.edgeText}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default TablePrint;
