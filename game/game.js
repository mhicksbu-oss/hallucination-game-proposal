const storyBeats = [
  {
    kicker: 'CASE FILE 01 / THE CALL',
    title: 'The call came from your number.',
    text: 'At 4:17 A.M., a dispatcher answered a twenty-three-second call. Your voice whispered: “I’m in Apartment 12. Don’t let me out.” You were asleep across town—or you remember being asleep.',
    evidence: '04:17 A.M. / 23 SECONDS',
    visual: 'INCOMING CALL / SOURCE: YOUR PHONE'
  },
  {
    kicker: 'CASE FILE 02 / THE ADDRESS',
    title: 'Apartment 12 does not exist.',
    text: 'The building plans end at eleven. Eight years ago, a twelfth room appeared for one night. Three investigators entered. Only two returned, and each insisted the other one was the copy.',
    evidence: 'FLOOR PLAN / UNIT 12 REMOVED',
    visual: 'ARCHIVE ERROR / ROOM NOT FOUND'
  },
  {
    kicker: 'CASE FILE 03 / THE RECORDING',
    title: '“The room copies what you forget.”',
    text: 'A cassette is waiting outside the door. The voice on it is yours: “It changes whenever you stop looking. Every missed detail gives it something new to wear.” The recording ends with three knocks.',
    evidence: 'CASSETTE 12-B / VOICE MATCH 99.8%',
    visual: 'PLAYBACK ACTIVE / SPEAKER: YOU'
  },
  {
    kicker: 'CASE FILE 04 / THE TEST',
    title: 'Prove which one of you arrived.',
    text: 'The door now bears the number 12. It will test three memories before it opens again. Recognize at least two changes. Miss twice, and the room will send something else home in your place.',
    evidence: 'EXIT CONDITION / 2 OF 3 MEMORIES',
    visual: 'IDENTITY TEST READY / DOOR UNLOCKED'
  }
];

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
    blindfold: 'A face rearranges itself in the dark.',
    actionPrompt: 'The portrait is smiling now. How do you respond?',
    actions: [
      { id: 'confront', label: 'SPEAK TO IT', detail: 'Ask the portrait what it wants.', trait: 'instinct' },
      { id: 'document', label: 'TAKE A PHOTO', detail: 'Create evidence before it changes again.', trait: 'evidence' },
      { id: 'restore', label: 'TURN IT AROUND', detail: 'Reject the new version of the room.', trait: 'memory' }
    ]
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
    blindfold: 'A small mechanism crosses from right to left.',
    actionPrompt: 'The handle has crossed to the other side. What now?',
    actions: [
      { id: 'open', label: 'OPEN THE DOOR', detail: 'Risk whatever is waiting beyond it.', trait: 'instinct' },
      { id: 'mark', label: 'MARK ITS POSITION', detail: 'Draw a line around the handle.', trait: 'evidence' },
      { id: 'barricade', label: 'BARRICADE IT', detail: 'Force the room to keep this version.', trait: 'memory' }
    ]
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
    blindfold: 'A voice searches the dial for your name.',
    actionPrompt: 'The radio is broadcasting your own voice. Choose quickly.',
    actions: [
      { id: 'answer', label: 'ANSWER THE VOICE', detail: 'Tell it which version is real.', trait: 'instinct' },
      { id: 'record', label: 'RECORD THE SIGNAL', detail: 'Preserve the impossible transmission.', trait: 'evidence' },
      { id: 'destroy', label: 'SMASH THE RADIO', detail: 'Silence the room before it speaks again.', trait: 'memory' }
    ]
  }
];

