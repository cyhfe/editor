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
  const isSelected = selectedId.includes(id);
  const imageRef = React.useRef<Konva.Image>(null);
  // React.useEffect(() => {
  //   const tr = trRef.current;
  //   if (tr) {
  //     if (isSelected && imageRef.current) {
  //       // we need to attach transformer manually
  //       tr.nodes([imageRef.current]);
  //       tr.getLayer()?.batchDraw();
  //     } else {
  //       tr.nodes([]);
  //       tr.getLayer()?.batchDraw();
  //     }
  //   }

  //   console.log(trRef, isSelected);
  // }, [image, isSelected, trRef]);
  return (
    <>
      <Image
        name="layer"
        ref={imageRef}
        image={image}
        draggable
        // onClick={() => {
        //   if (isSelecting) return;
        //   setSelectedId((prev) => {
        //     if (prev.includes(id)) {
        //       return prev.filter((prevId) => prevId !== id);
        //     } else {
        //       return [...prev, id];
        //     }
        //   });
        // }}
      />
    </>
  );
}
