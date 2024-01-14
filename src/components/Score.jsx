import { useEffect } from "react";

export default function Score({ score }) {
  return (
    <div className="scoreContainer">
      <p>Score: {score.score}</p>
      <p>Best Score: {score.maxScore}</p>
    </div>
  );
}
