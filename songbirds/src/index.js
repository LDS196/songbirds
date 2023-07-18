
import './index.html';
import './index.scss';
import birdsDataRu from './modules/birdsData';
import birdsDataEn from './modules/birdsDataEn';
import translateData from './modules/translateData';
import correctAnswer from './img/correct-answer.mp3';
import incorrectAnswer from './img/incorrect-answer.mp3';

const arrBirdsButton = Array.from(document.querySelectorAll('.choise__item'));
const choiseText = document.querySelector('.choise__text');
const cards = document.querySelector('.cards');
const cardTitle1 = Array.from(document.querySelectorAll('.card__title'))[1];
const cardTitle0 = Array.from(document.querySelectorAll('.card__title'))[0];
const cardSubTitle1 = Array.from(document.querySelectorAll('.card__subtitle'))[1];
const cardText1 = Array.from(document.querySelectorAll('.card__text'))[1]; //
const cardImg1 = Array.from(document.querySelectorAll('.card__img'))[1];
const cardImg0 = Array.from(document.querySelectorAll('.card__img'))[0];
const choiseCercle = Array.from(document.querySelectorAll('.choise__cercle'));
const typeItem = Array.from(document.querySelectorAll('.type__item'));
const typeScore = document.querySelector('.type__score');
const result = document.querySelector('.result');
const resultScore = document.querySelector('.result__score');
const resultBtnAgain = document.querySelector('.result__batton-again');

let birdsData = birdsDataRu ;
let randomNum;
let currentTimePlayed = 0; // время трека проигранное плеером2
let stateSong = 0; // 0- трек не играл. 1- играл
let levelGame = 0;
let numberBird;
let stateGame = 0;  // 0- не выбрана верная птица. 1 - выбрана верно
let song;
let song0;
let audio;
let audio0;
let currentScore;
let score = 0;
let arrAnswers = [];

arrBirdsButton.forEach(elem => elem.onclick = async () => {

  if (!arrAnswers.includes(elem.value)) {
    arrAnswers.push(elem.value);
  }

  if (stateSong == 1) {
    await audio.pause();
    playerCurrentTime.textContent = '00:00';
    playerDurationTime.textContent = '00:00';
    playBtn.classList.remove('player__btn-hidden');
    pauseBtn.classList.add('player__btn-hidden');
    slider.value = 0;
    slidecontainerBack.style.width = '0';
    currentTimePlayed = 0;
  }

  numberBird = elem.value;
  showCardBird(levelGame);
  song = birdsData[levelGame][numberBird].audio;
  audio = new Audio(song);
  playerDurationTime.textContent = secondsToHms(audio.duration);
  audio.addEventListener('timeupdate', updateProgreess);
  slider.addEventListener('input', setProgress);
  audio.onloadeddata = () => {
    setTimeout(() => {playerDurationTime.textContent = secondsToHms(audio.duration)}, 200)
  }

  if (birdsData[levelGame][numberBird].audio == birdsData[levelGame][randomNum].audio) {

    gameButtonLevelNext.classList.add('game__button-level_active');
    gameButtonLevelNext.addEventListener('click', getNextLevel);

    if (stateGame == 0) {
      currentScore = 6 - arrAnswers.length;  // заменить 6 на переменную
      score = currentScore + score
      typeScore.textContent = score;

      playCorrectAnswer();
      showRundomBird(levelGame, numberBird);
      audio0.pause();
      playBtn0.classList.remove('player__btn-hidden');
      pauseBtn0.classList.add('player__btn-hidden');
      slider0.value = 0;
      slidecontainerBack0.style.width = '0';
      currentTimePlayed0 = 0;
      
    }
  } else {
    if (stateGame == 0) {
      choiseCercle[numberBird].classList.add('choise__cercle_incorrect');
      playIncorrectAnswer();
    }
  }
});


 function showCardBird(levelGame) {
  choiseText.classList.add('choise__text_hidden');
  cards.classList.remove('cards_hidden');
  cardTitle1.textContent = birdsData[levelGame][numberBird].name;
  cardSubTitle1.textContent = birdsData[levelGame][numberBird].species;
  cardText1.textContent = birdsData[levelGame][numberBird].description;
  cardImg1.src = birdsData[levelGame][numberBird].image;
  cardImg1.style.width = '200px';
  cardImg1.style.height = '155px';

}

