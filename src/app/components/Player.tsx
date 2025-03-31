"use client";
import * as Tone from "tone";
import { useEffect, useState } from "react";
import { Piece } from "./pieces/types";

export interface PlayerProps {
  piece: Piece;
}

const Player = ({ piece }: PlayerProps) => {
  // const [player, setPlayer] = useState<Tone.Player | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [dbValue, setDbValue] = useState(Tone.gainToDb(1));

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
    setDbValue(gainToDb);
  }, [volume]);

  const onVolumeChange = (event: React.ChangeEvent<HTMLAudioElement>) => {
    const volumeChanged = event.target.volume !== volume;

    volumeChanged
      ? setVolume(event.target.volume)
      : setMuted(event.target.muted);
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

    // // For now, force student to reload page after stopping
    // // so we don't have to deal with disposing nodes and weird "restart" behavior
    // const controlsContainer = document.getElementById('controls-container')!;
    // // controlsContainer.removeChild(controls);

    // const reloadButton = document.createElement('button');
    // reloadButton.innerText = 'Refresh';

    // reloadButton.addEventListener('click', () => {
    //   window.location.reload();
    // });

    // controlsContainer.append(reloadButton);
  };

  const AUTO_PLAYBACK_KEY_NAME = "InfinitePieces.Settings.PlayAutomatically";

  /**
   * TODO: Migrate auto-playback from Vanilla JS to React
   */
  const handleRestartBehavior = () => {
    const shouldPlayAutomatically =
      localStorage.getItem(AUTO_PLAYBACK_KEY_NAME) === "true";
    const automaticPlaybackCheckbox = document.getElementById(
      "automatic-play-checkbox",
    ) as HTMLInputElement;

    if (shouldPlayAutomatically) {
      automaticPlaybackCheckbox.checked = true;
      const controls = document.getElementById("controls") as HTMLAudioElement;
      controls.play();
    }

    automaticPlaybackCheckbox.addEventListener("change", () => {
      localStorage.setItem(
        AUTO_PLAYBACK_KEY_NAME,
        automaticPlaybackCheckbox.checked.toString(),
      );
    });
  };

  const onLoad = () => {
    handleRestartBehavior();
  };

  return (
    <div onLoad={onLoad}>
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
      {/* <section>
        <input
          type="checkbox"
          id="automatic-play-checkbox"
          name="automatic-play-checkbox"
        />
        <label htmlFor="automatic-play-checkbox">Try to play automatically on page load</label>
      </section> */}
      {/* <p id="tone-load-feedback"></p> */}
      <section id="lfo-container" />
    </div>
  );
};

export default Player;
