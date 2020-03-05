<style>
  .playground {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: black;
    user-select: none;
  }
</style>

<script>
  export let enable = true;
  let enabled = enable;
</script>
{#if enabled}
<div class="playground">
    <slot>
      StatusBar component gets no input...
    </slot>
</div>
{:else}
<slot />
{/if}