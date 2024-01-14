import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import "./App.css";
import Score from "./components/Score";
import CardsBoard from "./components/CardsBoard";

async function createPokemon(id) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id + 1}`);
  if (!pokemon.ok) return "ERROR";
  const pokemonJson = await pokemon.json();
  return {
    name: pokemonJson.name,
    imgUrl: pokemonJson.sprites.other["official-artwork"].front_default,
    id: uuid(),
    clicked: false,
  };
}

async function createCardsArray(size) {
  const cardsPromises = Array(size)
    .fill(null)
    .map((_, index) => createPokemon(index));
  const cardsArray = await Promise.all(cardsPromises);
  return cardsArray;
}

function shuffleCardsArray(cardsArray, setCardsArray) {
  const cardsArrayShuffled = cardsArray.slice();
  let n = cardsArray.length;

  while (n > 0) {
    const i = Math.floor(Math.random() * n);
    n -= 1;
    [cardsArrayShuffled[i], cardsArrayShuffled[n]] = [
      cardsArrayShuffled[n],
      cardsArrayShuffled[i],
    ];
  }

  setCardsArray(cardsArrayShuffled);
}

function App() {
  const numebrOfCards = 15;
  const [cardsInformation, setCardsInformation] = useState(
    Array(numebrOfCards)
      .fill(null)
      .map(() => {
        return { id: uuid(), name: "", imgUrl: "", clicked: false };
      })
  );

  useEffect(() => {
    async function fetchAndFillArray() {
      const cardsArrayFilled = await createCardsArray(numebrOfCards);
      setCardsInformation(cardsArrayFilled);
    }
    fetchAndFillArray();
  }, []);

  const handleCardClick = (clickedCardId) => {
    if (cardsInformation.find((card) => card.id === clickedCardId).clicked) {
      setCardsInformation(
        cardsInformation.map((card) => {
          return { ...card, clicked: false };
        })
      );
    }
    shuffleCardsArray(cardsInformation, setCardsInformation);
  };

  return (
    <div className="App">
      <header>
        <div className="headerDescription">
          <h1>Memory Cards</h1>
          <p>
            Get points by clicking on an image but don&apos;t click on any more
            than once!
          </p>
        </div>
        <Score />
      </header>
      <CardsBoard
        cardsInformation={cardsInformation}
        handleCardClick={handleCardClick}
      />
    </div>
  );
}

export default App;
