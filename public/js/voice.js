/**
 * Kisan Mitra - Speech Synthesis Audio Advisor
 * Reads diagnosis and remedies aloud in farmer's preferred language.
 */

let speechSynth = window.speechSynthesis;
let isSpeaking = false;

function speakText(text, lang = "hi-IN") {
    if (!speechSynth) {
        alert("Speech synthesis is not supported on this browser.");
        return;
    }

    // Cancel ongoing speech
    stopAudio();

    if (!text || text.trim() === "") return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose voice matching language
    const voices = speechSynth.getVoices();
    let selectedVoice = null;

    if (lang.startsWith("hi")) {
        selectedVoice = voices.find(v => v.lang.includes("hi") || v.name.toLowerCase().includes("hindi") || v.lang.includes("IN"));
    } else if (lang.startsWith("te")) {
        selectedVoice = voices.find(v => v.lang.includes("te") || v.lang.includes("IN"));
    } else {
        selectedVoice = voices.find(v => v.lang.includes("en-IN") || v.lang.includes("en-GB") || v.lang.includes("en-US"));
    }

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    utterance.rate = 0.95; // Slightly slower, clear cadence for farmers
    utterance.pitch = 1.0;

    utterance.onstart = () => {
        isSpeaking = true;
        updateAudioButtonState(true);
    };

    utterance.onend = () => {
        isSpeaking = false;
        updateAudioButtonState(false);
    };

    utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        isSpeaking = false;
        updateAudioButtonState(false);
    };

    speechSynth.speak(utterance);
}

function stopAudio() {
    if (speechSynth && speechSynth.speaking) {
        speechSynth.cancel();
        isSpeaking = false;
        updateAudioButtonState(false);
    }
}

function updateAudioButtonState(active) {
    const btn = document.getElementById("btn-voice-read");
    if (!btn) return;
    if (active) {
        btn.innerHTML = `<span class="voice-wave active"></span> <span data-i18n="btn_stop_audio">Stop Audio</span>`;
        btn.classList.add("playing");
    } else {
        btn.innerHTML = `🔊 <span data-i18n="btn_listen">Listen (Audio)</span>`;
        btn.classList.remove("playing");
    }
}
