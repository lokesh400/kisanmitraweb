/**
 * Kisan Mitra (किसान मित्र) — Client UI & Pathology Controller
 * Clean, distraction-free, responsive, bilingual (English & Hindi),
 * with 43-condition interactive guide and adaptive lighting indicators.
 */

let currentImageBlob = null;
let currentDiagnosisData = null;
let cameraStream = null;
let cachedDiseases = null;

document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initCropSelect();
    initModeTabs();
    initDropzone();
    initCamera();
    initProtocolTabs();
    initActions();
    initChat();
    initEncyclopedia();
    initDialogLightDismissFallback();
});

/* ---------------- Crop Focus Selector ---------------- */
function initCropSelect() {
    const cropButtons = document.querySelectorAll(".crop-btn");
    const cropSelect = document.getElementById("crop-select");

    cropButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedCrop = btn.getAttribute("data-crop") || "Auto";
            cropButtons.forEach(b => {
                const isActive = b === btn;
                b.classList.toggle("active", isActive);
                b.setAttribute("aria-pressed", String(isActive));
            });

            if (cropSelect) cropSelect.value = selectedCrop;
            if (currentImageBlob) executeDiagnosis(currentImageBlob);
        });
    });
}

/* ---------------- Bilingual Setup (Strictly English & Hindi) ---------------- */
function initLanguage() {
    const savedLang = localStorage.getItem("kisan_lang") || "en";
    setLanguage(savedLang);

    const btnEn = document.getElementById("lang-btn-en");
    const btnHi = document.getElementById("lang-btn-hi");

    if (btnEn) {
        btnEn.addEventListener("click", () => {
            setLanguage("en");
            if (currentDiagnosisData) renderDiagnosis(currentDiagnosisData);
            if (cachedDiseases) renderEncyclopediaList();
        });
    }

    if (btnHi) {
        btnHi.addEventListener("click", () => {
            setLanguage("hi");
            if (currentDiagnosisData) renderDiagnosis(currentDiagnosisData);
            if (cachedDiseases) renderEncyclopediaList();
        });
    }
}

/* ---------------- Capture Mode Tabs ---------------- */
function initModeTabs() {
    const tabUpload = document.getElementById("tab-mode-upload");
    const tabCamera = document.getElementById("tab-mode-camera");
    const dropzoneSection = document.getElementById("dropzone-section");
    const cameraSection = document.getElementById("camera-section");

    if (tabUpload && tabCamera) {
        tabUpload.addEventListener("click", () => {
            tabUpload.classList.add("active");
            tabCamera.classList.remove("active");
            tabUpload.setAttribute("aria-selected", "true");
            tabCamera.setAttribute("aria-selected", "false");
            if (dropzoneSection) dropzoneSection.style.display = "block";
            if (cameraSection) cameraSection.style.display = "none";
            stopCameraStream();
        });

        tabCamera.addEventListener("click", () => {
            tabCamera.classList.add("active");
            tabUpload.classList.remove("active");
            tabCamera.setAttribute("aria-selected", "true");
            tabUpload.setAttribute("aria-selected", "false");
            if (dropzoneSection) dropzoneSection.style.display = "none";
            if (cameraSection) cameraSection.style.display = "block";
            startCameraStream();
        });
    }
}

/* ---------------- Upload Dropzone ---------------- */
function initDropzone() {
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("file-input");
    const previewContainer = document.getElementById("preview-container");
    const btnRemove = document.getElementById("btn-remove-preview");
    const btnDiagnose = document.getElementById("btn-diagnose");

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener("click", () => fileInput.click());
    dropzone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInput.click();
        }
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelected(e.target.files[0]);
        }
    });

    ["dragenter", "dragover"].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropzone.classList.add("dragover");
        });
    });

    ["dragleave", "drop"].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropzone.classList.remove("dragover");
        });
    });

    dropzone.addEventListener("drop", (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelected(e.dataTransfer.files[0]);
        }
    });

    if (btnRemove) {
        btnRemove.addEventListener("click", () => {
            currentImageBlob = null;
            fileInput.value = "";
            if (previewContainer) previewContainer.style.display = "none";
            if (dropzone) dropzone.style.display = "flex";
            if (btnDiagnose) btnDiagnose.disabled = true;
        });
    }

    if (btnDiagnose) {
        btnDiagnose.addEventListener("click", () => {
            if (currentImageBlob) executeDiagnosis(currentImageBlob);
        });
    }
}

