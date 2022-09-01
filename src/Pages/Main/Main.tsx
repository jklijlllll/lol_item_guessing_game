import Menu from "../../Components/Menu";
import Game from "../../Components/Game";
import { FunctionComponent, useEffect, useState } from "react";

const Main: FunctionComponent<{}> = (_) => {
  const [rank, setRank] = useState<number>(2);
  const [path, setPath] = useState<string>("Emblem_Silver");
  const [inGame, setInGame] = useState<boolean>(false);
  const [prob, setProb] = useState<Array<number>>([]);

  const rankMapping = new Map([
    [0, "Iron"],
    [1, "Bronze"],
    [2, "Silver"],
    [3, "Gold"],
    [4, "Platinum"],
    [5, "Diamond"],
    [6, "Master"],
    [7, "Grandmaster"],
    [8, "Challenger"],
  ]);

  useEffect(() => {
    rankMapping.forEach((value: string) => {
      localStorage.setItem(value, "0");
    });
  }, []);

  useEffect(() => {
    const diffMapping = new Map([
      [0, [1, 0, 0, 0, 0]],
      [1, [0.8, 0.2, 0, 0, 0]],
      [2, [0.6, 0.4, 0, 0, 0]],
      [3, [0.5, 0.5, 0, 0, 0]],
      [4, [0.4, 0.5, 0.1, 0, 0]],
      [5, [0.2, 0.4, 0.3, 0.1, 0]],
      [6, [0, 0.3, 0.5, 0.2, 0]],
      [7, [0, 0.1, 0.6, 0.3, 0]],
      [8, [0, 0, 0.3, 0.5, 0.2]],
    ]);

    if (rank !== undefined) setProb(diffMapping.get(rank)!);
  }, [rank]);

  return (
    <div className="app_container">
      {inGame ? (
        <Game
          setInGame={setInGame}
          prob={prob}
          rank={rank}
          rankMapping={rankMapping}
        ></Game>
      ) : (
        <Menu
          rank={rank}
          setRank={setRank}
          path={path}
          setPath={setPath}
          rankMapping={rankMapping}
          setInGame={setInGame}
        />
      )}
    </div>
  );
};

export default Main;
