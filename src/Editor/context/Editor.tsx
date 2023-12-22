import Konva from "konva";
import * as React from "react";

type EditorLayers = EditorLayer[];
interface EditorLayer {
  id: string;
  type: "image";
  src: string;
}

interface EditorContextValue {
  layers: EditorLayers;
  setLayers: React.Dispatch<React.SetStateAction<EditorLayers>>;
  trRef: React.RefObject<Konva.Transformer>;
  stageRef: React.RefObject<Konva.Stage>;
  selectionRef: React.RefObject<Konva.Rect>;
}

const EditorContext = React.createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [layers, setLayers] = React.useState<EditorLayers>([]);
  const trRef = React.useRef<Konva.Transformer>(null);

  const stageRef = React.useRef<Konva.Stage>(null);
  const selectionRef = React.useRef<Konva.Rect>(null);
  const value = React.useMemo(() => {
    return {
      layers,
      setLayers,
      trRef,
      stageRef,
      selectionRef,
    };
  }, [layers]);
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export const useEditor = () => {
  const ctx = React.useContext(EditorContext);
  if (ctx === null) {
    throw new Error("useEditor must be used within a EditorProvider");
  }
  return ctx;
};
