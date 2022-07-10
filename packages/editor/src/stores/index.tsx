import { PlateEditor, Value } from "@udecode/plate";
import type { MenuItem } from "@wix-slides/common/types";
import create from "zustand";
import createElementOnSelectItem from "../components/DashMenu/handlers/createElementOnSelectItem";
import blockMenuItems from "../components/DashMenu/menuItems";

interface DashMenuStore<V extends Value = Value> {
  isOpen: boolean;
  text: string;
  filteredItems: MenuItem[] | [];
  setFilteredItems: (items: MenuItem[] | []) => void;
  open: () => void;
  close: () => void;
  reset: () => void;
  setText: (text: string) => void;
  moveDown: () => void;
  moveUp: () => void;
  highlightIndex: (index: number) => void;
  highlightedIndex: number;
  onSelectItem: (
    ev:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<Element>,
    e: PlateEditor<V>,
    item: MenuItem
  ) => void;
}

const dashMenuBaseStore = {
  filteredItems: blockMenuItems(),
  isOpen: false,
  text: "",
  highlightedIndex: 0,
  onSelectItem: createElementOnSelectItem,
};

const useDashMenuStore = create<DashMenuStore>((set, get) => ({
  ...dashMenuBaseStore,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setText: (text) => set({ text }),
  setFilteredItems: (filteredItems) => set({ filteredItems }),
  moveDown: () =>
    set({
      highlightedIndex: get().highlightedIndex + 1,
    }),
  moveUp: () =>
    set({
      highlightedIndex: get().highlightedIndex + 1,
    }),
  reset: () => set({ ...dashMenuBaseStore }),
  highlightIndex: (index: number) =>
    set({
      highlightedIndex: index,
    }),
}));

export default useDashMenuStore;
