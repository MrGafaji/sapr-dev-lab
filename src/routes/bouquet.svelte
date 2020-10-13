<script>
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  let start;
  let canvas;
  let c;
  let color = '#ffffff';
  let headRadius = 30;
  let view;
  let origin;

  onMount(() => {
    start = Date.now();
    view = {
      x: window.innerWidth,
      y: window.innerHeight - 100,
    };
    origin = {
      x: view.x / 2,
      y: view.y,
    };
    canvas.width = view.x;
    canvas.height = view.y;
    c = canvas.getContext('2d');
    createBouquet(origin, color);
    animate();
  });

  const createBouquet = (origin, color) => {
    createFlower(origin.x - 200, origin.y - 200, color);
    createFlower(origin.x - 180, origin.y - 300, color);
    createFlower(origin.x - 100, origin.y - 380, color);
    createFlower(origin.x - 0, origin.y - 420, color);
    createFlower(origin.x + 100, origin.y - 380, color);
    createFlower(origin.x + 180, origin.y - 300, color);
    createFlower(origin.x + 200, origin.y - 200, color);
  };

  const createFlower = (x, y, color) => {
    createHead(x, y, headRadius, color);
    createStem(origin, x, y, color);
  };

  const createHead = (x, y, radius, color) => {
    c.beginPath();
    c.arc(x, y, radius, Math.PI * 2, false);
    c.fillStyle = color;
    c.fill();
  };

  const createStem = (origin, x, y, color) => {
    c.beginPath();
    c.moveTo(x, y);
    c.quadraticCurveTo(origin.x, y, origin.x, origin.y);
    c.strokeStyle = color;
    c.lineWidth = 6;
    c.stroke();
  };

  const animate = () => {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, view.x, view.y);
    let newOrigin = {
      x:
        origin.x -
        10 *
          Math.sin(
            (Date.now() - start) /
              (Math.sin((Date.now() - start) / 1000) * 300 + 900)
          ),
      y: origin.y,
    };
    createBouquet(newOrigin, color);
  };
</script>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>

<canvas bind:this={canvas} />
