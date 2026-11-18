// «Вініл-Клуб» — дані каталогу, їх обробка (ЛР8) і поведінка сторінок (ЛР9).
// Порядок у файлі: дані → допоміжні функції → функції обробки → функції інтерфейсу →
// виклики й обробники подій у кінці файла.
// Скрипт підключено на всіх сторінках, тому код, що стосується лише каталогу чи форми,
// виконується тільки там, де є потрібні елементи.

// ===== Дані =====

// Альбоми каталогу. Дані зібрані вручну з карток і таблиці каталогу (ЛР5–ЛР6), а оцінки —
// з RateYourMusic, Album of the Year, Discogs і Sputnikmusic (див. README).
// У ЛР10 цей масив переїде в зовнішній файл JSON, і сторінка завантажуватиме його через fetch.
// ratings — оцінки слухачів, переведені в шкалу 1–10:
// для альбомів 1–6 це середні з RateYourMusic (×2), Album of the Year (÷10), Discogs (×2), Sputnikmusic (×2, лише де є);
// для альбомів 7–9 сервіси мають замало голосів, тому тут Sputnikmusic і окремі оцінки користувачів AOTY.
// limited — лімітоване видання (від нього залежить бейдж картки), img — обкладинка для картки,
// tags — латинські жанри для фільтра в боковій панелі (data-genres).
// Назва альбому 9 навмисно записана з кутовими дужками: перевірка, що textContent показує їх як текст.
// const забороняє лише перепризначити змінну albums на інший масив,
// а сам масив лишається тим самим об'єктом, тож додавати в нього елементи через push можна.
const albums = [
  {
    id: 1,
    album: "Lamenting Malice",
    artist: "Cynthoni",
    year: 2026,
    genre: "брейккор",
    limited: true,
    note: "Подвійний мармуровий вініл із розворотом: брейккор, джангл і габер.",
    img: "images/card-2.jpg",
    tags: "breakcore gabber",
    label: { name: "Not On Label (Cynthoni Self-released)", catalogNumber: "CYN-003" },
    ratings: [7.1, 7.7, 9.6, 9.0],
    tracks: [
      { title: "Unbirthing", length: "1:06" },
      { title: "The F***ing Apocalypse", length: "4:02" },
      { title: "Ensh***ification", length: "4:04" },
      { title: "BleakReality", length: "3:48" },
      { title: "Hell Sings", length: "4:28" },
      { title: "MentallyILL", length: "5:23" },
      { title: "Imminent Eradication", length: "4:51" },
      { title: "Nihilism Extremist", length: "4:00" },
      { title: "Dead Doom Scrolls", length: "4:41" },
      { title: "Endlessly Dying Machine", length: "4:48" },
      { title: "(emotion)2", length: "5:12" },
      { title: "Shut Your B***h A** Up: Prolapse Of The Mind", length: "1:06" },
      { title: "Fearful Avoidant Disorganised Attachment", length: "4:23" },
      { title: "Disappearing", length: "6:48" },
      { title: "It Is 0 Seconds To Midnight", length: "7:03" }
    ]
  },
  {
    id: 2,
    album: "Ultraviolet",
    artist: "Usedcvnt",
    year: 2023,
    genre: "ембієнт",
    limited: true,
    note: "Прозоро-димчастий вініл, атмосферний брейккор і колаборації.",
    img: "images/card-3.jpg",
    tags: "breakcore ambient",
    label: { name: "Kitty On Fire Records", catalogNumber: "KOF-013" },
    ratings: [6.2, 6.6, 9.3],
    tracks: [
      { title: "Inhuman", length: "2:07" },
      { title: "143 Ways To Lose Urself", length: "2:27" },
      { title: "Limited In Love", length: "2:52" },
      { title: "You're My Friend Now", length: "2:23" },
      { title: "Kittens", length: "2:29" },
      { title: "Pls Tell Me What Is Ur Dream", length: "2:38" },
      { title: "Just Leave Me To Bleed", length: "3:01" },
      { title: "Sorry Mom, I'm Making Breakcore XD", length: "1:55" },
      { title: "Illusion Of Control", length: "2:27" },
      { title: "Yours Forever", length: "2:59" },
      { title: "It's 2am, I Can't Sleep", length: "1:55" },
      { title: "I Want To Eat Ur Heart Couse I Love U", length: "1:55" },
      { title: "Taste Of Blood", length: "1:36" },
      { title: "Overthinking", length: "2:24" },
      { title: "Disappearing Until I Feel Better", length: "2:59" }
    ]
  },
  {
    id: 3,
    album: "Draining Love Story",
    artist: "Sewerslvt",
    year: 2020,
    genre: "драм-енд-бейс",
    limited: false,
    note: "Культовий альбом на межі драм-енд-бейсу й брейккору.",
    img: "images/card-6.jpg",
    tags: "breakcore ambient",
    label: { name: "Geometric Lullaby", catalogNumber: "GEO-012" },
    ratings: [6.8, 7.7, 9.2],
    tracks: [
      { title: "Love Is a Mighty Big Word", length: "2:18" },
      { title: "Newlove", length: "5:59" },
      { title: "Yandere Complex", length: "4:10" },
      { title: "Ecifircas", length: "5:47" },
      { title: "Lexapro Delirium", length: "7:15" },
      { title: "This Fleeting Feeling", length: "3:31" },
      { title: "Swinging in His Cell", length: "5:22" },
      { title: "Mr. Kill Myself", length: "7:51" },
      { title: "Down the Drain", length: "8:08" },
      { title: "Slowdeath", length: "8:12" }
    ]
  },
  {
    id: 4,
    album: "The World Is Fvcked",
    artist: "Sewerslvt",
    year: 2020,
    genre: "джангл",
    limited: false,
    note: "Сім треків джанглу, ембієнту та експериментальної електроніки.",
    img: "images/card-7.jpg",
    tags: "jungle ambient drum-n-bass",
    label: { name: "Wave Racers Collective", catalogNumber: "WRCV-003" },
    ratings: [6.5, 7.3, 9.4],
    tracks: [
      { title: "A Thousand Lonely", length: "2:18" },
      { title: "Make-Me-Sad", length: "6:15" },
      { title: "Psychosis", length: "3:49" },
      { title: "Something of Value Less Than That", length: "4:36" },
      { title: "Ruined Snowy Day", length: "4:19" },
      { title: "I Really Like You Pt2", length: "7:03" },
      { title: "Jvnko Still Loves You", length: "6:59" }
    ]
  },
  {
    id: 5,
    album: "Man Bites Dog",
    artist: "Femtanyl",
    year: 2026,
    genre: "габбер",
    limited: false,
    note: "Десять треків 2026 року: брейккор, габбер і синтпанк на вінілі та CD.",
    img: "images/card-17.jpg",
    tags: "breakcore gabber synthpunk",
    label: { name: "Entitii Records", catalogNumber: "FEMT-850004" },
    ratings: [6.8, 7.4, 9.6],
    tracks: [
      { title: "Body The Pistol", length: "2:38" },
      { title: "Video Nasty", length: "3:02" },
      { title: "Sick Of It", length: "3:10" },
      { title: "Helltarget", length: "3:41" },
      { title: "City", length: "2:52" },
      { title: "Head Up", length: "3:25" },
      { title: "My Head Hurts", length: "2:46" },
      { title: "Shows You The Way To The Hiway", length: "2:42" },
      { title: "Man Bites Dog", length: "3:48" },
      { title: "Is This It", length: "3:57" }
    ]
  },
  {
    id: 6,
    album: "Chaser",
    artist: "Femtanyl",
    year: 2024,
    genre: "футворк",
    limited: true,
    note: "Односторонній лімітований EP на біло-червоному сплеттері: шість коротких треків.",
    img: "images/card-20.jpg",
    tags: "breakcore footwork gabber",
    label: { name: "Not On Label (Femtanyl Self-released)", catalogNumber: "FEM-001" },
    ratings: [7.2, 7.9, 9.1],
    tracks: [
      { title: "ACT RIGHT", length: "2:24" },
      { title: "P3T", length: "1:42" },
      { title: "PUSH UR T3MPRR", length: "2:28" },
      { title: "KATAMARI", length: "2:38" },
      { title: "MURDER EVERY 1 U KNOW! (feat. takihasdied)", length: "2:05" },
      { title: "GIRL HELL 1999", length: "2:25" }
    ]
  },
  {
    id: 7,
    album: "Sewerslvt Presents: Cynthoni, Pt. 1",
    artist: "Sewerslvt, Cynthoni",
    year: 2024,
    genre: "транс",
    limited: true,
    note: "Перша частина збірки: транс, джангл і брейккор.",
    img: "images/card-11.jpg",
    tags: "trance jungle breakcore",
    label: { name: "Not On Label (Cynthoni Self-released)", catalogNumber: "CYN-101" },
    ratings: [7.2, 7.8],
    tracks: [
      { title: "Theme Of Cynthoni", length: "3:00" },
      { title: "Death Of The Endless", length: "5:11" },
      { title: "Lychee Ice", length: "2:21" },
      { title: "Flickering In The Gloom (feat. Projekt Melody)", length: "3:48" },
      { title: "Grinding Of The Teeth", length: "2:42" },
      { title: "Monolithic Cyan Tsunami", length: "3:43" }
    ]
  },
  {
    id: 8,
    album: "Sewerslvt Presents: Cynthoni, Pt. 2",
    artist: "Sewerslvt, Cynthoni",
    year: 2024,
    genre: "транс",
    limited: true,
    note: "Друга частина збірки на блакитно-фіолетовому вінілі.",
    img: "images/card-12.jpg",
    tags: "trance jungle breakcore",
    label: { name: "Not On Label (Cynthoni Self-released)", catalogNumber: "CYN-102" },
    ratings: [7.4, 7.1],
    tracks: [
      { title: "Nine Red Squares", length: "3:33" },
      { title: "Dancing Dots", length: "4:45" },
      { title: "System Link", length: "2:50" },
      { title: "Meh.Tuhl.Hedz", length: "6:02" },
      { title: "Ekstaasi", length: "3:25" },
      { title: "Oublier", length: "3:46" }
    ]
  },
  {
    id: 9,
    album: "Draining Love Story <In The Eyes Of Cynthoni>",
    artist: "Cynthoni",
    year: 2025,
    genre: "брейккор",
    limited: true,
    note: "Подвійний вініл Blue & Pink Marbled із бонус-треками: брейккор, джангл і транс.",
    img: "images/card-14.jpg",
    tags: "breakcore jungle trance",
    label: { name: "Not On Label (Cynthoni Self-released)", catalogNumber: "CYN-002" },
    ratings: [5.0, 7.0, 7.7, 8.7],
    tracks: [
      { title: "It Is Happening Again...", length: "2:39" },
      { title: "Lvstlove", length: "6:06" },
      { title: "Yandere Era", length: "3:47" },
      { title: "Swan Dive Into Eternity", length: "6:02" },
      { title: "Lexapro Doesn't Work", length: "7:23" },
      { title: "The Feeling Is Gone", length: "4:34" },
      { title: "Femcels", length: "4:56" },
      { title: "Cynthoni Of Flames", length: "9:17" },
      { title: "Even Further Down The Drain", length: "8:02" },
      { title: "Slowburn", length: "7:07" },
      { title: "Cynthoni Of Flames (AgonyOST Remix) (Bonus)", length: "6:54" },
      { title: "Even Further Down The Drain (Into An Ocean Of Stars Mix) (Bonus)", length: "6:06" },
      { title: "Long Division (Cynthoni Cover) (Bonus)", length: "5:37" }
    ]
  }
];

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