//-----------------------------------Show birds------------


function showBirdsforGame(arrBirdsforGame) {
  const arrBirdsPage = Array.from(document.querySelectorAll('.choise__name-bird'));
  for (let i = 0; i < arrBirdsPage.length; i++) {
    arrBirdsPage[i].textContent = arrBirdsforGame[i].name;
  }
};

//----------------Next level-------------------------------------------------

const gameButtonLevelNext = document.querySelector('.game__button-level');
function getNextLevel() {
  if (levelGame < (birdsData.length - 1)) {
    levelGame++;
    showBirdsforGame(birdsData[levelGame]);
    choiseText.classList.remove('choise__text_hidden');
    cards.classList.add('cards_hidden');
    addRundomBird();
    resetRundomBird();
    resetStylesCercle();
    stateGame = 0;
    audio.pause();
    gameButtonLevelNext.classList.remove('game__button-level_active');
    gameButtonLevelNext.removeEventListener('click', getNextLevel);
    typeItem[levelGame].classList.add('type__item_active');
    typeItem[levelGame - 1].classList.remove('type__item_active');
    currentScore = 0;
    arrAnswers = [];
  } else {
    result.classList.remove('result_invisible');
    resultScore.textContent = score;
    gameAreaBlock.classList.add('game-area_invisible');
  }
}
if (levelGame == 4) {
  gameButtonLevelNext.removeEventListener('click', getNextLevel);
}

//---------------resultBtnAgain------------------

resultBtnAgain.addEventListener('click', () => {
  levelGame = 0;
  showBirdsforGame(birdsData[levelGame]);
  choiseText.classList.remove('choise__text_hidden');
  cards.classList.add('cards_hidden');
  addRundomBird();
  resetRundomBird();
  resetStylesCercle();
  stateGame = 0;
  audio.pause();
  gameButtonLevelNext.classList.remove('game__button-level_active');
  gameButtonLevelNext.removeEventListener('click', getNextLevel);
  typeItem[levelGame].classList.add('type__item_active');
  typeItem[birdsData.length - 1].classList.remove('type__item_active');
  currentScore = 0;
  arrAnswers = [];
  score = 0;
  result.classList.add('result_invisible');
  typeScore.textContent = score;
  resultScore.textContent = score;
  gameAreaBlock.classList.remove('game-area_invisible');
})


//----------запуск рандомной птицы для игры----

async function addRundomBird() {
  randomNum = await randomInteger(0, birdsData[levelGame].length);
  song0 = birdsData[levelGame][randomNum].audio;
  audio0 = new Audio(song0);
  audio0.addEventListener('timeupdate', updateProgreess0);
  slider0.addEventListener('input', setProgress0);

  audio0.onloadeddata = () => {
    setTimeout(() => {playerDurationTime0.textContent = secondsToHms(audio0.duration)}, 200)
  }

}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max - min);
  return Math.floor(rand);
}
addRundomBird()  // запуск случайной птицы для игры 

//------показываем угаданную птицу-------------
function showRundomBird(levelGame, numberBird) {
  cardImg0.src = birdsData[levelGame][numberBird].image;
  cardImg0.style.width = '200px';
  cardImg0.style.height = '155px';
  cardTitle0.textContent = birdsData[levelGame][numberBird].name;
  choiseCercle[numberBird].classList.add('choise__cercle_correct');

}

