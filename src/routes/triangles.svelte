<script>
  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
  const viewBoxWidth = 160;
  const viewBoxHeight = 90;
  const population = 100;
  const triangleOrigin = { x1: viewBoxWidth / 2, y1: viewBoxHeight / 2 };

  let registeredTriangles = [];
  let start;
  let progress;
  let pause = false;

  function step(timestamp) {
    if (!start) start = timestamp;
    progress = timestamp - start;

    for (let i = 0; i < registeredTriangles.length; i++) {
      !pause && setTriangle(i, progress);
    }

    !pause && window.requestAnimationFrame(step);
  }

  function populateregisteredTriangles() {
    for (let i = 0; i < population; i++) {
      var triangle = {};
      triangle.x1 = triangleOrigin.x1;
      triangle.y1 = triangleOrigin.y1;
      triangle.x2 = Math.random() * viewBoxWidth;
      triangle.y2 = Math.random() * viewBoxHeight;
      triangle.id = i;

      triangle.initial = triangle;

      registeredTriangles.push(triangle);
    }
  }

  function setTriangle(triangleId, prog) {
    var segmentClass = `triangle-${triangleId}-segment`;
    var triangleSegments = document.getElementsByClassName(segmentClass);
    if (triangleSegments.length > 0) {
      for (var i = 0; i < triangleSegments.length; i++) {
        triangleSegments[i].setAttribute(
          "x2",
          registeredTriangles[triangleId].initial.x2 +
            Math.cos(prog / 500 + triangleId) *
              registeredTriangles[triangleId].initial.x2
        );
        triangleSegments[i].setAttribute(
          "y2",
          registeredTriangles[triangleId].initial.y2 +
            Math.sin(prog / 500 + triangleId) *
              registeredTriangles[triangleId].initial.y2
        );
      }
    } else {
      console.error(" No Triangles found");
    }
  }

  function onPause(p) {
    pause = !p;
    p && window.requestAnimationFrame(step);
  }

  populateregisteredTriangles();

  onMount(() => {
    window.requestAnimationFrame(step);
  });

  onDestroy(() => {
    pause = true;
  });
</script>

<style>
  line {
    stroke: white;
    stroke-width: 0.05px;
  }
  .side-a {
    transform: translateY(50%);
  }
  h1 {
    color: white;
    font-size: 5em;
  }
</style>

<svelte:head>
  <title>Triangles</title>
</svelte:head>

<svg
  xmlns="http://www.w3.org/2000/svg"
  id="viewbox"
  viewBox="{0}
  {0}
  {viewBoxWidth}
  {viewBoxHeight}">
  {#each registeredTriangles as { id, x1, y1, x2, y2 }}
    <g id="triangle-{id}" class="triangle">
      <line class="triangle-{id}-segment" x1={x1} {y1} {x2} {y2} />
      <line class="triangle-{id}-segment side-a" {x1} {y1} {x2} {y2} />
      <line class="triangle-{id}-segment side-b" {x1} {y1} {x2} {y2} />
    </g>
  {:else}
    <h1>No triangles today!</h1>
  {/each}

</svg>

<button on:click={onPause(pause)}>pause</button>
