<script lang="ts">
    import { writable } from "svelte/store";
    import Button from "../base/Button.svelte";
    import ImageChooser from "../base/ImageChooser.svelte";
    import app from "$lib/app";

    const open = writable(false);
    const controller = app.controller.get();

    function proceed(image: HTMLImageElement) {
        controller.changeImage(image);
    }
</script>

<div class="flex flex-row justify-between gap-x-2">
    <div class="flex flex-row gap-x-2">
        <Button variant="inverted" on:click={() => open.set(true)}>Choose Image</Button>
    </div>

    <div class="flex flex-row">
        <Button on:click={() => controller.export("jpeg")}>Export Image</Button>
    </div>
</div>

<ImageChooser {open} on:confirm={e => proceed(e.detail)} />
