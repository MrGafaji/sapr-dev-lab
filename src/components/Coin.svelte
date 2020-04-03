<script>
  import { spring } from 'svelte/motion';
  import { getContext } from 'svelte';
  import throttle from 'lodash/throttle';

  export let color = "white";
  export let id = 0;
  export let size = 5;
  export let coords;
  export let viewBox;
  coords.stiffness = 0.6;
  coords.damping = 0.8;
  export let midiOutput;
  export let updateRegister;

  const convertPoint = getContext("convertPoint");
  let circle;

  const scale = (num, [in_min, in_max], [out_min, out_max]) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };

  const limit = (input, min, max) => {
    return input < min ? min : input > max ? max : input;
  };

  const fingerTracking = event => {
    const touch = [...event.touches].find(touch => touch.target === circle);
    const {x, y} = convertPoint(touch.clientX, touch.clientY);
    return  {x, y};
  };

  const updateCoords = throttle((x, y) => {
    x = limit(x, viewBox.x, viewBox.width);
    y = limit(y, viewBox.y, viewBox.height);
    coords.set({ x, y });
    updateRegister();
  }, 50);

  const sendMidi = (x, y) => {
    let pitchBends = [
      scale(x, [viewBox.x, viewBox.width], [-1, 1]),
      scale(y, [viewBox.y, viewBox.height], [1, -1])
    ];
    const definitelyScaled = pitchBends.every(d => d > -1 && d < 1);
    definitelyScaled && pitchBends.forEach((pitchBend, i) => {
      $midiOutput.sendPitchBend(pitchBend, i + 1 + 2 * circle.id);
    });
  }

  const onMove = event => {
    event.stopPropagation();
    let { x, y } = fingerTracking(event);
    sendMidi(x, y);
    updateCoords(x, y);
  };
</script>

<svelte:options namespace="svg" />
<circle
  bind:this={circle}
  {id}
  on:touchmove|preventDefault={onMove}
  cx={$coords.x}
  cy={$coords.y}
  r={size}
  fill={color} />
