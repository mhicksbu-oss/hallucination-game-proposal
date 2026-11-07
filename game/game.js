const stages = [
  {
    kicker: 'STAGE 01 / ARRIVAL',
    title: 'Remember the room.',
    observe: 'Study the details. When you are ready, look away.',
    returnText: 'Something feels newly deliberate.',
    prompt: 'Which detail contradicts your memory?',
    choices: [
      { id: 'portrait', label: 'THE PORTRAIT' },
      { id: 'clock', label: 'THE CLOCK' },
      { id: 'plant', label: 'THE PLANT' }
    ],
    correct: 'portrait',
    blindfold: 'A face rearranges itself in the dark.'
  },
  {
    kicker: 'STAGE 02 / MISMATCH',
    title: 'Test your memory.',
    observe: 'The room knows you are checking now. Look longer.',
    returnText: 'The light is warmer. The exit feels less certain.',
    prompt: 'Where did the room split from its previous version?',
    choices: [
      { id: 'lamp', label: 'THE LAMP' },
      { id: 'door', label: 'THE DOOR' },
      { id: 'note', label: 'THE NOTE' }
    ],
    correct: 'door',
    blindfold: 'A small mechanism crosses from right to left.'
  },
  {
    kicker: 'STAGE 03 / CONSEQUENCE',
    title: 'It remembers the test.',
    observe: 'There may be more than one change. Choose the detail that matters.',
    returnText: 'The signal has moved closer. The walls deny their color.',
    prompt: 'Which change is calling for your attention?',
    choices: [
      { id: 'radio', label: 'THE RADIO' },
      { id: 'wall', label: 'THE WALLS' },
      { id: 'clock', label: 'THE CLOCK' }
    ],
    correct: 'radio',
    blindfold: 'A voice searches the dial for your name.'
  }
];

const ui = {
  start: document.querySelector('#startScreen'),
  play: document.querySelector('#playScreen'),
  finalChoice: document.querySelector('#finalChoiceScreen'),
  ending: document.querySelector('#endingScreen'),
  startButton: document.querySelector('#startButton'),
  lookButton: document.querySelector('#lookButton'),
  replayButton: document.querySelector('#replayButton'),
  soundToggle: document.querySelector('#soundToggle'),
  stageLabel: document.querySelector('#stageLabel'),
  stageKicker: document.querySelector('#stageKicker'),
  stageTitle: document.querySelector('#stageTitle'),
  stageInstruction: document.querySelector('#stageInstruction'),
  room: document.querySelector('#room'),
  blindfold: document.querySelector('#blindfold'),
  blindfoldMessage: document.querySelector('#blindfoldMessage'),
  choicePanel: document.querySelector('#choicePanel'),
  choicePrompt: document.querySelector('#choicePrompt'),
  choiceButtons: document.querySelector('#choiceButtons'),
  pips: [...document.querySelectorAll('#memoryPips i')],
  memoryScore: document.querySelector('#memoryScore'),
  endingCode: document.querySelector('#endingCode'),
  endingTitle: document.querySelector('#endingTitle'),
  endingText: document.querySelector('#endingText'),
  finalScore: document.querySelector('#finalScore'),
  finalTrust: document.querySelector('#finalTrust'),
  liveRegion: document.querySelector('#liveRegion')
};

let state = { stage: 0, phase: 'observe', answers: [], sound: false, final: null };
let audioContext;
let ambientNodes = [];

function showScreen(screen) {
  [ui.start, ui.play, ui.finalChoice, ui.ending].forEach((item) => { item.hidden = item !== screen; });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function announce(message) {
  ui.liveRegion.textContent = '';
  window.setTimeout(() => { ui.liveRegion.textContent = message; }, 30);
}

function initAudio() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
}

function tone(frequency, duration = .18, volume = .035, type = 'sine') {
  if (!state.sound) return;
  initAudio();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gain.gain.setValueAtTime(0, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + .02);
  gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function startAmbient() {
  stopAmbient();
  if (!state.sound) return;
  initAudio();
  const gain = audioContext.createGain();
  gain.gain.value = .012;
  [55, 82.5].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = index ? 'triangle' : 'sine';
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index ? 7 : -4;
    oscillator.connect(gain);
    oscillator.start();
    ambientNodes.push(oscillator);
  });
  gain.connect(audioContext.destination);
  ambientNodes.push(gain);
}

