import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ApiDemoPage.css';

const ApiDemoPage = () => {
  const [characters, setCharacters] = useState([]);
  const [randomFact, setRandomFact] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get('https://rickandmortyapi.com/api/character');
        setCharacters(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Error fetching characters from Rick and Morty API');
      }
    };

    const fetchCatFact = async () => {
      try {
        const response = await axios.get('https://meowfacts.herokuapp.com/');
        setRandomFact(response.data.data[0]);
      } catch (err) {
        setError('Error fetching cat fact');
      }
    };

    fetchCharacters();
    fetchCatFact();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="api-demo-page">
      <h1 className="title">API Demo: Rick and Morty + Cat Facts</h1>

      <div className="rick-morty-section">
        <h2>Characters from Rick and Morty</h2>
        <div className="character-grid">
          {characters.map(character => (
            <div key={character.id} className="character-card">
              <img src={character.image} alt={character.name} className="character-image" />
              <h3 className="character-name">{character.name}</h3>
              <p className="character-species">Species: {character.species}</p>
              <p className="character-status">Status: {character.status}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cat-fact-section">
        <h2>Random Cat Fact</h2>
        <p>{randomFact || "Loading cat fact..."}</p>
      </div>
    </div>
  );
};

export default ApiDemoPage;
