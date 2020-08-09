<script>
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  let canvas;
  onMount(() => {
    console.log('sdf');
  });
</script>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>

<canvas bind:this={canvas} />
