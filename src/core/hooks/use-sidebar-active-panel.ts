import { atom, useAtom } from "jotai";

// Default to the new Components panel so the component library
// renders automatically when the editor loads
export const sidebarActivePanelAtom = atom<string>("components");
sidebarActivePanelAtom.debugLabel = "sidebarActivePanelAtom";

export const useSidebarActivePanel = () => {
  return useAtom(sidebarActivePanelAtom);
};