function handleFileSelected(file) {
    if (!file.type.startsWith("image/")) {
        alert(currentLang === "hi"
            ? "कृपया एक मान्य फोटो (JPG, PNG, WebP) अपलोड करें।"
            : "Please upload a valid image file (JPEG, PNG, WebP).");
        return;
    }

    currentImageBlob = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewContainer = document.getElementById("preview-container");
        const imagePreview = document.getElementById("image-preview");
        const dropzone = document.getElementById("dropzone");
        const btnDiagnose = document.getElementById("btn-diagnose");

        if (imagePreview) imagePreview.src = e.target.result;
        if (previewContainer) previewContainer.style.display = "block";
        if (dropzone) dropzone.style.display = "none";
        if (btnDiagnose) btnDiagnose.disabled = false;

        executeDiagnosis(currentImageBlob);
    };
    reader.readAsDataURL(file);
}

/* ---------------- WebRTC Live Camera ---------------- */
function initCamera() {
    const btnSnap = document.getElementById("btn-snap-photo");
    const btnSwitchCam = document.getElementById("btn-switch-camera");
    let facingMode = "environment";

    if (btnSnap) {
        btnSnap.addEventListener("click", () => {
            const video = document.getElementById("camera-video");
            if (!video || !cameraStream) return;

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                stopCameraStream();
                const tabUpload = document.getElementById("tab-mode-upload");
                const tabCamera = document.getElementById("tab-mode-camera");
                const camSection = document.getElementById("camera-section");
                const dropSection = document.getElementById("dropzone-section");

                if (tabUpload) {
                    tabUpload.classList.add("active");
                    tabUpload.setAttribute("aria-selected", "true");
                }
                if (tabCamera) {
                    tabCamera.classList.remove("active");
                    tabCamera.setAttribute("aria-selected", "false");
                }
                if (camSection) camSection.style.display = "none";
                if (dropSection) dropSection.style.display = "block";

                handleFileSelected(new File([blob], "field_photo.jpg", { type: "image/jpeg" }));
            }, "image/jpeg", 0.92);
        });
    }

    if (btnSwitchCam) {
        btnSwitchCam.addEventListener("click", () => {
            facingMode = facingMode === "environment" ? "user" : "environment";
            startCameraStream(facingMode);
        });
    }
}

async function startCameraStream(facing = "environment") {
    stopCameraStream();
    const video = document.getElementById("camera-video");
    const guideBox = document.getElementById("camera-guide");

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
        });
        if (video) {
            video.srcObject = cameraStream;
            video.style.display = "block";
            await video.play();
        }
        if (guideBox) guideBox.style.display = "block";
    } catch (err) {
        console.warn("Camera access failed:", err);
        alert(currentLang === "hi"
            ? "कैमरा उपलब्ध नहीं है। कृपया 'फोटो अपलोड' विकल्प चुनें।"
            : "Camera access is not available. Please use 'Upload Photo'.");
    }
}

function stopCameraStream() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    const video = document.getElementById("camera-video");
    if (video) video.style.display = "none";
}

/* ---------------- Accessible Tablist ---------------- */
function initProtocolTabs() {
    const tabs = Array.from(document.querySelectorAll(".proto-tab"));
    if (tabs.length === 0) return;

    const activateTab = (selectedTab, moveFocus = false) => {
        tabs.forEach(tab => {
            const isSelected = tab === selectedTab;
            tab.setAttribute("aria-selected", String(isSelected));
            const panelId = tab.getAttribute("data-tab");
            const panel = panelId ? document.getElementById(panelId) : null;
            if (panel) {
                panel.hidden = !isSelected;
                if (isSelected) panel.setAttribute("tabindex", "0");
                else panel.removeAttribute("tabindex");
            }
        });

        if (typeof selectedTab.scrollIntoView === "function") {
            try {
                selectedTab.scrollIntoView({ block: "nearest", inline: "nearest", container: "nearest" });
            } catch {
                selectedTab.scrollIntoView({ block: "nearest", inline: "nearest" });
            }
        }
        if (moveFocus) selectedTab.focus();
    };

    tabs.forEach((tab, idx) => {
        tab.addEventListener("click", () => activateTab(tab));
        tab.addEventListener("keydown", (e) => {
            let nextIdx = null;
            if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
            else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
            else if (e.key === "Home") nextIdx = 0;
            else if (e.key === "End") nextIdx = tabs.length - 1;

            if (nextIdx !== null) {
                e.preventDefault();
                activateTab(tabs[nextIdx], true);
            }
        });
    });
}

