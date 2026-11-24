// «Вініл-Клуб» — обробка даних каталогу (ЛР8), поведінка сторінок (ЛР9),
// завантаження даних із data.json і пам'ять у localStorage (ЛР10).
// Порядок у файлі: дані → допоміжні функції → функції обробки → сховище → завантаження →
// функції інтерфейсу → запуск і обробники подій у кінці файла.
// Скрипт підключено на всіх сторінках, тому код, що стосується лише каталогу, форми чи статистики,
// виконується тільки там, де є потрібні елементи.

// ===== Дані =====

// Альбоми каталогу. До ЛР10 масив був записаний прямо в коді, тепер його заповнює init()
// даними з data.json. Тут let, а не const: значення присвоюється пізніше, після завантаження.
let albums = [];

// Адреса файла даних варіанта (лежить поруч з index.html).
const DATA_URL = "data.json";

// ===== Допоміжні функції =====

// Записує текст у вказаний елемент. Масив рядків склеює переносами.
const show = (id, value) => {
  const box = document.getElementById(id);
  if (box === null) {
    console.error("Немає елемента з id:", id);
    return;
  }
  box.textContent = Array.isArray(value) ? value.join("\n") : value;
};

// Приймає рядок тривалості "3:36", повертає кількість секунд (216).
const toSeconds = (length) => {
  const parts = length.split(":");
  return Number(parts[0]) * 60 + Number(parts[1]);
};

// Приймає кількість секунд, повертає рядок "хв:сс" із двома цифрами секунд.
const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// У data.json немає поля id, а сам файл змінювати не можна. Тому id — порядковий номер запису
// у файлі (від 1): він стабільний, поки порядок записів не змінюється. Повертає той самий масив.
function addIds(list) {
  list.forEach((item, index) => {
    item.id = index + 1;
  });
  return list;
}

// ===== Функції обробки =====

// Приймає масив альбомів, повертає масив рядків «1. Назва — виконавець, рік (лейбл, країна)».
function numberedList(items) {
  const lines = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    lines.push(`${i + 1}. ${item.album} — ${item.artist}, ${item.year} (${item.label.name}, ${item.label.country})`);
  }
  return lines;
}

// Приймає альбом, повертає назву узагальненої жанрової групи.
function categoryOf(item) {
  switch (item.genre) {
    case "Rock":
    case "Hard Rock":
    case "Punk Rock":
    case "Grunge":
    case "Nu Metal":
      return "Рок і метал";
    case "Pop":
      return "Поп";
    case "Electronic":
      return "Електроніка";
    case "Hip-Hop":
      return "Хіп-хоп";
    default:
      return "Інші жанри";
  }
}

// Приймає масив альбомів і жанр, повертає альбоми саме цього жанру.
const filterByGenre = (items, value) => items.filter((item) => item.genre === value);

// Приймає масив альбомів і рік, повертає альбоми, видані цього року або пізніше.
const filterByYearFrom = (items, minYear) => items.filter((item) => item.year >= minYear);

// Приймає масив альбомів, повертає нову копію, відсортовану за роком випуску (від старіших).
const sortByYear = (items) => [...items].sort((a, b) => a.year - b.year);

// Приймає масив альбомів, повертає нову копію, відсортовану за назвою за українською абеткою.
const sortByTitle = (items) => [...items].sort((a, b) => a.album.localeCompare(b.album, "uk"));

// Приймає масив альбомів і заголовок, повертає рядки для блока фільтра: підсумок і список назв.
const describeFound = (heading, found) => [
  `${heading}: знайдено ${found.length}`,
  found.length === 0 ? "  нічого не знайдено" : found.map((item) => `  • ${item.album}`).join("\n")
];

// Приймає альбом, повертає загальну тривалість усіх його треків у секундах (у даних цього поля немає — воно обчислюване).
// Початкове значення 0: без нього накопичувачем став би перший трек-об'єкт, і сума перетворилася б на рядок "[object Object]…".
const albumSeconds = (item) => item.tracks.reduce((sum, track) => sum + toSeconds(track.length), 0);

// Приймає альбом, повертає середню оцінку слухачів (шкала 1–5) або 0, якщо оцінок немає.
const averageRating = (item) =>
  item.ratings.length === 0 ? 0 : item.ratings.reduce((sum, rating) => sum + rating, 0) / item.ratings.length;

// Приймає альбом, повертає його найдовший трек (об'єкт { title, length }) або undefined, якщо треків немає.
const longestTrackOf = (item) =>
  item.tracks.reduce((best, track) => (toSeconds(track.length) > toSeconds(best.length) ? track : best), item.tracks[0]);

