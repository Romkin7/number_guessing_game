'use strict'
// arvotaan arvattava numero väliltä 0-100, 0 ja sata myös mahdollisia
var arvattava = Math.floor(Math.random() * (100 + 1));
var ylempi = document.querySelector("#ylempi");
var alempi = document.querySelector("#alempi");
var numerot = document.querySelector("#numerot");
var form = document.querySelector("#lomake");
var paragraphs = document.querySelectorAll("p");
var vihje = document.querySelector("#vihje");
var arvaustenMaara = document.querySelector("#arvaustenMaara");
var gameButton = document.querySelector("#start_resetBtn");
var barChart = document.querySelector(".bar-chart");
// debug-tulostus kehittäjälle, kommentoi pois tuotantoversiosta
console.log("Arvattava: " + arvattava);
var lowerBar = document.getElementById("lower-bar");
var middleBar = document.getElementById("middle-bar");
var upperBar = document.getElementById("upper-bar");
// muuttuja pelaajan nykyistä arvausta varten
// alkuarvo on undefined, jotta erotetaan, onko tehty yhtään arvausta
// vai ei
var arvaus = null;
var highestGuess = 0;
var lowestGuess = 0;
var guesses = 0;
var win = false;
var numbers = [];
// määrittele myös muuttujat pelaajan nykyistä arvausta, parasta
// alinta ja parasta ylintä arvausta varten sekä tehtyjen arvausten
// lukumäärää varten


// kannattaa myös hakea tarvitsemasi DOM-elementit muuttujiin,
// jotta niitä on helpompi käyttää, muuttujanimet ovat lyhyempiä
// kirjoittaa kuin "document.getElementById(...)..."


//
// Event-käsittelijä lomakkeelle
//
function arvausTehty() {
  // haetaan käyttäjän syöttämä arvo ja tulkitaan se numeroksi
  var syote = document.getElementById('luku').value;
  arvaus = Number(syote);
  if(!/^([0-9]|[1-9][0-9]|100)$/.test(arvaus)) {
    document.getElementById('lomake').reset();
    return vihje.innerHTML = `Arvaus ${arvaus} ei kelvollinen. Voitte arvata lukua 0-100 välillä.`;
  }
  if (numbers.includes(arvaus)) {
    document.getElementById('lomake').reset();
    return vihje.innerHTML = `Olette jo yrittäneet arvata lukua ${arvaus}`;
  } 
  numbers.unshift(arvaus);
  setGuessValues(arvaus);
  win = arvattava === arvaus ? true : false;
  if (win) {
    win = false;
    vihje.innerHTML = `Vautsi Voitit ${guesses} arvausksella!! oikea luku on: ${arvattava}`;
    numbers = [];
    let count = 0;
    while (count <= arvattava) {
      numbers.push(count);
      count++;
    }
    document.getElementById("numerot").innerHTML = numbers.join(", ");
    setTimeout(reset, 3000);
  } else {
    vihje.innerHTML = `Arvattava luku on ${arvattava > arvaus ? `suurempi kuin ${arvaus}` : `pienempi kuin ${arvaus}`}`;
  }
  // tyhjennetään lomake uutta arvausta varten
  document.getElementById('lomake').reset();

  /*
  Toteuta tähän algoritmi:

    Päivitä arvausten määrä
    Jos pelaajan arvaus on pienempi kuin arvattava,
        Jos arvaus on parempi kuin nykyinen alempi arvaus,
          päivitä alempi arvaus
        Anna vihje "Luku on suurempi"
    Jos pelaajan arvaus on suurempi kuin arvattava,
        Jos arvaus on parempi kuin nykyinen ylempi arvaus,
          päivitä ylempi arvaus
        Anna vihje "Luku on pienempi"
    Jos arvaus on yhtäsuuri kuin arvattava
        Kirjoita vihje-elementtiin onnitttelut ja arvausten määrä
        Kirjoita numerot-elementtiin luvut nollasta arvattavaan
          Huomaa, että numerot on kirjoitettava html-koodina, jotta
          ne näytetään oikein!
  */
  function setGuessValues(arvaus) {
    guesses = guesses + 1;
    if(guesses === 1) {
      highestGuess = arvaus > arvattava ? arvaus : 0;
      lowestGuess = arvaus < arvattava ? arvaus : 0;
    }
    /* jos arvaus on korkeampi kuin arvattava ja arvaus on pienempi kuin korkeinArvaus ja arvaus ei ole arvattava
    tai arvaus  */
    highestGuess = arvaus > arvattava && arvaus < highestGuess && arvaus !== arvattava || arvaus > arvattava && arvaus < highestGuess && arvaus > lowestGuess && arvaus !== arvattava || arvaus > arvattava && arvaus > highestGuess  && arvaus !== arvattava ? arvaus : highestGuess;
    lowestGuess = arvaus < arvattava && arvaus > lowestGuess && arvaus !== arvattava || arvaus < arvattava && lowestGuess > highestGuess || arvaus < arvattava && lowestGuess > arvaus ? arvaus : lowestGuess;
    alempi.innerHTML = `Pienin arvaus: ${lowestGuess}`;
    ylempi.innerHTML = `Suurin arvaus: ${highestGuess}`;
    numbers.innerHTML = "";
    arvaustenMaara.innerHTML = `Arvattu: ${guesses === 1 ? `${guesses} kerta` : `${guesses} kertaa`}`;
    document.getElementById("numerot").innerHTML = numbers.join(", ");
    updateBars();
  }
  // onsubmit-käsittelijä palauttaa false, jotta lomaketta ei oikeasti lähetettäisi
  // lähetys lataisi sivun uudelleen ja nollaisi koko pelin
  return false;
}
function updateBars() {
  if(arvaus > arvattava && arvaus !== arvattava) {
    upperBar.style.width = `${highestGuess / arvattava * 100}%`;
  } else {
    lowerBar.style.width = `${lowestGuess / arvattava * 100}%`;
  }
}
function reset() {
  lowerBar.style.width = "0%";
  upperBar.style.width = "0%";
  arvaus = null;
  numbers = [];
  guesses = 0;
  win = false;
  highestGuess = 0;
  lowestGuess = 0;
  for(let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].innerHTML = "";
  }
  numerot.innerHTML = "";
  lomake.classList.add("display-none");
  barChart.classList.add("display-none");
  gameButton.classList.remove("display-none");
}
function startGame() {
  lowerBar.style.width = "0%";
  upperBar.style.width = "0%";
  lomake.classList.remove("display-none");
  barChart.classList.remove("display-none");
  gameButton.classList.add("display-none");
}
// asetetaan tapahtumankäsittelijä lomakkeelle, siis määritellään,
// mitä funktiota kutsutaan, kun lomake lähetetään
lomake.onchange = arvausTehty;
gameButton.onclick = startGame;

