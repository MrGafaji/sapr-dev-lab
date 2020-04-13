<script>
  import { spring } from "svelte/motion";
  import { getContext } from "svelte";
  import throttle from "lodash/throttle";
  import debounce from "lodash/debounce";

  export let color = "white";
  export let id = 0;
  export let radius = 8;
  export let coords;
  export let viewBox;
  coords.stiffness = 1;
  coords.damping = 0.9;
  export let midiOutput;
  export let updateRegister;
  export let svg;
  export let configureMode = false;

  const convertPoint = getContext("convertPoint");
  let circle;
  let coordpx = { xpx: 0, ypx: 0 };
  let configureX = false;
  let configureY = false;

  const scale = (num, [in_min, in_max], [out_min, out_max]) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };

  const limit = (input, min, max) => {
    return input < min ? min : input > max ? max : input;
  };

  const fingerTracking = event => {
    const touch = [...event.touches].find(touch => touch.target === circle);
    const { x, y } = convertPoint(touch.clientX, touch.clientY);
    return { x, y };
  };

  const updateCoords = throttle(({ x, y }) => {
    x = limit(x, viewBox.x, viewBox.width);
    y = limit(y, viewBox.y, viewBox.height);
    coords.set({ x, y });
    updateRegister();
  }, 10);

  const sendMidi = ({ x, y }, direction) => {
    let pitchBends = [
      scale(x, [viewBox.x, viewBox.width], [-1, 1]),
      scale(y, [viewBox.y, viewBox.height], [1, -1])
    ];
    const definitelyScaled = pitchBends.every(d => d > -1 && d < 1);
    definitelyScaled &&
      pitchBends.forEach((pitchBend, i) => {
        let index = i;
        if (direction) index = direction === "x" ? 0 : 1;
        $midiOutput.sendPitchBend(pitchBend, index + 1 + 2 * circle.id);
      });
  };

  const onMove = (event, coords) => {
    let { x, y } = coords ? coords : fingerTracking(event);
    sendMidi({ x, y });
    updateCoords({ x, y });
  };

  const onTrick = event => {
    const trickTouch = [...event.touches].find(
      (touch, index) => touch.target === svg
    );
    if (trickTouch) {
      const moveCoinToEmptyFinger = debounce(onMove, 100);
      moveCoinToEmptyFinger(
        event,
        convertPoint(trickTouch.clientX, trickTouch.clientY)
      );
    }
  };

  const onClick = () => {
    if ($configureMode) {
      configureMode.set({ id: id, direction: "x" });
    }
  };

  let uziSendMidi = false;
  configureMode.subscribe(mode => {
    if (mode.id === id && mode.direction) {
      uziSendMidi && clearInterval(uziSendMidi);
      uziSendMidi = setInterval(sendMidiWithDirection, 300);
      function sendMidiWithDirection() {
        !document.hasFocus() && sendMidi($coords, mode.direction);
      }
    } else {
      uziSendMidi && clearInterval(uziSendMidi);
    }
  });
</script>

<svelte:options namespace="svg" />
<circle
  bind:this={circle}
  {id}
  on:click={onClick}
  on:touchmove|preventDefault|stopPropagation={onMove}
  on:touchend={onTrick}
  cx={$coords.x}
  cy={$coords.y}
  class={$configureMode.id === id && 'animate-wobble-' + $configureMode.direction}
  r={radius}
  fill={color} />
