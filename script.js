(() => {
  "use strict";

  const ambient = document.querySelector(".ambient");
  const music = document.querySelector("#birthday-music");
  const musicToggle = document.querySelector(".music-toggle");
  const musicNote = document.querySelector(".music-note");
  const songUpload = document.querySelector("#song-upload");
  const photoPicker = document.querySelector("#photo-picker");
  const gallery = document.querySelector(".gallery");
  const photoModal = document.querySelector(".image-modal");
  const objectUrls = [];
  const MUSIC_URL = "";
  let uploadedMusicUrl = "";
  let musicContext = null;
  let musicNodes = [];
  let confessionStep = 0;

  if (ambient) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 42; i += 1) {
      const particle = document.createElement("i");
      particle.className = "particle";
      particle.style.setProperty("--x", `${Math.random() * 100}%`);
      particle.style.setProperty("--y", `${Math.random() * 100}%`);
      particle.style.setProperty("--size", `${1 + Math.random() * 2.5}px`);
      particle.style.setProperty("--duration", `${7 + Math.random() * 10}s`);
      particle.style.setProperty("--delay", `${-Math.random() * 15}s`);
      particle.style.setProperty("--drift", `${Math.round(Math.random() * 40 - 20)}px`);
      particle.style.setProperty("--opacity", `${.25 + Math.random() * .5}`);
      particle.style.setProperty("--tint", i % 4 === 0 ? "#800020" : "#e8a0a8");
      fragment.append(particle);
    }
    for (let i = 0; i < 5; i += 1) {
      const heart = document.createElement("i");
      heart.className = "particle heart-particle";
      heart.style.setProperty("--x", `${8 + Math.random() * 84}%`);
      heart.style.setProperty("--y", `${30 + Math.random() * 62}%`);
      heart.style.setProperty("--size", `${12 + Math.random() * 7}px`);
      heart.style.setProperty("--duration", `${11 + Math.random() * 8}s`);
      heart.style.setProperty("--delay", `${-Math.random() * 18}s`);
      heart.style.setProperty("--drift", `${Math.round(Math.random() * 36 - 18)}px`);
      heart.style.setProperty("--opacity", ".42");
      fragment.append(heart);
    }
    ambient.append(fragment);
  }

  document.querySelectorAll(".why-card").forEach(card => {
    card.addEventListener("click", () => {
      const open = card.classList.toggle("open");
      card.setAttribute("aria-expanded", String(open));
    });
  });

  if (gallery && photoPicker && photoModal) {
    const memories = [
      { src: "truth.jpeg", caption: "Tehi opposite ma basera, ek-arkako aakhama herdai bottle ghumayera sacho bolnu... thorai lajaudai, thorai hasdai, thorai maskidai—tyo pal nai xuttai thiyo..." },
      { src: "teaching.jpeg", caption: "Maile sikaunu bhanda ta besi timilai hereko hunthye. Kasari nahernu pani, yeti ramri chhau timi... timi bahek aru koi tira nazar jo jadaina..." },
      { src: "walk.jpeg", caption: "Tehii college dekhi tala samma hideko ajhai yaad chha. Tesari nai timisanga budheskal samma hidna man chha..." }
    ];

    function openPhoto(src, alt, caption) {
      photoModal.querySelector("img").src = src;
      photoModal.querySelector("img").alt = caption || alt;
      photoModal.querySelector(".modal-caption").textContent = caption;
      photoModal.classList.add("open");
      photoModal.querySelector(".modal-close").focus();
    }

    function addPhoto(src, captionText = "") {
      const card = document.createElement("div");
      card.className = "photo-card";
      const imageButton = document.createElement("button");
      imageButton.type = "button";
      imageButton.className = "photo-image";
      imageButton.setAttribute("aria-label", "Preview photo");
      const img = document.createElement("img");
      img.src = src;
      img.alt = captionText || "A photo in Aaru's birthday gallery";
      imageButton.append(img);
      const caption = document.createElement("span");
      caption.className = "caption";
      caption.contentEditable = "true";
      caption.setAttribute("role", "textbox");
      caption.setAttribute("aria-label", "Edit photo caption");
      caption.spellcheck = false;
      caption.textContent = captionText;
      imageButton.addEventListener("click", () => openPhoto(img.src, img.alt, caption.textContent));
      card.append(imageButton, caption);
      gallery.append(card);
    }

    memories.forEach(({ src, caption }) => addPhoto(src, caption));

    photoPicker.addEventListener("change", () => {
      for (const file of photoPicker.files) {
        if (!file.type.startsWith("image/")) continue;
        const url = URL.createObjectURL(file);
        objectUrls.push(url);
        addPhoto(url);
      }
      photoPicker.value = "";
    });

    const closePhoto = () => photoModal.classList.remove("open");
    photoModal.querySelector(".modal-close").addEventListener("click", closePhoto);
    photoModal.addEventListener("click", event => {
      if (event.target === photoModal) closePhoto();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closePhoto();
    });
    window.addEventListener("pagehide", () => objectUrls.forEach(URL.revokeObjectURL));
  }

  const envelopeWrap = document.querySelector(".envelope-wrap");
  const openLetterButton = document.querySelector(".open-letter-button");
  if (envelopeWrap && openLetterButton) {
    const openLetter = () => {
      if (envelopeWrap.classList.contains("open")) return;
      envelopeWrap.classList.add("open");
      document.querySelector(".letter-scene").classList.add("opened");
      document.querySelector(".open-letter-note").style.opacity = "0";
      openLetterButton.hidden = true;
      window.setTimeout(() => document.querySelector(".letter-wrap").classList.add("visible"), 1050);
    };
    openLetterButton.addEventListener("click", openLetter);
    envelopeWrap.addEventListener("click", openLetter);
    envelopeWrap.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLetter();
      }
    });
  }

  const confessionButton = document.querySelector(".confession-button");
  if (confessionButton) {
    confessionButton.addEventListener("click", () => {
      const lines = document.querySelectorAll(".confession-line");
      if (confessionStep >= lines.length) return;
      lines[confessionStep].classList.add("show");
      confessionStep += 1;
      if (confessionStep === lines.length) {
        confessionButton.hidden = true;
        document.querySelector(".next-after-confession").hidden = false;
      }
    });
  }

  function setMusicState(playing) {
    musicToggle.setAttribute("aria-pressed", String(playing));
    musicToggle.setAttribute("aria-label", playing ? "Turn music off" : "Turn music on");
    musicNote.textContent = playing ? "Music is on" : "Music is off";
  }

  async function startAmbientMusic() {
    const AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextType) throw new Error("Web Audio is not supported in this browser.");
    musicContext = musicContext || new AudioContextType();
    if (musicContext.state === "suspended") await musicContext.resume();
    const master = musicContext.createGain();
    master.gain.setValueAtTime(0, musicContext.currentTime);
    master.gain.linearRampToValueAtTime(.035, musicContext.currentTime + 2.5);
    master.connect(musicContext.destination);
    const notes = [146.83, 174.61, 220, 261.63];
    musicNodes = notes.map((frequency, index) => {
      const oscillator = musicContext.createOscillator();
      const volume = musicContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      volume.gain.value = index === 0 ? .48 : .2;
      oscillator.connect(volume);
      volume.connect(master);
      oscillator.start();
      return oscillator;
    });
    musicNodes.push(master);
  }

  function stopAmbientMusic() {
    if (!musicContext || musicNodes.length === 0) return;
    const master = musicNodes[musicNodes.length - 1];
    master.gain.cancelScheduledValues(musicContext.currentTime);
    master.gain.setValueAtTime(master.gain.value, musicContext.currentTime);
    master.gain.linearRampToValueAtTime(0, musicContext.currentTime + .8);
    const oscillators = musicNodes.slice(0, -1);
    window.setTimeout(() => {
      oscillators.forEach(oscillator => oscillator.stop());
      musicNodes = [];
    }, 900);
  }

  function setCustomTrack(file) {
    if (!file || !file.type.startsWith("audio/")) {
      musicNote.textContent = "Choose an audio file";
      musicNote.style.opacity = "1";
      return;
    }

    if (uploadedMusicUrl) URL.revokeObjectURL(uploadedMusicUrl);
    uploadedMusicUrl = URL.createObjectURL(file);
    music.src = uploadedMusicUrl;
    music.load();

    if (musicToggle.matches('[aria-pressed="true"]')) {
      music.play().catch(error => {
        console.error("Could not play the uploaded birthday song.", error);
        musicNote.textContent = "Music couldn't be played";
        musicNote.style.opacity = "1";
      });
    } else {
      musicNote.textContent = "Song loaded — tap the music button to play";
      musicNote.style.opacity = "1";
    }
  }

  if (MUSIC_URL) music.src = MUSIC_URL;
  if (songUpload) {
    songUpload.addEventListener("change", () => {
      const [file] = songUpload.files;
      setCustomTrack(file);
      songUpload.value = "";
    });
  }

  window.addEventListener("beforeunload", () => {
    if (uploadedMusicUrl) URL.revokeObjectURL(uploadedMusicUrl);
  });

  musicToggle.addEventListener("click", async () => {
    if (!musicToggle.matches('[aria-pressed="true"]')) {
      try {
        if (uploadedMusicUrl || MUSIC_URL) await music.play();
        else await startAmbientMusic();
        setMusicState(true);
        try { sessionStorage.setItem("aaru-music", "on"); }
        catch (error) { console.warn("Session music preference could not be saved.", error); }
      } catch (error) {
        console.error("Could not play the selected birthday music.", error);
        musicNote.textContent = "Music couldn't be played";
        musicNote.style.opacity = "1";
      }
    } else {
      if (uploadedMusicUrl || MUSIC_URL) {
        music.pause();
        music.currentTime = 0;
      } else {
        stopAmbientMusic();
      }
      setMusicState(false);
      try { sessionStorage.setItem("aaru-music", "off"); }
      catch (error) { console.warn("Session music preference could not be saved.", error); }
    }
  });

  try {
    if (sessionStorage.getItem("aaru-music") === "on") {
      musicToggle.title = "Music was enabled this session; tap to start";
    }
  } catch (error) {
    console.warn("Session music preference could not be read.", error);
  }
})();