const ui = {
  start: document.querySelector('#startScreen'),
  story: document.querySelector('#storyScreen'),
  play: document.querySelector('#playScreen'),
  finalChoice: document.querySelector('#finalChoiceScreen'),
  ending: document.querySelector('#endingScreen'),
  failure: document.querySelector('#failureScreen'),
  startButton: document.querySelector('#startButton'),
  storyKicker: document.querySelector('#storyKicker'),
  storyTitle: document.querySelector('#storyTitle'),
  storyText: document.querySelector('#storyText'),
  storyEvidence: document.querySelector('#storyEvidence'),
  storyVisual: document.querySelector('#storyVisual'),
  storyProgress: [...document.querySelectorAll('#storyProgress i')],
  storyNext: document.querySelector('#storyNext'),
  storySkip: document.querySelector('#storySkip'),
  lookButton: document.querySelector('#lookButton'),
  blindfoldReturn: document.querySelector('#blindfoldReturn'),
  replayButton: document.querySelector('#replayButton'),
  retryButton: document.querySelector('#retryButton'),
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
  missionText: document.querySelector('#missionText'),
  missionPips: [...document.querySelectorAll('.mission-progress i')],
  countdown: document.querySelector('#countdown'),
  timerLabel: document.querySelector('#timerLabel'),
  timerValue: document.querySelector('#timerValue'),
  timerBar: document.querySelector('#timerBar'),
  pips: [...document.querySelectorAll('#memoryPips i')],
  memoryScore: document.querySelector('#memoryScore'),
  endingCode: document.querySelector('#endingCode'),
  endingTitle: document.querySelector('#endingTitle'),
  endingText: document.querySelector('#endingText'),
  finalScore: document.querySelector('#finalScore'),
  finalTrust: document.querySelector('#finalTrust'),
  failureScore: document.querySelector('#failureScore'),
  suspenseOverlay: document.querySelector('#suspenseOverlay'),
  suspenseLine: document.querySelector('#suspenseLine'),
  liveRegion: document.querySelector('#liveRegion')
};

let state = { storyBeat: 0, stage: 0, phase: 'observe', answers: [], responses: [], sound: true, final: null };
let audioContext;
let ambientNodes = [];
let musicInterval;
let timerInterval;
let timerDeadline = 0;
let revealTimeouts = [];

