import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/julia/julia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [parametres, setParametres] = useState(['']);
  const [problemDescription, setProblemDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [option, setOption] = useState('');
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);
  const [showResult, setShowResult] = useState(false);

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
      const response = await axios.post('http://localhost:5086/api/OptimalControl', {
        parametres: JSON.stringify(parametres),
        problemDescription: problemDescription,
        option: option
      });
      console.log("Response from backend:", response.data);
      setSolution(response.data.result);
      setShowResult(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleParamChange = useCallback((index, value) => {
    setParametres(prevParametres => {
      const newParametres = [...prevParametres];
      newParametres[index] = value;
      return newParametres;
    });
  }, []);

  const addParametre = useCallback(() => {
    setParametres(prevParametres => [...prevParametres, '']);
  }, []);

  const removeParametre = useCallback((index) => {
    setParametres(prevParametres => {
      const newParametres = [...prevParametres];
      newParametres.splice(index, 1);
      return newParametres;
    });
  }, []);

  const toggleDescriptionVisibility = useCallback(() => {
    setIsDescriptionVisible(prevState => !prevState);
  }, []);

  const codeMirrorOptions = useMemo(() => ({
    mode: 'julia',
    theme: 'material',
    lineNumbers: true
  }), []);

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
                  {parametres.map((param, index) => (
                    <div key={index} className="parametre-container">
                      <CodeMirror
                        className='codeMirrorParametrs'
                        value={param}
                        options={codeMirrorOptions}
                        onBeforeChange={(editor, data, value) => {
                          handleParamChange(index, value);
                        }}
                      />
                      <button type="button" onClick={() => removeParametre(index)}>
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addParametre}>
                    <FontAwesomeIcon icon={faPlus} /> Ajouter Parametre
                  </button>
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
                      options={codeMirrorOptions}
                      onBeforeChange={(editor, data, value) => {
                        setProblemDescription(value);
                      }}
                    />
                  </label>
                )}
              </div>
              <div>
                <label>
                  Options:
                  <CodeMirror
                    className='codeMirrorOptions'
                    value={option}
                    options={codeMirrorOptions}
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
            {showResult && (
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
