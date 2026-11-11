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

// ===== Виведення на сторінку =====

show("out-count", `Альбомів у каталозі: ${albums.length}`);
show("out-numbered", numberedList(albums));
