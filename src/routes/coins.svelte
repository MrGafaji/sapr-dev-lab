<script>
  import { onMount, afterUpdate, onDestroy } from "svelte";
  import { writable, get } from "svelte/store";
  import { setContext } from "svelte";
  import { spring } from "svelte/motion";
  import WebMidi from "webmidi";
  import Playground from "../components/Playground.svelte";
  import Coin from "../components/Coin.svelte";
  import StatusBar from "../components/StatusBar.svelte";

  let status = "initial";
  let midi;
  let midiOutput = writable(null);
  let coinsRegister = writable([]);

  let viewBox = { x: 0, y: 0, width: 180, height: 100 };

  let svg;
  setContext("convertPoint", (x, y) => {
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  });

  const stopPropagation = event => {
    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
  };

  onMount(() => {
    enableMidi();
    const registerFromLocalStorage = JSON.parse(
      window.localStorage.getItem("coins")
    );
    if (registerFromLocalStorage !== null) {
      coinsRegister.set([]);
      registerFromLocalStorage.map(coinJson => {
        addCoin(coinJson);
      });
    }

    document
      .querySelector(".playground")
      .addEventListener("touchstart", event => stopPropagation(event), true);
    document
      .querySelector(".playground")
      .addEventListener("touchcancel", event => stopPropagation(event), true);
  });

  const onUpdateRegister = () => {
    setLocalStorage("coins", get(coinsRegister));
  };

  let addCoin = coinJson => {
    coinsRegister.update(register => {
      const { x, y } = coinJson
        ? coinJson.coords
        : { x: register.length * 10 + 15, y: 15 };

      if (register.length < 10) {
        return [
          ...register,
          {
            id: coinJson ? coinJson.id : register.length,
            color: [
              "gold",
              "silver",
              "DarkGoldenRod",
              "magenta",
              "cyan",
              "orange",
              "limegreen",
              "pink",
              "orangered",
              "CadetBlue"
            ][register.length],
            coords: spring({ x: x, y: y })
          }
        ];
      } else {
        return register;
      }
    });
  };

  let onAddCoin = () => {
    addCoin();
  };

  midiOutput.subscribe(device => {
    if (device) status = "Connected with " + get(midiOutput).name;
  });
  coinsRegister.subscribe(register => {
    if (register.length) setLocalStorage("coins", register);
  });

  const setLocalStorage = (entry, register) => {
    const flatRegister = register.map(coin => {
      let x, y;
      coin.coords.subscribe(c => {
        x = c.x;
        y = c.y;
      });
      return { ...coin, coords: { x: x, y: y } };
    });
    window.localStorage.setItem(entry, JSON.stringify(flatRegister));
  };

  const enableMidi = () => {
    WebMidi.enable(function(err) {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        midi = WebMidi;
        midiOutput.set(WebMidi.outputs[1]);
      }
    });
  };
</script>

<style>
  svg {
    width: 90%;
    height: 85%;
    background: rgba(255, 255, 255, 0.1);
    overflow: visible;
    margin: 5% 5% 0 5%;
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

<Playground enable="false">
  <svg
    viewbox="{viewBox.x}
    {viewBox.y}
    {viewBox.width}
    {viewBox.height}"
    bind:this={svg}>
    {#each $coinsRegister as coin}
      <Coin
        {...coin}
        midiOutput={$midiOutput}
        updateRegister={onUpdateRegister}
        {viewBox} />
    {:else}
      <p>Add coins first</p>
    {/each}
  </svg>

  <StatusBar
    label="Status:"
    status={status && status.toString()}
    {midi}
    {midiOutput}>
    <button on:click={onAddCoin}>add coin</button>
  </StatusBar>
</Playground>
