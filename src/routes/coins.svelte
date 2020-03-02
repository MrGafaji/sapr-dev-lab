<script>
  import { writable } from "svelte/store";
  import WebMidi from "webmidi";
  import CoinModel from "../models/CoinModel.js";
  import Playground from "../components/Playground.svelte";
  import Coin from "../components/Coin.svelte";
  import StatusBar from "../components/StatusBar.svelte";
  let status = null;
  let output;
  let coinsRegister = writable([new CoinModel(0, "white")]);
  export let renderCoins = [];
  let countdown = 0;

  WebMidi.enable(function(err) {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      output = WebMidi.outputs[0];
      status = "Connected with " + output.name;
    }
  });

  coinsRegister.subscribe(coins => {
    renderCoins = coins;
    console.log(coins[0]);
  });

  const updateCoords = event => {
    event.stopPropagation(); //todo: default browser handlers on touch need to stop
    const newEvent = event;
    coinsRegister.update(array => {
      const touch = newEvent.touches[0];
      const id = touch.target.id;
      array[id].x = touch.clientX;
      array[id].y = touch.clientY;
      return array;
    });
  };

//todo: 
// x and y, or coinsRegister below are not updated somehow, make it simple and reactive first

</script>

<Playground>
  <svg viewbox=" 0 0 127 127">
    {#each $coinsRegister as { ...props }}
      <Coin onTouch={e => updateCoords(e)} {...props}>{countdown}</Coin>
    {:else}
      <p>Add coins first</p>
    {/each}
  </svg>

  <StatusBar label="Status:" status={status && status.toString()}>
    <button
      on:click={() => coinsRegister.update(array =>
          array.push(new CoinModel(renderCoins.length, 'red'))
        )}>
      addcoin
    </button>
  </StatusBar>
</Playground>
