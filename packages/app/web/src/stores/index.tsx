import { Slide } from "@wix-slides/common/types";
import produce from "immer";
import type { Descendant } from "slate";
import create from "zustand";

export interface DecksterStore {
  userInfo: any | null;
  accessToken: string | undefined;
  editorNodes: Descendant[];
  cursorOnSlide: number;
  slides: Slide[];
  set: (fn: (draft: DecksterStore, args: any) => void) => void;
}

const useDecksterStore = create<DecksterStore>((set) => ({
  userInfo: null,
  accessToken: undefined,
  editorNodes: [],
  slides: [],
  cursorOnSlide: 0,
  //@ts-ignore
  set: (fn: any) => set(produce(fn)),
}));

export default useDecksterStore;