// ===== Функції обробки =====

// Приймає масив альбомів, повертає масив рядків «1. Назва — виконавець, рік (лейбл, номер)».
function numberedList(items) {
  const lines = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    lines.push(`${i + 1}. ${item.album} — ${item.artist}, ${item.year} (${item.label.name}, ${item.label.catalogNumber})`);
  }
  return lines;
}

// Приймає альбом, повертає назву узагальненої жанрової групи.
function categoryOf(item) {
  switch (item.genre) {
    case "брейккор":
    case "габбер":
      return "Жорстка електроніка";
    case "джангл":
    case "драм-енд-бейс":
      return "Брейкбіт";
    case "ембієнт":
      return "Атмосферний звук";
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

// Приймає альбом, повертає загальну тривалість усіх його треків у секундах.
// Початкове значення 0: без нього накопичувачем став би перший трек-об'єкт, і сума перетворилася б на рядок "[object Object]…".
const albumSeconds = (item) => item.tracks.reduce((sum, track) => sum + toSeconds(track.length), 0);

// Приймає альбом, повертає середню оцінку слухачів числом.
const averageRating = (item) => item.ratings.reduce((sum, rating) => sum + rating, 0) / item.ratings.length;

// Приймає альбом, повертає його найдовший трек (об'єкт { title, length }).
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

// Приймає альбом і одразу розбирає потрібні поля, повертає короткий рядок «назва (рік), каталожний номер».
const cardLine = ({ album, year, label: { catalogNumber } }) => `${album} (${year}), ${catalogNumber}`;

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

// ===== ЛР9: функції інтерфейсу =====

// Елементи сторінки. На сторінках, де якогось елемента немає, змінна дорівнює null.
const cardsBox = document.getElementById("cards");
const searchInput = document.getElementById("q");
const genreSelect = document.getElementById("filter");
const emptyBox = document.getElementById("empty");
const countBox = document.getElementById("count");
const sortBox = document.getElementById("sort");
const resetButton = document.getElementById("reset");
const dlg = document.getElementById("details");
const orderForm = document.getElementById("order-form");
const receiptBox = document.getElementById("receipt");
const toast = document.getElementById("toast");

// Поточний порядок сортування (бонус ЛР9). Пошук і жанр читаються прямо з полів.
let sortOrder = "default";

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

// Будує плашку виконавця (одного або кількох, як у статичних картках ЛР5).
function artistTags(artist) {
  const tags = [];
  for (const name of artist.split(", ")) {
    const tag = document.createElement("span");
    tag.className = "artist-tag artist-tag--" + name.toLowerCase();
    tag.textContent = name;
    tags.push(tag);
  }
  if (tags.length === 1) return tags[0];
  const group = document.createElement("span");
  group.className = "artist-tag-group";
  group.append(...tags);
  return group;
}

// Будує одну картку альбому з тими самими класами, що були в статичній розмітці.
function createCard(item, needle) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = item.id;
  card.dataset.genres = item.tags;

  // Бейдж залежить від даних: лімітовані видання отримують клас-модифікатор.
  const badge = document.createElement("span");
  badge.className = item.limited ? "card__badge card__badge--limited" : "card__badge";
  badge.textContent = item.limited ? "Лімітоване" : "Стандартне";

  const img = document.createElement("img");
  img.className = "card__img";
  img.src = item.img;
  img.alt = `Обкладинка: ${item.album} — ${item.artist}`;
  img.loading = "lazy";

  const body = document.createElement("div");
  body.className = "card__body";

  const title = document.createElement("h3");
  title.className = "card__title";
  highlightInto(title, item.album, needle);

  const excerpt = document.createElement("p");
  excerpt.className = "card__excerpt";
  excerpt.textContent = item.note;

  const meta = document.createElement("p");
  meta.className = "card__meta";
  meta.append(
    artistTags(item.artist),
    document.createElement("br"),
    `Жанр: ${item.genre}`,
    document.createElement("br"),
    `Рік: ${item.year}`
  );

  const code = document.createElement("p");
  code.className = "card__id";
  code.textContent = `Артикул: ${item.label.catalogNumber}`;

  const actions = document.createElement("div");
  actions.className = "card__actions";

  const order = document.createElement("a");
  order.className = "card__action";
  order.href = "form.html";
  order.textContent = "Замовити";

  // Справжня кнопка: фокусується з клавіатури, Enter і Space її натискають,
  // а клік по ній спливає до того самого обробника на контейнері.
  const more = document.createElement("button");
  more.type = "button";
  more.className = "card__quick";
  more.textContent = "Детальніше";

  actions.append(order, more);
  body.append(title, excerpt, meta, code, actions);
  card.append(badge, img, body);
  return card;
}

// Малює картки з масиву. needle — рядок пошуку для підсвітки.
// Картки спершу збираються у DocumentFragment, а в документ потрапляють однією вставкою (бонус ЛР9);
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

// Повертає копію списку в обраному порядку; "default" лишає порядок масиву.
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

// Лічильники для бонусу «debounce»: скільки разів спрацювала подія input і скільки разів реально виконався пошук.
let inputEvents = 0;
let searchRuns = 0;

// Збирає пошук, жанр і сортування разом і перемальовує список.
function applyFilters() {
  searchRuns++;
  const needle = searchInput.value.trim().toLowerCase();
  const genre = genreSelect.value;
  const byGenre = genre === "all" ? albums : filterByGenre(albums, genre);
  const found = byGenre.filter(
    (item) => item.album.toLowerCase().includes(needle) || item.artist.toLowerCase().includes(needle)
  );
  const result = sortList(found, sortOrder);

  renderCards(result, needle);
  emptyBox.hidden = result.length > 0;
  emptyBox.textContent = `Нічого не знайдено за запитом «${searchInput.value.trim()}». Спробуйте інший запит.`;
  countBox.textContent = `Знайдено: ${result.length} із ${albums.length}`;
}

// Заповнює модалку даними альбому і відкриває її.
function openDetails(item) {
  document.getElementById("d-title").textContent = `${item.artist} — ${item.album}`;
  document.getElementById("d-line1").textContent = `Жанр: ${item.genre} · Рік: ${item.year} · ${item.limited ? "лімітоване" : "стандартне"} видання`;
  document.getElementById("d-line2").textContent = `Лейбл: ${item.label.name} · Артикул: ${item.label.catalogNumber}`;
  document.getElementById("d-line3").textContent =
    `Треків: ${item.tracks.length} · Тривалість: ${formatDuration(albumSeconds(item))} · Середня оцінка: ${averageRating(item).toFixed(1)} з 10`;

  const list = document.getElementById("d-tracks");
  list.replaceChildren();
  for (const track of item.tracks) {
    const li = document.createElement("li");
    const length = document.createElement("span");
    length.className = "track-duration";
    length.textContent = track.length;
    li.append(track.title + " ", length);
    list.append(li);
  }
  dlg.showModal();
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

// Бонус ЛР9: замір рендеру. Викликається вручну з консолі: benchmarkRender(2000).
// Будує count карток двома способами — по одній у документ і через DocumentFragment — і повертає каталог.
function benchmarkRender(count) {
  const many = [];
  for (let i = 0; i < count; i++) {
    many.push(albums[i % albums.length]);
  }
  console.time("render: по одній картці");
  renderCards(many, "", false);
  cardsBox.offsetHeight; // змушує браузер одразу перерахувати розкладку, інакше він відклав би її за межі заміру
  console.timeEnd("render: по одній картці");
  console.time("render: DocumentFragment");
  renderCards(many, "", true);
  cardsBox.offsetHeight;
  console.timeEnd("render: DocumentFragment");
  applyFilters();
}

// ===== Виведення на сторінку і обробники подій =====

// --- Каталог ---

if (cardsBox !== null) {
  // Демонстрація ЛР8: ті самі функції, тепер для дев'яти записів.
  const breakcore = filterByGenre(albums, "брейккор");
  const missingGenre = filterByGenre(albums, "кантрі");
  const recent = filterByYearFrom(albums, 2024);

  const byYear = sortByYear(albums);
  const byTitle = sortByTitle(albums);

  const stats = statsForAlbums(albums);

  const searches = ["love", "KATAMARI", "vaporwave"];
  const newest = topBy(albums, "year");
  const problems = validate(albums);

  show("out-count", `Альбомів у каталозі: ${albums.length}`);
  show("out-numbered", numberedList(albums));
  show("out-categories", albums.map((item) => `${item.album} → ${categoryOf(item)}`));
  show("out-filter", [
    ...describeFound("Жанр «брейккор»", breakcore),
    ...describeFound("Жанр «кантрі»", missingGenre),
    ...describeFound("Видані з 2024 року", recent)
  ]);
  show("out-sorted", [
    "За роком:",
    byYear.map((item) => `  ${item.year} — ${item.album}`).join("\n"),
    "За назвою:",
    byTitle.map((item) => `  ${item.album}`).join("\n"),
    "Вихідний порядок (масив не змінено):",
    albums.map((item) => `  ${item.id}. ${item.album}`).join("\n")
  ]);
  show("out-stats", [
    `Альбомів: ${stats.count}`,
    `Загальна тривалість: ${formatDuration(stats.total)}`,
    `Середня тривалість альбому: ${stats.average} хв`,
    `Найдовший альбом: ${stats.max.album} (${formatDuration(albumSeconds(stats.max))})`,
    `Найдовший трек добірки: ${longestTrackOf(stats.longestTrackAlbum).title} — ${stats.longestTrackAlbum.album} (${longestTrackOf(stats.longestTrackAlbum).length})`,
    `Найвища середня оцінка: ${stats.topRated.album} (${averageRating(stats.topRated).toFixed(1)} з 10)`,
    `Різних жанрів: ${stats.categories}`,
    "Середня оцінка кожного альбому:",
    albums.map((item) => `  ${item.album}: ${averageRating(item).toFixed(1)} (джерел: ${item.ratings.length})`).join("\n")
  ]);

  show("out-search", searches.map((query) => describeFound(`Запит «${query}»`, searchByText(albums, query)).join("\n")));
  show("out-top", [
    "Топ-3 за роком:",
    newest.map((item) => `  ${item.year} — ${item.album}`).join("\n"),
    "Топ-2 за роком:",
    topBy(albums, "year", 2).map((item) => `  ${item.year} — ${item.album}`).join("\n")
  ]);
  show("out-lines", albums.map(cardLine));
  show("out-groups", Object.entries(countByCategory(albums)).map((entry) => `${entry[0]}: ${entry[1]}`));
  show("out-validate", problems.length === 0 ? "Помилок не знайдено" : problems);

  // Картки каталогу.
  applyFilters();

  // Пошук слухає input, а не change: change спрацьовує лише після виходу з поля чи Enter,
  // а input — на кожен введений символ, тож список оновлюється під час набирання.
  // Debounce (бонус): пошук запускається лише через 300 мс після останнього натискання.
  let searchTimer;
  searchInput.addEventListener("input", () => {
    inputEvents++;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      applyFilters();
      console.log(`Подій input: ${inputEvents}, запусків пошуку: ${searchRuns}`);
    }, 300);
  });
  genreSelect.addEventListener("change", applyFilters);

  // Сортування (бонус): один обробник на групі кнопок, порядок береться з data-sort.
  sortBox.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-sort]");
    if (!button) return;
    sortOrder = button.dataset.sort;
    for (const other of sortBox.querySelectorAll("button[data-sort]")) {
      const active = other === button;
      other.classList.toggle("active", active);
      other.setAttribute("aria-pressed", String(active));
    }
    applyFilters();
  });

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    genreSelect.value = "all";
    sortBox.querySelector('button[data-sort="default"]').click();
    showToast("Фільтр скинуто");
  });

  // Делегування: один слухач на контейнері .cards. Клік по будь-якому елементу картки
  // спливає до контейнера, а він сам не перемальовується, тож слухач працює і для карток,
  // які renderCards створила пізніше, після кожного пошуку чи сортування.
  cardsBox.addEventListener("click", (event) => {
    if (event.target.closest("a")) return; // «Замовити» — звичайне посилання на форму
    const card = event.target.closest(".card");
    if (!card) return;
    const item = albums.find((album) => album.id === Number(card.dataset.id));
    if (!item) return;
    openDetails(item);
  });

  document.getElementById("d-close").addEventListener("click", () => dlg.close());
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
