"use client";
import * as Tone from "tone";
import { useEffect, useState } from "react";
import { Piece } from "../pieces/registry";

export interface PlayerProps {
  piece: Piece;
  audioComponent?: HTMLAudioElement | null;
  setAudioComponent: (audio: HTMLAudioElement) => void;
}

const Player = ({ piece, setAudioComponent }: PlayerProps) => {
  // const [player, setPlayer] = useState<Tone.Player | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);

  useEffect(() => {
    const audio = document.querySelector("audio") as HTMLAudioElement;
    setAudioComponent(audio);
  }, []);

  useEffect(() => {
    console.log({ piece });
  }, [piece]);

  useEffect(() => {
    Tone.getDestination().mute = muted;
  }, [muted]);

  useEffect(() => {
    /**
     * We have to convert Gain (0.0-1.0) to
     * DBFS (-Infinite-0) before passing the
     * volume change to Tone.
     */
    const gainToDb = Tone.gainToDb(volume);
    console.log(gainToDb);
    Tone.getDestination().volume.value = gainToDb;
  }, [volume]);

  const onVolumeChange = (event: React.ChangeEvent<HTMLAudioElement>) => {
    const volumeChanged = event.target.volume !== volume;

    if (volumeChanged) {
      setVolume(event.target.volume);
    } else {
      setMuted(event.target.muted);
    }
  };

  const onPlay = async () => {
    Tone.getDestination().mute = false;
    Tone.getTransport().start();
    await Tone.start();
    await Tone.loaded();
  };

  const onPause = () => {
    Tone.getTransport().stop();
    Tone.getDestination().mute = true;
  };

  return (
    <section id="controls-container">
      <audio
        id="controls"
        controls
        loop
        src="/silence.mp3"
        onPlay={onPlay}
        onPause={onPause}
        onVolumeChange={onVolumeChange}
      ></audio>
    </section>
  );
};

export default Player;