// Приймає масив альбомів, повертає об'єкт статистики: кількість, сумарна й середня тривалість,
// найдовший альбом, найдовший трек добірки, найвища середня оцінка, кількість різних жанрів.
const statsForAlbums = (items) => {
  // total: сума тривалостей альбомів. Початкове значення 0 потрібне, бо без нього
  // reduce узяв би за накопичувач перший альбом-об'єкт, і результат став би рядком "[object Object]…".
  const total = items.reduce((sum, item) => sum + albumSeconds(item), 0);
  // max: альбом із найбільшою тривалістю — накопичувач порівнюється з поточним альбомом.
  const max = items.reduce((best, item) => (albumSeconds(item) > albumSeconds(best) ? item : best), items[0]);
  // Найдовший трек добірки: альбом, чий найдовший трек довший за найдовші треки інших.
  const longestTrackAlbum = items.reduce(
    (best, item) => (toSeconds(longestTrackOf(item).length) > toSeconds(longestTrackOf(best).length) ? item : best),
    items[0]
  );
  const topRated = items.reduce((best, item) => (averageRating(item) > averageRating(best) ? item : best), items[0]);
  const genres = items.map((item) => item.genre);
  return {
    count: items.length,
    total: total,
    average: (total / items.length / 60).toFixed(1),
    max: max,
    longestTrackAlbum: longestTrackAlbum,
    topRated: topRated,
    categories: genres.filter((genre, index) => genres.indexOf(genre) === index).length
  };
};

// ----- Бонусні функції ЛР8 -----

// Приймає масив альбомів і запит, повертає альбоми, у назві або в назві будь-якого треку яких є запит (без урахування регістру).
const searchByText = (items, query) => {
  const needle = query.toLowerCase();
  return items.filter(
    (item) =>
      item.album.toLowerCase().includes(needle) ||
      item.tracks.filter((track) => track.title.toLowerCase().includes(needle)).length > 0
  );
};

// Приймає масив альбомів, назву числового поля рядком і n, повертає n альбомів із найбільшим значенням цього поля.
const topBy = (items, field, n = 3) => [...items].sort((a, b) => b[field] - a[field]).slice(0, n);

// Приймає альбом і одразу розбирає потрібні поля, повертає короткий рядок «назва (рік), лейбл, країна».
const cardLine = ({ album, year, label: { name, country } }) => `${album} (${year}), ${name}, ${country}`;

// Приймає масив альбомів, повертає об'єкт «назва жанрової групи → кількість альбомів у ній».
const countByCategory = (items) =>
  items.reduce((groups, item) => {
    const group = categoryOf(item);
    groups[group] = (groups[group] || 0) + 1;
    return groups;
  }, {});

// Приймає масив альбомів, повертає масив рядків-зауважень (порожній, якщо дані коректні).
const validate = (items) => {
  const problems = [];
  const referenceKeys = Object.keys(items[0]).join();
  items.forEach((item, index) => {
    const name = `Запис ${index + 1}`;
    if (Object.keys(item).join() !== referenceKeys) {
      problems.push(`${name}: інший набір полів (${Object.keys(item).join(", ")})`);
    }
    if (typeof item.id !== "number" || typeof item.year !== "number") {
      problems.push(`${name}: id і year мають бути числами, а year зараз ${typeof item.year}`);
    }
    if (typeof item.album !== "string" || item.album.trim() === "") {
      problems.push(`${name}: порожня назва альбому`);
    }
    if (typeof item.label !== "object" || item.label === null) {
      problems.push(`${name}: немає вкладеного об'єкта label`);
    }
  });
  return problems;
};

// Виводить у секцію «Демонстрація роботи» результати функцій ЛР8.
// Викликається з init() лише після завантаження: до того масив albums порожній.
function renderDemo() {
  const stats = statsForAlbums(albums);
  const problems = validate(albums);

  show("out-count", `Альбомів у каталозі: ${albums.length}`);
  show("out-numbered", numberedList(albums));
  show("out-categories", albums.map((item) => `${item.album} → ${categoryOf(item)}`));
  show("out-filter", [
    ...describeFound("Жанр «Pop»", filterByGenre(albums, "Pop")),
    ...describeFound("Жанр «Country»", filterByGenre(albums, "Country")),
    ...describeFound("Видані з 2000 року", filterByYearFrom(albums, 2000))
  ]);
  show("out-sorted", [
    "За роком:",
    sortByYear(albums).map((item) => `  ${item.year} — ${item.album}`).join("\n"),
    "За назвою:",
    sortByTitle(albums).map((item) => `  ${item.album}`).join("\n"),
    "Вихідний порядок (масив не змінено):",
    albums.map((item) => `  ${item.id}. ${item.album}`).join("\n")
  ]);
  show("out-stats", [
    `Альбомів: ${stats.count}`,
    `Загальна тривалість: ${formatDuration(stats.total)}`,
    `Середня тривалість альбому: ${stats.average} хв`,
    `Найдовший альбом: ${stats.max.album} (${formatDuration(albumSeconds(stats.max))})`,
    `Найдовший трек добірки: ${longestTrackOf(stats.longestTrackAlbum).title} — ${stats.longestTrackAlbum.album} (${longestTrackOf(stats.longestTrackAlbum).length})`,
    `Найвища середня оцінка: ${stats.topRated.album} (${averageRating(stats.topRated).toFixed(2)} з 5)`,
    `Різних жанрів: ${stats.categories}`,
    "Середня оцінка кожного альбому:",
    albums.map((item) => `  ${item.album}: ${averageRating(item).toFixed(2)} (оцінок: ${item.ratings.length})`).join("\n")
  ]);

  show("out-search", ["love", "BEAT", "vaporwave"].map((query) => describeFound(`Запит «${query}»`, searchByText(albums, query)).join("\n")));
  show("out-top", [
    "Топ-3 за роком:",
    topBy(albums, "year").map((item) => `  ${item.year} — ${item.album}`).join("\n"),
    "Топ-2 за роком:",
    topBy(albums, "year", 2).map((item) => `  ${item.year} — ${item.album}`).join("\n")
  ]);
  show("out-lines", albums.map(cardLine));
  show("out-groups", Object.entries(countByCategory(albums)).map((entry) => `${entry[0]}: ${entry[1]}`));
  show("out-validate", problems.length === 0 ? "Помилок не знайдено" : problems);
}

