import { Rect } from "react-konva";
import * as React from "react";
import { useEditor } from "./context/Editor";
import { useSelection } from "./context/Selection";
export default function SelectionRect() {
  const { selectionRef } = useEditor();
  const { isSelecting, selectionRect } = useSelection();
  const { x1, x2, y1, y2 } = selectionRect;
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  return (
    <Rect
      fill="rgba(0,0,255,0.5)"
      visible={isSelecting}
      ref={selectionRef}
      x={x}
      y={y}
      width={width}
      height={height}
    />
  );
}
