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
  const scale = (num, [in_min, in_max], [out_min, out_max]) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  const limit = (input, max = 100) => {
    return input < 0 ? 0 : input > max ? max : input;
  }

  const updateCoords = event => {
    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
    const touch = [...event.touches].find(touch => touch.target === circle);

    let { x, y } = convertPoint(touch.clientX, touch.clientY);
    [x,y] = [x,y].map(d => limit(d));
    [y].forEach((dimension, i) => {
      const scaledDimension = scale(dimension, [0, 100], [1, -1])
      midiOutput.sendPitchBend(scaledDimension, i+1 + 2*circle.id);
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
