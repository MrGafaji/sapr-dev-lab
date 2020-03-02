<!-- <script>
  export const id = 0;
  export const color = "red";
  export const size = "30px";
  export const showCountDown = false;
  export let x;
  export let y;
</script>

<style>
  .coin {
    position: relative;
    border-radius: 50%;
  }
</style>

<div {id} class="coin" background-color={color} left={x} bottom={y} height={size} width={size}>
  {#if showCountDown}
  <slot />
  {/if}
</div> -->

<script>
  import { spring } from 'svelte/motion';
  export const id = 0;
  export let onTouch;
  export let color = "red";
  export const showCountDown = false;
  export let size = spring(10);
  export let x;
  export let y;

	let coords = spring({ x: $x, y: $y }, {
		stiffness: 0.1,
		damping: 0.6
	});

</script>

<div style="position: absolute; right: 1em;">
	<label>
		<h3>stiffness ({coords.stiffness})</h3>
		<input bind:value={coords.stiffness} type="range" min="0" max="1" step="0.01">
	</label>

	<label>
		<h3>damping ({coords.damping})</h3>
		<input bind:value={coords.damping} type="range" min="0" max="1" step="0.01">
	</label>
</div>

<circle on:touchmove="{e => onTouch(e)}" {id} cx={$coords.x} cy={$coords.y} r={$size} fill={color}/>
