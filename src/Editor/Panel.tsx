import { v4 as uuidv4 } from "uuid";
import { useEditor } from "./context/Editor";

const images = ["/bag.webp", "/chair.webp", "/headphones.webp"];

export default function Panel() {
  const { setLayers } = useEditor();
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