// ===== ЛР10: сховище (localStorage) =====
// Сховище приймає лише рядки, тому масиви й об'єкти записуються через JSON.stringify,
// а читаються через JSON.parse у try/catch: вміст могли зіпсувати вручну в DevTools або інший скрипт.
// Тут лежать лише favorites, theme і ключі бонусів (filters, albums-cache) — нічого чутливого.

// Повертає масив id обраних альбомів; порожній, якщо ключа ще немає або вміст зіпсовано.
function loadFavorites() {
  const raw = localStorage.getItem("favorites");
  if (!raw) return []; // ключа ще немає
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];
  }
}

// Записує масив id обраних альбомів.
function saveFavorites(list) {
  localStorage.setItem("favorites", JSON.stringify(list));
}

// Бонус: повертає збережений стан фільтрів { query, genre, sort, onlyFavorites } або null.
function loadFilters() {
  const raw = localStorage.getItem("filters");
  if (!raw) return null;
  try {
    const filters = JSON.parse(raw);
    return typeof filters === "object" && filters !== null ? filters : null;
  } catch (error) {
    return null;
  }
}

// Бонус: повертає кеш даних { savedAt, data } або null, якщо кешу немає чи він зіпсований.
function loadCache() {
  const raw = localStorage.getItem("albums-cache");
  if (!raw) return null;
  try {
    const cache = JSON.parse(raw);
    if (cache === null || !Array.isArray(cache.data) || cache.data.length === 0 || typeof cache.savedAt !== "number") {
      return null;
    }
    return cache;
  } catch (error) {
    return null;
  }
}

// Бонус: зберігає копію даних разом із часом збереження.
function saveCache(data) {
  localStorage.setItem("albums-cache", JSON.stringify({ savedAt: Date.now(), data: data }));
}

// ===== ЛР10: завантаження даних =====

// Завантажує data.json і повертає масив альбомів.
// fetch відхиляє проміс лише тоді, коли відповіді немає зовсім (немає мережі). Відповідь 404 чи 500
// для нього — успіх, тож catch її не побачить. Тому response.ok перевіряємо самі і кидаємо помилку
// з кодом: інакше код спробував би розібрати сторінку «404 Not Found» як JSON і впав би з
// незрозумілою помилкою розбору замість зрозумілого «HTTP 404».
async function loadData() {
  const response = await fetch(DATA_URL);

  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Файл даних порожній або має неправильну структуру");
  }

  return data;
}

// Бонус: та сама функція на ланцюжку then/catch. Не викликається — лежить для порівняння в README.
// Помилку ловить той, хто викличе: loadDataWithThen().then(...).catch(showLoadError).
function loadDataWithThen() {
  return fetch(DATA_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Файл даних порожній або має неправильну структуру");
      }
      return data;
    });
}

// ===== Функції інтерфейсу =====

// Елементи сторінки. На сторінках, де якогось елемента немає, змінна дорівнює null.
const cardsBox = document.getElementById("cards");
const searchInput = document.getElementById("q");
const genreSelect = document.getElementById("filter");
const onlyFavoritesBox = document.getElementById("only-fav");
const emptyBox = document.getElementById("empty");
const countBox = document.getElementById("count");
const sortBox = document.getElementById("sort");
const resetButton = document.getElementById("reset");
const loader = document.querySelector(".loader");
const loadErrorBox = document.getElementById("load-error");
const cacheNote = document.getElementById("cache-note");
const dlg = document.getElementById("details");
const orderForm = document.getElementById("order-form");
const receiptBox = document.getElementById("receipt");
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const themeButton = document.getElementById("theme");
const toast = document.getElementById("toast");
const artistSelect = document.getElementById("artist");
const artistInfo = document.getElementById("artist-info");

// Стан каталогу: порядок сортування і масив id обраних альбомів.
let sortOrder = "default";
let favorites = loadFavorites();

