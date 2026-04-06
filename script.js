window.onload = function () {
  const inicio = document.getElementById("inicio");
  const videoIntro = document.getElementById("videoIntro");
  const elegante = document.getElementById("elegante");
  const videoFondo = document.getElementById("videoFondoInvitacion");
  let iniciado = false;

  // Iniciar la experiencia al hacer clic
  inicio.addEventListener("click", (e) => {
    if (iniciado) return;
    iniciado = true;
    
    const mensaje = document.getElementById("mensaje");
    if (mensaje) mensaje.style.display = "none";
    
    // Activar sonido de la intro
    videoIntro.muted = false;
    
    // Intentar reproducir la intro
    videoIntro.play().catch(error => {
      console.log("Error al reproducir video:", error);
      continuarConInvitacion();
    });

    videoIntro.onended = () => {
      continuarConInvitacion();
    };
    
    function continuarConInvitacion() {
      inicio.style.opacity = "0";
      setTimeout(() => {
        inicio.classList.remove("activa");
        elegante.classList.add("activa");
        
        if (videoFondo) {
          videoFondo.play().catch(e => console.log("Error video fondo:", e));
        }
      }, 1000);
    }
  });

  // ========== REPRODUCTOR DE MÚSICA ==========
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const progressBar = document.getElementById("progress");
  const progressContainer = document.querySelector(".progress-container");
  const currentTimeSpan = document.getElementById("current");
  const durationSpan = document.getElementById("duration");
  const volumeIcon = document.getElementById("volumeIcon");
  const volumeSliderContainer = document.getElementById("volumeSliderContainer");
  const volumeSlider = document.getElementById("volume");

  let isPlaying = false;

  // Establecer volumen inicial
  if (volumeSlider && audio) {
    volumeSlider.value = "0.7";
    audio.volume = 0.7;
  }

  // Cambiar icono de volumen según el nivel
  function updateVolumeIcon(volume) {
    if (volumeIcon) {
      if (volume == 0) {
        volumeIcon.textContent = "🔇";
      } else if (volume < 0.5) {
        volumeIcon.textContent = "🔉";
      } else {
        volumeIcon.textContent = "🔊";
      }
    }
  }

  /* MOSTRAR/OCULTAR CONTROL DE VOLUMEN VERTICAL */
  if (volumeIcon && volumeSliderContainer) {
    volumeIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      volumeSliderContainer.classList.toggle("show");
    });
  }

  /* CERRAR CONTROL DE VOLUMEN AL HACER CLICK FUERA */
  document.addEventListener("click", function(e) {
    if (volumeSliderContainer && volumeIcon) {
      if (!volumeSliderContainer.contains(e.target) && !volumeIcon.contains(e.target)) {
        volumeSliderContainer.classList.remove("show");
      }
    }
  });

  /* CONTROL DE VOLUMEN */
  if (volumeSlider && audio) {
    volumeSlider.addEventListener("input", (e) => {
      const volume = parseFloat(e.target.value);
      audio.volume = volume;
      updateVolumeIcon(volume);
    });
  }

  /* ACTUALIZAR ICONO CUANDO EL AUDIO CAMBIA EL VOLUMEN POR OTROS MEDIOS */
  if (audio) {
    audio.addEventListener("volumechange", () => {
      if (volumeSlider) {
        volumeSlider.value = audio.volume;
        updateVolumeIcon(audio.volume);
      }
    });
  }

  /* PLAY / PAUSE - SOLO SE REPRODUCE AL HACER CLIC */
  if (playBtn && audio) {
    playBtn.addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
        playBtn.textContent = "▶";
      } else {
        audio.play();
        playBtn.textContent = "⏸";
      }
      isPlaying = !isPlaying;
    });
  }

  /* ACTUALIZAR PROGRESO */
  if (audio) {
    audio.addEventListener("timeupdate", () => {
      const { currentTime, duration: dur } = audio;

      if (dur && progressBar) {
        const percent = (currentTime / dur) * 100;
        progressBar.style.width = percent + "%";

        if (currentTimeSpan) currentTimeSpan.textContent = formatTime(currentTime);
        if (durationSpan) durationSpan.textContent = formatTime(dur);
      }
    });
  }

  /* CLICK EN BARRA */
  if (progressContainer && audio) {
    progressContainer.addEventListener("click", (e) => {
      const width = progressContainer.clientWidth;
      const clickX = e.offsetX;
      const dur = audio.duration;

      audio.currentTime = (clickX / width) * dur;
    });
  }

  /* BOTÓN ANTERIOR - reinicia canción */
  if (prevBtn && audio) {
    prevBtn.addEventListener("click", () => {
      audio.currentTime = 0;
    });
  }

  /* BOTÓN SIGUIENTE - reinicia canción */
  if (nextBtn && audio) {
    nextBtn.addEventListener("click", () => {
      audio.currentTime = 0;
    });
  }

  /* FORMATO TIEMPO */
  function formatTime(time) {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  // ========== CONTADOR REGRESIVO - MISA (28 de Abril 20:30) ==========
  const fechaMisa = new Date("April 28, 2026 20:30:00").getTime();

  function actualizarContadorMisa() {
    const ahora = new Date().getTime();
    const diferencia = fechaMisa - ahora;

    if (diferencia <= 0) {
      document.getElementById("diasMisa").innerText = "00";
      document.getElementById("horasMisa").innerText = "00";
      document.getElementById("minutosMisa").innerText = "00";
      document.getElementById("segundosMisa").innerText = "00";
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    document.getElementById("diasMisa").innerText = dias.toString().padStart(2, "0");
    document.getElementById("horasMisa").innerText = horas.toString().padStart(2, "0");
    document.getElementById("minutosMisa").innerText = minutos.toString().padStart(2, "0");
    document.getElementById("segundosMisa").innerText = segundos.toString().padStart(2, "0");
  }

  // ========== CONTADOR REGRESIVO - FIESTA (9 de Mayo 21:30) ==========
  const fechaFiesta = new Date("May 9, 2026 21:30:00").getTime();

  function actualizarContadorFiesta() {
    const ahora = new Date().getTime();
    const diferencia = fechaFiesta - ahora;

    if (diferencia <= 0) {
      document.getElementById("diasFiesta").innerText = "00";
      document.getElementById("horasFiesta").innerText = "00";
      document.getElementById("minutosFiesta").innerText = "00";
      document.getElementById("segundosFiesta").innerText = "00";
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    document.getElementById("diasFiesta").innerText = dias.toString().padStart(2, "0");
    document.getElementById("horasFiesta").innerText = horas.toString().padStart(2, "0");
    document.getElementById("minutosFiesta").innerText = minutos.toString().padStart(2, "0");
    document.getElementById("segundosFiesta").innerText = segundos.toString().padStart(2, "0");
  }

  // Iniciar ambos contadores
  actualizarContadorMisa();
  actualizarContadorFiesta();
  setInterval(() => {
    actualizarContadorMisa();
    actualizarContadorFiesta();
  }, 1000);

  // Botón de datos bancarios
  const btnBancarios = document.getElementById("btnBancarios");
  if (btnBancarios) {
    btnBancarios.addEventListener("click", () => {
      const datosDiv = document.getElementById("datosBancarios");
      if (datosDiv) {
        if (datosDiv.style.display === "none" || datosDiv.style.display === "") {
          datosDiv.style.display = "block";
          btnBancarios.textContent = "🙈 OCULTAR DATOS";
        } else {
          datosDiv.style.display = "none";
          btnBancarios.textContent = "💳 DATOS BANCARIOS";
        }
      }
    });
  }

  // Botón de WhatsApp
  const btnWhatsapp = document.getElementById("btnWhatsapp");
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener("click", (e) => {
      e.preventDefault();
      const mensaje = encodeURIComponent("¡Hola! Quiero confirmar mi asistencia a tus 15 años ✨");
      window.open(`https://wa.me/+5493854354477?text=${mensaje}`, "_blank");
    });
  }
};