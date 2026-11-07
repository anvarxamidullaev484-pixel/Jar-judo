const STORAGE_KEY = "jar-judo-athletes-v1";
const form = document.getElementById("athleteForm");
const nameInput = document.getElementById("athleteName");
const ageInput = document.getElementById("athleteAge");
const weightInput = document.getElementById("athleteWeight");
const list = document.getElementById("athleteList");
const empty = document.getElementById("emptyState");
const search = document.getElementById("searchInput");
let athletes = loadAthletes();

function loadAthletes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveAthletes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(athletes));
}
function render() {
  const term = search.value.trim().toLocaleLowerCase("uz");
  const shown = athletes.filter(a => a.name.toLocaleLowerCase("uz").includes(term));
  list.innerHTML = "";
  document.getElementById("totalCount").textContent = athletes.length;
  document.getElementById("listCount").textContent = `${athletes.length} ta`;
  empty.style.display = shown.length ? "none" : "block";
  empty.querySelector("b").textContent = athletes.length && term ? "Sportchi topilmadi" : "Hozircha ro‘yxat bo‘sh";
  empty.querySelector("small").textContent = athletes.length && term ? "Boshqa ism bilan qidirib ko‘ring." : "Birinchi sportchini qo‘shing.";
  shown.forEach(a => {
    const row = document.createElement("div");
    row.className = "athlete-row";
    const info = document.createElement("div");
    info.className = "athlete-info";
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = a.name.trim().charAt(0).toUpperCase();
    const details = document.createElement("div");
    const title = document.createElement("b");
    title.textContent = a.name;
    const meta = document.createElement("small");
    meta.textContent = `${a.age ? a.age + " yosh" : "Yoshi kiritilmagan"}  ·  ${a.weight}`;
    details.append(title, meta);
    info.append(avatar, details);
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "✕ O‘chirish";
    del.type = "button";
    del.addEventListener("click", () => {
      if (confirm(`${a.name} ro‘yxatdan o‘chirilsinmi?`)) {
        athletes = athletes.filter(item => item.id !== a.id);
        saveAthletes();
        render();
      }
    });
    row.append(info, del);
    list.append(row);
  });
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;
  athletes.unshift({
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())),
    name,
    age: ageInput.value ? Number(ageInput.value) : "",
    weight: weightInput.value
  });
  saveAthletes();
  form.reset();
  nameInput.focus();
  render();
});
search.addEventListener("input", render);
render();
