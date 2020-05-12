<script>
  import { onMount } from "svelte";
  const { cos, atan, sqrt } = Math;

  const viewBoxWidth = 200;
  const viewBoxHeight = 200;
  const vertical = 10;
  const horizontal = 10;

  let squarray = [];
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

  function setup() {
    drawSquares();
    drawWaves(waves);
  }

  function recolor(squareId, waves, prog, speed) {
    var square = document.getElementById(squareId);
    // console.log(square);
    let col = 0;

    var x = square.getAttribute("hor");
    var y = square.getAttribute("vert");
    var delta = atan(x / y);
    var epsilon = 0.5 * Math.PI - delta;
    var c = sqrt(x ** 2 + y ** 2);
    var A = c * cos(epsilon) ** 2;
    col = 0;

    console.log("prog = " + prog);
    square.setAttribute("color", `rgba(255, 255, 255,${col})`);
  }

  function step(timestamp) {
    if (!start) start = timestamp;
    progress = timestamp - start;
    for (let i = 0; i < vertical; i++) {
      for (let j = 0; j < horizontal; j++) {
        recolor("square-" + i + "-" + j, waves, progress, speed);
        // console.log("square-" + i + "-" + j);
      }
    }
    if (progress < 100000 && !pause) {
      window.requestAnimationFrame(step);
    }
  }

  function onPause(p) {
    pause = !p;
    p && window.requestAnimationFrame(step);
  }

  setup();
  onMount(() => {
    window.squarray = squarray;
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
