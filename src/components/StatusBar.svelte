<script>
  export let label;
  export let status;
</script>

<style>
  .status-bar {
    margin: 1em 0;
    width: 100%;
    font-size: 0.5em;
    display: flex;
    justify-content: space-between;
  }
  span {
    margin: 0 1em;
  }
</style>

<div class="status-bar">
  <span>
    <span>{label}</span>
    <span>{status}</span>
  </span>
  <span>
    <slot />
  </span>
</div>