function showScreen(screen) {
  [ui.start, ui.story, ui.play, ui.finalChoice, ui.ending, ui.failure].forEach((item) => { item.hidden = item !== screen; });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderStoryBeat() {
  const beat = storyBeats[state.storyBeat];
  ui.stageLabel.textContent = `CASE FILE / 0${state.storyBeat + 1}`;
  ui.storyKicker.textContent = beat.kicker;
  ui.storyTitle.textContent = beat.title;
  ui.storyText.textContent = beat.text;
  ui.storyEvidence.textContent = beat.evidence;
  ui.storyVisual.dataset.beat = String(state.storyBeat);
  ui.storyVisual.querySelector('p').innerHTML = beat.visual.replace(' / ', '<br />');
  ui.storyProgress.forEach((pip, index) => {
    pip.className = index < state.storyBeat ? 'complete' : index === state.storyBeat ? 'active' : '';
  });
  ui.storyNext.innerHTML = state.storyBeat === storyBeats.length - 1
    ? 'OPEN APARTMENT 12 <span aria-hidden="true">→</span>'
    : 'CONTINUE <span aria-hidden="true">→</span>';
  tone(110 + state.storyBeat * 18, .45, .025, 'triangle');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  announce(`${beat.kicker}. ${beat.title} ${beat.text}`);
}

function enterRoomFromStory() {
  showScreen(ui.play);
  renderStage();
  ui.lookButton.focus();
}

function advanceStory() {
  if (state.storyBeat < storyBeats.length - 1) {
    state.storyBeat += 1;
    renderStoryBeat();
    return;
  }
  enterRoomFromStory();
}

function announce(message) {
  ui.liveRegion.textContent = '';
  window.setTimeout(() => { ui.liveRegion.textContent = message; }, 30);
}

function clearReveal() {
  revealTimeouts.forEach((timeout) => window.clearTimeout(timeout));
  revealTimeouts = [];
  ui.suspenseOverlay.hidden = true;
  ui.suspenseLine.classList.remove('visible');
}

function runSuspenseReveal(lines, callback) {
  clearReveal();
  stopTimer('SIGNAL LOST');
  ui.suspenseOverlay.hidden = false;
  let index = 0;

  const showNext = () => {
    ui.suspenseLine.classList.remove('visible');
    const swapTimeout = window.setTimeout(() => {
      ui.suspenseLine.textContent = lines[index];
      ui.suspenseLine.classList.add('visible');
      tone(65 + index * 18, .55, .04, index === lines.length - 1 ? 'sawtooth' : 'triangle');
      index += 1;
      if (index < lines.length) revealTimeouts.push(window.setTimeout(showNext, 850));
      else revealTimeouts.push(window.setTimeout(() => {
        ui.suspenseOverlay.hidden = true;
        ui.suspenseLine.classList.remove('visible');
        callback();
      }, 950));
    }, 180);
    revealTimeouts.push(swapTimeout);
  };

  showNext();
}

function stopTimer(label = 'PAUSED') {
  window.clearInterval(timerInterval);
  timerInterval = null;
  ui.timerLabel.textContent = label;
  ui.timerValue.textContent = '—';
  ui.timerBar.style.transform = 'scaleX(0)';
  ui.countdown.classList.remove('urgent');
  ui.countdown.classList.add('paused');
}

function startTimer(seconds, label, onExpire) {
  window.clearInterval(timerInterval);
  const duration = seconds * 1000;
  timerDeadline = Date.now() + duration;
  ui.timerLabel.textContent = label;
  ui.countdown.classList.remove('paused', 'urgent');

  const update = () => {
    const remainingMs = Math.max(0, timerDeadline - Date.now());
    const remaining = Math.ceil(remainingMs / 1000);
    ui.timerValue.textContent = String(remaining).padStart(2, '0');
    ui.timerBar.style.transform = `scaleX(${remainingMs / duration})`;
    ui.countdown.classList.toggle('urgent', remaining <= 5);
    if (remaining > 0 && remaining <= 5 && remainingMs % 1000 > 850) tone(72 + remaining * 5, .12, .025, 'square');
    if (remainingMs <= 0) {
      window.clearInterval(timerInterval);
      timerInterval = null;
      onExpire();
    }
  };

  update();
  timerInterval = window.setInterval(update, 100);
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

  const notes = [110, 130.81, 98, 146.83];
  let step = 0;
  const pulse = () => {
    if (!state.sound) return;
    tone(notes[step % notes.length], .65, .018, 'triangle');
    if (step % 2 === 0) window.setTimeout(() => tone(notes[(step + 2) % notes.length] * 2, .3, .012, 'sine'), 280);
    step += 1;
  };
  pulse();
  musicInterval = window.setInterval(pulse, 900);
}

function stopAmbient() {
  window.clearInterval(musicInterval);
  musicInterval = null;
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
  ui.missionText.textContent = 'Memorize the room. You have 20 seconds, or you can look away early.';
  ui.missionPips.forEach((pip, index) => {
    pip.className = index < state.stage ? 'complete' : index === state.stage ? 'active' : '';
  });
  ui.room.dataset.stage = String(state.stage);
  ui.room.dataset.phase = 'observe';
  ui.room.classList.remove('mutated', 'is-shifting');
  ui.choicePanel.hidden = true;
  ui.blindfold.hidden = true;
  ui.lookButton.hidden = false;
  ui.lookButton.innerHTML = 'LOOK AWAY <span aria-hidden="true">◉</span>';
  updateMemory();
  startTimer(20, 'MEMORIZE', () => {
    if (state.phase === 'observe') {
      announce('Time expired. The room changes while you look away.');
      lookAway();
    }
  });
  announce(`${stage.kicker}. ${stage.title} ${stage.observe}`);
}

function lookAway() {
  const stage = stages[state.stage];
  if (state.phase === 'observe') {
    stopTimer('LOOK AWAY');
    state.phase = 'away';
    ui.room.dataset.phase = 'away';
    ui.blindfoldMessage.textContent = stage.blindfold;
    ui.blindfold.hidden = false;
    ui.lookButton.innerHTML = 'LOOK AGAIN <span aria-hidden="true">◎</span>';
    ui.stageInstruction.textContent = 'You can return, but the room will not wait forever.';
    tone(146.8, .55, .045, 'sawtooth');
    announce('You look away. ' + stage.blindfold + ' Press Look Again to return.');
    ui.blindfoldReturn.focus();
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
    ui.missionText.textContent = 'Identify the changed detail before the evidence becomes unreliable.';
    renderChoices(stage);
    startTimer(15, 'DECIDE', () => timeoutChoice());
    tone(220 + state.stage * 35, .22, .05, 'square');
    window.setTimeout(() => tone(329.6 + state.stage * 28, .45, .03), 100);
    announce(`You look again. ${stage.returnText} ${stage.prompt}`);
  }
}

function renderChoices(stage) {
  ui.choicePanel.classList.remove('action-choice');
  ui.choicePrompt.textContent = stage.prompt;
  ui.choiceButtons.replaceChildren();
  stage.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.choice = choice.id;
    const label = document.createElement('strong');
    label.textContent = choice.label;
    button.append(label);
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
  state.phase = 'respond';
  stopTimer('CHOICE LOCKED');
  tone(correct ? 523.25 : 164.81, .42, .05, correct ? 'sine' : 'sawtooth');
  updateMemory();
  ui.stageInstruction.textContent = correct
    ? 'Your memory and the room agree—for now.'
    : 'The room accepts your answer without confirming it.';
  ui.missionText.textContent = correct
    ? 'You caught the contradiction. Now decide what your character does.'
    : 'Certainty is gone. Your response still determines what happens next.';
  renderActionChoices(stage);
  announce(`${ui.stageInstruction.textContent} ${stage.actionPrompt}`);
}

function timeoutChoice() {
  if (state.phase !== 'choose') return;
  const stage = stages[state.stage];
  state.answers.push({ stage: state.stage, choice: 'timeout', correct: false });
  state.phase = 'respond';
  stopTimer('TIME EXPIRED');
  updateMemory();
  tone(82.41, .7, .05, 'sawtooth');
  ui.stageInstruction.textContent = 'The change settles before you can name it.';
  ui.missionText.textContent = 'You missed the evidence, but you still control the response.';
  renderActionChoices(stage);
  announce(`Time expired. ${stage.actionPrompt}`);
}

function renderActionChoices(stage) {
  ui.choicePanel.classList.add('action-choice');
  ui.choicePrompt.textContent = stage.actionPrompt;
  ui.choiceButtons.replaceChildren();
  stage.actions.forEach((action) => {
    const button = document.createElement('button');
    button.type = 'button';
    const label = document.createElement('strong');
    label.textContent = action.label;
    const detail = document.createElement('small');
    detail.textContent = action.detail;
    button.append(label, detail);
    button.addEventListener('click', () => selectResponse(action));
    ui.choiceButtons.append(button);
  });
  ui.choicePanel.hidden = false;
  ui.choiceButtons.querySelector('button')?.focus();
}

function selectResponse(action) {
  if (state.phase !== 'respond') return;
  state.responses.push({ stage: state.stage, ...action });
  state.phase = 'answered';
  ui.choicePanel.hidden = true;
  ui.choicePanel.classList.remove('action-choice');
  ui.stageInstruction.textContent = `You chose: ${action.label.toLowerCase()}. The room remembers.`;
  ui.missionText.textContent = 'Decision recorded. Continue when you are ready.';
  tone(action.trait === 'instinct' ? 196 : action.trait === 'evidence' ? 261.63 : 130.81, .5, .035, 'triangle');
  ui.lookButton.hidden = false;
  const currentScore = state.answers.filter((answer) => answer.correct).length;
  ui.lookButton.innerHTML = state.stage === stages.length - 1
    ? currentScore >= 2
      ? 'MAKE THE FINAL CHOICE <span aria-hidden="true">→</span>'
      : 'FACE THE RESULT <span aria-hidden="true">→</span>'
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
    stopTimer('COMPLETE');
    const score = state.answers.filter((answer) => answer.correct).length;
    if (score < 2) {
      failGame(score);
      return;
    }
    ui.stageLabel.textContent = 'FINAL / DECISION';
    showScreen(ui.finalChoice);
    document.querySelector('.decision-card')?.focus();
    announce('Final decision. Which reality should remain?');
  }
}

