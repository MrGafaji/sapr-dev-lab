<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { setContext } from "svelte";
  import { spring } from "svelte/motion";
  import WebMidi from "webmidi";
  import Playground from "../components/Playground.svelte";
  import Coin from "../components/Coin.svelte";
  import StatusBar from "../components/StatusBar.svelte";
  
  let coinCount = 0;
  let status = null;
  let midiOutput;
  let coinsRegister = [];

  WebMidi.enable(function(err) {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      midiOutput = WebMidi.outputs[0];
      status = "Connected with " + midiOutput.name;
    }
  });

  let svg;
  setContext("convertPoint", (x, y) => {
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  });

  onMount(() => {
    const stopPropagation = event => {
      if (event.cancelable) {
        event.preventDefault();
      }
      event.stopPropagation();
    };
    document.querySelector(".playground").addEventListener("touchstart", event => stopPropagation(event), true);
    document.querySelector(".playground").addEventListener("touchcancel", event => stopPropagation(event), true);
  });

  let onAddCoin = () => {
    if (coinCount < 10) {coinsRegister = [
      ...coinsRegister,
      {
        id: coinCount,
        color: ["gold", "silver", "DarkGoldenRod", "magenta","cyan", "orange", "limegreen", "pink", "orangered", "CadetBlue"][coinCount],
        coords: spring({ x: coinsRegister.length * 10 + 15, y: 15 }),
      }
    ];
    coinCount++;}
  };
</script>

<svelte:head>
  <meta name="msapplication-tap-highlight" content="no">
  <meta
    name="viewport"
    content="width=device-width, user-scalable=no, initial-scale=1.0,
    maximum-scale=0.9, minimum-scale=1.1" />
  <title>Coin</title>
</svelte:head>

<Playground enable="false">
  <svg viewbox="0 0 127 127" bind:this={svg}>
    {#each coinsRegister as coin}
      <Coin {...coin} midiOutput={midiOutput}></Coin>
    {:else}
      <p>Add coins first</p>
    {/each}
  </svg>

  <StatusBar label="Status:" status={status && status.toString()}>
    <button on:click={onAddCoin}>addcoin</button>
  </StatusBar>
</Playground>
