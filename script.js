const gradientMap = document.querySelector(".gradient-map");
const pickerDot = document.querySelector(".picker-dot");
const hueSlider = document.querySelector(".hue-slider");
const hueCursor = document.querySelector(".hue-cursor");
const colorPreview = document.querySelector(".color-preview");
const copyButtons = document.querySelectorAll(".copy-button");
const hexCode = document.getElementById("hex-code");

let isDragging = false;
let currentHue = 141;
let currentSaturation = 37;
let currentLightness = 32;

function updateColor(e, element) {
  const rect = element.getBoundingClientRect();
  let x, y;

  if (element === gradientMap) {
    x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    pickerDot.style.left = x + "px";
    pickerDot.style.top = y + "px";

    currentSaturation = Math.round((x / rect.width) * 100);
    currentLightness = Math.round(100 - (y / rect.height) * 100);
  } else if (element === hueSlider) {
    y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    currentHue = Math.round((y / rect.height) * 360);
    hueCursor.style.top = y + "px";
  }

  const hslColor = `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;
  colorPreview.style.backgroundColor = hslColor;

  gradientMap.style.background = `
  linear-gradient(to bottom, transparent, #000),
  linear-gradient(to right, #fff, hsl(${currentHue}, 100%, 50%))
`;

  updateColorCodes();
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4)),
  ];
}

function rgbToHex(rgb) {
  return rgb
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("")
    .toUpperCase();
}

function updateColorCodes() {
  const rgb = hslToRgb(currentHue, currentSaturation, currentLightness);
  const hex = rgbToHex(rgb);
  hexCode.textContent = `HEX: #${hex}`;
}

function showCopyNotification(format) {
  const notification = document.createElement("div");
  notification.className = "copy-notification";
  notification.textContent = `${format} copied to clipboard!`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

copyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const rgb = hslToRgb(currentHue, currentSaturation, currentLightness);
    const hex = rgbToHex(rgb);
    let textToCopy = "";
    let format = "";

    switch (button.dataset.type) {
      case "hex":
        textToCopy = `#${hex}`;
        format = "HEX";
        break;
      case "discord":
        textToCopy = `0x${hex}`;
        format = "Discord color embed";
        break;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      showCopyNotification(format);
    });
  });
});

gradientMap.addEventListener("mousedown", (e) => {
  isDragging = true;
  updateColor(e, gradientMap);
});

hueSlider.addEventListener("mousedown", (e) => {
  isDragging = true;
  updateColor(e, hueSlider);
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  if (e.target === gradientMap || gradientMap.contains(e.target)) {
    updateColor(e, gradientMap);
  } else if (e.target === hueSlider) {
    updateColor(e, hueSlider);
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

/* vue */

const namespace = "colour_selector_for_discord.py_embed/writedev";
const key = "page-visits";

fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
  .then((response) => response.json())
  .then((data) => {
    document.getElementById(
      "view-counter"
    ).textContent = `view : ${data.value}`;
  })
  .catch((err) => console.error("Erreur:", err));