// Кладе текст у елемент і виділяє в ньому перший збіг із needle тегом <mark>.
// Рядок ріжеться через slice на три частини, а append робить із рядків текстові вузли,
// тому розмітка з даних ніколи не розбирається як HTML.
function highlightInto(element, text, needle) {
  const position = needle === "" ? -1 : text.toLowerCase().indexOf(needle);
  if (position === -1) {
    element.textContent = text;
    return;
  }
  const mark = document.createElement("mark");
  mark.textContent = text.slice(position, position + needle.length);
  element.append(text.slice(0, position), mark, text.slice(position + needle.length));
}

// Будує одну картку альбому з тими самими класами, що були в статичній розмітці ЛР5–ЛР7.
function createCard(item, needle) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = item.id;

  // Бейдж залежить від даних: альбоми із середньою оцінкою від 4,75 отримують клас-модифікатор «хіт».
  const rating = averageRating(item);
  const isHit = rating >= 4.75;
  const badge = document.createElement("span");
  badge.className = isHit ? "card__badge card__badge--hot" : "card__badge";
  badge.textContent = `${isHit ? "Хіт · " : ""}★ ${rating.toFixed(1)}`;

  // Обкладинок у даних немає, тому картинка — заглушка, стабільна для кожного id.
  const img = document.createElement("img");
  img.className = "card__img";
  img.src = "https://picsum.photos/seed/vinyl-" + item.id + "/600/400";
  img.alt = `Фото-заглушка до альбому ${item.album} — ${item.artist}`;
  img.loading = "lazy";

  // Платівка в кутку обкладинки: обертається через CSS, коли картка під курсором або у фокусі.
  const discLabel = document.createElement("img");
  discLabel.src = img.src;
  discLabel.alt = "";
  discLabel.loading = "lazy";
  const disc = document.createElement("span");
  disc.className = "card__disc";
  disc.setAttribute("aria-hidden", "true");
  disc.append(discLabel);

  const cover = document.createElement("div");
  cover.className = "card__cover";
  cover.append(img, disc);

  const body = document.createElement("div");
  body.className = "card__body";

  const title = document.createElement("h3");
  title.className = "card__title";
  highlightInto(title, item.album, needle);

  const excerpt = document.createElement("p");
  excerpt.className = "card__excerpt";
  excerpt.textContent = `Треків: ${item.tracks.length} · Тривалість: ${formatDuration(albumSeconds(item))}`;

  const artist = document.createElement("span");
  artist.className = "artist-tag";
  highlightInto(artist, item.artist, needle);

  const meta = document.createElement("p");
  meta.className = "card__meta";
  meta.append(artist, document.createElement("br"), `Жанр: ${item.genre}`, document.createElement("br"), `Рік: ${item.year}`);

  const label = document.createElement("p");
  label.className = "card__id";
  label.textContent = `Лейбл: ${item.label.name} (${item.label.country})`;

  const actions = document.createElement("div");
  actions.className = "card__actions";

  const order = document.createElement("a");
  order.className = "card__action";
  order.href = "form.html";
  order.textContent = "Замовити";

  // Справжня кнопка: фокусується з клавіатури, а клік по ній спливає до обробника на контейнері.
  const more = document.createElement("button");
  more.type = "button";
  more.className = "card__quick";
  more.textContent = "Детальніше";

  const isFavorite = favorites.includes(item.id);
  const fav = document.createElement("button");
  fav.className = "fav";
  fav.type = "button";
  fav.dataset.id = item.id;
  fav.textContent = isFavorite ? "❤️" : "🤍";
  fav.setAttribute("aria-pressed", String(isFavorite));
  fav.setAttribute("aria-label", "Додати до обраного");

  actions.append(order, more, fav);
  body.append(title, excerpt, meta, label, actions);
  card.append(badge, cover, body);
  return card;
}

// Малює картки з масиву. needle — рядок пошуку для підсвітки.
// Картки спершу збираються у DocumentFragment, а в документ потрапляють однією вставкою;
// з useFragment = false кожна картка вставляється окремо — так можна порівняти швидкість.
function renderCards(list, needle = "", useFragment = true) {
  cardsBox.replaceChildren();
  const target = useFragment ? document.createDocumentFragment() : cardsBox;
  for (const item of list) {
    target.append(createCard(item, needle));
  }
  if (useFragment) {
    cardsBox.append(target);
  }
}

// Повертає копію списку в обраному порядку; "default" лишає порядок файла даних.
function sortList(items, order) {
  switch (order) {
    case "title":
      return sortByTitle(items);
    case "year":
      return sortByYear(items);
    case "rating":
      return [...items].sort((a, b) => averageRating(b) - averageRating(a));
    default:
      return items;
  }
}

// Будує опції списку жанрів із даних: унікальні значення поля genre за абеткою.
// Так список ніколи не розійдеться з файлом даних. Обраний жанр зберігається, якщо він ще є.
function fillGenreOptions() {
  const current = genreSelect.value;
  const genres = albums.map((item) => item.genre);
  const unique = genres.filter((genre, index) => genres.indexOf(genre) === index).sort((a, b) => a.localeCompare(b, "uk"));

  const all = document.createElement("option");
  all.value = "all";
  all.textContent = "усі";
  genreSelect.replaceChildren(all);
  for (const genre of unique) {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreSelect.append(option);
  }
  genreSelect.value = unique.includes(current) ? current : "all";
}

