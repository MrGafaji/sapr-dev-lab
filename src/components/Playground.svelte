<style>
  .full-fixed-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: black;
    user-select: none;
  }
  .playground {
    margin: 5% 5% 200px 5%;
  }
</style>

<script>
  export let enable = true;
  let enabled = enable;
</script>
{#if enabled}
<div class="full-fixed-container">
  <div class="playground">
    <slot>
      StatusBar component gets no input...
    </slot>
  </div>
</div>
{:else}
<slot />
{/if}