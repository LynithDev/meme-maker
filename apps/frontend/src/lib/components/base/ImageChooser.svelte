<script lang="ts">
    import { writable } from "svelte/store";
    import { createEventDispatcher } from "svelte";
    import Modal from "../overlay/Modal.svelte";
    import TextInput from "./TextInput.svelte";
    import FilePicker from "./FilePicker.svelte";

    const image = writable<HTMLImageElement | null>(null);
    let filePicker: FilePicker;
    let urlInput: TextInput;

    export let open = writable(false);

    const dispatcher = createEventDispatcher<{
        confirm: HTMLImageElement;
        cancel: void;
    }>();

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

    function useLink(url: string, set: () => void) {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                image.set(img);
                set();
            };
            img.onerror = () => {
                image.set(null);
            };
        }
    }

    function handleFileEvent(event: CustomEvent<FileList | null>) {
        const files = event.detail;
        useFile(files, () => {
            urlInput.$set({ value: "" });
        });
    }

    let timeout: NodeJS.Timeout | null = null;
    function handleInputEvent(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        if (!input)
            return;

        if (timeout)
            clearTimeout(timeout);

        timeout = setTimeout(() => {
            useLink(input.value, () => {
                filePicker.clear();
            });
        }, 300);
    }

    function handlePasteEvent(event: ClipboardEvent) {
        if ($open !== true || !event.clipboardData)
            return;

        if (event.clipboardData.files.length > 0)
            useFile(event.clipboardData.files, () => {
                urlInput.$set({ value: "" });
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

    <TextInput
        bind:this={urlInput}
        on:input={e => handleInputEvent(e.detail)}
        name="url-input"
        class="w-full"
        placeholder="https://example.com/image.png"
    />

    {#if $image}
        <div class="divider-x" />
        <h4>Preview</h4>
        <img class="border/40 h-full max-h-50 border rounded-md" src={$image.src} alt="Preview" />
    {/if}
</Modal>