function stopAmbient() {
  ambientNodes.forEach((node) => {
    try { if (typeof node.stop === 'function') node.stop(); } catch (error) { /* already stopped */ }
    try { node.disconnect(); } catch (error) { /* already disconnected */ }
  });
  ambientNodes = [];
}

function renderStage() {
  const stage = stages[state.stage];
  state.phase = 'observe';
  ui.stageLabel.textContent = `ROOM / 0${state.stage + 1}`;
  ui.stageKicker.textContent = stage.kicker;
  ui.stageTitle.textContent = stage.title;
  ui.stageInstruction.textContent = stage.observe;
  ui.room.dataset.stage = String(state.stage);
  ui.room.dataset.phase = 'observe';
  ui.room.classList.remove('mutated', 'is-shifting');
  ui.choicePanel.hidden = true;
  ui.blindfold.hidden = true;
  ui.lookButton.hidden = false;
  ui.lookButton.innerHTML = 'LOOK AWAY <span aria-hidden="true">◉</span>';
  updateMemory();
  announce(`${stage.kicker}. ${stage.title} ${stage.observe}`);
}

function lookAway() {
  const stage = stages[state.stage];
  if (state.phase === 'observe') {
    state.phase = 'away';
    ui.room.dataset.phase = 'away';
    ui.blindfoldMessage.textContent = stage.blindfold;
    ui.blindfold.hidden = false;
    ui.lookButton.innerHTML = 'LOOK AGAIN <span aria-hidden="true">◎</span>';
    ui.stageInstruction.textContent = 'You can return, but the room will not wait forever.';
    tone(146.8, .55, .045, 'sawtooth');
    announce('You look away. ' + stage.blindfold + ' Press Look Again to return.');
    return;
  }

  if (state.phase === 'away') {
    state.phase = 'choose';
    ui.blindfold.hidden = true;
    ui.room.classList.add('mutated', 'is-shifting');
    window.setTimeout(() => ui.room.classList.remove('is-shifting'), 750);
    ui.room.dataset.phase = 'changed';
    ui.lookButton.hidden = true;
    ui.stageInstruction.textContent = stage.returnText;
    renderChoices(stage);
    tone(220 + state.stage * 35, .22, .05, 'square');
    window.setTimeout(() => tone(329.6 + state.stage * 28, .45, .03), 100);
    announce(`You look again. ${stage.returnText} ${stage.prompt}`);
  }
}

function renderChoices(stage) {
  ui.choicePrompt.textContent = stage.prompt;
  ui.choiceButtons.replaceChildren();
  stage.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.choice = choice.id;
    button.textContent = choice.label;
    button.addEventListener('click', () => selectChoice(choice.id));
    ui.choiceButtons.append(button);
  });
  ui.choicePanel.hidden = false;
  ui.choiceButtons.querySelector('button')?.focus();
}

function selectChoice(choice) {
  if (state.phase !== 'choose') return;
  const stage = stages[state.stage];
  const correct = choice === stage.correct;
  state.answers.push({ stage: state.stage, choice, correct });
  state.phase = 'answered';
  tone(correct ? 523.25 : 164.81, .42, .05, correct ? 'sine' : 'sawtooth');
  updateMemory();
  ui.choicePanel.hidden = true;
  ui.stageInstruction.textContent = correct
    ? 'Your memory and the room agree—for now.'
    : 'The room accepts your answer without confirming it.';
  ui.lookButton.hidden = false;
  ui.lookButton.innerHTML = state.stage === stages.length - 1
    ? 'MAKE THE FINAL CHOICE <span aria-hidden="true">→</span>'
    : 'ENTER THE NEXT VERSION <span aria-hidden="true">→</span>';
  ui.lookButton.focus();
  announce(ui.stageInstruction.textContent);
}

function advance() {
  if (state.phase !== 'answered') return;
  if (state.stage < stages.length - 1) {
    state.stage += 1;
    renderStage();
  } else {
    ui.stageLabel.textContent = 'FINAL / DECISION';
    showScreen(ui.finalChoice);
    document.querySelector('.decision-card')?.focus();
    announce('Final decision. Which reality should remain?');
  }
}

