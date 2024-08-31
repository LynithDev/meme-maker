<script lang="ts">
    import ElementSetting from "./ElementSetting.svelte";
    import type MemeCanvasController from "$lib/canvas/MemeCanvasController";
    import type MemeElement from "$lib/canvas/MemeElement";
    import type { MemeElementSettings, ValidOptionTypes } from "$lib/canvas/MemeElement";

    export let controller: MemeCanvasController;

    let settings: MemeElementSettings;
    let mixed: string[];

    controller.onSelectedElementsChange = (list) => {
        getElementsSettings(list[0]!);
    // [settings, mixed] = getSimilarSettings(list);
    };

    function getElementsSettings(element: MemeElement) {
        console.log(element.settings);
    // console.log(fields);
    };

    const onChange = (key: string, newValue: ValidOptionTypes) => {
        controller.selectedElements.forEach((element) => {
            controller.updateElementSetting(element, key, newValue);
        });
    };
</script>

<div class="flex flex-col gap-y-2">

    {#if settings}
        {#each Object.entries(settings) as [key, value]}
            <ElementSetting
                name={key}
                value={value}
                mixed={mixed.includes(key)}
                onChange={newValue => onChange(key, newValue)}
            />
        {/each}
    {/if}

</div>
