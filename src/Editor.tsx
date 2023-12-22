import Konva from "konva";
import * as React from "react";
import { Layer, Stage, Image } from "react-konva";
import useImage from "use-image";

interface EditorContextValue {
  layers: EditorLayers;
  setLayers: React.Dispatch<React.SetStateAction<EditorLayers>>;
}

const EditorContext = React.createContext<EditorContextValue | null>(null);
const useEditor = () => {
  const ctx = React.useContext(EditorContext);
  if (ctx === null) {
    throw new Error("useEditor must be used within a EditorProvider");
  }
  return ctx;
};

type EditorLayers = React.ReactNode[];

function KonvaImage({ src }: { src: string }) {
  const [image] = useImage(src);
  return <Image image={image} draggable />;
}

export default function Editor() {
  const [layers, setLayers] = React.useState<EditorLayers>([]);

  const value = React.useMemo(() => {
    return {
      layers,
      setLayers,
    };
  }, [layers]);

  return (
    <EditorContext.Provider value={value}>
      <div className="flex">
        <Panel />
        <Canvas />
      </div>
    </EditorContext.Provider>
  );
}

const images = ["/bag.webp", "/chair.webp", "/headphones.webp"];

function Panel() {
  const { setLayers } = useEditor();
  return (
    <div>
      {images.map((src) => {
        return (
          <img
            onClick={() => {
              setLayers((prev) => [...prev, <KonvaImage src={src} />]);
            }}
            src={src}
            alt=""
            key={src}
            width={100}
            height={100}
            className="border"
          />
        );
      })}
    </div>
  );
}

const Canvas = () => {
  const ref = React.useRef<Konva.Stage>(null);
  const { layers } = useEditor();
  // const handleExport = () => {
  //   const uri = ref.current?.toDataURL();
  //   console.log(uri);
  // };

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const stage = ref.current;
    const container = containerRef.current;
    if (!stage || !container) return;
    stage.width(container.offsetWidth);
    stage.height(container.offsetHeight);
  }, []);

  return (
    <div className="grow w-full h-full p-2" ref={containerRef}>
      <Stage
        ref={ref}
        className="w-full h-[600px] outline-2 outline-slate-400 outline-dashed overflow-hidden"
      >
        <Layer>{layers}</Layer>
      </Stage>
    </div>
  );
};
