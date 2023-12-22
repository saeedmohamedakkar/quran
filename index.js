
const MAIN_API = `https://mp3quran.net/api/v3/`;
const API_LANGUAGE = `ar`;
const recitersSelect = document.querySelector("#recitersSelect");
const moshafSelect = document.querySelector("#moshafSelect");
const surahSelect = document.querySelector("#surahSelect");
const audioPlayer = document.querySelector("#audio");

async function getReciters() {
  const allReciters = await fetch(`${MAIN_API}reciters`);
  const data = await allReciters.json();


  recitersSelect.innerHTML = `<option value=''>اختيار القارئ</option>`;
  recitersSelect.setAttribute(
    "class",
    "text-center rounded-4 p-1  "
  );
  data.reciters.forEach((reciter) => {
    recitersSelect.innerHTML += `<option value=${reciter.id}>${reciter.name}</option>`;
  });

  recitersSelect.addEventListener("change", (e) => getMoshaf(e.target.value));
}

getReciters();

async function getMoshaf(reciterId) {
  const allMoshafs = await fetch(
    `${MAIN_API}reciters?language=${API_LANGUAGE}&reciter=${reciterId}`
  );
  const data = await allMoshafs.json();


  const moshafs = data.reciters[0].moshaf;

  moshafSelect.innerHTML = `<option value=''>اختيار المصحف</option>`;
  moshafSelect.setAttribute(
    "class",
    "text-center rounded-4 p-1 "
  );
  surahSelect.innerHTML = `<option value=''>اختيار السوره</option>`;
  surahSelect.setAttribute(
    "class",
    "text-center rounded-4 p-1"
  );
  moshafs.forEach((moshaf) => {
    moshafSelect.innerHTML += `<option value=${moshaf.id} data-surahList=${moshaf.surah_list} data-server=${moshaf.server}>${moshaf.name}</option>`;
  });
  moshafSelect.addEventListener("change", (e) => {
    const surahList =
      e.target.options[moshafSelect.selectedIndex].dataset.surahlist;
    const surahServer =
      e.target.options[moshafSelect.selectedIndex].dataset.server;
    getSurah(surahList, surahServer);
  });
}

async function getSurah(surahList = "", server) {

  const arraySurahList = surahList.split(",");

  const allSurahs = await fetch(`${MAIN_API}suwar?language=${API_LANGUAGE}`);
  const data = await allSurahs.json();

  surahSelect.innerHTML = `<option value=''>اختيار السوره</option>`;
  surahSelect.setAttribute(
    "class",
    "text-center rounded-4 p-1 "
  );
  arraySurahList.forEach((list) => {
    data.suwar.forEach((surah) => {
      if (surah.id == list) {

        const surahNumber = surah.id.toString().padStart(3, "0");

        surahSelect.innerHTML += `<option value=${server}${surahNumber}.mp3>${surah.name}</option>`;
      }
    });
  });

  surahSelect.addEventListener("change", (e) => playSurah(e));
}

function playSurah(event) {
  audioPlayer.src = event.target.value;
  audioPlayer.autoplay = true;
}