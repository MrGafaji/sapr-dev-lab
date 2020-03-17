<script>
  import { spring } from "svelte/motion";
  import { getContext } from "svelte";

  export let color = "white";
  export let id = 0;
  export let size = 5;
  export let coords;
  export let viewBox;
  coords.stiffness = 0.6;
  coords.damping = 0.8;
  export let midiOutput;
  export let updateRegister;

  let circle;

  const convertPoint = getContext("convertPoint");
  const scale = (num, [in_min, in_max], [out_min, out_max]) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };
  const limit = (input, min, max) => {
    return input < min ? min : input > max ? max : input;
  };

  const updateCoords = event => {
    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
    const touch = [...event.touches].find(touch => touch.target === circle);

    let { x, y } = convertPoint(touch.clientX, touch.clientY);
    x = limit(x, viewBox.x, viewBox.width);
    y = limit(y, viewBox.y, viewBox.height);
    coords.set({ x, y });
    updateRegister();

    let pitchBends = [
      scale(x, [viewBox.x, viewBox.width], [-1, 1]),
      scale(y, [viewBox.y, viewBox.height], [1, -1])
    ];
    pitchBends.forEach((pitchBend, i) => {
      midiOutput.sendPitchBend(pitchBend, i + 1 + 2 * circle.id);
    });
  };
</script>

<svelte:options namespace="svg" />
<circle
  bind:this={circle}
  {id}
  on:touchmove={updateCoords}
  cx={$coords.x}
  cy={$coords.y}
  r={size}
  fill={color} />