// Робить активною кнопку сортування з указаним data-sort.
function setSortButton(order) {
  sortOrder = order;
  for (const button of sortBox.querySelectorAll("button[data-sort]")) {
    const active = button.dataset.sort === order;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  }
}

// Збирає пошук, жанр, «тільки обране» і сортування разом і перемальовує список.
// Наприкінці запам'ятовує стан фільтрів (бонус).
function applyFilters() {
  const needle = searchInput.value.trim().toLowerCase();
  const genre = genreSelect.value;
  const byGenre = genre === "all" ? albums : filterByGenre(albums, genre);
  const found = byGenre.filter(
    (item) =>
      (item.album.toLowerCase().includes(needle) || item.artist.toLowerCase().includes(needle)) &&
      (!onlyFavoritesBox.checked || favorites.includes(item.id))
  );
  const result = sortList(found, sortOrder);

  renderCards(result, needle);
  emptyBox.hidden = result.length > 0;
  emptyBox.textContent = `Нічого не знайдено за запитом «${searchInput.value.trim()}». Спробуйте інший запит або скиньте фільтри.`;
  countBox.textContent = `Показано ${result.length} із ${albums.length}`;

  localStorage.setItem(
    "filters",
    JSON.stringify({ query: searchInput.value, genre: genre, sort: sortOrder, onlyFavorites: onlyFavoritesBox.checked })
  );
}

// Бонус: ставить елементи керування у збережений стан. Викликається лише після завантаження,
// бо опцій жанрів до того ще немає, і збережений жанр нікуди було б обрати.
function restoreFilters() {
  const saved = loadFilters();
  if (saved === null) return;
  searchInput.value = typeof saved.query === "string" ? saved.query : "";
  // Значення зі сховища могли змінити вручну, тож беремо лише ті, що справді є серед варіантів.
  const genreValues = [...genreSelect.options].map((option) => option.value);
  genreSelect.value = genreValues.includes(saved.genre) ? saved.genre : "all";
  onlyFavoritesBox.checked = saved.onlyFavorites === true;
  const sortValues = [...sortBox.querySelectorAll("button[data-sort]")].map((button) => button.dataset.sort);
  setSortButton(sortValues.includes(saved.sort) ? saved.sort : "default");
}

// Додає альбом до обраного або прибирає з нього, зберігає список і перемальовує картки.
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favoriteId) => favoriteId !== id);
    showToast("Прибрано з обраного");
  } else {
    favorites.push(id);
    showToast("Додано до обраного");
  }
  saveFavorites(favorites);
  applyFilters();
  // Після перемальовування кнопка — новий елемент, тож повертаємо на неї фокус для клавіатури.
  cardsBox.querySelector(`.fav[data-id="${id}"]`)?.focus();
}

// Приймає масив пар [підпис, значення], повертає список означень <dl>.
function definitionList(pairs) {
  const list = document.createElement("dl");
  list.className = "details-list";
  for (const [term, value] of pairs) {
    const dt = document.createElement("dt");
    dt.textContent = term;
    const dd = document.createElement("dd");
    dd.textContent = value;
    list.append(dt, dd);
  }
  return list;
}

// Повертає заголовок секції модалки.
function sectionHeading(text) {
  const heading = document.createElement("h3");
  heading.textContent = text;
  return heading;
}

// Повертає абзац для порожнього масиву, щоб замість дірки людина бачила пояснення.
function emptyNote(text) {
  const note = document.createElement("p");
  note.className = "modal__meta";
  note.textContent = text;
  return note;
}

// Підписи для ключів вкладеного об'єкта label; невідомий ключ виводиться як є.
const LABEL_FIELDS = { name: "Назва", country: "Країна" };

