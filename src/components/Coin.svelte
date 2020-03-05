<script>
  import { spring } from "svelte/motion";
  import { getContext } from "svelte";

  export let color = "white";
  export let id = 0;
  export let size = 5;
  export let coords;
  coords.stiffness = 0.6;
  coords.damping = 0.8;
  export let midiOutput;

  let circle;
  
  const convertPoint = getContext("convertPoint");

  const updateCoords = event => {
    const scale = (num, [in_min, in_max], [out_min, out_max]) => {
      return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
    const touch = [...event.touches].find(touch => touch.target === circle);

    const { x, y } = convertPoint(touch.clientX, touch.clientY);
    [y].forEach((dimension, i) => {
      const scaledDimension = scale(dimension, [0, 127], [-1, 1])
      midiOutput.sendPitchBend(scaledDimension, 12 + i + 2*circle.id);
    })
    $coords = { x, y };
  };
</script>

<svelte:options namespace="svg" />
<circle
  bind:this={circle}
  id={id}
  on:touchmove={updateCoords}
  cx={$coords.x}
  cy={$coords.y}
  r={size}
  fill={color} />
