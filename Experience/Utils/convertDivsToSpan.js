export default function (element) {
  element.style.overflow = "hidden";
  element.innerHTML = element.innerText
    .split("")
    .map((char) => {
      if (char === " ") {
        return `<span>${char}</span>`;
      }
      return `<span class="animated-is">${char}</span>`;
    })
    .join("");

  return element;
}
