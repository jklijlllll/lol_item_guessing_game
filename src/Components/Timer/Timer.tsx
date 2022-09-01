import React from "react";
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";

const Timer: FunctionComponent<{
  seconds: number;
  setSeconds: Dispatch<SetStateAction<number>>;
  setEndGame: Dispatch<SetStateAction<boolean>>;
}> = ({ seconds, setSeconds, setEndGame }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [setSeconds]);

  useEffect(() => {
    if (seconds === 0) setEndGame(true);
  }, [seconds, setEndGame]);
  return (
    <div className="timer">
      <h1>
        {Math.floor(seconds / 60) +
          ":" +
          (seconds % 60 < 10 ? "0" + (seconds % 60) : seconds % 60)}
      </h1>
    </div>
  );
};

export default Timer;
