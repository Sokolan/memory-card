import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import "./App.css";
import Score from "./components/Score";
import CardsBoard from "./components/CardsBoard";
import WinModal from "./components/WinModal";

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

function App() {
  const [numebrOfCards, setNumberOfCards] = useState(15);
  const [cardsInformation, setCardsInformation] = useState(
    Array(numebrOfCards)
      .fill(null)
      .map(() => {
        return { id: uuid(), name: "", imgUrl: "", clicked: false };
      })
  );

  function setEasyMode() {
    setNumberOfCards(1);
    setCardsInformation(cardsInformation.slice(0, 1));
  }
  const [score, setScore] = useState({ score: 0, maxScore: 0 });

  useEffect(() => {
    async function fetchAndFillArray() {
      const cardsArrayFilled = await createCardsArray(numebrOfCards);
      setCardsInformation(cardsArrayFilled);
    }
    fetchAndFillArray();
  }, []);

  function shuffleCardsArray(cardsArray) {
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

    return cardsArrayShuffled;
  }

  const handleCardClick = (clickedCardId) => {
    const currentScore = score.score;
    const currentCard = cardsInformation.find(
      (card) => card.id === clickedCardId
    );

    if (currentCard.clicked) {
      setCardsInformation(
        shuffleCardsArray(
          cardsInformation.map((card) => {
            return { ...card, clicked: false };
          })
        )
      );
      setScore({ ...score, score: 0 });
      return;
    } else {
      setCardsInformation(
        shuffleCardsArray(
          cardsInformation.map((card) => {
            if (card.id === currentCard.id) {
              return { ...card, clicked: true };
            }
            return card;
          })
        )
      );
      if (score.score + 1 <= score.maxScore) {
        setScore({ ...score, score: currentScore + 1 });
      } else {
        setScore({
          ...score,
          score: currentScore + 1,
          maxScore: score.maxScore + 1,
        });
      }
    }
  };

  const resetScore = () => {
    setScore({ ...score, score: 0 });
    setCardsInformation(
      cardsInformation.map((card) => {
        return { ...card, clicked: false };
      })
    );
  };

  return (
    <div className="App">
      <WinModal
        score={score.score}
        numebrOfCards={numebrOfCards}
        resetScore={resetScore}
      />
      <header>
        <div className="headerDescription">
          <h1>Memory Cards</h1>
          <p>
            Get points by clicking on an image but don&apos;t click on any more
            than once!
          </p>
        </div>
        <Score score={score} />
      </header>
      <CardsBoard
        cardsInformation={cardsInformation}
        handleCardClick={handleCardClick}
      />
      <button onClick={() => setEasyMode()}>Click here for easy mode</button>
    </div>
  );
}

export default App;
