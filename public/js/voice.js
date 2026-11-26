/**
 * Kisan Mitra (किसान मित्र) — Bilingual Speech Synthesis Audio Advisor
 * Speaks diagnosis and prescriptions clearly in Hindi (hi-IN) or English (en-IN).
 */

const speechSynth = window.speechSynthesis;
let isSpeaking = false;

function speakText(text, lang = "en-IN") {
    if (!speechSynth) {
        alert("Speech synthesis is not supported on this browser.");
        return;
    }

    stopAudio();

    if (!text || text.trim() === "") return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynth.getVoices();
    let selectedVoice = null;

    if (lang.startsWith("hi")) {
        selectedVoice = voices.find(v => v.lang.includes("hi") || v.name.toLowerCase().includes("hindi"));
    } else {
        selectedVoice = voices.find(v => v.lang.includes("en-IN") || v.lang.includes("en-GB") || v.lang.includes("en-US"));
    }

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
        isSpeaking = true;
        updateAudioButtonState(true);
    };

    utterance.onend = () => {
        isSpeaking = false;
        updateAudioButtonState(false);
    };

    utterance.onerror = () => {
        isSpeaking = false;
        updateAudioButtonState(false);
    };

    speechSynth.speak(utterance);
}

function stopAudio() {
    if (speechSynth && speechSynth.speaking) {
        speechSynth.cancel();
    }
    isSpeaking = false;
    updateAudioButtonState(false);
}

function updateAudioButtonState(active) {
    const btn = document.getElementById("btn-voice-read");
    if (!btn) return;

    const listenLabel = typeof getLocalizedText === "function" ? getLocalizedText("btn_listen", "Listen (Audio)") : "Listen (Audio)";
    const stopLabel = typeof getLocalizedText === "function" ? getLocalizedText("btn_stop_audio", "Stop Audio") : "Stop Audio";

    if (active) {
        btn.innerHTML = `<span aria-hidden="true">⏹️</span> <span data-i18n="btn_stop_audio">${stopLabel}</span>`;
        btn.classList.add("playing");
    } else {
        btn.innerHTML = `<span aria-hidden="true">🔊</span> <span data-i18n="btn_listen">${listenLabel}</span>`;
        btn.classList.remove("playing");
    }
}
