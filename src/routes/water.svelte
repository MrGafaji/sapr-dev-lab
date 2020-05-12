<script>
  import { onMount } from "svelte";
  const viewBoxWidth = 200;
  const viewBoxHeight = 200;
  const numberOfCircles = 2000;
  const center = {};
  center.x = viewBoxWidth * 0.5;
  center.y = viewBoxHeight * 0.25;
  const rotRadius = 10;
  const speed = 0.005;

  let registeredCircles = [];
  let start;
  let progress;
  let pause = false;

  function step(timestamp) {
    if (!start) start = timestamp;
    progress = timestamp - start;
    for (let i = 1; i < registeredCircles.length + 1; i++) {
      moveCircle(i, progress * speed, rotRadius, center);
    }
    if (progress < 100000 && !pause) {
      window.requestAnimationFrame(step);
    }
  }

  function populateRegisteredCircles() {
    for (let i = 0; i < numberOfCircles; i++) {
      var circle = {};
      circle.cy =
        center.y +
        (rotRadius * Math.sin((i * 2 * Math.PI) / numberOfCircles)) / 10;
      circle.cx = 0.1 * i;
      circle.r = 0.1;
      circle.id = "circle-" + (i + 1);

      circle.initial = circle;

      registeredCircles.push(circle);
    }
  }

  function moveCircle(circleId, prog, rotRadius, center) {
    var circle = document.getElementById("circle-" + circleId);
    if (circle) {
      // circle.setAttribute(
      //   "cx",
      //   center.x +
      //     rotRadius *
      //       Math.cos(prog + (circleId * 2 * Math.PI) / numberOfCircles)
      // );
      circle.setAttribute(
        "cy",
        center.y +
          (rotRadius *
            Math.sin(prog + (circleId * 20 * Math.PI) / numberOfCircles) +
            rotRadius *
              Math.sin(prog + (circleId * 90 * Math.PI) / numberOfCircles)) /
            20
      );
      //   circle.setAttribute(
      //     "r",
      //     registeredCircles[circleId].initial.r +
      //       Math.sin(prog / 1500) * registeredCircles[circleId].initial.r
      //   );
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
    fill: lawngreen;
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
