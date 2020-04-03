<script>
  import { setContext, getContext } from "svelte";

  export let label;
  export let status;
  export let midi;
  export let midiOutput;
  export let midiDeviceMenu;

  const onChangeMidiDevice = device => {
    midiOutput.set(device);
    midiDeviceMenu.show = !midiDeviceMenu.show;
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
      {#if status}
        <a
          on:click|stopPropagation|preventDefault={() => midiDeviceMenu.show = !midiDeviceMenu.show}
          class="status"
          href="#open"
          alt="open midi device menu">
          {status}
        </a>
      {:else}loading...{/if}
    </span>
    <span class="device-menu {!midiDeviceMenu.show && 'hidden'}">
      {#if midi}
        {#each midi.outputs as device}
          <div on:click|stopPropagation={() => onChangeMidiDevice(device)}>{device.name}</div>
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
