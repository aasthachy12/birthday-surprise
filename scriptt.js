document.addEventListener("DOMContentLoaded", function () {
  const firstPage = document.getElementById("firstPage");
  const yesButton = document.getElementById("yesButton");
  const noButton = document.getElementById("noButton");

  const birthdayPage = document.getElementById("birthdayPage");
  const heart = document.getElementById("heart");
  const flyingArrow = document.getElementById("flyingArrow");
  const birthdayMessage = document.getElementById("birthdayMessage");
  const openSurpriseButton = document.getElementById("openSurpriseButton");

  const envelopePage = document.getElementById("envelopePage");
  const envelopeButton = document.getElementById("envelopeButton");

  const letterPage = document.getElementById("letterPage");
  const birthdaySong = document.getElementById("birthdaySong");

  const catVideo = document.getElementById("catVideo");
  const catCanvas = document.getElementById("catCanvas");

  const playMemoryButton = document.getElementById("playMemoryButton");
  const memoryVideo = document.getElementById("memoryVideo");
  const memoryClip = document.getElementById("memoryClip");
  const videoClose = document.getElementById("videoClose");

  const kissPopup = document.getElementById("kissPopup");
  const kissClose = document.getElementById("kissClose");

  const celebration = document.getElementById("celebration");

  let envelopeOpened = false;

  function playCelebration() {
    if (!celebration) return;

    const colors = ["#ff4f87", "#ff9cc0", "#ffd86b", "#ffffff", "#d65d80"];
    const shapes = ["♥", "✦", "●", "♥", "✧"];

    for (let i = 0; i < 45; i++) {
      const piece = document.createElement("span");

      piece.className = "confetti";
      piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.color = colors[Math.floor(Math.random() * colors.length)];
      piece.style.fontSize = `${12 + Math.random() * 17}px`;
      piece.style.setProperty("--drift", `${-160 + Math.random() * 320}px`);
      piece.style.animationDelay = `${Math.random() * 0.35}s`;

      celebration.appendChild(piece);

      setTimeout(function () {
        piece.remove();
      }, 2800);
    }
  }

  function moveNoButton() {
    if (!noButton) return;

    const x = Math.random() * 180 - 90;
    const y = Math.random() * 100 - 50;

    noButton.style.transform = `translate(${x}px, ${y}px)`;
  }

  function playArrowHitSound() {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(620, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        220,
        audioContext.currentTime + 0.22
      );

      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.22,
        audioContext.currentTime + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.26
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.27);
    } catch (error) {}
  }

  function startCatVideo() {
    if (!catVideo || !catCanvas) return;

    const context = catCanvas.getContext("2d", {
      willReadFrequently: true
    });

    function drawCat() {
      if (catVideo.readyState >= 2) {
        const sourceWidth = catVideo.videoWidth;
        const sourceHeight = Math.floor(catVideo.videoHeight * 0.78);

        if (sourceWidth > 0 && sourceHeight > 0) {
          if (
            catCanvas.width !== sourceWidth ||
            catCanvas.height !== sourceHeight
          ) {
            catCanvas.width = sourceWidth;
            catCanvas.height = sourceHeight;
          }

          context.clearRect(0, 0, catCanvas.width, catCanvas.height);

          context.drawImage(
            catVideo,
            0,
            0,
            sourceWidth,
            sourceHeight,
            0,
            0,
            catCanvas.width,
            catCanvas.height
          );

          const image = context.getImageData(
            0,
            0,
            catCanvas.width,
            catCanvas.height
          );

          const pixels = image.data;

          for (let i = 0; i < pixels.length; i += 4) {
            const red = pixels[i];
            const green = pixels[i + 1];
            const blue = pixels[i + 2];

            if (green > red * 1.18 && green > blue * 1.18 && green > 70) {
              pixels[i + 3] = 0;
            }
          }

          context.putImageData(image, 0, 0);
        }
      }

      requestAnimationFrame(drawCat);
    }

    catVideo.play().catch(function () {});
    drawCat();
  }

  noButton?.addEventListener("mouseenter", moveNoButton);

  noButton?.addEventListener("touchstart", function (event) {
    event.preventDefault();
    moveNoButton();
  });

  yesButton?.addEventListener("click", function () {
    firstPage.style.display = "none";
    birthdayPage?.classList.add("show");

    const arrowStartDelay = 500;
    const arrowTravelTime = 1250;

    setTimeout(function () {
      if (!heart || !flyingArrow || !birthdayPage) return;

      const pageBox = birthdayPage.getBoundingClientRect();
      const heartBox = heart.getBoundingClientRect();

      const startX = birthdayPage.clientWidth * 0.1;
      const startY = birthdayPage.clientHeight * 0.68;

      const targetX = heartBox.left - pageBox.left + heartBox.width / 2;
      const targetY = heartBox.top - pageBox.top + heartBox.height / 2;

      const angle = Math.atan2(targetY - startY, targetX - startX);
      const angleInDegrees = angle * (180 / Math.PI);
      const arrowLength = 108;

      flyingArrow.style.setProperty(
        "--arrow-angle",
        `${angleInDegrees}deg`
      );

      flyingArrow.style.left = `${startX}px`;
      flyingArrow.style.top = `${startY}px`;
      flyingArrow.style.opacity = "1";
      flyingArrow.classList.add("shoot");

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          flyingArrow.style.left =
            `${targetX - arrowLength * Math.cos(angle)}px`;

          flyingArrow.style.top =
            `${targetY - arrowLength * Math.sin(angle) + 10}px`;
        });
      });
    }, arrowStartDelay);

    setTimeout(function () {
      heart?.classList.add("hit");
      playArrowHitSound();
      birthdayMessage?.classList.add("show-message");
      playCelebration();
    }, arrowStartDelay + arrowTravelTime);
  });

  openSurpriseButton?.addEventListener("click", function () {
    birthdayPage.style.display = "none";
    envelopePage?.classList.add("show");
    startCatVideo();
  });

  envelopeButton?.addEventListener("click", function () {
    if (envelopeOpened) return;
    envelopeOpened = true;

    envelopeButton.classList.add("open");
    playCelebration();

    setTimeout(function () {
      envelopePage.style.display = "none";
      letterPage?.classList.add("show");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 700);
  });

  playMemoryButton?.addEventListener("click", function () {
    if (birthdaySong) {
      birthdaySong.currentTime = 0;
      birthdaySong.volume = 0.65;
      birthdaySong.play().catch(function () {});
    }

    if (memoryVideo) {
      memoryVideo.hidden = false;
    }

    if (memoryClip) {
      memoryClip.currentTime = 0;
      memoryClip.play().catch(function () {});
    }
  });
memoryClip?.addEventListener("ended", function () {
  if (birthdaySong) {
    birthdaySong.pause();
    birthdaySong.currentTime = 0;
  }
});
  videoClose?.addEventListener("click", function () {
  memoryClip?.pause();

  if (birthdaySong) {
    birthdaySong.pause();
    birthdaySong.currentTime = 0;
  }

  if (memoryVideo) {
    memoryVideo.hidden = true;
  }

  if (kissPopup) {
    kissPopup.hidden = false;
  }

  playCelebration();
});
  kissClose?.addEventListener("click", function () {
    if (kissPopup) {
      kissPopup.hidden = true;
    }
  });
});
