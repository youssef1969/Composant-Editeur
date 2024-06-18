import React, { useState } from 'react';
import './App.css';

const Table = () => {
  const [cells, setCells] = useState([]);

  const addCell = () => {
    setCells([...cells, ""]);
  };

  const removeCell = (index) => {
    const newCells = cells.filter((_, i) => i !== index);
    setCells(newCells);
  };

  const handleChange = (e, index) => {
    const newCells = cells.map((cell, i) => (i === index ? e.target.value : cell));
    setCells(newCells);
  };

  return (
    <div>
      <button onClick={addCell}>Ajouter un parametre </button>
      <div className="table">
        {cells.map((cell, index) => (
          <div key={index} className="cell">
            <input 
              type="text"
              value={cell}
              onChange={(e) => handleChange(e, index)}
            />
            <button onClick={() => removeCell(index)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
