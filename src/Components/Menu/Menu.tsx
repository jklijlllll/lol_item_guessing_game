import { Slider } from "@mui/material";
import "../../Styles/styles.css";
import { Dispatch, FunctionComponent, SetStateAction } from "react";

const Menu: FunctionComponent<{
  rank: number;
  setRank: Dispatch<SetStateAction<number>>;
  path: string;
  setPath: Dispatch<SetStateAction<string>>;
  rankMapping: Map<number, string>;
  setInGame: Dispatch<SetStateAction<boolean>>;
}> = ({ rank, setRank, path, setPath, rankMapping, setInGame }) => {
  const handleChange = (event: any, newValue: any) => {
    setRank(newValue);
    setPath("Emblem_" + rankMapping.get(newValue)!);
  };

  return (
    <div className="menu">
      <img
        className="logo"
        src={require("../../Media/logo.png")}
        alt={"logo"}
      ></img>
      <h1 className="title_text">Item Guessing Game</h1>
      <div className="high_score_container">
        <h1 className="high_score_text">
          High Score: {localStorage.getItem(rankMapping.get(rank)!)}
        </h1>
      </div>
      <img
        className="rank_icon"
        src={require("../../Media/Rank_Icons/" + path + ".png")}
        alt={path}
      ></img>
      <Slider
        size="small"
        aria-label="Rank"
        value={rank}
        track={false}
        onChange={handleChange}
        step={1}
        marks
        min={0}
        max={rankMapping.size - 1}
      />
      <button className="play_button" onClick={() => setInGame(true)}>
        PLAY
      </button>
    </div>
  );
};

export default Menu;
