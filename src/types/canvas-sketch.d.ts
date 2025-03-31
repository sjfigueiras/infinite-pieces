declare module 'canvas-sketch' {
    interface SketchSettings {
        dimensions?: string | [number, number];
        animate?: boolean;
        canvas?: HTMLCanvasElement | null;
        pixelsPerInch?: number;
        scaleToView?: boolean;
        units?: string;
    }

    interface SketchProps {
        context: CanvasRenderingContext2D;
        width: number;
        height: number;
        time: number;
    }

    type SketchFunction = (props: SketchProps) => void;

    export default function canvasSketch(
        sketch: SketchFunction,
        settings: SketchSettings
    ): void;
}
