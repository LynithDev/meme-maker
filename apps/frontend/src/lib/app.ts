import type { Writable } from "svelte/store";
import { createContext } from "./svelte/context";
import type MemeCanvasController from "./canvas/MemeCanvasController";
import type Modal from "./components/overlay/Modal.svelte";

const controller = createContext<MemeCanvasController>();

export default {
    controller,
};
