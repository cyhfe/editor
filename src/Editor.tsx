import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import * as React from "react";
import { Layer, Stage, Image, Transformer } from "react-konva";
import useImage from "use-image";
import { v4 as uuidv4 } from "uuid";
interface EditorContextValue {
  layers: EditorLayers;
  setLayers: React.Dispatch<React.SetStateAction<EditorLayers>>;
  trRef: React.MutableRefObject<any>;
  selectedId: string[];
  setSelectedId: React.Dispatch<React.SetStateAction<string[]>>;
}

const EditorContext = React.createContext<EditorContextValue | null>(null);
const useEditor = () => {
  const ctx = React.useContext(EditorContext);
  if (ctx === null) {
    throw new Error("useEditor must be used within a EditorProvider");
  }
  return ctx;
};

type EditorLayers = EditorLayer[];
interface EditorLayer {
  id: string;
  type: "image";
  src: string;
}

interface KonvaImageProps {
  src: string;
  id: string;
}
function KonvaImage({ src, id }: KonvaImageProps) {
  const [image] = useImage(src);
  const { trRef, selectedId, setSelectedId } = useEditor();
  const isSelected = selectedId.includes(id);
  const imageRef = React.useRef<Konva.Image>(null);
  React.useEffect(() => {
    const tr = trRef.current;
    if (tr) {
      if (isSelected && imageRef.current) {
        // we need to attach transformer manually
        tr.nodes([imageRef.current]);
        tr.getLayer().batchDraw();
      } else {
        tr.nodes([]);
        tr.getLayer().batchDraw();
      }
    }

    console.log(trRef, isSelected);
  }, [image, isSelected, trRef]);
  return (
    <>
      <Image
        ref={imageRef}
        image={image}
        draggable
        onClick={() => {
          setSelectedId((prev) => {
            if (prev.includes(id)) {
              return prev.filter((prevId) => prevId !== id);
            } else {
              return [...prev, id];
            }
          });
        }}
      />
    </>
  );
}

export default function Editor() {
  const [layers, setLayers] = React.useState<EditorLayers>([]);
  const trRef = React.useRef<any>(null);
  const [selectedId, setSelectedId] = React.useState<string[]>([]);
  const value = React.useMemo(() => {
    return {
      layers,
      setLayers,
      trRef,
      selectedId,
      setSelectedId,
    };
  }, [layers, selectedId]);

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
  const { setLayers, selectedId } = useEditor();
  return (
    <div>
      {images.map((src) => {
        return (
          <img
            onClick={() => {
              const id = uuidv4();
              setLayers((prev) => [
                ...prev,
                {
                  type: "image",
                  src,
                  id,
                },
              ]);
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
  const { layers, setSelectedId, trRef } = useEditor();
  // const trRef = React.useRef<Konva.Transformer>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const stage = ref.current;
    const container = containerRef.current;
    if (!stage || !container) return;
    stage.width(container.offsetWidth);
    stage.height(container.offsetHeight);
  }, []);

  function checkDeselect(
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId([]);
    }
  }

  return (
    <div className="grow w-full h-full p-2" ref={containerRef}>
      <Stage
        ref={ref}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        className="w-full h-[600px] outline-2 outline-slate-400 outline-dashed overflow-hidden"
      >
        <Layer>
          {layers.map((layer) => {
            if (layer.type === "image") {
              return (
                <KonvaImage src={layer.src} id={layer.id} key={layer.id} />
              );
            } else {
              return null;
            }
          })}

          <Transformer
            ref={trRef}
            flipEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};