// Заповнює модалку всіма даними альбому і відкриває її.
// Кожен контейнер спершу очищається, інакше дані попереднього альбому змішалися б із новими.
function openDetails(item) {
  const main = document.getElementById("d-main");
  const object = document.getElementById("d-object");
  const list = document.getElementById("d-list");
  const table = document.getElementById("d-table");
  main.replaceChildren();
  object.replaceChildren();
  list.replaceChildren();
  table.replaceChildren();

  document.getElementById("d-title").textContent = `${item.artist} — ${item.album}`;

  // Прості й обчислювані поля.
  const longest = longestTrackOf(item);
  main.append(
    definitionList([
      ["Виконавець", item.artist],
      ["Жанр", `${item.genre} (${categoryOf(item)})`],
      ["Рік", String(item.year)],
      ["Треків", String(item.tracks.length)],
      ["Загальна тривалість", formatDuration(albumSeconds(item))],
      ["Найдовший трек", longest === undefined ? "—" : `${longest.title} (${longest.length})`],
      ["Середня оцінка", item.ratings.length === 0 ? "ще немає оцінок" : `${averageRating(item).toFixed(2)} з 5`]
    ])
  );

  // Вкладений об'єкт: перебір ключів, щоб не загубити поле, якого немає в інших записах.
  const labelPairs = [];
  for (const [key, value] of Object.entries(item.label)) {
    labelPairs.push([LABEL_FIELDS[key] ?? key, String(value)]);
  }
  object.append(sectionHeading("Лейбл"), definitionList(labelPairs));

  // Масив чисел: оцінки слухачів списком.
  list.append(sectionHeading(`Оцінки слухачів (${item.ratings.length})`));
  if (item.ratings.length === 0) {
    list.append(emptyNote("Слухачі ще не оцінили цей альбом."));
  } else {
    const ratingsList = document.createElement("ul");
    ratingsList.className = "ratings";
    item.ratings.forEach((rating, index) => {
      const li = document.createElement("li");
      li.textContent = `Оцінка ${index + 1}: ${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating} з 5)`;
      ratingsList.append(li);
    });
    list.append(ratingsList);
  }

  // Масив об'єктів: трекліст таблицею. Широку таблицю на телефоні прокручує обгортка .table-wrap.
  table.append(sectionHeading("Трекліст"));
  if (item.tracks.length === 0) {
    table.append(emptyNote("Трекліст поки не додано."));
  } else {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    const tracksTable = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    for (const heading of ["№", "Назва", "Тривалість"]) {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = heading;
      headRow.append(th);
    }
    thead.append(headRow);
    const tbody = document.createElement("tbody");
    item.tracks.forEach((track, index) => {
      const row = document.createElement("tr");
      for (const value of [String(index + 1), track.title, track.length]) {
        const td = document.createElement("td");
        td.textContent = value;
        row.append(td);
      }
      tbody.append(row);
    });
    tracksTable.append(thead, tbody);
    wrap.append(tracksTable);
    table.append(wrap);
  }

  dlg.showModal();
}

// Показує людині, що завантаження не вдалося, і що з цим робити.
// Якщо на сторінці вже є дані з кешу, повідомлення каже, що показано збережену копію.
function showLoadError(error, fromCache = false) {
  loadErrorBox.hidden = false;
  loadErrorBox.textContent =
    (fromCache
      ? "Не вдалося оновити каталог, тому показано збережену копію. "
      : "Не вдалося завантажити каталог. ") +
    "Перевірте з'єднання з інтернетом і оновіть сторінку. Технічні подробиці: " + error.message;
}

// Показує каталог із поточного масиву albums: опції жанрів, збережені фільтри, картки й демо-блок.
function showCatalog() {
  fillGenreOptions();
  restoreFilters();
  applyFilters();
  renderDemo();
}

// Запуск каталогу: дані з кешу (якщо є) показуються одразу, свіжі завантажуються з data.json.
async function initCatalog() {
  const cached = loadCache();
  if (cached !== null) {
    albums = addIds(cached.data);
    showCatalog();
    cacheNote.hidden = false;
    cacheNote.textContent = `Показано дані з кешу від ${new Date(cached.savedAt).toLocaleString("uk-UA")}. Оновлюємо…`;
  } else {
    loader.hidden = false; // спінер потрібен лише тоді, коли показати поки нічого
  }

  try {
    const data = await loadData();
    saveCache(data);
    albums = addIds(data);
    showCatalog();
    cacheNote.hidden = true;
  } catch (error) {
    showLoadError(error, cached !== null);
    if (cached !== null) {
      cacheNote.textContent = `Показано дані з кешу від ${new Date(cached.savedAt).toLocaleString("uk-UA")}.`;
    }
  } finally {
    // Ховаємо тут, а не в кінці try: після помилки виконання стрибає одразу в catch,
    // рядок у кінці try не виконався б, і спінер крутився б вічно поруч із повідомленням про помилку.
    loader.hidden = true;
  }
}

// Тост: один таймер на всі виклики.
// clearTimeout скасовує попередній таймер: без нього таймер від першого виклику
// сховав би вже нове повідомлення раніше, ніж минуть його 2,5 секунди.
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}

// Мобільне меню: клас-стан на списку й aria-expanded на кнопці змінюються разом.
function setMenu(open) {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
}

