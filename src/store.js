import { writable } from "svelte/store";
import { spring } from "svelte/motion";
import WebMidi from "webmidi";

export const status = writable(null);
export const midi = writable(null);
export const midiOutput = writable(null);
export const coins = writable([]);
export const viewBox = { x: 0, y: 0, width: 180, height: 100 };
export const showDeviceMenu = writable(false);

export const stopPropagation = () => {
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
};

export const addCoin = coinJson => {
  coins.update(prevCoins => {
    const { x, y } = coinJson ? coinJson.coords : { x: prevCoins.length * 10 + 15, y: 15 };

    if (prevCoins.length < 10) {
      return [
        ...prevCoins,
        {
          id: coinJson ? coinJson.id : prevCoins.length,
          color: [
            "gold",
            "silver",
            "DarkGoldenRod",
            "magenta",
            "cyan",
            "orange",
            "limegreen",
            "pink",
            "orangered",
            "CadetBlue"
          ][prevCoins.length],
          coords: spring({ x: x, y: y })
        }
      ];
    }
  });
};

export const setLocalStorage = (entry, coins, window) => {
  const flatcoins = coins.map(coin => {
    let x, y;
    coin.coords.subscribe(c => {
      x = c.x;
      y = c.y;
    });
    return { ...coin, coords: { x: x, y: y } };
  });
  window.localStorage.setItem(entry, JSON.stringify(flatcoins));
};

export const enableMidi = () => {
  WebMidi.enable(function(err) {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      midi.set(WebMidi);
      midiOutput.set(WebMidi.outputs[1]);
    }
  });
};