// ------------сбрасываем стили при переходе на новый уровень
function resetRundomBird() {
  cardImg0.src = 'assets/bird-backgraund.jpg';
  cardImg0.style.width = '';
  cardImg0.style.height = '';
  cardTitle0.textContent = '******';
  choiseCercle[numberBird].classList.remove('choise__cercle_correct');
  choiseCercle[numberBird].classList.remove('choise__cercle_correct');
  playBtn0.classList.remove('player__btn-hidden');
  pauseBtn0.classList.add('player__btn-hidden');
  playerCurrentTime0.textContent = '00:00';
  playerDurationTime0.textContent = '00:00';
  slider0.value = 0;
  slidecontainerBack0.style.width = '0';
  currentTimePlayed0 = 0;
};
function resetStylesCercle() {
  for (let cercle of choiseCercle) {
    cercle.classList.remove('choise__cercle_incorrect');
    cercle.classList.remove('choise__cercle_correct');
  }
};


function playCorrectAnswer() {
  const audio = new Audio();
  audio.src = correctAnswer;
  audio.play();
  stateGame = 1;
}
function playIncorrectAnswer() {
  const audio = new Audio();
  audio.src = incorrectAnswer;
  audio.play()
}

//-----------------Player0-------------

const playBtn0 = Array.from(document.querySelectorAll('.player__play-btn'))[0];
const pauseBtn0 = Array.from(document.querySelectorAll('.player__pause-btn'))[0];
const playerCurrentTime0 = Array.from(document.querySelectorAll('.player__current-time'))[0];
const playerDurationTime0 = Array.from(document.querySelectorAll('.player__duration-time'))[0];
const slider0 = Array.from(document.querySelectorAll('.slider'))[0];
const slidecontainerBack0 = Array.from(document.querySelectorAll('.slidecontainer__back'))[0];

let currentTimePlayed0 = 0; // Время с момента старта

playBtn0.addEventListener('click', () => {
  playSong0();
});

pauseBtn0.addEventListener('click', async () => {
  currentTimePlayed0 = audio0.currentTime;
  pauseSong0();
})

async function playSong0() {

  if (currentTimePlayed0 == 0) {
    await audio0.play();
    playBtn0.classList.add('player__btn-hidden');
    pauseBtn0.classList.remove('player__btn-hidden');
    playerDurationTime0.textContent = secondsToHms(audio0.duration);
  } else {
    audio0.currentTime = currentTimePlayed0;
    await audio0.play();
    playBtn0.classList.add('player__btn-hidden');
    pauseBtn0.classList.remove('player__btn-hidden');
    currentTimePlayed0 = 0;
  }
}

function pauseSong0() {
  audio0.pause();
  playBtn0.classList.remove('player__btn-hidden');
  pauseBtn0.classList.add('player__btn-hidden');
};

//--Progressbar-------------------------------------

function updateProgreess0() {
  const duration = audio0.duration;
  const currentTime = audio0.currentTime;
  const progressValue = (currentTime / duration) * 100;
  slider0.value = `${progressValue}`;
  slidecontainerBack0.style.width = (currentTime / duration) * 100 + '%';
  playerCurrentTime0.textContent = secondsToHms(audio0.currentTime)
}

//-----Set progress--------------------------------

function setProgress0(e) {
  const duration = audio0.duration;
  const value = slider0.value;
  audio0.currentTime = (value / 100) * duration;
  currentTimePlayed0 = (value / 100) * duration;
  playerCurrentTime0.textContent = secondsToHms(audio0.currentTime);
}

//----------------Player2-----------

const playBtn = Array.from(document.querySelectorAll('.player__play-btn'))[1];
const pauseBtn = Array.from(document.querySelectorAll('.player__pause-btn'))[1];
const playerCurrentTime = Array.from(document.querySelectorAll('.player__current-time'))[1];
const playerDurationTime = Array.from(document.querySelectorAll('.player__duration-time'))[1];
const slider = Array.from(document.querySelectorAll('.slider'))[1];
const slidecontainerBack = Array.from(document.querySelectorAll('.slidecontainer__back'))[1];

playBtn.addEventListener('click', () => {
  playSong();
});

pauseBtn.addEventListener('click', async () => {
  currentTimePlayed = await audio.currentTime;
  pauseSong();
})