/* ---------------- Execute Diagnosis ---------------- */
async function executeDiagnosis(imageBlob) {
    const loadingState = document.getElementById("loading-state");
    const emptyState = document.getElementById("empty-state");
    const resultDetails = document.getElementById("result-details");
    const btnDiagnose = document.getElementById("btn-diagnose");

    if (emptyState) emptyState.style.display = "none";
    if (resultDetails) resultDetails.style.display = "none";
    if (loadingState) loadingState.style.display = "flex";
    if (btnDiagnose) {
        btnDiagnose.disabled = true;
        btnDiagnose.innerHTML = `<span aria-hidden="true">⏳</span> <span>${getLocalizedText("btn_diagnosing", "Analyzing...")}</span>`;
    }

    try {
        const cropSelect = document.getElementById("crop-select");
        const selectedCrop = cropSelect ? cropSelect.value : "Auto";

        const formData = new FormData();
        formData.append("file", imageBlob);
        formData.append("crop", selectedCrop);

        const response = await fetch("/api/v1/diagnose", {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const data = await response.json();
        currentDiagnosisData = data;
        renderDiagnosis(data);
    } catch (err) {
        console.error("Diagnosis failure:", err);
        alert(currentLang === "hi"
            ? `जांच विफल रही: ${err.message}`
            : `Diagnosis failed: ${err.message}`);
        if (emptyState) emptyState.style.display = "flex";
    } finally {
        if (loadingState) loadingState.style.display = "none";
        if (btnDiagnose) {
            btnDiagnose.disabled = false;
            btnDiagnose.innerHTML = `<span aria-hidden="true">🔍</span> <span>${getLocalizedText("btn_diagnose", "Diagnose Crop")}</span>`;
        }
    }
}

/* ---------------- Render Diagnosis Dashboard ---------------- */
function renderDiagnosis(data) {
    const resultDetails = document.getElementById("result-details");
    const emptyState = document.getElementById("empty-state");

    if (emptyState) emptyState.style.display = "none";
    if (resultDetails) resultDetails.style.display = "block";

    const lightingBadge = document.getElementById("lighting-badge");

    if (data.status === "unclear_leaf") {
        if (lightingBadge) lightingBadge.hidden = true;
        document.getElementById("disease-name").textContent = currentLang === "hi"
            ? "स्पष्ट पत्ती या कंद नहीं मिला"
            : data.prediction.name;
        document.getElementById("disease-hindi").textContent = data.message || "कृपया पत्ते पर कैमरा केंद्रित करें।";
        document.getElementById("disease-pathogen").textContent = `Vegetation Detected: ${data.vegetation_percentage || 0}%`;
        document.getElementById("confidence-text").textContent = "0%";

        const sevBadge = document.getElementById("severity-badge");
        sevBadge.textContent = currentLang === "hi" ? "⚠️ अस्पष्ट फोटो" : "⚠️ Unclear Photo";
        sevBadge.style.backgroundColor = "#b91c1c";

        document.getElementById("organic-remedies-list").innerHTML = `
            <div class="remedy-card" style="border-inline-start-color: #b91c1c;">
                <div class="remedy-title">⚠️ ${currentLang === "hi" ? "फोटो निर्देश" : "Photography Guidance"}</div>
                <div class="remedy-detail">${currentLang === "hi"
                    ? "अपलोड की गई फोटो में टमाटर या आलू की पत्ती/कंद साफ नहीं दिख रहा। कृपया पत्ते को फ्रेम के बीच में रखकर दोबारा फोटो लें।"
                    : "Not enough tomato or potato leaf, stem, or tuber tissue detected. Center a clear close-up photo and try again."}</div>
            </div>
        `;
        document.getElementById("chemical-treatments-list").innerHTML = "";
        document.getElementById("knapsack-recipe-text").textContent = "-";
        document.getElementById("phd-taxonomy-text").textContent = "-";
        document.getElementById("phd-epidemiology-text").textContent = "-";
        document.getElementById("phd-differential-text").textContent = "-";
        document.getElementById("phd-icar-text").textContent = "-";
        document.getElementById("deficiency-content").innerHTML = "";
        document.getElementById("preventive-list").innerHTML = "";
        document.getElementById("alternatives-container").innerHTML = "";
        return;
    }

    const pred = data.prediction;
    const treat = data.treatment_plan;
    const spectral = data.spectral_deficiency_analysis;
    const phd = (currentLang === "hi" && data.phd_pathology_hi)
        ? data.phd_pathology_hi
        : (data.phd_pathology || {});

    const cropBadge = document.getElementById("disease-crop-badge");
    if (cropBadge) {
        const cropLabel = data.crop || pred.crop || "Tomato";
        cropBadge.textContent = currentLang === "hi"
            ? (cropLabel === "Potato" ? "🥔 आलू" : "🍅 टमाटर")
            : (cropLabel === "Potato" ? "🥔 POTATO" : "🍅 TOMATO");
        cropBadge.style.backgroundColor = cropLabel === "Potato" ? "#b45309" : "#146c37";
    }

    if (lightingBadge) {
        if (data.metadata?.extreme_condition_mode) {
            lightingBadge.hidden = false;
            const isDark = data.metadata.lighting_summary?.isLowLight;
            lightingBadge.textContent = currentLang === "hi"
                ? (isDark ? "🌙 कम रोशनी सुधार लागू" : "☀️ तेज रोशनी संतुलित")
                : (isDark ? "🌙 Low-Light Enhanced" : "☀️ Exposure Balanced");
        } else {
            lightingBadge.hidden = true;
        }
    }

    const localizedTitle = getDiseaseLocalizedName(pred.name, "hi");
    document.getElementById("disease-name").textContent = currentLang === "hi" ? localizedTitle : pred.name;
    document.getElementById("disease-hindi").textContent = currentLang === "hi" ? pred.name : localizedTitle;
    document.getElementById("disease-pathogen").textContent = pred.pathogen;
    document.getElementById("confidence-text").textContent = `${pred.confidence_percent}%`;

    const sevBadge = document.getElementById("severity-badge");
    sevBadge.textContent = getLocalizedSeverity(pred.severity, currentLang);
    sevBadge.style.backgroundColor = pred.badge_color || "#146c37";

    // Tab 1: Organic
    const organicList = document.getElementById("organic-remedies-list");
    organicList.innerHTML = (treat.organic_remedies || []).map(item => `
        <div class="remedy-card">
            <div class="remedy-title">🌿 ${escapeHtml(item)}</div>
        </div>
    `).join("") || `<p class="remedy-detail">${currentLang === "hi" ? "विशेष जैविक उपचार आवश्यक नहीं है।" : "No special organic intervention required."}</p>`;

    // Tab 2: Chemical & 15L Knapsack Sprayer
    const knapsackText = document.getElementById("knapsack-recipe-text");
    if (knapsackText) knapsackText.textContent = phd.knapsack_15l_recipe || "";

    const chemicalList = document.getElementById("chemical-treatments-list");
    if (treat.chemical_treatments && treat.chemical_treatments.length > 0) {
        chemicalList.innerHTML = treat.chemical_treatments.map(item => `
            <div class="remedy-card chemical">
                <div class="remedy-title">🧪 ${escapeHtml(item.chemical)}</div>
                <div class="remedy-dosage-tag">${currentLang === "hi" ? "मात्रा" : "Dosage"}: ${escapeHtml(item.dosage)}</div>
                <div class="remedy-detail">${currentLang === "hi" ? "विधि" : "Interval"}: ${escapeHtml(item.interval)}</div>
            </div>
        `).join("");
    } else {
        chemicalList.innerHTML = `<div class="remedy-card"><div class="remedy-detail">✅ ${currentLang === "hi" ? "रासायनिक छिड़काव की आवश्यकता नहीं है।" : "No chemical spray required."}</div></div>`;
    }

    // Tab 3: Pathology
    document.getElementById("phd-taxonomy-text").textContent = phd.taxonomy || `${pred.category} — ${pred.pathogen}`;
    document.getElementById("phd-epidemiology-text").textContent = phd.epidemiology || data.symptoms_and_causes?.causes || "";
    document.getElementById("phd-differential-text").textContent = phd.differential_diagnosis || data.symptoms_and_causes?.symptoms || "";
    document.getElementById("phd-icar-text").textContent = phd.icar_recommendation || "";

    // Tab 4: Soil & Nutrients
    const defContent = document.getElementById("deficiency-content");
    let defHTML = `
        <div class="remedy-card deficiency">
            <div class="remedy-title">🌱 ${currentLang === "hi" ? "खाद एवं पोषण सलाह" : "Fertilizer Recommendation"}</div>
            <div class="remedy-detail">${escapeHtml(treat.fertilizer_recommendation || "Balanced NPK nutrition.")}</div>
        </div>
    `;
    if (spectral.suspected_deficiencies && spectral.suspected_deficiencies.length > 0) {
        spectral.suspected_deficiencies.forEach(d => {
            defHTML += `
                <div class="remedy-card deficiency">
                    <div class="remedy-title">⚠️ ${escapeHtml(d.nutrient)} (${d.confidence}%)</div>
                    <div class="remedy-detail">${escapeHtml(d.reason)}</div>
                    <div class="remedy-detail"><strong>${currentLang === "hi" ? "उपाय" : "Correction"}:</strong> ${escapeHtml(d.guide.correction)}</div>
                </div>
            `;
        });
    }
    defContent.innerHTML = defHTML;

    // Tab 5: Preventive
    const prevList = document.getElementById("preventive-list");
    prevList.innerHTML = (treat.preventive_measures || []).map(item => `
        <div class="remedy-card">
            <div class="remedy-title">🛡️ ${escapeHtml(item)}</div>
        </div>
    `).join("");

    // Spectral Breakdown
    const greenPct = spectral.green_ratio_pct || 0;
    const yellowPct = spectral.yellow_chlorosis_pct || 0;
    const brownPct = spectral.brown_necrosis_pct || 0;

    document.getElementById("spectral-bar-green").style.width = `${greenPct}%`;
    document.getElementById("spectral-bar-yellow").style.width = `${yellowPct}%`;
    document.getElementById("spectral-bar-brown").style.width = `${brownPct}%`;

    document.getElementById("spectral-green").textContent = `${greenPct}%`;
    document.getElementById("spectral-yellow").textContent = `${yellowPct}%`;
    document.getElementById("spectral-brown").textContent = `${brownPct}%`;

    // Alternatives
    const altContainer = document.getElementById("alternatives-container");
    altContainer.innerHTML = (data.top_predictions || []).map(c => `
        <div class="alt-row">
            <span class="alt-label">${escapeHtml(c.label)}</span>
            <div class="alt-bar-bg">
                <div class="alt-bar-fill" style="width: ${c.confidence}%"></div>
            </div>
            <span class="alt-percent">${c.confidence}%</span>
        </div>
    `).join("");

    // Voice Narration
    const summaryText = currentLang === "hi"
        ? `${localizedTitle}। ${getLocalizedSeverity(pred.severity, "hi")}। ${phd.knapsack_15l_recipe || ""}`
        : pred.voice_summary;

    const btnVoice = document.getElementById("btn-voice-read");
    if (btnVoice) {
        btnVoice.onclick = () => {
            if (isSpeaking) stopAudio();
            else speakText(summaryText, currentLang === "hi" ? "hi-IN" : "en-IN");
        };
    }
}

/* ---------------- Actions ---------------- */
function initActions() {
    const btnWhatsapp = document.getElementById("btn-whatsapp");
    const btnPrint = document.getElementById("btn-print");

    if (btnWhatsapp) {
        btnWhatsapp.addEventListener("click", () => {
            if (!currentDiagnosisData) {
                alert(currentLang === "hi" ? "कृपया पहले पत्ती की जांच करें।" : "Please diagnose a photo first.");
                return;
            }
            const pred = currentDiagnosisData.prediction;
            const treat = currentDiagnosisData.treatment_plan;
            const phd = currentLang === "hi"
                ? (currentDiagnosisData.phd_pathology_hi || currentDiagnosisData.phd_pathology || {})
                : (currentDiagnosisData.phd_pathology || {});
            const topChemical = treat.chemical_treatments[0]?.chemical || (currentLang === "hi" ? "आवश्यकता नहीं" : "None required");
            const detectedCrop = currentDiagnosisData.crop || pred.crop || "Tomato";

            const msg = currentLang === "hi"
                ? `🌿 *किसान मित्र (Kisan Mitra) दवा पर्ची* 🌿\n\n` +
                  `📍 *फसल:* ${detectedCrop === "Potato" ? "आलू (Potato)" : "टमाटर (Tomato)"}\n` +
                  `🔍 *पहचान:* ${pred.hindi_name} (${pred.name})\n` +
                  `⚠️ *गंभीरता:* ${pred.severity}\n\n` +
                  `⚡ *15L स्प्रेयर पंप:* ${phd.knapsack_15l_recipe || ""}\n` +
                  `🧪 *रासायनिक दवा:* ${topChemical}\n` +
                  `🌱 *जैविक उपचार:* ${treat.organic_remedies[0] || "नीम का तेल (5ml/L)"}`
                : `🌿 *Kisan Mitra Crop Prescription* 🌿\n\n` +
                  `📍 *Crop:* ${detectedCrop}\n` +
                  `🔍 *Diagnosis:* ${pred.name} (${pred.hindi_name})\n` +
                  `⚠️ *Severity:* ${pred.severity}\n\n` +
                  `⚡ *15L Sprayer Pump:* ${phd.knapsack_15l_recipe || ""}\n` +
                  `🧪 *Chemical:* ${topChemical}\n` +
                  `🌱 *Organic:* ${treat.organic_remedies[0] || "Neem Oil 5ml/L"}`;

            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
        });
    }

    if (btnPrint) {
        btnPrint.addEventListener("click", () => window.print());
    }
}

/* ---------------- Disease Encyclopedia Modal (43 Conditions Lookup) ---------------- */
function initEncyclopedia() {
    const btnOpen = document.getElementById("btn-nav-diseases");
    const encDialog = document.getElementById("encyclopedia-modal");
    const btnClose = document.getElementById("encyclopedia-close");
    const searchInput = document.getElementById("enc-search");
    const filterBtns = document.querySelectorAll(".enc-filter-btn");

    if (!encDialog || !btnOpen) return;

    btnOpen.addEventListener("click", async () => {
        encDialog.showModal();
        if (!cachedDiseases) {
            try {
                const res = await fetch("/api/v1/diseases");
                const data = await res.json();
                cachedDiseases = data.diseases || [];
            } catch (err) {
                console.error("Failed to fetch diseases catalog:", err);
                cachedDiseases = [];
            }
        }
        renderEncyclopediaList();
    });

    if (btnClose) btnClose.addEventListener("click", () => encDialog.close());
    if (searchInput) searchInput.addEventListener("input", () => renderEncyclopediaList());

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderEncyclopediaList();
        });
    });
}

