<script lang="ts">
    import { writable } from "svelte/store";
    import Button from "../base/Button.svelte";
    import TextInput from "../base/TextInput.svelte";
    import FilePicker from "../base/FilePicker.svelte";
    import Modal from "$lib/components/overlay/Modal.svelte";
    import app from "$lib/app";

    const image = writable<HTMLImageElement | null>(null);
    let filePicker: FilePicker;
    let urlInput: TextInput;

    const controller = app.controller.get()!;
    const open = writable(false);

    function openModal() {
        open.set(true);
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
        const input = event.target as HTMLInputElement;

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

    // else {
        //     const url = event.clipboardData.getData("text");
        //     useLink(url, () => {
        //         filePicker.clear();
        //         urlInput.$set({ value: url });
        //     });
        // }
    }

    function proceed() {
        if ($image) {
            controller.changeImage($image);
            image.set(null);
            open.set(false);
        }
    }

    function cancel() {
        image.set(null);
    }

</script>

<div class="flex flex-row justify-between gap-x-2">
    <div class="flex flex-row gap-x-2">
        <Button variant="inverted" on:click={openModal}>Choose Image</Button>
    </div>

    <div class="flex flex-row">
        <Button on:click={() => controller.export("jpeg")}>Export Image</Button>
    </div>
</div>

<svelte:window on:paste={handlePasteEvent} />

<Modal
    open={open}
    on:confirm={proceed}
    on:cancel={cancel}
>
    <h3 slot="title">Choose Image</h3>
    <p slot="paragraph">Choose an image (accepted PNG, JPG, JPEG, WEBP) from your computer or by pasting the image from your clipboard. You can also provide a link to an image.</p>

    <FilePicker bind:this={filePicker} class="w-full" accept="image/*" on:change={handleFileEvent} />
    <p>or</p>
    <TextInput bind:this={urlInput} class="w-full" on:input={handleInputEvent} placeholder="https://example.com/image.png" />

    {#if $image}
        <div class="divider-x" />
        <h4>Preview</h4>
        <img class="border/40 h-full max-h-50 border rounded-md" src={$image.src} alt="Preview" />
    {/if}
</Modal>
