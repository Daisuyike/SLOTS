// Counter
let bets = 0;
let money = 50;  // Start with £50

// Images
let bgimg, machineimg, leverUp, leverDown;
let cherry, bell, bar, seven;

// SFX
let cherrySound, bellSound, barSound, sevenSound;
let leverSound;

// Slot logic
let icons = [];
let lowWinPatterns = [];
let highWinPatterns = [];
let currentReelIcons = [];

// Lever
let currentimage;
let button;
let isSwitched = false;

// Phone
let phoneImg;
let showPhone = false;
let phoneX = 0, phoneY = 0, phoneW, phoneH;
let pendingSpin = false;
let phoneSound;
let phoneText = "Wife: come home the kids miss you";

// go home
let showStats = false;
let statsButton;
let callsReceived = 0;


// Load assets
function preload() {
  bgimg = loadImage('/assets/bg.gif');
  machineimg = loadImage('/assets/machine.png');
  leverUp = loadImage('/assets/leverUp.png');
  leverDown = loadImage('/assets/leverDown.png');
  phoneImg = loadImage('/assets/phone.png');

  cherry = loadImage('/assets/cherry.png');
  bell = loadImage('/assets/bell.png');
  bar = loadImage('/assets/bar.png');
  seven = loadImage('/assets/seven.png');

  soundFormats('mp3');
  cherrySound = loadSound('/assets/cherrywin.mp3');
  bellSound = loadSound('/assets/bellwin.mp3');
  barSound = loadSound('/assets/barwin.mp3');
  sevenSound = loadSound('/assets/sevenwin.mp3');
  leverSound = loadSound('/assets/lever.mp3');
  phoneSound = loadSound('/assets/phone.mp3');
}

// Setup screen
function setup() {
  createCanvas(windowWidth, windowHeight);
  currentimage = leverUp;

  // Create lever button
  button = createButton('');
  button.position(windowWidth * 0.8, windowHeight * 0.29);
  button.size(80, 150);
  button.style('background-color', 'transparent');
  button.style('border', '0');
  button.mousePressed(switchImage);

  icons = [cherry, bell, bar, seven];

  lowWinPatterns = [
    [cherry, cherry, bell],
    [bell, bell, bar],
    [bar, bar, seven],
    [seven, seven, cherry],
    [bar, cherry, bar],
  ];

  highWinPatterns = [
    [bell, bell, bell],
    [bar, bar, bar],
    [seven, seven, seven],
  ];

  currentReelIcons = [random(icons), random(icons), random(icons)];

  // Create top-left stats button
statsButton = createButton('🏠');
statsButton.position(20, 20);
statsButton.size(50, 50);
statsButton.style('font-size', '24px');
statsButton.style('border-radius', '12px');
statsButton.mousePressed(() => {
  showStats = !showStats;
});
}

let payouts = {
  cherry: 10,
  bell: 20,
  bar: 50,
  seven: 100
};

// Draw frame
function draw() {
  if (showStats) {
  background(0);
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("you went home", width / 2, height / 3);
  textSize(32);
  text(`hours spent: ${bets}`, width / 2, height / 2);
  text(`missed calls: ${callsReceived}`, width / 2, height / 2 + 50);
  text(`Money Left: £${money}`, width / 2, height / 2 + 100);

  if (money < 5) {
    textSize(36);
    fill(255, 100, 100);
    text("cant afford bills anymore", width / 2, height / 2 + 170);
  }

  if (money > 5) {
    textSize(36);
    fill(255, 100, 100);
    text("double or nothing tomorrow?", width / 2, height / 2 + 170);
  }

  return; // Exit early to avoid drawing slot machine behind it
}

  background(bgimg);
  image(machineimg, 0, 0, windowWidth, windowHeight);
  image(currentimage, 0, 0, windowWidth, windowHeight);

  fill(255);
  textSize(32);
  textAlign(LEFT, TOP);
  text("£5", windowWidth * 0.70, windowHeight * 0.385);
  text("£" + money, windowWidth * 0.70, windowHeight * 0.535);

  let reelX = [windowWidth * 0.09, windowWidth * 0.21, windowWidth * 0.32];
  let reelY = windowHeight * 0.1;
  let iconSize = 700;

  for (let i = 0; i < 3; i++) {
    image(currentReelIcons[i], reelX[i], reelY, iconSize, iconSize);
  }

  if (showPhone) {
  phoneX = 0;
  phoneY = 0;
  phoneW = windowWidth;
  phoneH = windowHeight;
  image(phoneImg, phoneX, phoneY, phoneW, phoneH);

  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text(phoneText, width / 2, height - 100);
}

}

// Lever pull
function switchImage() {
  if (!isSwitched && money >= 5) {
    if (showPhone) return;

    leverSound.play();
    currentimage = leverDown;
    isSwitched = true;

    // Pre-spin setup
    bets++;
    money -= 5;

    // Phone interrupt on every 7th spin
    if (bets % 7 === 0) {
        showPhone = true;
        pendingSpin = true;
        phoneSound.play();
        callsReceived++; 
        // return;
}

    completeSpin();
  } else if (money < 5) {
  showStats = true; 
}

}

function completeSpin() {
  let result;

  if (bets % 8 === 0) {
    result = random(highWinPatterns);
  } else {
    let randomChance = random(1);
    if (randomChance < 0.1) {
      result = random(lowWinPatterns);
    } else {
      result = [random(icons), random(icons), random(icons)];
    }
  }

  currentReelIcons = result;

  if (result[0] === result[1] && result[1] === result[2]) {
    if (result[0] === cherry) {
      money += payouts.cherry;
      cherrySound.play();
    } else if (result[0] === bell) {
      money += payouts.bell;
      bellSound.play();
    } else if (result[0] === bar) {
      money += payouts.bar;
      barSound.play();
    } else if (result[0] === seven) {
      money += payouts.seven;
      sevenSound.play();
    }
  }

  setTimeout(() => {
    currentimage = leverUp;
    isSwitched = false;
  }, 200);
}

// Phone click dismiss
function mousePressed() {
  if (showPhone) {
    if (
      mouseX > phoneX &&
      mouseX < phoneX + phoneW &&
      mouseY > phoneY &&
      mouseY < phoneY + phoneH
    ) {
      showPhone = false;
      if (pendingSpin) {
        pendingSpin = false;
        completeSpin();
      }
    }
  }
}