// Тема: явний вибір людини (клас на <html>) важливіший за системну схему.
function isDark() {
  const root = document.documentElement;
  if (root.classList.contains("dark-theme")) return true;
  if (root.classList.contains("light-theme")) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(dark) {
  const root = document.documentElement;
  root.classList.toggle("dark-theme", dark);
  root.classList.toggle("light-theme", !dark);
  themeButton.setAttribute("aria-pressed", String(dark));
  themeButton.textContent = dark ? "☀ Світла тема" : "🌙 Темна тема";
}

// Власна перевірка форми, яку не зробити HTML-атрибутами: подарункове паковання — лише для нових платівок.
// Коли умова виконана, setCustomValidity("") обов'язково знімає помилку, інакше поле лишилося б невалідним назавжди.
function checkGiftWrap() {
  const giftWrap = document.getElementById("opt-gift-wrap");
  const condition = orderForm.querySelector('input[name="condition"]:checked');
  const isNew = condition !== null && condition.value === "new";
  giftWrap.setCustomValidity(
    giftWrap.checked && !isNew ? "Подарункове паковання доступне лише для нових запечатаних платівок." : ""
  );
}

// Показує або ховає помилки під усіма полями, що мають контейнер span.error. Повертає true, якщо помилок немає.
function showFieldErrors() {
  let allOk = true;
  for (const field of orderForm.querySelectorAll("input, select, textarea")) {
    const error = document.getElementById("err-" + field.id);
    if (error === null) continue;
    const ok = field.checkValidity();
    error.textContent = ok ? "" : field.validationMessage;
    field.classList.toggle("invalid", !ok);
    if (!ok) allOk = false;
  }
  return allOk;
}

// Повертає текст підпису <label> для поля з указаним id.
const labelText = (id) => orderForm.querySelector(`label[for="${id}"]`).textContent;

// Будує «квитанцію» з надісланих значень: тільки createElement і textContent.
function renderReceipt() {
  const fullname = document.getElementById("customer-fullname").value.trim();
  const delivery = document.getElementById("delivery-method");
  const album = document.getElementById("album-select");
  const quantity = Number(document.getElementById("album-quantity").value);
  const condition = orderForm.querySelector('input[name="condition"]:checked');
  const extras = [];
  for (const box of orderForm.querySelectorAll('input[name="extra_options"]:checked')) {
    extras.push(labelText(box.id));
  }
  const comment = document.getElementById("order-comment").value.trim();

  const rows = [
    `Покупець: ${fullname}`,
    `Email: ${document.getElementById("customer-email").value}`,
    `Телефон: ${document.getElementById("customer-phone").value}`,
    `Дата доставки: ${document.getElementById("delivery-date").value}`,
    `Доставка: ${delivery.options[delivery.selectedIndex].textContent}`,
    `Альбом: ${album.options[album.selectedIndex].textContent}`,
    `Каталожний номер: ${document.getElementById("catalog-number").value}`,
    `Кількість: ${quantity} шт.`,
    `Стан: ${condition === null ? "не обрано" : labelText(condition.id)}`,
    `Опції: ${extras.length === 0 ? "без додаткових опцій" : extras.join("; ")}`,
    `Коментар: ${comment === "" ? "—" : comment}`,
    `Згода з умовами: ${document.getElementById("return-consent").checked ? "так" : "ні"}`
  ];

  const heading = document.createElement("h2");
  heading.textContent = "Квитанція замовлення";
  const list = document.createElement("ul");
  for (const row of rows) {
    const li = document.createElement("li");
    li.textContent = row;
    list.append(li);
  }
  receiptBox.replaceChildren(heading, list);
  receiptBox.hidden = false;
}

// Бонус: замір рендеру. Викликається вручну з консолі: benchmarkRender(2000).
// Будує count карток двома способами і повертає час кожного в мілісекундах, потім повертає каталог.
function benchmarkRender(count) {
  const many = [];
  for (let i = 0; i < count; i++) {
    many.push(albums[i % albums.length]);
  }
  const start = performance.now();
  renderCards(many, "", false);
  cardsBox.offsetHeight; // змушує браузер одразу перерахувати розкладку, інакше він відклав би її за межі заміру
  const middle = performance.now();
  renderCards(many, "", true);
  cardsBox.offsetHeight;
  const end = performance.now();
  applyFilters();
  return { oneByOne: Math.round(middle - start), fragment: Math.round(end - middle) };
}

// ----- Бонус: сторінка «Статистика» з публічним API MusicBrainz (працює без ключа) -----

// Повертає перший знайдений запис виконавця з MusicBrainz.
async function loadArtistInfo(name) {
  const url = "https://musicbrainz.org/ws/2/artist/?fmt=json&limit=1&query=artist:" + encodeURIComponent(`"${name}"`);
  const response = await fetch(url);
  // MusicBrainz дозволяє приблизно один запит на секунду і на частіші відповідає 503.
  if (response.status === 503) {
    throw new Error("HTTP 503: сервер просить робити запити рідше, зачекайте кілька секунд");
  }
  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }
  const data = await response.json();
  if (!Array.isArray(data.artists) || data.artists.length === 0) {
    throw new Error("виконавця не знайдено");
  }
  return data.artists[0];
}

// Показує на сторінці статистики 6 полів відповіді API для обраного виконавця.
async function showArtist(name) {
  loader.hidden = false;
  loadErrorBox.hidden = true;
  artistInfo.replaceChildren();
  try {
    const artist = await loadArtistInfo(name);
    const lifeSpan = artist["life-span"] ?? {};
    const tags = Array.isArray(artist.tags) ? artist.tags.slice(0, 3).map((tag) => tag.name).join(", ") : "";
    artistInfo.append(
      sectionHeading(artist.name),
      definitionList([
        ["Тип", artist.type ?? "невідомо"],
        ["Країна", artist.country ?? "невідомо"],
        ["Місто чи регіон", artist["begin-area"]?.name ?? artist.area?.name ?? "невідомо"],
        ["Початок діяльності", lifeSpan.begin ?? "невідомо"],
        ["Діяльність завершено", lifeSpan.ended === true ? `так${lifeSpan.end ? ", " + lifeSpan.end : ""}` : "ні"],
        ["Теги", tags === "" ? "немає" : tags]
      ])
    );
  } catch (error) {
    loadErrorBox.hidden = false;
    loadErrorBox.textContent =
      "Не вдалося отримати дані з MusicBrainz. Перевірте з'єднання й спробуйте ще раз. Технічні подробиці: " + error.message;
  } finally {
    loader.hidden = true;
  }
}

