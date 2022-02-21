import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import './App.css';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';

import { useCallback, useEffect, useState } from "react";

import { makeStyles } from "makeStyles";
import { Game, GameComboTitles, GameType } from "game";

interface Color {
  color?: string
}

const useStyles = makeStyles<Color>()((_theme, { color }) => ({
  "root": {
    "backgroundColor": color
  },

  "radio": {
    paddingRight: "0.5em",
    whiteSpace: "nowrap"
  }
})
);



function App() {

  let [answer, setAnswer] = useState<string>("");
  let [solution, setSolution] = useState<string | undefined>();
  let [color, setColor] = useState<string | undefined>();
  let [gameType, setGameType] = useState<GameType>(GameType.Random);
  let [game, setGame] = useState<Game>(new Game(gameType));

  const { classes } = useStyles({ color: color });

  useEffect( ()=>{
    let input : HTMLInputElement|null = document.querySelector("input#in");
    if (input) {
      setTimeout(()=>{input!.focus();});
    }
  });

  const newGame = useCallback(() => {
    setColor(undefined);
    setSolution(undefined);
    setAnswer("");
    setGame(new Game(gameType));
  }, [gameType]);

  const doSetGame = useCallback((gt: GameType) => {
    setGameType(gt);
    newGame();
    setGame(new Game(gt));
  }, [newGame]);

  const showSolution = useCallback( (color?: string) => {
    setColor(color);
    setSolution(game.solution)
    setTimeout(newGame, 2000);
  }, [game, newGame]);

  const validateAnswer = useCallback( () => {
    showSolution(game.isValid(answer!) ? "lime" : "pink");
  }, [game, answer, showSolution]);


  const radios: JSX.Element[] = [];
  for (let entry of GameComboTitles.entries()) {
    const type: GameType = entry[0];
    const key = type.toString();

    radios.push(<span key={key} className={classes.radio} >
      <RadioButton  inputId={key} name={key}
        value={type}
        onChange={(e) => doSetGame(e.value)}
        checked={gameType === type} />
      <label htmlFor={key}>{entry[1]}</label>
    </span>);
  }


  const footer = <>
    <Button label="Validate" icon="pi pi-check" onClick={() => validateAnswer()} style={{ marginRight: '.25em' }} />
    <Button label="Skip" icon="pi pi-times" onClick={() => showSolution()} className="p-button-secondary" />
  </>;

  return (
    <div>
      <Card title="Game type" className={classes.root}>
        {radios}
      </Card>
      <Card title="Quiz" subTitle={game.question} className={classes.root} footer={footer}>
        {solution}
        <InputText  hidden={solution !== undefined } 
                    id="in" 
                    onKeyDown={e => e.key === 'Enter' && validateAnswer()}
                    value={answer} onChange={(e) => setAnswer(e.target.value)} />
      </Card>
    </div>
  );
}


export default App;
