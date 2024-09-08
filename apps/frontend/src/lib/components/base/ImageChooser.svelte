<script lang="ts">
    import { writable } from "svelte/store";
    import { createEventDispatcher } from "svelte";
    import Modal from "../overlay/Modal.svelte";
    import FilePicker from "./FilePicker.svelte";
    import Button from "./Button.svelte";

    const image = writable<HTMLImageElement | null>(null);
    let filePicker: FilePicker;

    const pasteMessage = writable<string | null>(null);
    const supportsClipboard = () => {
        const isSupported = () => {
            try {
                return !!navigator.clipboard && !!navigator.clipboard.read;
            }
            // eslint-disable-next-line unused-imports/no-unused-vars -- Unused
            catch (e) {
                return false;
            }
        };

        const supported = isSupported();
        if (!supported)
            pasteMessage.set("Your browser does not support clipboard access.");

        return supported;
    };

    export let open = writable(false);

    const dispatcher = createEventDispatcher<{
        confirm: HTMLImageElement;
        cancel: void;
    }>();

    function useBlob(blob: Blob, set: () => void) {
        if (blob.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    image.set(img);
                    set();
                };
                img.onerror = () => {
                    image.set(null);
                };
            };
            reader.readAsDataURL(blob);
        }
    }

    function useFile(files: FileList | null, set: () => void) {
        const file = files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    image.set(img);
                    set();
                };
                img.onerror = () => {
                    image.set(null);
                };
            };
            reader.readAsDataURL(file);
        }
    }

    function handleFileEvent(event: CustomEvent<FileList | null>) {
        const files = event.detail;
        useFile(files, () => {});
    }

    function handlePasteEvent(event: ClipboardEvent) {
        if ($open !== true || !event.clipboardData)
            return;

        if (event.clipboardData.files.length > 0)
            useFile(event.clipboardData.files, () => {
                filePicker.clear();
            });
    }

    function proceed() {
        if ($image) {
            dispatcher("confirm", $image);
            image.set(null);
            open.set(false);
        }
    }

    function cancel() {
        image.set(null);
        dispatcher("cancel");
    }

    async function fromClipboard() {
        try {
            if (supportsClipboard()) {
                const value = await navigator.clipboard.read();
                const item = value.at(0);
                if (!item)
                    return;

                item.types.forEach((type) => {
                    if (type.startsWith("image/"))
                        item.getType(type).then((blob) => {
                            useBlob(blob, () => {});
                        });
                });
            }
        }
        // eslint-disable-next-line unused-imports/no-unused-vars -- Unused
        catch (e) {
            pasteMessage.set("Missing permissions to read from your clipboard.");
        }
    }
</script>

<svelte:window on:paste={handlePasteEvent} />

<Modal
    open={open}
    on:confirm={proceed}
    on:cancel={cancel}
>
    <h3 slot="title">Choose Image</h3>
    <p slot="paragraph">Choose an image (accepted PNG, JPG, JPEG, WEBP) from your computer or by pasting the image from your clipboard. You can also provide a link to an image.</p>

    <FilePicker
        bind:this={filePicker}
        on:change={handleFileEvent}
        class="w-full"
        accept="image/*"
    />

    <p>or</p>

    <Button
        class="w-full"
        variant="inverted"
        on:click={fromClipboard}
        disabled={!supportsClipboard()}
    >
        Paste from clipboard
    </Button>

    {#if $pasteMessage}
        <p class="text-red-500">{$pasteMessage}</p>
    {/if}

    {#if $image}
        <div class="divider-x" />
        <h4>Preview</h4>
        <img class="border/40 h-full max-h-50 border rounded-md" src={$image.src} alt="Preview" />
    {/if}
</Modal>
