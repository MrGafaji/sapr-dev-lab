<script>
  import { setContext } from "svelte";

  export let label;
  export let status;
  export let midi;
  export let midiOutput;
  export let showDeviceMenu;

  const onChangeMidiDevice = (device, index) => {
    window.localStorage.setItem("defaultMidiDeviceIndex", index);
    midiOutput.set(device);
    showDeviceMenu.set(false);
  };
</script>

<style>
  .status-bar {
    margin: 1em 0;
    width: 100%;
    font-size: 0.5em;
    display: flex;
    justify-content: space-between;
  }

  .status {
    position: relative;
  }

  span {
    margin: 0 1em;
  }

  .device-menu {
    position: absolute;
    top: -100%;
    min-width: 200px;
  }

  .hidden {
    display: none;
  }
</style>

<div class="status-bar">
  <span class="status">
    <span>{label}</span>
    <span class="{$showDeviceMenu && 'hidden'}">
      {#if status}
        <a
          on:click|stopPropagation|preventDefault={() => ($showDeviceMenu = !$showDeviceMenu)}
          class="status"
          href="#open"
          alt="open midi device menu">
          {status}
        </a>
      {:else}loading...{/if}
    </span>
    <span class="device-menu {!$showDeviceMenu && 'hidden'}">
      {#if $midi}
        {#each $midi.outputs as device, index}
          <div
            class="my-10 pointer"
            on:click|stopPropagation={() => onChangeMidiDevice(device, index)}>
            {device.name}
          </div>
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