function renderEncyclopediaList() {
    const listEl = document.getElementById("enc-list");
    const searchInput = document.getElementById("enc-search");
    const activeFilterBtn = document.querySelector(".enc-filter-btn.active");
    if (!listEl || !cachedDiseases) return;

    const query = (searchInput?.value || "").toLowerCase().trim();
    const filter = activeFilterBtn?.getAttribute("data-filter") || "all";

    const filtered = cachedDiseases.filter(d => {
        const matchesCrop = filter === "all" || (d.crop || "").toLowerCase().includes(filter);
        if (!matchesCrop) return false;
        if (!query) return true;
        return (
            (d.name || "").toLowerCase().includes(query) ||
            (d.hindi_name || "").toLowerCase().includes(query) ||
            (d.pathogen || "").toLowerCase().includes(query) ||
            (d.symptoms || "").toLowerCase().includes(query)
        );
    });

    listEl.innerHTML = filtered.map(d => {
        const isPotato = (d.crop || "").toLowerCase() === "potato";
        const title = currentLang === "hi" ? (d.hindi_name || d.name) : d.name;
        const subtitle = currentLang === "hi" ? d.name : (d.pathogen || "");
        return `
            <button type="button" class="enc-item-card" data-disease-id="${escapeHtml(d.id)}">
                <div>
                    <div class="enc-item-title">${escapeHtml(title)}</div>
                    <div class="enc-item-meta">${escapeHtml(subtitle)} • ${escapeHtml(d.category || "")}</div>
                    <div class="enc-item-symptom">${escapeHtml(d.symptoms || "")}</div>
                </div>
                <span class="enc-item-crop ${isPotato ? "potato" : ""}">${isPotato ? (currentLang === "hi" ? "आलू" : "Potato") : (currentLang === "hi" ? "टमाटर" : "Tomato")}</span>
            </button>
        `;
    }).join("") || `<p style="text-align:center; padding: 20px; color: var(--text-muted);">${currentLang === "hi" ? "कोई रोग नहीं मिला।" : "No matching condition found."}</p>`;

    listEl.querySelectorAll(".enc-item-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-disease-id");
            const d = cachedDiseases.find(item => item.id === id);
            if (!d) return;

            const chemFirst = d.chemical_treatments?.[0];
            currentDiagnosisData = {
                status: "success",
                crop: d.crop || "Tomato",
                prediction: {
                    disease_id: d.id,
                    crop: d.crop || "Tomato",
                    name: d.name,
                    hindi_name: d.hindi_name,
                    confidence_percent: 100,
                    category: d.category,
                    severity: d.severity,
                    badge_color: d.badge_color,
                    pathogen: d.pathogen,
                    voice_summary: d.voice_summary
                },
                top_predictions: [{ class_index: 0, crop: d.crop, label: `${d.crop} - ${d.name}`, confidence: 100 }],
                phd_pathology: {
                    taxonomy: `${d.category} — ${d.pathogen}`,
                    epidemiology: d.causes,
                    differential_diagnosis: d.symptoms,
                    knapsack_15l_recipe: chemFirst
                        ? `Standard 15L Knapsack Sprayer: Dissolve recommended ${chemFirst.chemical} (${chemFirst.dosage}) cleanly in 15L water with 10ml wetting sticker.`
                        : "Standard 15L Knapsack Sprayer: Mix 60ml cold-pressed Neem Oil (10,000 ppm) + 15ml mild liquid soap in 15L water.",
                    icar_recommendation: "Follow 3-year non-solanaceous crop rotation and certified disease-free planting material."
                },
                phd_pathology_hi: {
                    taxonomy: `${d.category} — ${d.pathogen}`,
                    epidemiology: d.causes,
                    differential_diagnosis: `${d.hindi_name} — ${d.symptoms}`,
                    knapsack_15l_recipe: chemFirst
                        ? `मानक 15-लीटर स्प्रेयर पंप विधि: ${chemFirst.chemical} (${chemFirst.dosage}) को 15 लीटर साफ पानी व 10ml स्टीकर के साथ घोलकर समान छिड़काव करें।`
                        : "मानक 15-लीटर पंप: 60ml नीम तेल (10,000 ppm) और 15ml तरल साबुन 15 लीटर पानी में मिलाकर छिड़काव करें।",
                    icar_recommendation: "3-वर्षीय गैर-सोलेनेसी फसल चक्र और प्रमाणित रोगमुक्त बीज/कंद का उपयोग करें।"
                },
                symptoms_and_causes: { symptoms: d.symptoms, causes: d.causes },
                treatment_plan: {
                    organic_remedies: d.organic_remedies || [],
                    chemical_treatments: d.chemical_treatments || [],
                    preventive_measures: d.preventive_measures || [],
                    fertilizer_recommendation: d.fertilizer_recommendation || ""
                },
                spectral_deficiency_analysis: {
                    green_ratio_pct: 65,
                    yellow_chlorosis_pct: 20,
                    brown_necrosis_pct: 15,
                    suspected_deficiencies: []
                }
            };

            document.getElementById("encyclopedia-modal").close();
            renderDiagnosis(currentDiagnosisData);
        });
    });
}

