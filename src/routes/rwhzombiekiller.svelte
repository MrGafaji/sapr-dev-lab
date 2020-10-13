<script>
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  import { lookAhead } from '../rwhzombiekiller';

  let viewBoxHeight = 1080;
  let viewBoxWidth = 1920;
  const floorHeight = 300;
  onMount(() => {
    lookAhead();
  });
  onDestroy(() => {});

  let head = { x: 100, y: 100, r: 20 };
  let chest = { x: 100, y: 140 };
  let leftElbow = { x: 80, y: 160 };
  let leftHand = { x: 70, y: 200 };
  let rightElbow = { x: 120, y: 160 };
  let rightHand = { x: 130, y: 200 };
  let leftKnee = { x: 80, y: 280 };
  let leftFoot = { x: 70, y: 350 };
  let rightKnee = { x: 120, y: 280 };
  let rightFoot = { x: 130, y: 350 };
  let butt = { x: 100, y: 200 };
</script>

<style>
  svg {
    position: fixed;
  }
  svg#background {
    width: 100vw;
    background: lightblue;
  }
  rect {
    fill: green;
  }
  line {
    stroke: black;
    stroke-width: 8px;
    stroke-linecap: round;
  }
  #human {
    top: 530px;
    left: 900px;
    width: 200px;
  }
</style>

<svg id="background" viewBox="0 0 {viewBoxWidth} {viewBoxHeight}">
  <rect
    x="0"
    y={viewBoxHeight - floorHeight}
    height={floorHeight}
    width={viewBoxWidth} />
</svg>
<svg id="human" viewBox="0 0 200 400">
  <circle cx={head.x} cy={head.y} r={head.r} />
  <line id="neck" x1={head.x} y1={head.y} x2={chest.x} y2={chest.y} />
  <line
    id="left-shoulder"
    x1={chest.x}
    y1={chest.y}
    x2={leftElbow.x}
    y2={leftElbow.y} />
  <line
    id="right-shoulder"
    x1={chest.x}
    y1={chest.y}
    x2={rightElbow.x}
    y2={rightElbow.y} />
  <line
    id="left-arm"
    x1={leftElbow.x}
    y1={leftElbow.y}
    x2={leftHand.x}
    y2={leftHand.y} />
  <line
    id="right-arm"
    x1={rightElbow.x}
    y1={rightElbow.y}
    x2={rightHand.x}
    y2={rightHand.y} />
  <line
    id="left-upper-leg"
    x1={butt.x}
    y1={butt.y}
    x2={leftKnee.x}
    y2={leftKnee.y} />
  <line
    id="right-upper-leg"
    x1={butt.x}
    y1={butt.y}
    x2={rightKnee.x}
    y2={rightKnee.y} />
  <line
    id="left-leg"
    x1={leftKnee.x}
    y1={leftKnee.y}
    x2={leftFoot.x}
    y2={leftFoot.y} />
  <line
    id="right-leg"
    x1={rightKnee.x}
    y1={rightKnee.y}
    x2={rightFoot.x}
    y2={rightFoot.y} />
  <line id="body" x1={chest.x} y1={chest.y} x2={butt.x} y2={butt.y} />
</svg>
