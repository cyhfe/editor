import { Stage, Layer, Star, Text, Image as KonvaImage1 } from "react-konva";
import Konva from "konva";
import * as React from "react";
import useImage from "use-image";
import { UploadRoot, UploadInput, useUpload } from "@cyhfe/react-ui";
import { Panel } from "./Panel";

function KonvaImage({ src }: { src: string }) {
  const [image] = useImage(src);
  return <KonvaImage1 image={image} draggable />;
}

const Canvas = () => {
  const ref = React.useRef<Konva.Stage>(null);

  const handleExport = () => {
    const uri = ref.current?.toDataURL();
    console.log(uri);
  };

  const containerRef = React.useRef<HTMLDivElement>(null);

  const { imageList } = useEditor();

  function getImages() {
    return imageList.map((image) => {
      const src = URL.createObjectURL(image.file);
      return <KonvaImage src={src} key={image.id} />;
    });
  }

  React.useEffect(() => {
    const stage = ref.current;
    const container = containerRef.current;
    if (!stage || !container) return;
    stage.width(container.offsetWidth);
    stage.height(container.offsetHeight);
  }, []);

  return (
    <div className="grow w-full h-full p-2" ref={containerRef}>
      <button onClick={handleExport}>export</button>
      <Stage
        ref={ref}
        className="w-full h-[600px] outline-2 outline-slate-400 outline-dashed"
      >
        <Layer>
          {/* <LionImage />
          <LionImage /> */}
          {getImages()}
        </Layer>
      </Stage>
    </div>
  );
};

interface EditorContextValue {
  imageList: FileWithId[];
  setImageList: React.Dispatch<React.SetStateAction<FileWithId[]>>;
}

const EditorContext = React.createContext<EditorContextValue | null>(null);
export const useEditor = () => {
  const ctx = React.useContext(EditorContext);
  if (ctx === null) {
    throw new Error("useEditor must be used within a EditorProvider");
  }
  return ctx;
};

type FileWithId = {
  file: File;
  id: string;
};

function App() {
  const [imageList, setImageList] = React.useState<FileWithId[]>([]);
  const value = React.useMemo(() => {
    return {
      imageList,
      setImageList,
    };
  }, [imageList]);
  return (
    <EditorContext.Provider value={value}>
      <div className="flex">
        <Panel />
        <Canvas />
      </div>
    </EditorContext.Provider>
  );
}

export default App;