/* ---------------- Native Modal Dialog Chat ---------------- */
function updateChatContextBanner() {
    const banner = document.getElementById("chat-context-banner");
    const bannerText = document.getElementById("chat-context-text");
    if (!banner || !bannerText) return;

    if (currentDiagnosisData && currentDiagnosisData.status === "success" && currentDiagnosisData.prediction?.name) {
        const pred = currentDiagnosisData.prediction;
        const name = currentLang === "hi" ? (pred.hindi_name || pred.name) : pred.name;
        banner.hidden = false;
        bannerText.textContent = currentLang === "hi"
            ? `सक्रिय जांच संदर्भ: ${name}`
            : `Discussing active diagnosis: ${name}`;
    } else {
        banner.hidden = true;
    }
}

function initChat() {
    const chatBtn = document.getElementById("floating-chat-btn");
    const btnNavChat = document.getElementById("btn-nav-chat");
    const chatDialog = document.getElementById("chat-modal");
    const chatClose = document.getElementById("chat-close");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");

    if (!chatDialog) return;

    const openChatModal = () => {
        updateChatContextBanner();
        if (!chatDialog.open) chatDialog.showModal();
    };

    if (chatBtn) chatBtn.addEventListener("click", openChatModal);
    if (btnNavChat) btnNavChat.addEventListener("click", openChatModal);
    if (chatClose) chatClose.addEventListener("click", () => chatDialog.close());

    const sendMsg = async () => {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;

        appendChatBubble(text, "user");
        chatInput.value = "";

        const typingId = appendTypingBubble();
        const diseaseContext = currentDiagnosisData?.status === "success"
            ? (currentDiagnosisData.prediction?.name || "")
            : "";

        try {
            const res = await fetch("/api/v1/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    disease_context: diseaseContext,
                    language: currentLang
                })
            });
            const data = await res.json();
            removeTypingBubble(typingId);
            appendChatBubble(data.reply, "bot");
        } catch (err) {
            removeTypingBubble(typingId);
            appendChatBubble(
                currentLang === "hi"
                    ? "सर्वर से संपर्क नहीं हो सका।"
                    : "Unable to reach Kisan AI advisor.",
                "bot"
            );
        }
    };

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            sendMsg();
        });
    }

    document.querySelectorAll(".quick-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const promptText = chip.textContent.trim() || chip.getAttribute("data-prompt");
            if (chatInput && promptText) {
                chatInput.value = promptText;
                sendMsg();
            }
        });
    });
}