//----------------------------PlaySong-------
async function playSong() {
  stateSong = 1
  if (currentTimePlayed == 0) {
    await audio.play();
    playBtn.classList.add('player__btn-hidden');
    pauseBtn.classList.remove('player__btn-hidden');
    playerDurationTime.textContent = secondsToHms(audio.duration);
  } else {
    audio.currentTime = currentTimePlayed;
    await audio.play();
    playBtn.classList.add('player__btn-hidden');
    pauseBtn.classList.remove('player__btn-hidden');
    currentTimePlayed = 0;
  }
}
//-----pauseSong-------
function pauseSong() {
  audio.pause();
  playBtn.classList.remove('player__btn-hidden');
  pauseBtn.classList.add('player__btn-hidden');
}

//---Перевод времени--------------------------------------
function secondsToHms(d) {
  d = Number(d);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  if (s < 10 && m < 10) return `${'0' + m}:${'0' + s}`;
  if (s > 10 && m < 10) return `${'0' + m}:${s}`;
  if (s < 10 && m > 10) return `${m}:${'0' + s}`;
  if (s > 10 && m > 10) return `${m}:${s}`;
}

//--Progressbar-------------------------------------

function updateProgreess() {
  const duration = audio.duration;
  const currentTime = audio.currentTime;
  const progressValue = (currentTime / duration) * 100;
  slidecontainerBack.style.width = (currentTime / duration) * 100 + '%';
  slider.value = progressValue ? progressValue : 0;
  playerCurrentTime.textContent = secondsToHms(audio.currentTime)
}

//-----Set progress--------------------------------

function setProgress(e) {
  const duration = audio.duration;
  const value = slider.value;
  audio.currentTime = (value / 100) * duration;
  currentTimePlayed = (value / 100) * duration;
  playerCurrentTime.textContent = secondsToHms(audio.currentTime);
};

//-------------InputVolume fof Player1--------
const volumeInput0 = document.querySelectorAll('.volume')[0];
const volumeContainerBack0 = document.querySelectorAll('.volumecontainer__back')[0];

volumeInput0.onchange = function () {
  audio0.volume = volumeInput0.value / 100;
  volumeContainerBack0.style.width = (volumeInput.value / 100) * 120 + 'px';

}
//-------------InputVolume fof Player2--------
const volumeInput = document.querySelectorAll('.volume')[1];
const volumeContainerBack = document.querySelectorAll('.volumecontainer__back')[1];

volumeInput.onchange = function () {
  audio.volume = volumeInput.value / 100;
  volumeContainerBack.style.width = (volumeInput.value / 100) * 120 + 'px';
}


//---------------Gallery------------------------

const typeItemGallery = Array.from(document.querySelectorAll('.type__item-gallery'));
const galleryItems = document.querySelector('.gallery__items');
const cardGallery = Array.from(document.querySelectorAll('.card-gallery'));
const cardImgGallery = Array.from(document.querySelectorAll('.card__img-gallery'));
const cardTitleGallery = Array.from(document.querySelectorAll('.card__title-gallery'));
const cardSubTitleGallery = Array.from(document.querySelectorAll('.card__subtitle-gallery'));
const cardTextGallery = Array.from(document.querySelectorAll('.card__text-gallery'));

const playerPlayBtnGallery = Array.from(document.querySelectorAll('.player__play-btn-gallery'));
const playerPauseBtnGallery = Array.from(document.querySelectorAll('.player__pause-btn-gallery'));
const playerCurrentTimeGallery = Array.from(document.querySelectorAll('.player__current-time-gallery'));
const playerDurationTimeGallery = Array.from(document.querySelectorAll('.player__duration-time-gallery'));
const sliderGallery = Array.from(document.querySelectorAll('.slider-gallery'));
const slidecontainerBackGallery = Array.from(document.querySelectorAll('.slidecontainer__back-gallery'));
const volumeInputGallery = Array.from(document.querySelectorAll('.volume-gallery'));
const volumeContainerBackGallery = Array.from(document.querySelectorAll('.volumecontainer__back-gallery'));
let arrAudioGallery;
let stage = 0;


