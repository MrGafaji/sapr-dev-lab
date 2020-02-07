<script>
  const viewBoxWidth = 200;
  const viewBoxHeight = 200;

  function step(timestamp) {
    if (!start) start = timestamp;
    var progress = timestamp - start;
    moveCircle("circle");
    if (progress < 20000) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);

  function generateCircle(size) {
    var circle = document.createElement("circle");
    circle.setAttribute("cx", Math.random() * viewBoxWidth);
    circle.setAttribute("cy", Math.random() * viewBoxHeight);
    circle.setAttribute("r", size);
    circle.style.fill = "white";
    document.querySelector("#viewbox").appendChild(circle);
  }

  function moveCircle(circleId) {
    var circle = document.getElementById(circleId);
    circle.setAttribute("cx", Math.random() * viewBoxWidth);
    circle.setAttribute("cy", Math.random() * viewBoxHeight);
  }

  window.generateCircle = generateCircle;
  window.moveCircle = moveCircle;
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
  <circle id="circle" cx="100" cy="100" r="5" />
</svg>
