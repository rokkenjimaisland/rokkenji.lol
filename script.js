const clock = document.querySelector("#clock");

function updateClock() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  clock.textContent = formatter.format(new Date());
}

updateClock();
setInterval(updateClock, 1000);
