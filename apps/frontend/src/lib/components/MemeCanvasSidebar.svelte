<script lang="ts">
    import ElementSetting from "./ElementSetting.svelte";
    import type MemeCanvasController from "$lib/canvas/MemeCanvasController";
    import type MemeElement from "$lib/canvas/MemeElement";
    import type { Settings, ValidOptionTypes } from "$lib/canvas/MemeElement";
    import { sameValues } from "$lib/helpers";

    export let controller: MemeCanvasController;

    let settings: Settings | null = null;
    let mixed: string[] = [];

    controller.onSelectedElementsChange = () => updated(controller.selectedElements);
    controller.onElementsUpdated = () => updated(controller.selectedElements);

    function updated(list: MemeElement[]) {
        if (list.length === 0) {
            settings = null;
            mixed = [];
            return;
        }

        const firstElement = list[0]!;
        const baseSettings = getElementSettings(firstElement);

        for (let i = 1; i < list.length; i++) {
            const element = list[i]!;
            const elementSettings = getElementSettings(element);

            if (element.constructor === firstElement.constructor) {
                for (const key in elementSettings)
                    if (!sameValues(baseSettings[key], elementSettings[key]))
                        mixed.push(key);
            }
            else {
                mixed = [];
                break;
            }
        }

        settings = baseSettings;
    };

    function getElementSettings(element: MemeElement): Settings {
        return {
            ...element.getCommonProperties(),
            ...element.settings,
        };
    }

    const onChange = (key: string, newValue: ValidOptionTypes) => {
        controller.selectedElements.forEach((element) => {
            controller.updateElement(element, key, newValue);
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
