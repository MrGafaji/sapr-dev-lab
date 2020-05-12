<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const { cos, atan, sqrt } = Math;

  const viewBoxWidth = 200;
  const viewBoxHeight = 200;
  const vertical = 10;
  const horizontal = 10;

  let squarray = writable([]);
  let waves = [];
  let pause = false;
  let start;
  let progress;
  const speed = 0.001;

  function drawSquares() {
    for (let i = 0; i < vertical; i++) {
      for (let j = 0; j < horizontal; j++) {
        var square = {};
        square.id = "square-" + i + "-" + j;
        square.vert = i;
        square.hor = j;

        var x = square.hor;
        var y = square.vert;

        var d = sqrt(x ** 2 + y ** 2);
        var delta = atan(x / y);
        var A = d * cos((0.3 * Math.PI) / 2 - delta);

        let c = cos(A) ** 2;

        square.color = `rgba(255, 255, 255,${c})`;

        squarray.push(square);
      }
    }
  }

  function drawWaves() {
    var wave = {};
    wave.freq = 1;
    wave.alpha = Math.PI / 4;
    // console.log(wave.alpha);
    waves.push(wave);
  }

  function recolor(square, waves, prog, speed) {
    let alpha = 0;

    // var delta = atan(square.hor / square.vert);
    // var epsilon = 0.5 * Math.PI - delta;
    // var c = sqrt(x ** 2 + y ** 2);
    // var A = c * cos(epsilon) ** 2;
    square.color = `rgba(255,255,255,${alpha})`;
  }

  function step(timestamp) {
    if (!start) start = timestamp;
    progress = timestamp - start;
    for (let square in squarray) {
      recolor(square, waves, progress, speed);
    }
    if (progress < 100000 && !pause) {
      window.requestAnimationFrame(step);
    }
  }

  function onPause(p) {
    pause = !p;
    p && window.requestAnimationFrame(step);
  }

  onMount(() => {
    drawSquares();
    drawWaves(waves);
    window.requestAnimationFrame(step);
  });
</script>

<style>

</style>

<svelte:head>
  <title>VisualsFromOuterSpace</title>
</svelte:head>

<svg
  id="viewbox"
  viewBox="0 0 {viewBoxWidth}
  {viewBoxHeight}"
  xmlns="http://www.w3.org/2000/svg">
  {#each squarray as { id, vert, hor, color }}
    <rect
      {id}
      x={(hor * viewBoxWidth) / horizontal}
      y={(vert * viewBoxHeight) / vertical}
      width={viewBoxWidth / horizontal}
      height={viewBoxHeight / vertical}
      {vert}
      {hor}
      style="fill: {color}" />
  {:else}
    <h1>No circles today!</h1>
  {/each}

</svg>

<button on:click={onPause(pause)}>pause</button>
