import "../styles/winModal.css"

export default function WinModal({ numebrOfCards, score, resetScore }) {
  if (numebrOfCards === score) {
    return (
      <button className="winModal" onClick={() => resetScore()}>
        <p>Congratulations, You Have Wan!</p>
        <p>Click to play again</p>
      </button>
    );
  } else return null;
}
