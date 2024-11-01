import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/julia/julia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import './App.css';

const latexSymbols = {
  "\\sqrt": "\u221A",
  "\\cbrt": "\u221B",
  "\\female": "♀",
  "\\mars": "♂",
  "\\pprime": "″",
  "\\ppprime": "‴",
  "\\pppprime": "⁗",
  "\\backpprime": "‶",
  "\\backppprime": "‷",
  "\\xor": "⊻",
  "\\nand": "⊼",
  "\\nor": "⊽",
  "\\iff": "⟺",
  "\\implies": "⟹",
  "\\impliedby": "⟸",
  "\\to": "→",
  "\\euler": "ℯ",
  "\\ohm": "Ω",
  "\\Sigma": "Σ",
  "\\Tau": "Τ",
  "\\Phi": "Φ",
  "\\Psi": "Ψ",
  "\\Omega": "Ω",
  "\\alpha": "α",
  "\\beta": "β",
  "\\gamma": "γ",
  "\\delta": "δ",
  "\\zeta": "ζ",
  "\\eta": "η",
  "\\theta": "θ",
  "\\lambda": "λ",
  "\\mu": "μ",
  "\\xi": "ξ",
  "\\pi": "π",
  "\\rho": "ρ",
  "\\sigma": "σ",
  "\\tau": "τ",
  "\\varphi": "φ",
  "\\psi": "ψ",
  "\\omega": "ω",
  "\\phi": "ϕ",
  "\\^1": "¹",
  "\\^2": "²",
  "\\^3": "³",
  "\\dot": "̇",
  "\\ddot": "̈",
};

const latexRegex = /\\[a-zA-Z]+|\^\d/g;

function replaceLatexSymbols(text) {
  return text.replace(latexRegex, (match) => latexSymbols[match] || match);
}

function App() {
  const [message, setMessage] = useState('');
  const [parametres, setParametres] = useState(['']);
  const [problemDescription, setProblemDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [option, setOption] = useState('');
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [resultFontSize, setResultFontSize] = useState(14); 

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
    clearTimeout(typingTimeoutRef.current);
    setParametres(prevParametres => {
      const newParametres = [...prevParametres];
      newParametres[index] = value;
      return newParametres;
    });
    typingTimeoutRef.current = setTimeout(() => {
      setParametres(prevParametres => {
        const newParametres = [...prevParametres];
        newParametres[index] = replaceLatexSymbols(value);
        return newParametres;
      });
    }, 500);
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
    lineNumbers: false 
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
                  Taille de la police des résultats :
                  <select value={resultFontSize} onChange={(e) => setResultFontSize(parseInt(e.target.value))}>
                    <option value={12}>12</option>
                    <option value={14}>14</option>
                    <option value={16}>16</option>
                    <option value={18}>18</option>
                    <option value={20}>20</option>
                    <option value={22}>22</option>
                    <option value={24}>24</option>
                    <option value={26}>26</option>
                    <option value={28}>28</option>
                    <option value={30}>30</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Parametres:
                  {parametres.map((param, index) => (
                    <div key={index} className="parametre-container">
                      <div className="parametre-input">
                        <CodeMirror
                          className='codeMirrorParametrs'
                          value={param}
                          options={codeMirrorOptions}
                          onBeforeChange={(editor, data, value) => {
                            handleParamChange(index, value);
                          }}
                        />
                        <button type="button" onClick={() => removeParametre(index)} className="remove-button">
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <button type="button" onClick={addParametre}>
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                  ))}
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
                        clearTimeout(typingTimeoutRef.current);
                        typingTimeoutRef.current = setTimeout(() => {
                          setProblemDescription(replaceLatexSymbols(value));
                        }, 500);
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
                      clearTimeout(typingTimeoutRef.current);
                      typingTimeoutRef.current = setTimeout(() => {
                        setOption(replaceLatexSymbols(value));
                      }, 500);
                    }}
                  />
                </label>
              </div>
              <button type="submit">Soumettre</button>
            </form>
          </div>
          <div className="right" style={{ fontSize: `${resultFontSize}px` }}>
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
