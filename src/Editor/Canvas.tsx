import { KonvaEventObject } from "konva/lib/Node";
import * as React from "react";
import { Layer, Stage, Transformer } from "react-konva";
import SelectionRect from "./SelectionRect";
import KonvaImage from "./KonvaImage";
import { useEditor } from "./context/Editor";
import { useSelection } from "./context/Selection";
import Konva from "konva";
export default function Canvas() {
  const { layers, trRef, stageRef, selectionRef } = useEditor();
  const {
    selectedId,
    setSelectedId,
    setIsSelecting,
    isSelecting,
    setSelectionRect,
  } = useSelection();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const stage = stageRef.current;
    const container = containerRef.current;
    if (!stage || !container) return;
    stage.width(container.offsetWidth);
    stage.height(container.offsetHeight);
  }, [stageRef]);

  React.useEffect(() => {
    const tf = trRef.current;
    const stage = stageRef.current;
    if (!tf || !stage) return;
    const shapes = stage.find(".layer");
    const selectedShapes = shapes.filter((shape) =>
      selectedId.includes(shape.id())
    );
    tf.nodes(selectedShapes);
  }, [selectedId, stageRef, trRef]);

  function checkDeselect(
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId([]);
    }
  }

  function handleMouseDown(e: KonvaEventObject<MouseEvent>) {
    const stage = stageRef.current;
    const selection = selectionRef.current;
    if (!stage || !selection || e.target !== stage) return;
    e.evt.preventDefault();
    const { x, y } = stage.getPointerPosition() ?? { x: 0, y: 0 };
    setSelectionRect({
      x1: x,
      y1: y,
      x2: x,
      y2: y,
    });
    setIsSelecting(true);
  }

  function handleMouseUp(e: KonvaEventObject<MouseEvent>) {
    const stage = stageRef.current;
    const selection = selectionRef.current;
    const tr = trRef.current;
    if (!stage || !selection || !tr || !isSelecting) return;

    e.evt.preventDefault();
    setIsSelecting(false);
    const shapes = stage.find(".layer");
    const box = selection.getClientRect();
    const selected: string[] = [];
    shapes.forEach((shape) => {
      const isSelected = Konva.Util.haveIntersection(
        box,
        shape.getClientRect()
      );
      if (isSelected) {
        selected.push(shape.id());
      }
    });
    setSelectedId(selected);
    // console.log(selected);
    // tr.nodes(selected);
  }

  function handleClick(e: KonvaEventObject<MouseEvent>) {
    checkDeselect(e);
  }

  function handleMouseMove(e: KonvaEventObject<MouseEvent>) {
    const stage = stageRef.current;
    if (!isSelecting || !stage) {
      return;
    }
    e.evt.preventDefault();
    const { x, y } = stage.getPointerPosition() ?? { x: 0, y: 0 };
    setSelectionRect((prev) => ({
      ...prev,
      x2: x,
      y2: y,
    }));
  }

  return (
    <div className="grow w-full h-full p-2" ref={containerRef}>
      <Stage
        ref={stageRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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

          <SelectionRect />
        </Layer>
      </Stage>
    </div>
  );
}
