import { createContext } from "./svelte/context";
import type MemeCanvasController from "./canvas/MemeCanvasController";

const controller = createContext<MemeCanvasController>();

export default {
    controller,
};
