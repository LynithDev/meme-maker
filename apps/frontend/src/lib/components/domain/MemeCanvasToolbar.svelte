<script lang="ts">
    import { writable } from "svelte/store";
    import { Settings01Icon } from "svelte-untitled-ui-icons/Settings01Icon";
    import { onMount } from "svelte";
    import Button from "../base/Button.svelte";
    import ImageChooser from "../base/ImageChooser.svelte";
    import Modal from "../overlay/Modal.svelte";
    import TextInput from "../base/TextInput.svelte";
    import Switch from "../base/Switch.svelte";
    import app from "$lib/app";

    const imageChooserOpened = writable(false);
    const canvasModalOpened = writable(false);
    const exportModalOpened = writable(false);

    const controller = app.controller.get();
    const disabled = writable(true);

    // Export props
    const options = ["webp", "jpeg", "png"] as const;
    const selected = writable(2);
    const fileName = writable("meme");

    onMount(() => {
        controller.listen("imageChange", () => {
            disabled.set(controller.image === null);
        });
    });

    function proceed(image: HTMLImageElement) {
        controller.changeImage(image);
    }

    type PaddingKey = keyof typeof controller.padding;

    function changePadding(key: PaddingKey, value: number) {
        const padding = {
            ...controller.padding,
            [key]: value,
        };

        controller.changePadding(padding);
    }

    function paddingKeys() {
        return Object.keys(controller.padding) as PaddingKey[];
    }

    function exportImage() {
        const option = options[$selected];
        if (option)
            controller.export($fileName, option);

        exportModalOpened.set(false);
    }
</script>

<div class="flex flex-row justify-between gap-x-2">
    <div class="flex flex-row gap-x-2">
        <Button variant="inverted" on:click={e => imageChooserOpened.set(true)}>Choose Image</Button>
        <Button
            variant="inverted"
            on:click={e => canvasModalOpened.set(true)}
            disabled={$disabled}
        >
            <Settings01Icon slot="icon" size="16" />
            Canvas
        </Button>
    </div>

    <div class="flex flex-row">
        <Button
            on:click={() => exportModalOpened.set(true)}
            disabled={$disabled}
        >
            Export
        </Button>
    </div>
</div>

<ImageChooser open={imageChooserOpened} on:confirm={e => proceed(e.detail)} />

<Modal open={canvasModalOpened} title="Canvas Settings">
    <div class="flex flex-col gap-y-2">
        <h4>Padding</h4>
        <div class="grid grid-cols-2 my-2 max-w-64 gap-2">
            {#each paddingKeys() as paddingKey}
                <div class="grid grid-cols-2 items-center gap-1">
                    <label for={`padding-${paddingKey}-input`}>
                        {paddingKey.charAt(0).toUpperCase() + paddingKey.slice(1)}
                    </label>
                    <TextInput
                        name={paddingKey}
                        id={`padding-${paddingKey}-input`}
                        validate="integer"
                        value={controller.padding[paddingKey]}
                        class="text-center"
                        on:validatedInput={e => changePadding(paddingKey, Number.parseFloat(e.detail.currentTarget.value))}
                    />
                </div>
            {/each}
        </div>
    </div>
</Modal>

<Modal
    title="Export"
    open={exportModalOpened}
    on:confirm={exportImage}
>
    <h4>Image Type</h4>
    <p>Choose the image type you want to export your meme to.</p>
    <Switch bind:selected={$selected} options={["WEBP", "JPEG", "PNG"]} />

    <div class="divider-x"></div>

    <h4>File Name</h4>
    <p>The name of the exported file.</p>
    <TextInput value={$fileName} on:change={e => fileName.set(e.detail.currentTarget.value)} />
</Modal>
