import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Importez votre fichier CSS ici

function App() {
  const [message, setMessage] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [code, setCode] = useState('');
  const [option, setOption] = useState('');

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
        const response = await axios.post('http://localhost:5086/api/OptimalControl', { problemDescription: problemDescription });
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
                  {/* Ajoutez la classe "textarea-code" pour appliquer la coloration syntaxique */}
                  <textarea 
                    className="textarea-code" 
                    value={problemDescription} 
                    onChange={(e) => setProblemDescription(e.target.value)} 
                  />
                </label>
              </div>
              <button type="submit">Soumettre</button>
            </form>
          </div>
          <div className="right">
            {solution && (
              <div>
                <h2>Test_back</h2>
                <p>{solution}</p>
                <h2>Code</h2>
                <pre>{code}</pre>
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
