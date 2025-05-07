declare module "canvas-sketch" {
  interface SketchSettings {
    dimensions?: string | [number, number];
    animate?: boolean;
    canvas?: HTMLCanvasElement | null;
    pixelsPerInch?: number;
    scaleToView?: boolean;
    units?: string;
  }

  interface SketchProps {
    audioComponent?: HTMLAudioElement;
    context: CanvasRenderingContext2D;
    height: number;
    playhead: number;
    time: number;
    width: number;
  }

  type SketchFunction = (props: SketchProps) => void;

  export default function canvasSketch(
    sketch: SketchFunction,
    settings: SketchSettings,
  ): CanvasSketchManager;
}
