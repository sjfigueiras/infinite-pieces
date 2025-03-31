import * as Tone from "tone";

const uprightMap = {
  A0: "a0.wav",
  "C#1": "csharp1.wav",
  F1: "f1.wav",
  "C#2": "csharp2.wav",
  F2: "f2.wav",
  A2: "a2.wav",
  "C#3": "csharp3.wav",
  F3: "f3.wav",
  A3: "a3.wav",
  "C#4": "csharp4.wav",
  F4: "f4.wav",
  A4: "a4.wav",
  "C#5": "csharp5.wav",
  F5: "f5.wav",
  A5: "a5.wav",
  "C#6": "csharp6.wav",
  F6: "f6.wav",
  A6: "a6.wav",
  "C#7": "csharp7.wav",
  F7: "f7.wav",
  A7: "a7.wav",
  C8: "c8.wav",
};

const samplerConfig = {
  baseUrl: "/samples/vsco2-ce/upright-piano/",
  onload: async function () {
    return Tone.start();
  },
};

export function createUprightSampler(): Tone.Sampler {
  return new Tone.Sampler(
    uprightMap,
    samplerConfig.onload,
    samplerConfig.baseUrl,
  );
}