// Запуск сторінки статистики: виконавці беруться з data.json, далі по одному запиту до API.
async function initStats() {
  loader.hidden = false;
  try {
    albums = addIds(await loadData());
    const artists = albums.map((item) => item.artist);
    for (const name of artists.filter((artist, index) => artists.indexOf(artist) === index)) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      artistSelect.append(option);
    }
    await showArtist(artistSelect.value);
  } catch (error) {
    showLoadError(error);
  } finally {
    loader.hidden = true;
  }
}

// ===== Запуск і обробники подій =====

// --- Шапка на всіх сторінках: меню і тема ---

burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

// Клік будь-де поза меню й поза кнопкою закриває меню.
document.addEventListener("click", (event) => {
  if (!event.target.closest("#menu, #burger")) setMenu(false);
});

// Спершу сховище, потім система: збережений вибір — це рішення людини, і воно має перемагати
// системну схему; системна потрібна лише тоді, коли людина ще нічого не обирала.
const savedTheme = localStorage.getItem("theme"); // "dark" | "light" | null
if (savedTheme === "dark" || savedTheme === "light") {
  applyTheme(savedTheme === "dark");
} else {
  applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
}
themeButton.addEventListener("click", () => {
  const next = !isDark();
  applyTheme(next);
  localStorage.setItem("theme", next ? "dark" : "light");
});

// --- Каталог ---

if (cardsBox !== null) {
  initCatalog();

  // Пошук слухає input, а не change: change спрацьовує лише після виходу з поля чи Enter,
  // а input — на кожен введений символ, тож список оновлюється під час набирання.
  // Debounce: пошук запускається лише через 300 мс після останнього натискання.
  let searchTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 300);
  });
  genreSelect.addEventListener("change", applyFilters);
  onlyFavoritesBox.addEventListener("change", applyFilters);

  // Сортування: один обробник на групі кнопок, порядок береться з data-sort.
  sortBox.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-sort]");
    if (!button) return;
    setSortButton(button.dataset.sort);
    applyFilters();
  });

  // Скидання чистить і поля, і збережений стан фільтрів.
  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    genreSelect.value = "all";
    onlyFavoritesBox.checked = false;
    setSortButton("default");
    applyFilters();
    localStorage.removeItem("filters");
    showToast("Фільтри скинуто");
  });

  // Делегування: один слухач на контейнері .cards. Клік по будь-якому елементу картки
  // спливає до контейнера, а він сам не перемальовується, тож слухач працює і для карток,
  // які renderCards створила пізніше, після завантаження, пошуку чи сортування.
  cardsBox.addEventListener("click", (event) => {
    const fav = event.target.closest(".fav");
    if (fav) {
      toggleFavorite(Number(fav.dataset.id));
      return; // сердечко не відкриває модалку
    }
    if (event.target.closest("a")) return; // «Замовити» — звичайне посилання на форму
    const card = event.target.closest(".card");
    if (!card) return;
    const item = albums.find((album) => album.id === Number(card.dataset.id));
    if (!item) return;
    openDetails(item);
  });

  document.getElementById("d-close").addEventListener("click", () => dlg.close());
}

// --- Статистика ---

if (artistInfo !== null) {
  initStats();
  artistSelect.addEventListener("change", () => showArtist(artistSelect.value));
}

// --- Форма замовлення ---

if (orderForm !== null) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Ця перевірка лише підказує людині: її легко вимкнути в DevTools або надіслати запит в обхід сторінки,
    // тому справжня перевірка даних — на сервері, який приймає замовлення.
    checkGiftWrap();
    if (!showFieldErrors()) {
      showToast("Перевірте поля, позначені червоним");
      return;
    }
    renderReceipt();
    showToast("Замовлення оформлено");
    orderForm.reset();
  });

  // Після виправлення поля його помилка зникає одразу, не чекаючи наступного submit.
  orderForm.addEventListener("change", () => {
    checkGiftWrap();
    for (const field of orderForm.querySelectorAll(".invalid")) {
      const ok = field.checkValidity();
      document.getElementById("err-" + field.id).textContent = ok ? "" : field.validationMessage;
      field.classList.toggle("invalid", !ok);
    }
  });

  orderForm.addEventListener("reset", () => {
    for (const error of orderForm.querySelectorAll(".error")) {
      error.textContent = "";
    }
    for (const field of orderForm.querySelectorAll(".invalid")) {
      field.classList.remove("invalid");
    }
  });
}
