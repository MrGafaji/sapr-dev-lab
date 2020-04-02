<script>
  export let label;
  export let status;
  export let midi;
  export let midiOutput;

  let hideMenu = true;

  const showMenu = (e) => {
    e.preventDefault();
    hideMenu = !hideMenu;
  };
</script>

<style>
  .status-bar {
    position: relative;
    margin: 1em 0;
    width: 100%;
    font-size: 0.5em;
    display: flex;
    justify-content: space-between;
  }
  span {
    margin: 0 1em;
  }
  .device-menu {
    position: absolute;
    top: -100%;
  }
  .hidden {
    display: none;
  }
</style>

<div class="status-bar">
  <span>
    <span>{label}</span>
    <span>
      <a on:click={showMenu} class="status" href="#open">{status}</a>
    </span>
    <span class="device-menu {hideMenu && 'hidden'}">
      {#if midi}
        {#each midi.outputs as device, index}
          <div on:click={() => midiOutput.set(midi.outputs[index])}>{device.name}</div>
        {:else}
          <p>No devices..</p>
        {/each}
      {/if}
    </span>
  </span>
  <span>
    <slot />
  </span>
</div>
