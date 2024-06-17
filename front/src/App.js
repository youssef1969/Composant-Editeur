import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/julia/julia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import Table from './Table';


function App() {
  const [message, setMessage] = useState('');
  const [parametres, setParametres] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [option, setOption] = useState('');
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);
  const [showResult, setShowResult] = useState(false); // Etat pour contrôler l'affichage du résultat

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
      const response = await axios.post('http://localhost:5086/api/OptimalControl', { parametres: parametres, problemDescription: problemDescription, option: option });
      console.log("Response from backend:", response.data);
      setSolution(response.data.result);
      setOption(response.data.option);
      setShowResult(true); // Activer l'affichage du résultat après la soumission
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleDescriptionVisibility = () => {
    setIsDescriptionVisible(!isDescriptionVisible);
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
                  Parametres:
                  <CodeMirror
                    className='codeMirrorParametrs'
                    value={parametres}                                                              
                    options={{
                      mode: 'julia',
                      theme: 'material',
                      lineNumbers: true
                    }}
                    onBeforeChange={(editor, data, value) => {
                      setParametres(value);
                    }}
                  />
                  <p><Table />/</p>
                </label>
                <div className="toggle-button" onClick={toggleDescriptionVisibility}>
                  {isDescriptionVisible ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
                  Description du problème
                </div>
                {isDescriptionVisible && (
                  <label>
                    <CodeMirror
                      className='codeMirrorProblemDescription'
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
                )}
                <label>
                  Options:
                  <CodeMirror
                    className='codeMirrorOptions'
                    value={option}
                    options={{
                      mode: 'julia',
                      theme: 'material',
                      lineNumbers: true
                    }}
                    onBeforeChange={(editor, data, value) => {
                      setOption(value);
                    }}
                  />
                </label>
                
              </div>
              <button type="submit">Soumettre</button>
            </form>
          </div>
          <div className="right">
            {showResult  && (
              <div className="output-text">
                <h2>Code</h2>
                <p>{solution}</p>
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