function failGame(score) {
  ui.failureScore.textContent = `${score} / 3`;
  ui.stageLabel.textContent = 'FAILED / MEMORY LOST';
  runSuspenseReveal(
    ['THE CLOCK STOPS.', 'THE DOOR OPENS.', 'YOU DO NOT REMEMBER LEAVING.'],
    () => {
      showScreen(ui.failure);
      ui.retryButton.focus();
      announce('Run failed. The room chose for you. Try again.');
    }
  );
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
  const traitCounts = state.responses.reduce((counts, response) => {
    counts[response.trait] = (counts[response.trait] || 0) + 1;
    return counts;
  }, { memory: 0, evidence: 0, instinct: 0 });
  const highestTraitCount = Math.max(...Object.values(traitCounts));
  const leadingTraits = Object.keys(traitCounts).filter((trait) => traitCounts[trait] === highestTraitCount);
  const dominantTrait = leadingTraits.length === 1
    ? leadingTraits[0]
    : state.responses.at(-1)?.trait || finalChoice;
  const actionEcho = {
    memory: ' Behind you, a key turns in a lock that was never there.',
    evidence: ' Your newest photograph shows the door already open.',
    instinct: ' The knocking stops the moment you think of turning around.'
  }[dominantTrait];
  const endings = {
    memory: score >= 2
      ? ['ENDING 01 / THE WITNESS', 'The room remembers you back.', 'Every object returns to its first position. The lock clicks. Beyond the door, someone is arranging a second room—and they look exactly like you.']
      : ['ENDING 02 / THE RESTORATION', 'You rebuild a room that never existed.', 'The last object slides into place. A note appears beneath your hand: THANK YOU FOR REMEMBERING ME. The handwriting is yours.'],
    evidence: score >= 2
      ? ['ENDING 03 / THE ARCHIVIST', 'The recording contains a fourth room.', 'You press play. In the footage, you are already standing inside it, facing the camera. Behind you, the handle begins to turn.']
      : ['ENDING 04 / THE ACCOMPLICE', 'The room rewards your attention.', 'Nothing moves. Nothing blinks. Then the radio whispers tomorrow’s date—and begins counting backward from ten.'],
    instinct: score >= 2
      ? ['ENDING 05 / THE INTERRUPTION', 'You refuse the room its answer.', 'You walk through the wall before it can change again. The screen goes dark. Three slow knocks come from somewhere behind you.']
      : ['ENDING 06 / THE AUTHOR', 'You choose the contradiction.', 'The walls loosen into unfinished lines. A new door draws itself in the air. On it, in wet ink: DO NOT LET ME OUT.']
  };
  const [code, title, text] = endings[finalChoice];
  ui.endingCode.textContent = code;
  ui.endingTitle.textContent = title;
  ui.endingText.textContent = text + actionEcho;
  ui.finalScore.textContent = `${score} / 3`;
  const playStyleLabel = { memory: 'CONTROL', evidence: 'DOCUMENT', instinct: 'CONFRONT' }[dominantTrait];
  ui.finalTrust.textContent = `${finalChoice.toUpperCase()} / ${playStyleLabel}`;
  ui.stageLabel.textContent = code.replace('ENDING ', 'END / ');
  runSuspenseReveal(
    ['THE ROOM GOES QUIET.', 'SOMETHING MOVES BEHIND THE DOOR.', 'YOUR CHOICE HAS BEEN RECORDED.'],
    () => {
      showScreen(ui.ending);
      tone(110, 1.4, .045, 'triangle');
      window.setTimeout(() => tone(164.81, 1.6, .025), 200);
      ui.replayButton.focus();
      announce(`${code}. ${title} ${text}${actionEcho}`);
    }
  );
}

