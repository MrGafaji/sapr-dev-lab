<script>
  import { onMount } from "svelte";
  import { getContext, setContext } from "svelte";
  import { writable, get } from "svelte/store";
  import debounce from "lodash/debounce";
  import Playground from "../components/Playground.svelte";
  import Coin from "../components/Coin.svelte";
  import StatusBar from "../components/StatusBar.svelte";
  import {
    table,
    status,
    configureMode,
    midi,
    midiOutput,
    coins,
    viewBox,
    showDeviceMenu,
    stopPropagation,
    addCoin,
    deleteCoin,
    setLocalStorage,
    enableMidi
  } from "../store.js";

  let svg;
  setContext("convertPoint", (x, y) => {
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  });

  let onUpdateRegister = () => {};

  const onAddCoin = () => {
    addCoin();
  };

  const onDeleteCoin = () => {
    deleteCoin();
  };

  const onClearCoins = () => {
    coins.set([]);
  };

  const onConfigure = () => {
    if ($configureMode) {
      if ($configureMode.direction === "x") {
        configureMode.set({ ...$configureMode, direction: "y" });
      } else {
        configureMode.set(false);
      }
    } else {
      configureMode.set(true);
    }
  };

  onMount(() => {
    const midi = enableMidi(window);

    const localStorageCoins = JSON.parse(window.localStorage.getItem("coins"));
    if (localStorageCoins !== null) {
      coins.set([]);
      localStorageCoins.map(coinJson => {
        addCoin(coinJson);
      });
    }
    onUpdateRegister = () => {
      const setLocalStorageDebounced = debounce(setLocalStorage, 300);
      setLocalStorageDebounced("coins", get(coins), window);
    };

    midiOutput.subscribe(device => {
      if (device) {
        status.set("Connected with " + device.name);
      }
    });

    coins.subscribe(register => {
      if (register.length) setLocalStorage("coins", register, window);
    });

    document
      .querySelector(".playground")
      .addEventListener("touchstart", event => stopPropagation(event), true);
    document
      .querySelector(".playground")
      .addEventListener("touchcancel", event => stopPropagation(event), true);
  });
</script>

<style>
  svg {
    width: 90%;
    height: 85%;
    background: rgba(255, 255, 255, 0.1);
    overflow: visible;
    margin: 5% 5% 0 5%;
  }
  text {
    fill: limegreen;
    font-variant: all-petite-caps;
  }
</style>

<svelte:head>
  <meta name="msapplication-tap-highlight" content="no" />
  <meta
    name="viewport"
    content="width=device-width, user-scalable=no, initial-scale=1.0,
    maximum-scale=0.9, minimum-scale=1.1" />
  <title>Coin</title>
</svelte:head>

<Playground onPlaygroundClick={() => showDeviceMenu.set(false)}>
  {#if $table === 2}
    <svg
      viewbox="{viewBox.x}
      {viewBox.y}
      {viewBox.width}
      {viewBox.height}"
      bind:this={svg}>
      {#if $coins.length}
        {#each $coins as coin (coin.id)}
          <Coin
            {...coin}
            {midiOutput}
            updateRegister={onUpdateRegister}
            {configureMode}
            {viewBox}
            {svg} />
        {/each}
      {:else}
        <text text-anchor="middle" x={viewBox.width / 2} y={viewBox.height / 2}>
          add coins
        </text>
      {/if}
    </svg>
  {:else if $table === 1}
    <div>table 1</div>
  {:else}
    <div>table 0</div>
  {/if}

  <StatusBar
    label="Status:"
    status={$status}
    {midi}
    {midiOutput}
    {showDeviceMenu}>
    <button on:click={onConfigure} class={$configureMode && 'btn-active'}>
      {#if $configureMode.direction}
        <div class="animate-wobble-{$configureMode.direction}">
          map {$configureMode.direction} axis
        </div>
      {:else if $configureMode}select coin{:else}configure{/if}
    </button>
    <button on:click={onAddCoin}>add coin</button>
    <button on:click={onDeleteCoin}>delete coin</button>
    <button on:click={onClearCoins}>destroy</button>
  </StatusBar>
</Playground>
