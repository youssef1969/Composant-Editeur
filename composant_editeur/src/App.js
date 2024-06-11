import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript'; // Changez selon le langage
import 'codemirror/mode/julia/julia'; // Importer le mode Julia

import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [code, setCode] = useState('');
  const [option, setOption] = useState('default');

  useEffect(() => {
    axios.get('http://localhost:5086/api/OptimalControl')
      .then(response => {
        setMessage(response.data.Message);
      })
      .catch(error => {
        console.error('Il y a eu une erreur!', error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5086/api/OptimalControl', { problemDescription: problemDescription, option: option });
      console.log("Response from backend:", response.data);
      setSolution(response.data.result);
      setCode(response.data.code);
      setOption(response.data.option);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Interface Graphique de Contrôle Optimal</h1>
        <p>{message}</p>
        <div className="container">
          <div className="left">
            <form onSubmit={handleSubmit}>
              <div>
                <label>
                  Description du problème :
                  <CodeMirror
                    value={problemDescription}
                    options={{
                      mode: 'julia', 
                      theme: 'material',
                      lineNumbers: true
                    }}
                    onBeforeChange={(editor, data, value) => {
                      setProblemDescription(value);
                    }}
                  />
                </label>
              </div>
              <div>
                <label>
                  Option de résolution :
                  <select value={option} onChange={(e) => setOption(e.target.value)}>
                    <option value="default">Default</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                  </select>
                </label>
              </div>
              <button type="submit">Soumettre</button>
            </form>
          </div>
          <div className="right">
            {solution && (
              <div>
                <h2>Solution</h2>
                <p>{solution}</p>
                <h2>Code</h2>
                <CodeMirror
                  value={code}
                  options={{
                    mode: 'julia',
                    theme: 'material',
                    lineNumbers: true,
                    readOnly: true
                  }}
                />
                <h2>Option</h2>
                <p>{option}</p>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
