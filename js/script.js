const world = document.querySelector(".world");
const magicDoor = document.querySelector("#magicDoor");
const rabbit = document.querySelector("#rabbit");
const streetLight = document.querySelector("#streetLight");
const doorMessage = document.querySelector("#doorMessage");
const closeMessage = document.querySelector("#closeMessage");
const enterButton = document.querySelector("#enterButton");
const discover = document.querySelector("#discover");

function showDiscover(text) {
  discover.textContent = text;
  discover.classList.add("show");
  clearTimeout(showDiscover.timer);
  showDiscover.timer = setTimeout(() => discover.classList.remove("show"), 1800);
}

magicDoor.addEventListener("click", () => {
  world.classList.add("door-open");
  doorMessage.classList.add("show");
});

closeMessage.addEventListener("click", () => doorMessage.classList.remove("show"));

enterButton.addEventListener("click", () => {
  doorMessage.classList.remove("show");
  showDiscover("我們會慢慢把故事放進這裡。");
});

doorMessage.addEventListener("click", (event) => {
  if (event.target === doorMessage) doorMessage.classList.remove("show");
});

rabbit.addEventListener("click", () => {
  world.classList.add("rabbit-found");
  showDiscover("欸，你發現小兔子了。");
});

streetLight.addEventListener("click", () => {
  world.classList.toggle("lit");
  showDiscover(world.classList.contains("lit") ? "原來街燈也有自己的魔法。" : "晚一點，它會再亮起來。");
});