function updateMemory() {
  ui.pips.forEach((pip, index) => {
    pip.className = '';
    if (state.answers[index]) pip.classList.add(state.answers[index].correct ? 'correct' : 'missed');
  });
  if (!state.answers.length) ui.memoryScore.textContent = 'UNTESTED';
  else {
    const correct = state.answers.filter((answer) => answer.correct).length;
    ui.memoryScore.textContent = `${correct} / ${state.answers.length} ALIGNED`;
  }
}

function chooseEnding(finalChoice) {
  state.final = finalChoice;
  const score = state.answers.filter((answer) => answer.correct).length;
  const endings = {
    memory: score >= 2
      ? ['ENDING 01 / THE WITNESS', 'The room remembers you back.', 'You restore the first room detail by detail. When the door finally opens, the corridor beyond contains three framed portraits of you—each with a different expression. Memory did not preserve reality. It taught reality how to imitate you.']
      : ['ENDING 02 / THE RESTORATION', 'You rebuild a room that never existed.', 'You insist on the version you remember. The furniture obeys, but the proportions feel borrowed from a dream. The door opens inward onto the same room. This time, a note on the table says: WELCOME BACK.'],
    evidence: score >= 2
      ? ['ENDING 03 / THE ARCHIVIST', 'Everything visible becomes true.', 'You keep the final version and record every contradiction. The room grows perfectly still. On the radio, your own voice begins reading the list one item ahead of you. Evidence survives—but it is no longer yours alone.']
      : ['ENDING 04 / THE ACCOMPLICE', 'The room rewards your attention.', 'You accept what can be seen now. The older versions dissolve without protest. As you leave, the door number changes once more behind your back. You do not turn around.'],
    instinct: score >= 2
      ? ['ENDING 05 / THE INTERRUPTION', 'You refuse the room its answer.', 'You turn off the lamp, cover the portrait, silence the radio, and walk through the wall. For one second there is no room and no observer—only the sensation of waking before the dream decides what it meant.']
      : ['ENDING 06 / THE AUTHOR', 'You choose the contradiction.', 'You refuse to separate memory from evidence. The room loosens around your decision, becoming unfinished and full of possible doors. One of them bears your handwriting: DO NOT LOOK TWICE.']
  };
  const [code, title, text] = endings[finalChoice];
  ui.endingCode.textContent = code;
  ui.endingTitle.textContent = title;
  ui.endingText.textContent = text;
  ui.finalScore.textContent = `${score} / 3`;
  ui.finalTrust.textContent = finalChoice.toUpperCase();
  ui.stageLabel.textContent = code.replace('ENDING ', 'END / ');
  showScreen(ui.ending);
  tone(110, 1.4, .045, 'triangle');
  window.setTimeout(() => tone(164.81, 1.6, .025), 200);
  ui.replayButton.focus();
  announce(`${code}. ${title} ${text}`);
}

function resetGame() {
  state = { stage: 0, phase: 'observe', answers: [], sound: state.sound, final: null };
  ui.room.classList.remove('mutated', 'is-shifting');
  ui.stageLabel.textContent = 'PROLOGUE / 00';
  showScreen(ui.start);
  ui.startButton.focus();
  announce('Game reset. Enter the room when you are ready.');
}

ui.startButton.addEventListener('click', () => {
  showScreen(ui.play);
  renderStage();
  startAmbient();
  ui.lookButton.focus();
});

ui.lookButton.addEventListener('click', () => {
  if (state.phase === 'answered') advance();
  else lookAway();
});

ui.soundToggle.addEventListener('click', () => {
  state.sound = !state.sound;
  ui.soundToggle.setAttribute('aria-pressed', String(state.sound));
  ui.soundToggle.textContent = `SOUND: ${state.sound ? 'ON' : 'OFF'}`;
  if (state.sound) { initAudio(); startAmbient(); tone(440, .18, .035); }
  else stopAmbient();
});

document.querySelectorAll('.decision-card').forEach((button) => {
  button.addEventListener('click', () => chooseEnding(button.dataset.final));
});

ui.replayButton.addEventListener('click', resetGame);

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !ui.play.hidden && !ui.lookButton.hidden && document.activeElement.tagName !== 'BUTTON') {
    event.preventDefault();
    ui.lookButton.click();
  }
});
