import Card from "./Card";
import "../styles/cardsBoard.css";

export default function CardsBoard({ cardsInformation, handleCardClick }) {
  return (
    <div className="cardsBoard">
      {cardsInformation.map((card) => {
        return (
          <button onClick={() => handleCardClick(card.id)} key={card.id}>
            <Card name={card.name} imgUrl={card.imgUrl} />
          </button>
        );
      })}
    </div>
  );
}
