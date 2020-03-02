<script>
  import Nav from "../components/Nav.svelte";

  export let segment;
</script>

<style>
  main {
    position: relative;
    max-width: 70%;
    margin: auto auto;
    box-sizing: border-box;
    font-size: 2em;
  }
</style>

<Nav {segment} />

<main>
  <slot />
</main>