/* ---------------- Fallback Light-Dismiss Across Dialogs ---------------- */
function initDialogLightDismissFallback() {
    if ("closedBy" in HTMLDialogElement.prototype) return;

    const isOutside = (e, dlg) => {
        const r = dlg.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    for (const dlg of document.querySelectorAll('dialog[closedby="any"]')) {
        let pressedOutside = false;
        dlg.addEventListener("pointerdown", (e) => { pressedOutside = isOutside(e, dlg); });
        dlg.addEventListener("pointerup", (e) => {
            if (pressedOutside && isOutside(e, dlg)) dlg.close();
        });
    }
}

function formatAdvisorMessage(rawText) {
    return escapeHtml(rawText)
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
}

function appendTypingBubble() {
    const chatMessages = document.getElementById("chat-messages");
    if (!chatMessages) return null;
    const id = `typing-${Date.now()}`;
    const bubble = document.createElement("div");
    bubble.id = id;
    bubble.className = "chat-bubble bot-bubble";
    bubble.textContent = currentLang === "hi" ? "किसान सलाहकार टाइप कर रहे हैं..." : "Kisan Advisor is typing...";
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

function removeTypingBubble(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
}

function appendChatBubble(text, type) {
    const chatMessages = document.getElementById("chat-messages");
    if (!chatMessages) return;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${type === "user" ? "user" : "bot-bubble"}`;

    if (type === "user") {
        bubble.textContent = text;
    } else {
        const bodyDiv = document.createElement("div");
        bodyDiv.className = "chat-bubble-body";
        bodyDiv.innerHTML = formatAdvisorMessage(text);
        bubble.appendChild(bodyDiv);

        const speakBtn = document.createElement("button");
        speakBtn.type = "button";
        speakBtn.className = "chat-speak-btn";
        speakBtn.textContent = currentLang === "hi" ? "🔊 सुनें" : "🔊 Listen";
        speakBtn.addEventListener("click", () => {
            const plain = text.replace(/\*\*/g, "").replace(/\*/g, "");
            if (typeof speakText === "function") {
                speakText(plain, currentLang === "hi" ? "hi-IN" : "en-IN");
            }
        });
        bubble.appendChild(speakBtn);
    }

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
