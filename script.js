const colorPicker = document.getElementById("colorPicker");
const colorCode = document.getElementById("colorCode");
const previewBox = document.getElementById("preview");
const copyButton = document.getElementById("copyButton");

// Met à jour la couleur et le code couleur
colorPicker.addEventListener("input", (event) => {
  const selectedColor = event.target.value;
  const formattedColor = "0x" + selectedColor.slice(1);
  colorCode.value = formattedColor;
  previewBox.style.backgroundColor = selectedColor;
});

// Copie le code couleur dans le presse-papier
copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(colorCode.value).then(() => {
    // Change temporairement le texte du bouton
    copyButton.textContent = "Copy !";
    setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 2000);
  });
});
