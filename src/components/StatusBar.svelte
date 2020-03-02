<script>
  export let label;
  export let status;
</script>

<style>
  .status-bar {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100vw;
    font-size: 0.5em;
    display: flex;
    justify-content: space-between;
  }
  span {
    margin: 0 1em;
  }
  .to-right {
    align-self: flex-end;
  }
</style>

<div class="status-bar">
  <span>{label}</span>
  <span>{status}</span>
  <span class="to-right">
    <slot />
  </span>
</div>