function resetGame() {
  clearReveal();
  stopTimer('READY');
  state = { storyBeat: 0, stage: 0, phase: 'observe', answers: [], responses: [], sound: state.sound, final: null };
  ui.room.classList.remove('mutated', 'is-shifting');
  ui.stageLabel.textContent = 'PROLOGUE / 00';
  showScreen(ui.start);
  ui.startButton.focus();
  announce('Game reset. Enter the room when you are ready.');
}

ui.startButton.addEventListener('click', () => {
  showScreen(ui.story);
  startAmbient();
  state.storyBeat = 0;
  renderStoryBeat();
  ui.storyNext.focus();
});

ui.storyNext.addEventListener('click', advanceStory);
ui.storySkip.addEventListener('click', enterRoomFromStory);

ui.lookButton.addEventListener('click', () => {
  if (state.phase === 'answered') advance();
  else lookAway();
});

ui.blindfoldReturn.addEventListener('click', lookAway);
ui.blindfold.addEventListener('click', () => {
  if (state.phase === 'away') lookAway();
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
ui.retryButton.addEventListener('click', resetGame);

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !ui.play.hidden && !ui.lookButton.hidden && document.activeElement.tagName !== 'BUTTON') {
    event.preventDefault();
    ui.lookButton.click();
  }
});
