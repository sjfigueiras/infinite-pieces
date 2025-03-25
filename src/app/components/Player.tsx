'use client';
import * as Tone from "tone";
import { useState } from "react";

const Player = () => {
  const [player, setPlayer] = useState<Tone.Player | null>(null);

  const loadSample = async () => {
    const newPlayer = new Tone.Player("/samples/vsco2-ce/upright-piano/a0.wav").toDestination();
    setPlayer(newPlayer);
  };

  const playSample = () => {
    if (player) {
      player.start();
    }
  };

  return (
    <div>
      <button onClick={loadSample}>Cargar Sample</button>
      <button onClick={playSample} disabled={!player}>
        Reproducir
      </button>
    </div>
  );
};

export default Player;
