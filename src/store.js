import { writable } from 'svelte/store';
import { spring } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import WebMidi from 'webmidi';

export const table = writable(2);
export const status = writable(null);
export const loopmidiLink =
  'https://www.tobias-erichsen.de/software/loopmidi.html';
export const configureMode = writable(false);
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

export const addCoin = (coinJson) => {
  coins.update((prevCoins) => {
    const currentSlot = prevCoins ? prevCoins.length : 0;
    const { x, y } = coinJson
      ? coinJson.coords
      : { x: currentSlot * 10 + 15, y: 15 };

    if (currentSlot < 10) {
      return [
        ...prevCoins,
        {
          id: coinJson ? coinJson.id : currentSlot,
          color: [
            'gold',
            'silver',
            'DarkGoldenRod',
            'magenta',
            'cyan',
            'orange',
            'limegreen',
            'pink',
            'orangered',
            'CadetBlue',
          ][currentSlot],
          coords: spring({ x: x, y: y }),
        },
      ];
    } else {
      return prevCoins;
    }
  });
};

export const deleteCoin = () => {
  coins.update((prevCoins) => {
    return prevCoins.slice(0, -1);
  });
};

export const setLocalStorage = (entry, coins, window) => {
  const flatcoins = coins.map((coin) => {
    let x, y;
    coin.coords.subscribe((c) => {
      x = c.x;
      y = c.y;
    });
    return { ...coin, coords: { x: x, y: y } };
  });
  window.localStorage.setItem(entry, JSON.stringify(flatcoins));
};

export const enableMidi = (window) => {
  WebMidi.enable(function (err) {
    if (err) {
      console.log('WebMidi could not be enabled.', err);
    } else {
      midi.set(WebMidi);
      const defaultMidiDeviceIndex = JSON.parse(
        window.localStorage.getItem('defaultMidiDeviceIndex')
      );
      midiOutput.set(WebMidi.outputs[defaultMidiDeviceIndex || 0]);
    }
  });
};
