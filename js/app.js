// «Вініл-Клуб» — дані каталогу та їх обробка (ЛР8).
// Порядок у файлі: дані → допоміжні функції → функції обробки → виклики show().

// ===== Дані =====

// Альбоми каталогу. const забороняє лише перепризначити змінну albums на інший масив,
// а сам масив лишається тим самим об'єктом, тож додавати в нього елементи через push можна.
const albums = [
  {
    id: 1,
    album: "Lamenting Malice",
    artist: "Cynthoni",
    year: 2026,
    genre: "брейккор",
    label: { name: "Not On Label (Cynthoni Self-released)", catalogNumber: "CYN-003" },
    ratings: [9, 8, 10, 9, 7],
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
    label: { name: "Kitty On Fire Records", catalogNumber: "KOF-013" },
    ratings: [8, 7, 8],
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
    label: { name: "Geometric Lullaby", catalogNumber: "GEO-012" },
    ratings: [10, 9, 10, 9, 10, 8],
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
    label: { name: "Wave Racers Collective", catalogNumber: "WRCV-003" },
    ratings: [8, 9, 7, 8],
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
    label: { name: "Entitii Records", catalogNumber: "FEMT-850004" },
    ratings: [9, 8],
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
    label: { name: "Not On Label (Femtanyl Self-released)", catalogNumber: "FEM-001" },
    ratings: [9, 10, 8, 9, 9, 10, 8],
    tracks: [
      { title: "ACT RIGHT", length: "2:24" },
      { title: "P3T", length: "1:42" },
      { title: "PUSH UR T3MPRR", length: "2:28" },
      { title: "KATAMARI", length: "2:38" },
      { title: "MURDER EVERY 1 U KNOW! (feat. takihasdied)", length: "2:05" },
      { title: "GIRL HELL 1999", length: "2:25" }
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

// ===== Виведення на сторінку =====

const breakcore = filterByGenre(albums, "брейккор");
const missingGenre = filterByGenre(albums, "кантрі");
const recent = filterByYearFrom(albums, 2024);

const byYear = sortByYear(albums);
const byTitle = sortByTitle(albums);

const stats = statsForAlbums(albums);

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
  albums.map((item) => `  ${item.album}: ${averageRating(item).toFixed(1)} (оцінок: ${item.ratings.length})`).join("\n")
]);
