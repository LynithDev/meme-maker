<script lang="ts">
    import app from "$lib/app";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { Settings01Icon } from "svelte-untitled-ui-icons/Settings01Icon";
    import Button from "../base/Button.svelte";
    import ImageChooser from "../base/ImageChooser.svelte";
    import Switch from "../base/Switch.svelte";
    import TextInput from "../base/TextInput.svelte";
    import Modal from "../overlay/Modal.svelte";

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
        <Button on:click={e => imageChooserOpened.set(true)} variant="inverted">Choose Image</Button>
        <Button
            disabled={$disabled}
            on:click={e => canvasModalOpened.set(true)}
            variant="inverted"
        >
            <Settings01Icon size="16" slot="icon" />
            Canvas
        </Button>
    </div>

    <div class="flex flex-row">
        <Button
            disabled={$disabled}
            on:click={() => exportModalOpened.set(true)}
        >
            Export
        </Button>
    </div>
</div>

<ImageChooser on:confirm={e => proceed(e.detail)} open={imageChooserOpened} />

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
                        class="text-center"
                        id={`padding-${paddingKey}-input`}
                        name={paddingKey}
                        on:validatedInput={e => changePadding(paddingKey, Number.parseFloat(e.detail.currentTarget.value))}
                        validate="integer"
                        value={controller.padding[paddingKey]}
                    />
                </div>
            {/each}
        </div>
    </div>
</Modal>

<Modal
    on:confirm={exportImage}
    open={exportModalOpened}
    title="Export"
>
    <h4>Image Type</h4>
    <p>Choose the image type you want to export your meme to.</p>
    <Switch bind:selected={$selected} options={["WEBP", "JPEG", "PNG"]} />

    <div class="divider-x"></div>

    <h4>File Name</h4>
    <p>The name of the exported file.</p>
    <TextInput on:change={e => fileName.set(e.detail.currentTarget.value)} value={$fileName} />
</Modal>
