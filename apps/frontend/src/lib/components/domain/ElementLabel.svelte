<script lang="ts">
    export let name: string;
</script>

<span class="text-xs text-fg/60 uppercase">{name.replaceAll("_", " ")}</span>
