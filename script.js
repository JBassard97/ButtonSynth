const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let activeOscillators = {};

function playChord(frequencies) {
  const selectEl = document.getElementById("tone");
  const tone = selectEl.value;
  const noteLengthEl = document.getElementById("noteLength");
  const notelength = Number(noteLengthEl.value);

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
  gainNode.connect(audioContext.destination);

  frequencies.forEach((frequency) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = tone;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(gainNode);
    oscillator.start();
    activeOscillators[frequency] = oscillator;
  });

  setTimeout(() => {
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioContext.currentTime + notelength
    );
    frequencies.forEach((frequency) => {
      const oscillator = activeOscillators[frequency];
      if (oscillator) {
        oscillator.stop(audioContext.currentTime + notelength);
        delete activeOscillators[frequency];
      }
    });
  }, notelength * 1000);
}

function stopChord(frequencies) {
  frequencies.forEach((frequency) => {
    const oscillator = activeOscillators[frequency];
    if (oscillator) {
      oscillator.stop();
      delete activeOscillators[frequency];
    }
  });
}

function generateNoteNames() {
  const noteNames = [];
  const octaves = ["1", "2", "3", "4", "5", "6"];

  for (const octave of octaves) {
    for (let semitone = 0; semitone <= 11; semitone++) {
      const frequency = 110 * Math.pow(2, (semitone + (octave - 2) * 12) / 12);
      const note = getNoteName(frequency);
      const fullName = `${note}${octave}`;
      noteNames.push(fullName);
    }
  }

  return noteNames;
}

function getNoteName(frequency) {
  const noteNames = [
    "A",
    "B♭",
    "B",
    "C",
    "C#",
    "D",
    "E♭",
    "E",
    "F",
    "F#",
    "G",
    "G#",
  ];
  const noteIndex = Math.round(12 * Math.log2(frequency / 440));
  const normalizedNoteIndex = ((noteIndex % 12) + 12) % 12;
  return noteNames[normalizedNoteIndex];
}

function getFrequencyFromNoteName(noteName) {
  const octave = noteName.slice(-1);
  const noteWithoutOctave = noteName.slice(0, -1);
  const noteIndex = [
    "A",
    "B♭",
    "B",
    "C",
    "C#",
    "D",
    "E♭",
    "E",
    "F",
    "F#",
    "G",
    "G#",
  ].indexOf(noteWithoutOctave);
  return 110 * Math.pow(2, (noteIndex + (octave - 2) * 12) / 12);
}

function createButtons() {
  const buttonContainer = document.getElementById("buttonContainer");
  const noteNames = generateNoteNames();

  for (const noteName of noteNames) {
    const button = document.createElement("button");
    button.textContent = noteName;

    if (
      noteName.includes("1") &&
      !noteName.includes("#") &&
      !noteName.includes("♭")
    ) {
      button.style.background = "linear-gradient(135deg, pink, orchid)";
    }

    if (
      noteName.includes("2") &&
      !noteName.includes("#") &&
      !noteName.includes("♭")
    ) {
      button.style.background = "linear-gradient(135deg, peachpuff, orange)";
    }

    if (
      noteName.includes("3") &&
      !noteName.includes("#") &&
      !noteName.includes("♭")
    ) {
      button.style.background = "linear-gradient(135deg, lightyellow, yellow)";
    }

    if (
      noteName.includes("4") &&
      !noteName.includes("#") &&
      !noteName.includes("♭")
    ) {
      button.style.background = "linear-gradient(135deg, palegreen, limegreen)";
    }

    if (
      noteName.includes("5") &&
      !noteName.includes("#") &&
      !noteName.includes("♭")
    ) {
      button.style.background =
        "linear-gradient(135deg, lightblue, deepskyblue)";
    }

    if (
      noteName.includes("6") &&
      !noteName.includes("#") &&
      !noteName.includes("♭")
    ) {
      button.style.background =
        "linear-gradient(135deg, mediumorchid, rebeccapurple)";
    }

    // Check if the note name has a sharp or flat
    if (noteName.includes("#") || noteName.includes("♭")) {
      button.style.color = "white";
      button.style.backgroundColor = "black";
    }

    const frequency = getFrequencyFromNoteName(noteName);

    button.addEventListener("touchstart", (event) => {
      event.preventDefault(); // Prevents the default context menu
      if (!activeOscillators[frequency]) {
        playChord([frequency]);
      }
    });

    button.addEventListener("touchend", (event) => {
      event.preventDefault(); // Prevents the default context menu
      stopChord([frequency]);
    });

    buttonContainer.appendChild(button);
  }
}

createButtons();
