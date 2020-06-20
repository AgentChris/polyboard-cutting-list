import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button, FormFile } from 'react-bootstrap';
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
      if (line) {
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
      <h1>Exporta lista mobila formated according to Petre Jarda 👷🏻‍♂️🪑💪</h1>
      <h3>Pasul 1</h3>
      <p>Copiaza urmatorul text in clipboard.</p>
      <input type="text" value="<material>;<quantity>;<height>;<width>;<top_edge_present>;" readOnly
             className="w-100" onClick={(event)=>{
               event.target.focus();event.target.select();
      }}/><br />
      <h3>Pasul 2</h3>
      <p>Lipseste/Paste textul de mai sus conform imagini de mai jos</p>
      <img />
      <h3>Pasul 3</h3>
      <p>Bifeza optiunea cu net dimension ca si in imaginea de mai sus si asigurate ca toate configuriatiile corespund
      cu imaginea de mai sus</p>
      <h3>Pasul 4</h3>
      <p>Apasa pe ASCII export conform imagini de mai jos si decarca fisierul txt</p>
      <h3>Pasul 5</h3>
      <p>Adauga fisierul descarcat in casuta de mai jos</p>
      <h3>Pasul final printeaza tabelul apasand pe butonul de mai jos</h3>
      <FormFile
        id="custom-file"
        label="Incarca fisierul txt"
        custom
        data-browse="Incarca"
        className="w-50"
        onChange={event => handleFileChosen(event.target.files[0])} accept=".txt"
      /><br />
      <Button onClick={handlePrint} className="mt-4">Printeaza tabel</Button><br />
      {(table && table.length) ? <TablePrint table={table} ref={componentRef} />:'Nu ai incarcat niciun fisier'}
    </div>
  );
}

export default App;
