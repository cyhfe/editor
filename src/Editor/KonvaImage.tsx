import Konva from "konva";
import { Image } from "react-konva";
import * as React from "react";
import useImage from "use-image";
import { useEditor } from "./context/Editor";
import { useSelection } from "./context/Selection";

interface KonvaImageProps {
  src: string;
  id: string;
}

export default function KonvaImage({ src, id }: KonvaImageProps) {
  const [image] = useImage(src);
  const { trRef } = useEditor();
  const { selectedId, setSelectedId, isSelecting } = useSelection();
  const imageRef = React.useRef<Konva.Image>(null);
  const radio = image ? image.width / image.height : 1;
  // React.useEffect(() => {
  //   // if (isSelecting) return;
  //   const tr = trRef.current;
  //   const img = imageRef.current;
  //   if (tr && img) {

  //       const nodes = tr.nodes().slice(); // use slice to have new copy of array
  //       // remove node from array
  //       // nodes.splice(nodes.indexOf(img), 1);
  //       // tr.nodes(nodes);
  //       // tr.getLayer()?.batchDraw();
  //     } else {
  //       const nodes = tr.nodes().concat([img]);
  //       tr.nodes(nodes);
  //       // tr.getLayer()?.batchDraw();
  //     }
  //   }
  // }, [id, selectedId, trRef]);
  return (
    <>
      <Image
        name="layer"
        id={id}
        ref={imageRef}
        image={image}
        draggable
        width={200}
        height={200 / radio}
        onClick={(e) => {
          const img = imageRef.current;
          if (!img) return;
          const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
          if (metaPressed) {
            return;
          } else {
            setSelectedId((prev) => {
              if (prev[0] === id) {
                return [];
              } else {
                return [id];
              }
            });
          }
        }}
      />
    </>
  );
}
