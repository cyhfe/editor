import * as React from "react";

interface SelectionContextValue {
  selectedId: string[];
  setSelectedId: React.Dispatch<React.SetStateAction<string[]>>;
  isSelecting: boolean;
  setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>;
  selectionRect: SelectionRect;
  setSelectionRect: React.Dispatch<React.SetStateAction<SelectionRect>>;
}

const SelectionContext = React.createContext<SelectionContextValue | null>(
  null
);

interface SelectionRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectionRect, setSelectionRect] = React.useState<SelectionRect>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  const [selectedId, setSelectedId] = React.useState<string[]>([]);
  const [isSelecting, setIsSelecting] = React.useState(false);
  const value = React.useMemo(() => {
    return {
      selectedId,
      setSelectedId,
      isSelecting,
      setIsSelecting,
      selectionRect,
      setSelectionRect,
    };
  }, [isSelecting, selectedId, selectionRect]);

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}
export const useSelection = () => {
  const ctx = React.useContext(SelectionContext);
  if (ctx === null) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return ctx;
};