typeItemGallery.forEach(item =>{
  item.addEventListener('click', async() => {
    typeItemGallery[stage].classList.remove('type__item_active');

    await arrAudioGallery.forEach( (audio) =>{
       audio.pause();
       audio.currentTime = 0
    });
    resetStyleForBirdsGallery()
    stage = typeItemGallery.indexOf(item);
    showGallery();
    item.classList.add('type__item_active');
   })
})
let currentTimePlayedGallery;
function showGallery() {
  arrAudioGallery = []
for (let i = 0; i < cardGallery.length; i++) {
  currentTimePlayedGallery = 0;
  cardTitleGallery[i].textContent = birdsData[stage][i].name;
  cardSubTitleGallery[i].textContent = birdsData[stage][i].species;
  cardTextGallery[i].textContent = birdsData[stage][i].description;
  cardImgGallery[i].src = birdsData[stage][i].image;
  cardImgGallery[i].style.width = '200px';
  cardImgGallery[i].style.height = '155px';
  const audioGallery = new Audio();

  arrAudioGallery.push(audioGallery);

  audioGallery.src = birdsData[stage][i].audio;

  audioGallery.onloadeddata = () => {
    setTimeout(() => {playerDurationTimeGallery[i].textContent = secondsToHms( audioGallery.duration)}, 200)
  }

  playerPlayBtnGallery[i].onclick = async() => {

    await arrAudioGallery.forEach( (audio) => {
       audio.pause();
    });

      playerPlayBtnGallery.forEach( (btn) => {
      btn.classList.remove('player__btn-hidden'); 
   });

   playerPauseBtnGallery.forEach( (btn) => {
    btn.classList.add('player__btn-hidden'); 
 })

    if (currentTimePlayedGallery == 0) {
      await audioGallery.play();
      playerPlayBtnGallery[i].classList.add('player__btn-hidden');
      playerPauseBtnGallery[i].classList.remove('player__btn-hidden');
      playerDurationTimeGallery[i].textContent = secondsToHms(audioGallery.duration);
    } else {
      audioGallery.currentTime = currentTimePlayedGallery;
      await audioGallery.play();
      playerPlayBtnGallery[i].classList.add('player__btn-hidden');
      playerPauseBtnGallery[i].classList.remove('player__btn-hidden');
      currentTimePlayedGallery = 0;
    }
  };

  playerPauseBtnGallery[i].addEventListener('click', () => {

    audioGallery.pause();
    playerPlayBtnGallery[i].classList.remove('player__btn-hidden');
    playerPauseBtnGallery[i].classList.add('player__btn-hidden');
  });

  audioGallery.addEventListener('timeupdate', () =>{
    const duration = audioGallery.duration;
    const currentTime = audioGallery.currentTime;
    const progressValue = (currentTime / duration) * 100;
    slidecontainerBackGallery[i].style.width = (currentTime / duration) * 100 + '%';
    sliderGallery[i].value = progressValue ? progressValue : 0;
    playerCurrentTimeGallery[i].textContent = secondsToHms(audioGallery.currentTime)
  });

  sliderGallery[i].addEventListener('input', () =>{
    const duration = audioGallery.duration;
    const value = sliderGallery[i].value;
    audioGallery.currentTime = (value / 100) * duration;
    currentTimePlayedGallery = (value / 100) * duration;
    playerCurrentTimeGallery[i].textContent = secondsToHms(audioGallery.currentTime);
  });

  volumeInputGallery[i].onchange = function () {
    audioGallery.volume = volumeInputGallery[i].value / 100;
    volumeContainerBackGallery[i].style.width = (volumeInputGallery[i].value / 100) * 120 + 'px';
  }
}
}

function resetStyleForBirdsGallery(){          // сброс стилей у птиц при выборе нового вида птиц
  for(let i = 0; i < playerPlayBtnGallery.length; i++ ){
    playerPauseBtnGallery[i].classList.add('player__btn-hidden');
    playerPlayBtnGallery[i].classList.remove('player__btn-hidden');
    playerCurrentTimeGallery[i].textContent = '';
    sliderGallery[i].value = 0
    slidecontainerBackGallery[i].style.width = '0'
    playerDurationTimeGallery[i].textContent = '00:00';
    currentTimePlayedGallery = 0;
  }
}

