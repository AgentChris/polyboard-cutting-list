import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from 'react-bootstrap';
import './main.scss';
import TablePrint from "./TablePrint";

const MATERIAL_INDEX = 0;
const QUANTITY_INDEX = 2;
const HEIGHT_INDEX = 3;
const WIDTH_INDEX = 4;
const TOP_EDGE_INDEX = 5;
const BOTTOM_EDGE_INDEX = 6;
const RIGHT_EDGE_INDEX = 7;
const LEFT_EDGE_INDEX = 8;

function App() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [table, setTable] = useState();
  let fileReader;

  const handleFileRead = (e) => {
    const content = fileReader.result;
    const tableData = [];
    content.split('\n').forEach((line) => {
      if(line) {
        let attributes = line.split(';');
        const heightIsSmaller = parseFloat(attributes[HEIGHT_INDEX]) < parseFloat(attributes[WIDTH_INDEX]);
        let edgeText = '';

        const topEdge = parseInt(attributes[TOP_EDGE_INDEX], 10);
        const bottomEdge = parseInt(attributes[BOTTOM_EDGE_INDEX], 10);
        const rightEdge = parseInt(attributes[RIGHT_EDGE_INDEX], 10);
        const leftEdge = parseInt(attributes[LEFT_EDGE_INDEX], 10);
        if (topEdge + bottomEdge + rightEdge + leftEdge===4) {
          edgeText = 'roata';
        } else {
          for (let i = 0; i < topEdge + bottomEdge; i++) {
            edgeText += heightIsSmaller ? 'lunga ':'scurta ';
          }
          for (let i = 0; i < rightEdge + leftEdge; i++) {
            edgeText += heightIsSmaller ? 'scurta ':'lunga ';
          }
        }

        tableData.push({
          name: attributes[MATERIAL_INDEX],
          quantity: attributes[QUANTITY_INDEX],
          length: heightIsSmaller ? parseFloat(attributes[WIDTH_INDEX]):parseFloat(attributes[HEIGHT_INDEX]),
          width: !heightIsSmaller ? parseFloat(attributes[WIDTH_INDEX]):parseFloat(attributes[HEIGHT_INDEX]),
          edgeText: edgeText
        });
      }
    });

    setTable(tableData);
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };
  return (
    <div className="p-3">
      <h1>Upload polyboard ascii export</h1>
      <input type="text" value="<material>;<quantity>;<height>;<width>;<top_edge_present>;" readOnly className="w-100"/><br/>
      <input type="file" onChange={event => handleFileChosen(event.target.files[0])} accept=".txt" /><br />
      <Button onClick={handlePrint} className="mt-4">Printeaza table</Button><br />
      {(table && table.length) ? <TablePrint table={table} ref={componentRef} /> : 'Incarca fisier'}
    </div>
  );
}

export default App;
