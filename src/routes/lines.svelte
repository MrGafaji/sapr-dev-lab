<script>
  import { onMount } from "svelte";
  const viewBoxWidth = 160;
  const viewBoxHeight = 90;
  const population = 100;
  const lineOrigin = { x1: viewBoxWidth / 2, y1: viewBoxHeight / 2 };

  let registeredLines = [];
  let start;
  let progress;
  let pause = false;

  function step(timestamp) {
    if (!start) start = timestamp;
    progress = timestamp - start;

    for (let i = 0; i < registeredLines.length; i++) {
      setLine(i, progress);
    }

    !pause && window.requestAnimationFrame(step);
  }

  function populateregisteredLines() {
    for (let i = 0; i < population; i++) {
      var line = {};
      line.x1 = lineOrigin.x1;
      line.y1 = lineOrigin.y1;
      line.x2 = Math.random() * viewBoxWidth;
      line.y2 = Math.random() * viewBoxHeight;
      line.id = "line-" + i;

      line.initial = line;

      registeredLines.push(line);
    }
  }

  function setLine(lineId, prog) {
    var line = document.getElementById("line-" + lineId);
    if (line) {
      line.setAttribute(
        "x2",
        registeredLines[lineId].initial.x2 +
          Math.cos(prog / 500 + lineId) * registeredLines[lineId].initial.x2
      );
      line.setAttribute(
        "y2",
        registeredLines[lineId].initial.y2 +
          Math.sin(prog / 500 + lineId) * registeredLines[lineId].initial.y2
      );
    } else {
      console.error(" No circles found");
    }
  }

  function onPause(p) {
    pause = !p;
    p && window.requestAnimationFrame(step);
  }

  populateregisteredLines();
  onMount(() => {
    window.requestAnimationFrame(step);
  });
</script>

<style>
  line {
    stroke: white;
    stroke-width: 0.05px;
  }
  h1 {
    color: white;
    font-size: 5em;
  }
</style>

<svelte:head>
  <title>Lines</title>
</svelte:head>

<svg
  id="viewbox"
  viewBox="{0}
  {0}
  {viewBoxWidth}
  {viewBoxHeight}"
  xmlns="http://www.w3.org/2000/svg">
  {#each registeredLines as { id, x1, y1, x2, y2 }}
    <line {id} {x1} {y1} {x2} {y2} />
  {:else}
    <h1>No lines today!</h1>
  {/each}

</svg>

<button on:click={onPause(pause)}>pause</button>
