import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button, FormFile } from 'react-bootstrap';
import video from './video-1592675406.mp4'
import pas_1 from './pas_1.png';
import pas_2 from './pas_2.png';
import pas_3 from './pas_3.png';
import pas_4 from './pas_4.png';
import pas_5 from './pas_5.png';
import './main.scss';
import TablePrint from "./TablePrint";

const MATERIAL_INDEX = 0;
const QUANTITY_INDEX = 1;
const HEIGHT_INDEX = 2;
const WIDTH_INDEX = 3;
const TOP_EDGE_INDEX = 4;
const BOTTOM_EDGE_INDEX = 5;
const RIGHT_EDGE_INDEX = 6;
const LEFT_EDGE_INDEX = 7;
const CABINET_NAME_INDEX = 8;

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
        const cabinetName = attributes[CABINET_NAME_INDEX];
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
          edgeText: edgeText,
          cabinetName: cabinetName,
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
      <p>Asigurate ca formatul pentru cutting list este urmatorul text in aceasi ordine !!!!</p>
      <p>Daca nu reusesti sa urmaresti instructiunile exista un videoclip jos de tot in website cu toti pasi</p>
      <input type="text"
             value="<Material with thickness>;<Quantity>;<Height>;<Width>;<Top Edge Present>;<Bottom Edge Present>;<Right Edge Present>;<Left Edge Present>;"
             readOnly
             className="w-100" onClick={(event) => {
        event.target.focus();
        event.target.select();
      }} /><br />
      <h3>Pasul 2</h3>
      <p>Asigurate ca toate configuriatiile corespund cu imaginile de mai jos</p>
      <img src={pas_1} alt="pas_1" className="image-step"/>
      <img src={pas_2} alt="pas_2" className="image-step"/>
      <img />
      <h3>Pasul 3</h3>
      <p>Nu uita sa bifeza optiunea cu net dimension ca si in imaginea de mai sus</p>
      <img src={pas_3} alt="pas_3" className="image-step"/>
      <h3>Pasul 4</h3>
      <p>Apasa pe ASCII export conform imagini de mai jos si decarca fisierul txt</p>
      <img src={pas_4} alt="pas_4" className="image-step"/>
      <img src={pas_5} alt="pas_5" className="image-step"/>
      <h3>Pasul 5</h3>
      <p>Adauga fisierul obtinut de la pasul anterior in casuta de mai jos</p>
      <FormFile
        id="custom-file"
        label="Incarca fisierul txt"
        custom
        data-browse="Incarca"
        className="w-50"
        onChange={event => handleFileChosen(event.target.files[0])} accept=".txt"
      /><br />
      <h3>Pasul final printeaza tabelul apasand pe butonul de mai jos</h3>
      <Button onClick={handlePrint} className="mt-4">Printeaza tabel</Button><br />
      {(table && table.length) ? <TablePrint table={table} ref={componentRef} />:'Nu ai incarcat niciun fisier'}
      <div>
        <h5>Ajutor </h5>
        <p>Te rog urmareste videoclipul de mai jos daca nu ai reusit sa obtii tabelul corect.</p>
        <video width="750" height="500" controls >
          <source src={video} type="video/mp4"/>
        </video>
      </div>
    </div>
  );
}

export default App;
