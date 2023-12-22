import Konva from "konva";
import * as React from "react";
import { Layer, Stage } from "react-konva";

export default function Editor() {
  const [layer, setLayer] = React.useState([]);
  return (
    <div className="flex">
      <Panel />
      <Canvas />
    </div>
  );
}

const images = ["/bag.webp", "/chair.webp", "/headphones.webp"];

function Panel() {
  return (
    <div>
      {images.map((src) => {
        return (
          <img
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

  const handleExport = () => {
    const uri = ref.current?.toDataURL();
    console.log(uri);
  };

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
        className="w-full h-[600px] outline-2 outline-slate-400 outline-dashed"
      >
        <Layer>
          {/* <LionImage />
          <LionImage /> */}
          {/* {getImages()} */}
        </Layer>
      </Stage>
    </div>
  );
};
