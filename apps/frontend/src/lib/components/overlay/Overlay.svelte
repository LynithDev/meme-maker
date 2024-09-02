<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { writable } from "svelte/store";

    export let open = writable(false);
    let element: HTMLDivElement;

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
        open.set(false);
    }

    function clickOutside(event: MouseEvent) {
        if (event.target === element)
            close();
    }
</script>

<svelte:window on:click={clickOutside} />

{#if $open}
    <div bind:this={element} class="bg-pure-black/60 fixed left-0 top-0 z-1000 h-screen w-screen animate-fade-in animate-duration-150 animate-ease-in-out backdrop-blur-md">
        <slot />
    </div>
{/if}
