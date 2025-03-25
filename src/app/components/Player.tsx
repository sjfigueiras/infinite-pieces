'use client';
import * as Tone from "tone";
import { useState } from "react";

const Player = () => {
  // const [player, setPlayer] = useState<Tone.Player | null>(null);
  const [mute, setMute] = useState<Tone.Player | null>(null);
  
  const onVolumeChange = () => {
    debugger;
    const toneDestination = Tone.getDestination();
    // toneDestination.mute = controls.muted;
    // toneDestination.output.gain.value = controls.volume;
  }

  const onPlay = async () => {
    await Tone.start();
    const transport = Tone.getTransport().start();

    const Entusiasmo = await import('./pieces/entusiasmo');

    await Tone.loaded();

    console.log(transport.state)

    console.log(Entusiasmo);
    // document.querySelector('#tone-load-feedback')!.innerText =
    //   'Audio files loaded!';
    // drawAnalysers(registeredLFOs);
  }

  const onPause = () => {
    Tone.getTransport().stop();
    Tone.getDestination().mute = true;

    // For now, force student to reload page after stopping
    // so we don't have to deal with disposing nodes and weird "restart" behavior
    const controlsContainer = document.getElementById('controls-container')!;
    // controlsContainer.removeChild(controls);

    const reloadButton = document.createElement('button');
    reloadButton.innerText = 'Refresh';

    reloadButton.addEventListener('click', () => {
      window.location.reload();
    });

    controlsContainer.append(reloadButton);
  }

  const AUTO_PLAYBACK_KEY_NAME = 'InfinitePieces.Settings.PlayAutomatically';

  const handleRestartBehavior = () => {
    const shouldPlayAutomatically =
      localStorage.getItem(AUTO_PLAYBACK_KEY_NAME) === 'true';
    const automaticPlaybackCheckbox = document.getElementById(
      'automatic-play-checkbox'
    ) as HTMLInputElement;
    if (shouldPlayAutomatically) {
      automaticPlaybackCheckbox.checked = true;
      const controls = document.getElementById('controls') as HTMLAudioElement;
      controls.play();
    }
    automaticPlaybackCheckbox.addEventListener('change', () => {
      localStorage.setItem(
        AUTO_PLAYBACK_KEY_NAME,
        automaticPlaybackCheckbox.checked.toString()
      );
    });
  };

  const assignVersion = () => {
    const versionTag = document.getElementById(
      'version-link'
    ) as HTMLAnchorElement;
    versionTag.innerText = `Tone.js version ${Tone.version}`;
    versionTag.href = `https://tonejs.github.io/docs/${Tone.version}/`;
  };

  // Extract: Anaylzer Plotting
  // Como podemos acceder a los tipos de Tone
  const drawAnalysers = (registeredLFOs: any) => {

    function draw(ctx: any, canvas: any, analyser: any) {
      requestAnimationFrame(() => draw(ctx, canvas, analyser));
      const values = analyser.getValue();

      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#ff0077';
      ctx.lineWidth = 2;

      // Dibujar la forma de onda
      for (let i = 0; i < values.length; i++) {
        const x = (i / values.length) * canvas.width;
        const y = (1 - (values[i] +1) / 2) * canvas.height;
        if (i === 0) {
          ctx.moveTo(x, y );
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }

    const lfoContainer = document.getElementById("lfo-container")!;
    registeredLFOs.length > 0
    && lfoContainer.appendChild(document.createTextNode("LFOs")) 
    && lfoContainer.appendChild(document.createElement("br"))
    && lfoContainer.appendChild(document.createElement("br"));

    registeredLFOs.forEach((registeredLFO: any, i: number) => {
      // Configurar canvas
      const canvas = document.createElement("canvas");
      canvas.setAttribute("id", `anaylser-node-${i}`);
      canvas.setAttribute("style", "background-color: white");

      lfoContainer.appendChild(document.createTextNode(registeredLFO.name));
      lfoContainer.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      canvas.width = 200;
      canvas.height = 200;

      draw(ctx, canvas, registeredLFO.analyser);
    });
  }; 

  const onLoad = () => {
    console.log('DOMloaded')
    assignVersion();
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
      <section>
        <input
          type="checkbox"
          id="automatic-play-checkbox"
          name="automatic-play-checkbox"
        />
        <label htmlFor="automatic-play-checkbox">Try to play automatically on page load</label>
      </section>
      <p id="tone-load-feedback"></p>
      <section id="lfo-container" />
    </div>
  );
};

export default Player;
