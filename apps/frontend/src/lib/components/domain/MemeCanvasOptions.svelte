<script lang="ts">
    import { onMount } from "svelte";
    import ElementSetting from "./Setting.svelte";
    import app from "$lib/app";
    import type MemeElement from "$lib/canvas/MemeElement";
    import type { Settings, ValidOptionTypes } from "$lib/canvas/MemeElement";
    import { sameValues } from "$lib/utils/helpers";

    const controller = app.controller.get();
    let container: HTMLDivElement;

    onMount(() => {
        controller.listen("elementsUpdated", updated);
        controller.listen("selectedElementsChange", updated);

        controller.listen("inputFocusRequest", (e) => {
            const elements = container.querySelectorAll(`[name=${e.inputName}]`);
            if (elements.length > 0) {
                const el = elements[0] as HTMLInputElement;
                el.focus();
            }
        });
    });

    let settings: Settings | null = null;
    let mixed: string[] = [];

    function updated() {
        const list = controller.selectedElements;
        settings = null;
        mixed = [];

        if (list.length === 0)
            return;

        const firstElement = list[0]!;
        const baseSettings = getElementSettings(firstElement);

        for (let i = 1; i < list.length; i++) {
            const element = list[i]!;
            const elementSettings = getElementSettings(element);

            if (element.constructor === firstElement.constructor) {
                for (const key in elementSettings)
                    if (!sameValues(baseSettings.settings[key], elementSettings.settings[key]))
                        mixed.push(key);
            }
            else {
                mixed = mixed.filter(key => key in baseSettings.common);

                baseSettings.settings = {};
            }

            for (const key in elementSettings.common)
                if (!sameValues(baseSettings.common[key], elementSettings.common[key]))
                    mixed.push(key);
        }

        settings = { ...baseSettings.common, ...baseSettings.settings };
    };

    function getElementSettings(element: MemeElement) {
        return {
            common: element.getCommonProperties(),
            settings: element.settings,
        };
    }

    const onChange = (key: string, newValue: ValidOptionTypes) => {
        controller.selectedElements.forEach((element) => {
            controller.updateElement(element, key, newValue);
        });
    };
</script>

<div bind:this={container} class="flex flex-col gap-y-2 md:px-2">

    {#if settings}
        <div class="grid grid-cols-2 my-2 gap-x-2 gap-y-4 [&>*:not(:nth-child(-n+6))]:col-span-2 md:mt-0">
            {#each Object.entries(settings) as [key, value]}
                <ElementSetting
                    name={key}
                    value={value}
                    mixed={mixed.includes(key)}
                    onChange={newValue => onChange(key, newValue)}
                />
            {/each}
        </div>
    {/if}

</div>
