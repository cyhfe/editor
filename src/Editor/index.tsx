import Panel from "./Panel";
import Canvas from "./Canvas";
import { EditorProvider } from "./context/Editor";
import { SelectionProvider } from "./context/Selection";

export default function Editor() {
  return (
    <EditorProvider>
      <SelectionProvider>
        <div className="flex">
          <Panel />
          <Canvas />
        </div>
      </SelectionProvider>
    </EditorProvider>
  );
}
