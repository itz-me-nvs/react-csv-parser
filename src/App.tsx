import Papa from "papaparse";
import React, { useState } from "react";
import "./App.css";

function App() {
  const [tableRows, setTableRows] = useState<string[]>([]);
  const [values, setValues] = useState<string[][]>([]);

  const parseCSVData = (data: any[]) => {
    const rowsArray: string[][] = [];
    const valuesArray: string[][] = [];

    data.forEach((d: any) => {
      rowsArray.push(Object.keys(d));
      valuesArray.push(Object.values(d));
    });

    setTableRows(rowsArray[0]);
    setValues(valuesArray);
  };

  const changeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files![0];

    if (file) {
      try {
        const response = await parseCSVFile(file);
        parseCSVData(response.data);
      } catch (error) {
        console.error("Error parsing CSV:", error);
      }
    }
  };

  const parseCSVFile = (file: File) => {
    return new Promise<{ data: any[] }>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  return (
    <div>
      {/* File Uploader */}
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />
      <br />
      <br />
      {/* Table */}
      <table>
        <thead>
          <tr>
            {tableRows.map((row, index) => (
              <th key={index}>{row}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((value, rowIndex) => (
            <tr key={rowIndex}>
              {value.map((val, columnIndex) => (
                <td key={columnIndex}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
