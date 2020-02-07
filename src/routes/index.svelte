<script>
  import { onMount } from "svelte";
  const viewBoxWidth = 200;
  const viewBoxHeight = 200;
  const numberOfCircles = 10;

  let registeredCircles = [];
  let start;
  let progress;
  let pause = false;

  function step(timestamp) {
    if (!start) start = timestamp;
    progress = timestamp - start;
    for (let i = 0; i < registeredCircles.length; i++) {
      moveCircle(i, progress);
    }
    if (progress < 100000 && !pause) {
      window.requestAnimationFrame(step);
    }
  }

  function populateRegisteredCircles() {
    for (let i = 0; i < numberOfCircles; i++) {
      var circle = {};
      circle.cx = Math.random() * viewBoxWidth;
      circle.cy = Math.random() * viewBoxHeight;
      circle.r = 5;
      circle.id = "circle-" + i;

      circle.initial = circle;

      registeredCircles.push(circle);
    }
  }

  function moveCircle(circleId, prog) {
    var circle = document.getElementById("circle-" + circleId);
    if (circle) {
      circle.setAttribute(
        "cx",
        registeredCircles[circleId].initial.cx +
          Math.sin(prog / 1000) * registeredCircles[circleId].initial.cx
      );
      circle.setAttribute(
        "cy",
        registeredCircles[circleId].initial.cy +
          Math.sin(prog / 2000) * registeredCircles[circleId].initial.cy
      );
      circle.setAttribute(
        "r",
        registeredCircles[circleId].initial.r +
          Math.sin(prog / 1500) * registeredCircles[circleId].initial.r
      );
    } else {
      console.log(" No circles found");
    }
  }

  function onPause(p) {
    pause = !p;
    p && window.requestAnimationFrame(step);
  }

  populateRegisteredCircles();
  onMount(() => {
    window.registeredCircles = registeredCircles;
    window.populateRegisteredCircles = populateRegisteredCircles;
    window.moveCircle = moveCircle;
    window.requestAnimationFrame(step);
  });
</script>

<style>
  circle {
    fill: aquamarine;
  }
</style>

<svelte:head>
  <title>VisualsFromOuterSpace</title>
</svelte:head>

<svg
  id="viewbox"
  viewBox="0 0 {viewBoxWidth}
  {viewBoxHeight}"
  xmlns="http://www.w3.org/2000/svg">
  {#each registeredCircles as { id, cx, cy, r }}
    <circle {id} {cx} {cy} {r} />
  {:else}
    <h1>No circles today!</h1>
  {/each}

</svg>

<button on:click={onPause(pause)}>pause</button>
