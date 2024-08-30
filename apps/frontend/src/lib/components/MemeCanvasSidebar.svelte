<script lang="ts">
    import ElementSetting from "./ElementSetting.svelte";
    import type MemeCanvasController from "$lib/canvas/MemeCanvasController";
    import type MemeElement from "$lib/canvas/MemeElement";
    import type { MemeElementOptions, ValidOptionTypes } from "$lib/canvas/MemeElement";
    import { sameValues } from "$lib/helpers";

    export let controller: MemeCanvasController;

    let settings: MemeElementOptions;
    let mixed: string[];

    controller.onSelectedElementsChange = (list) => {
        [settings, mixed] = getSimilarSettings(list);
    };

    function getSimilarSettings(elements: MemeElement[]): [MemeElementOptions, string[]] {
        const settings: Record<string, ValidOptionTypes> = {};
        const mixed: string[] = [];

        // HELL WHAT IS THIS
        for (const element of elements)
            loop: for (const [key, value] of Object.entries(element.settings).concat(Object.entries(element.options)))
                if (key in settings) {
                    if (typeof settings[key] !== typeof value) {
                        delete settings[key];
                        continue loop;
                    }
                    else if (typeof value !== "object" && typeof value === typeof settings[key]) {
                        if (settings[key] !== value)
                            mixed.push(key);

                        continue loop;
                    }

                    // @ts-ignore
                    const keysA = Object.keys(settings[key]);
                    const keysB = Object.keys(value);

                    if (keysA.length !== keysB.length) {
                        delete settings[key];
                        continue loop;
                    }

                    // Check if the values are the same
                    keysA.forEach((k) => {
                        if (!sameValues((settings[key] as any)[k], (value as any)[k]))
                            mixed.push(key);
                    });
                }
                else {
                    settings[key] = value;
                }

        return [settings as unknown as MemeElementOptions, mixed];
    }

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
