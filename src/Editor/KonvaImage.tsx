import Konva from "konva";
import { Image } from "react-konva";
import * as React from "react";
import useImage from "use-image";
import { useSelection } from "./context/Selection";

interface KonvaImageProps {
  src: string;
  id: string;
}

export default function KonvaImage({ src, id }: KonvaImageProps) {
  const [image] = useImage(src);
  const { setSelectedId } = useSelection();
  const imageRef = React.useRef<Konva.Image>(null);
  const radio = image ? image.width / image.height : 1;
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
