import { KonvaEventObject } from "konva/lib/Node";
import * as React from "react";
import { Layer, Stage, Transformer } from "react-konva";
import SelectionRect from "./SelectionRect";
import KonvaImage from "./KonvaImage";
import { useEditor } from "./context/Editor";
import { useSelection } from "./context/Selection";
export default function Canvas() {
  const { layers, trRef, stageRef } = useEditor();
  const { setSelectedId, setIsSelecting, isSelecting } = useSelection();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const stage = stageRef.current;
    const container = containerRef.current;
    if (!stage || !container) return;
    stage.width(container.offsetWidth);
    stage.height(container.offsetHeight);
  }, [stageRef]);

  function checkDeselect(
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId([]);
    }
  }

  function handleMouseDown() {
    setIsSelecting(true);
  }

  function handleMouseUp() {
    setIsSelecting(false);
  }

  function handleMouseMove(e: KonvaEventObject<MouseEvent>) {
    if (!isSelecting) {
      return;
    }
    e.evt.preventDefault();
  }

  return (
    <div className="grow w-full h-full p-2" ref={containerRef}>
      <Stage
        ref={stageRef}
        onClick={checkDeselect}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-[600px] outline-2 outline-slate-400 outline-dashed overflow-hidden"
      >
        <Layer>
          <SelectionRect />
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
}
