<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	main {
		position: relative;
		max-width: 100%;
		height: 100%;
		background-color: black;
		margin: auto auto;
		box-sizing: border-box;
	}
</style>

<!-- <Nav {segment}/> -->

<main>
	<slot></slot>
</main>