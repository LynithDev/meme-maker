import type MemeCanvasController from "./canvas/MemeCanvasController";
import { createContext } from "./svelte/context";

const controller = createContext<MemeCanvasController>();

export default {
    controller,
};
