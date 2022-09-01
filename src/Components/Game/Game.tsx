import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import itemData from "../../Data/item.json";
import CloseIcon from "@mui/icons-material/Close";
import Timer from "../Timer";
import { IconButton } from "@mui/material";
import { TailSpin } from "react-loader-spinner";

const Game: FunctionComponent<{
  setInGame: Dispatch<SetStateAction<boolean>>;
  prob: Array<number>;
  rank: number;
  rankMapping: Map<number, string>;
}> = ({ setInGame, prob, rank, rankMapping }) => {
  const items = Object.entries(itemData.data).filter((item: any) => {
    return item[1].gold.purchasable === true && !item[1].requiredChampion;
  });

  const numItems = items.length;

  const randItemNum = () => {
    let randNum = Math.random();
    let k = 0;
    let max = prob.length;

    for (let i = 0; i < max; i++) {
      k += prob[i];

      if (randNum < k) {
        return i + 1;
      }
    }
    return max;
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [init, setInit] = useState<boolean>(false);

  const [seconds, setSeconds] = useState<number>(60);
  const [guess, setGuess] = useState<number | undefined>();
  const [curNumItems, setCurNumItems] = useState<number>(randItemNum());
  const [curItems, setCurItems] = useState<Array<number>>([]);
  const [nextNumItems, setNextNumItems] = useState<number>(randItemNum());
  const [nextItems, setNextItems] = useState<Array<number>>([]);

  const [score, setScore] = useState<number>(0);
  const [endGame, setEndGame] = useState<boolean>(false);

  const [prevPrices, setPrevPrices] = useState<Array<number>>([]);
  const [prevItems, setPrevItems] = useState<Array<number>>([]);
  const [correctGuess, setCorrectGuess] = useState<number>();
  const [prevCorrect, setPrevCorrect] = useState<boolean>();

  const cacheImages = async (srcArray: any) => {
    const promises = await srcArray.map((src: any) => {
      return new Promise<void>(function (resolve, reject) {
        const img = new Image();

        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => reject();
      });
    });

    await Promise.all(promises);

    setIsLoading(false);
  };

  // initialze items
  useEffect(() => {
    let curItemArray = [];
    let nextItemArray = [];

    for (let i = 0; i < curNumItems; i++) {
      curItemArray.push(Math.floor(Math.random() * numItems));
    }

    const imgs = curItemArray.map((e) => {
      return (
        "https://leagueofitems.com/images/items/256/" +
        items[e][1]["image"]["full"].replace(".png", "") +
        ".webp"
      );
    });

    cacheImages(imgs);

    for (let j = 0; j < nextNumItems; j++) {
      nextItemArray.push(Math.floor(Math.random() * numItems));
    }

    setInit(true);
    setCurItems(curItemArray);
    setNextItems(nextItemArray);
  }, [init]);

  useEffect(() => {
    let itemArray = [];

    setCurItems(nextItems);

    for (let i = 0; i < nextNumItems; i++) {
      itemArray.push(Math.floor(Math.random() * numItems));
    }

    const imgs = itemArray.map((e) => {
      return (
        "https://leagueofitems.com/images/items/256/" +
        items[e][1]["image"]["full"].replace(".png", "") +
        ".webp"
      );
    });

    cacheImages(imgs);

    setNextItems(itemArray);
  }, [nextNumItems, numItems, prevItems, prevPrices]);

  const checkGuess = () => {
    let correctGuess = 0;
    let correctArray = [];

    for (const i of curItems) {
      let price = items[i][1]["gold"]["total"];
      correctGuess += price;
      correctArray.push(price);
    }

    setCorrectGuess(correctGuess);
    setPrevPrices(correctArray);

    let isCorrect = guess === correctGuess;
    setPrevCorrect(isCorrect);
    return isCorrect;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (checkGuess()) setScore(score + 1);

    setPrevItems(curItems);
    setGuess(undefined);
    setCurNumItems(nextNumItems);
    setNextNumItems(randItemNum());
  };

  useEffect(() => {
    const current_high_score = localStorage.getItem(
      rankMapping.get(rank)?.replace("Emblem_", "")!
    );

    if (score > parseInt(current_high_score!)) {
      localStorage.setItem(rankMapping.get(rank)!, score.toString());
    }
  }, [endGame]);
  return (
    <div className="game">
      {endGame ? (
        <div className="score_container">
          <h1 className="score_title">Score:</h1>
          <h1 className="score_text">{score}</h1>
          <button className="done_button" onClick={() => setInGame(false)}>
            Done
          </button>
        </div>
      ) : !isLoading ? (
        <>
          <div className="current_info">
            <div className="header">
              <IconButton
                aria-label="close"
                onClick={() => setInGame(false)}
                className="close_button"
              >
                <CloseIcon sx={{ color: "#EDB852" }} fontSize="large" />
              </IconButton>
            </div>
            <div className="item_info">
              <Timer
                seconds={seconds}
                setSeconds={setSeconds}
                setEndGame={setEndGame}
              />
              <h1 className="score_text">{score}</h1>
              <div className="item_selection">
                {curItems.map((e, index) => (
                  <img
                    src={
                      "https://leagueofitems.com/images/items/256/" +
                      items[e][1]["image"]["full"].replace(".png", "") +
                      ".webp"
                    }
                    key={index}
                    alt="item_icon"
                    className="current_items"
                  />
                ))}
              </div>
              <form onSubmit={handleSubmit} className="form_container">
                <div className="guess_container">
                  <label className="guess_label">
                    <input
                      className="guess_input"
                      type="numeric"
                      min="0"
                      value={guess || ""}
                      onChange={(e: any) => {
                        if (e.target.value !== "") {
                          setGuess(parseInt(e.target.value));
                        } else {
                          setGuess(undefined);
                        }
                      }}
                    />
                  </label>
                  <input
                    className="guess_submit"
                    type="submit"
                    value="Submit"
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="prev_info">
            <div className="correct_prices">
              {prevPrices.map((e, index) => (
                <div key={index + 10}>
                  <h1>{e}</h1>
                  <img
                    src={
                      "https://leagueofitems.com/images/items/256/" +
                      items[prevItems[index]][1]["image"]["full"].replace(
                        ".png",
                        ""
                      ) +
                      ".webp"
                    }
                    className="prev_items"
                    alt="item_icon"
                  />
                </div>
              ))}
            </div>

            <h1 className={prevCorrect ? "correct_sum" : "incorrect_sum"}>
              {correctGuess}
            </h1>
          </div>
        </>
      ) : (
        <TailSpin
          wrapperClass="spinner"
          color="#445fa5"
          height="200"
          width="200"
        ></TailSpin>
      )}
    </div>
  );
};

export default Game;
