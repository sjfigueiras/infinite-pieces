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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
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

  const onVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  const togglePlay = async () => {
    if (isPlaying) {
      Tone.getTransport().stop();
      Tone.getDestination().mute = true;
      setIsPlaying(false);
    } else {
      Tone.getDestination().mute = false;
      Tone.getTransport().start();
      await Tone.start();
      await Tone.loaded();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <section className="flex items-center gap-4 bg-black/10 backdrop-blur-sm p-4 rounded-lg">
      <button
        onClick={togglePlay}
        className="p-2 rounded-full hover:bg-black/20 transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25v13.5m-7.5-13.5v13.5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z"
            />
          </svg>
        )}
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-black/20 transition-colors"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
          className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
      </div>

      <audio id="controls" loop src="/silence.mp3"></audio>
    </section>
  );
};

export default Player;