//--------------------------Lang-----------------------------

const btnRu = document.querySelector('.lang-ru');
const btnEn = document.querySelector('.lang-en');

btnEn.addEventListener('click', async () =>{
  for( let key in translateData){
    document.querySelector( `.${key}`).innerHTML = `${translateData[key][btnEn.value]}`;
    btnEn.classList.add('button-lang_active')
    btnRu.classList.remove('button-lang_active')
    birdsData = birdsDataEn;
    await localStorage.clear();
    localStorage.setItem('lang', 'en');
 
  }
})
btnRu.addEventListener('click', async () =>{
  for( let key in translateData){
    document.querySelector( `.${key}`).innerHTML = `${translateData[key][btnRu.value]}`;
    btnRu.classList.add('button-lang_active')
    btnEn.classList.remove('button-lang_active')
    birdsData = birdsDataRu;
     await localStorage.clear();
    localStorage.setItem('lang', 'ru');
  }
});

if (localStorage.getItem('lang') == 'en'){
  for( let key in translateData){
    document.querySelector( `.${key}`).innerHTML = `${translateData[key][btnEn.value]}`;
    btnRu.classList.remove('button-lang_active');
    btnEn.classList.add('button-lang_active');
  }
}
if (localStorage.getItem('lang') == 'ru'){
  for( let key in translateData){
    document.querySelector( `.${key}`).innerHTML = `${translateData[key][btnRu.value]}`;
    btnRu.classList.add('button-lang_active');
    btnEn.classList.remove('button-lang_active');
  }
}

//-----------------Manage Menu------------------------
const navButtonsArray = Array.from(document.querySelectorAll('.nav__item'));
const aboutBlock = document.querySelector('.about');
const gameAreaBlock = document.querySelector('.game-area');
const aboutBtnStartGame = document.querySelector('.about__button');
const galleryBlock =document.querySelector('.gallery');
const headerLang =document.querySelector('.header__lang');

navButtonsArray[1].addEventListener('click', () => {
  aboutBlock.classList.add('about_invisible');
  gameAreaBlock.classList.remove('game-area_invisible');
  navButtonsArray[1].classList.add('nav__item_active');
  navButtonsArray[0].classList.remove('nav__item_active');
  galleryBlock.classList.add('gallery_invisible');
  navButtonsArray[2].classList.remove('nav__item_active');
  showBirdsforGame(birdsData[levelGame]);
  headerLang.classList.add('header__ang_disactive');
});
navButtonsArray[0].addEventListener('click', () => {
  aboutBlock.classList.remove('about_invisible');
  gameAreaBlock.classList.add('game-area_invisible');
  navButtonsArray[0].classList.add('nav__item_active');
  navButtonsArray[1].classList.remove('nav__item_active');
  galleryBlock.classList.add('gallery_invisible');
  navButtonsArray[2].classList.remove('nav__item_active');
  headerLang.classList.remove('header__ang_disactive');
})

aboutBtnStartGame.addEventListener('click', () => {
  aboutBlock.classList.add('about_invisible');
  gameAreaBlock.classList.remove('game-area_invisible');
  navButtonsArray[1].classList.add('nav__item_active');
  navButtonsArray[0].classList.remove('nav__item_active');
  showBirdsforGame(birdsData[levelGame]);
  headerLang.classList.add('header__ang_disactive');
});
navButtonsArray[2].addEventListener('click', () => {
  aboutBlock.classList.add('about_invisible');
  gameAreaBlock.classList.add('game-area_invisible');
  galleryBlock.classList.remove('gallery_invisible');
  navButtonsArray[0].classList.remove('nav__item_active')
  navButtonsArray[1].classList.remove('nav__item_active')
  navButtonsArray[2].classList.add('nav__item_active');
  showGallery();
  headerLang.classList.add('header__ang_disactive');
})