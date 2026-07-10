/**
 * Sting de entrada (~4s), estilo Interstellar pero breve: un swell
 * grave en quintas que crece, un whoosh de aire ascendente y una
 * campana luminosa en el clímax, todo bañado en reverb generada.
 * 100% sintetizado con Web Audio, sin archivos.
 *
 * Garantía de reproducción: el contexto es un singleton que se
 * desbloquea con primeAudio() en el primer gesto real del usuario;
 * si al abrir la puerta el navegador aún no concede audio (p. ej.
 * la rueda del mouse no cuenta como activación), el sting queda
 * pendiente y suena en el siguiente gesto válido.
 */
let ctx: AudioContext | null = null;
let pending = false;

function ensureCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function flush(): void {
  if (!pending || !ctx || ctx.state !== "running") return;
  pending = false;
  schedule(ctx);
}

/** Llamar en pointerdown/keydown/touchstart: desbloquea el contexto */
export function primeAudio(): void {
  const c = ensureCtx();
  if (c.state !== "running") {
    void c.resume().then(flush);
  } else {
    flush();
  }
}

export function playIntroSting(): void {
  const c = ensureCtx();
  pending = true;
  void c.resume().then(flush);
  flush();

  if (!pending) return;

  // Fallback: reintenta en el siguiente gesto con activación válida
  const events = ["pointerdown", "keydown", "touchstart"] as const;
  const retry = () => {
    primeAudio();
    if (!pending) {
      for (const e of events) window.removeEventListener(e, retry);
    }
  };
  for (const e of events) window.addEventListener(e, retry, { passive: true });
}

function schedule(c: AudioContext): void {
  const master = c.createGain();
  master.gain.value = 0.8;
  master.connect(c.destination);

  // Reverb: impulso de ruido con decaimiento exponencial (3s)
  const irLength = Math.floor(c.sampleRate * 3);
  const ir = c.createBuffer(2, irLength, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < irLength; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLength, 2.4);
    }
  }
  const reverb = c.createConvolver();
  reverb.buffer = ir;
  const wet = c.createGain();
  wet.gain.value = 0.6;
  reverb.connect(wet);
  wet.connect(master);

  const dry = c.createGain();
  dry.gain.value = 0.55;
  dry.connect(master);

  const out = (node: AudioNode) => {
    node.connect(reverb);
    node.connect(dry);
  };

  const t = c.currentTime + 0.05;

  // Swell grave: La1 + La2 + Mi3 creciendo hasta el clímax
  const swell: Array<[number, number]> = [
    [55.0, 0.24],
    [110.0, 0.15],
    [164.81, 0.09],
  ];
  for (const [freq, peak] of swell) {
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 1.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
    out(gain);

    for (const detune of [0, 3]) {
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = detune;
      osc.connect(gain);
      osc.start(t);
      osc.stop(t + 3.8);
    }
  }

  // Whoosh: aire que sube con el swell
  const noiseLength = Math.floor(c.sampleRate * 2.2);
  const noiseBuffer = c.createBuffer(1, noiseLength, c.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseLength; i++) noiseData[i] = Math.random() * 2 - 1;
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 1.1;
  bp.frequency.setValueAtTime(160, t);
  bp.frequency.exponentialRampToValueAtTime(1500, t + 1.15);
  const noiseGain = c.createGain();
  noiseGain.gain.setValueAtTime(0.0001, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.09, t + 0.95);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);
  noise.connect(bp);
  bp.connect(noiseGain);
  out(noiseGain);
  noise.start(t);
  noise.stop(t + 2.2);

  // Campana en el clímax: Mi5 + Si5, decaimiento largo en la reverb
  const bellAt = t + 1.05;
  for (const [freq, vol] of [
    [659.25, 0.12],
    [987.77, 0.05],
  ] as const) {
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, bellAt);
    gain.gain.exponentialRampToValueAtTime(vol, bellAt + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, bellAt + 2.8);
    gain.connect(reverb);

    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start(bellAt);
    osc.stop(bellAt + 3);
  }
}
