/**
 * Kisan Mitra (किसान मित्र) — Client UI & Pathology Controller
 * Bilingual (English & Hindi), Accessible Tabs, Native Modal Dialog, PhD Diagnosis
 */

let currentImageBlob = null;
let currentDiagnosisData = null;
let cameraStream = null;
let activeMode = "upload";

document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initCropSelect();
    initModeTabs();
    initDropzone();
    initCamera();
    initProtocolTabs();
    initActions();
    initChat();
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

            if (cropSelect) {
                cropSelect.value = selectedCrop;
            }

            if (currentImageBlob) {
                executeDiagnosis(currentImageBlob);
            }
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
        });
    }

    if (btnHi) {
        btnHi.addEventListener("click", () => {
            setLanguage("hi");
            if (currentDiagnosisData) renderDiagnosis(currentDiagnosisData);
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
            activeMode = "upload";
            tabUpload.classList.add("active");
            tabCamera.classList.remove("active");
            tabUpload.setAttribute("aria-selected", "true");
            tabCamera.setAttribute("aria-selected", "false");
            if (dropzoneSection) dropzoneSection.style.display = "block";
            if (cameraSection) cameraSection.style.display = "none";
            stopCameraStream();
        });

        tabCamera.addEventListener("click", () => {
            activeMode = "camera";
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

/* ---------------- Upload Dropzone & Keyboard Accessibility ---------------- */
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
                activeMode = "upload";
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
            ? "कैमरा उपलब्ध नहीं है। कृपया 'फोटो अपलोड करें' का उपयोग करें।"
            : "Camera access is not available. Please use the 'Upload Photo' option.");
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

/* ---------------- Accessible Tablist (aria-selected + hidden + arrow keys) ---------------- */
function initProtocolTabs() {
    const tablist = document.querySelector(".protocol-tablist");
    const tabs = Array.from(document.querySelectorAll(".proto-tab"));
    if (!tablist || tabs.length === 0) return;

    const activateTab = (selectedTab, moveFocus = false) => {
        tabs.forEach(tab => {
            const isSelected = tab === selectedTab;
            tab.setAttribute("aria-selected", String(isSelected));
            const panelId = tab.getAttribute("data-tab");
            const panel = panelId ? document.getElementById(panelId) : null;
            if (panel) {
                panel.hidden = !isSelected;
                if (isSelected) {
                    panel.setAttribute("tabindex", "0");
                } else {
                    panel.removeAttribute("tabindex");
                }
            }
        });

        // Scroll only within tablist container cleanly
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

/* ---------------- Diagnosis Request ---------------- */
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
        btnDiagnose.innerHTML = `<span aria-hidden="true">⏳</span> <span>${getLocalizedText("btn_diagnosing", "Analyzing Pathology...")}</span>`;
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

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        currentDiagnosisData = data;
        renderDiagnosis(data);
    } catch (err) {
        console.error("Diagnosis failure:", err);
        alert(currentLang === "hi"
            ? `जांच विफल रही: ${err.message}`
            : `Diagnosis failed: ${err.message}. Please ensure the server is running.`);
        if (emptyState) emptyState.style.display = "flex";
    } finally {
        if (loadingState) loadingState.style.display = "none";
        if (btnDiagnose) {
            btnDiagnose.disabled = false;
            btnDiagnose.innerHTML = `<span aria-hidden="true">🔍</span> <span>${getLocalizedText("btn_diagnose", "Diagnose Crop Health")}</span>`;
        }
    }
}

/* ---------------- Render Diagnosis & Bilingual PhD Report ---------------- */
function renderDiagnosis(data) {
    const resultDetails = document.getElementById("result-details");
    const emptyState = document.getElementById("empty-state");

    if (emptyState) emptyState.style.display = "none";
    if (resultDetails) resultDetails.style.display = "block";

    if (data.status === "unclear_leaf") {
        document.getElementById("disease-name").textContent = currentLang === "hi"
            ? "पत्ती या फसल स्पष्ट नहीं दिखी"
            : data.prediction.name;
        document.getElementById("disease-hindi").textContent = data.message || "कृपया पत्ते या आलू पर कैमरा केंद्रित करें।";
        document.getElementById("disease-pathogen").textContent = `Vegetation Detected: ${data.vegetation_percentage || 0}% (Minimum required: 10%)`;
        document.getElementById("confidence-text").textContent = "0%";

        const sevBadge = document.getElementById("severity-badge");
        sevBadge.textContent = currentLang === "hi" ? "⚠️ अस्पष्ट फोटो" : "⚠️ Unclear Photo";
        sevBadge.style.backgroundColor = "#b91c1c";

        document.getElementById("organic-remedies-list").innerHTML = `
            <div class="remedy-card" style="border-inline-start-color: #b91c1c;">
                <div class="remedy-title">⚠️ ${currentLang === "hi" ? "फोटो निर्देश" : "Photography Guidance"}</div>
                <div class="remedy-detail">${currentLang === "hi"
                    ? "अपलोड की गई फोटो में पत्ती या आलू साफ नहीं दिख रहा है। कृपया पत्ते को करीब से और प्राकृतिक रोशनी में लें।"
                    : "The uploaded image does not show enough plant foliage or tuber texture. Frame the affected leaf closely in natural daylight."}</div>
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
            ? (cropLabel === "Potato" ? "🥔 आलू (POTATO)" : "🍅 टमाटर (TOMATO)")
            : (cropLabel === "Potato" ? "🥔 POTATO" : "🍅 TOMATO");
        cropBadge.style.backgroundColor = cropLabel === "Potato" ? "#b45309" : "#146c37";
    }

    const localizedTitle = getDiseaseLocalizedName(pred.name, "hi");
    document.getElementById("disease-name").textContent = currentLang === "hi" ? localizedTitle : pred.name;
    document.getElementById("disease-hindi").textContent = currentLang === "hi" ? pred.name : localizedTitle;
    document.getElementById("disease-pathogen").textContent = `${getLocalizedText("pathogen", "Pathogen")}: ${pred.pathogen}`;
    document.getElementById("confidence-text").textContent = `${pred.confidence_percent}%`;

    const sevBadge = document.getElementById("severity-badge");
    sevBadge.textContent = getLocalizedSeverity(pred.severity, currentLang);
    sevBadge.style.backgroundColor = pred.badge_color || "#146c37";

    // Tab 1: Organic Remedies
    const organicList = document.getElementById("organic-remedies-list");
    organicList.innerHTML = (treat.organic_remedies || []).map(item => `
        <div class="remedy-card">
            <div class="remedy-title">🌿 ${escapeHtml(item)}</div>
        </div>
    `).join("") || `<p class="remedy-detail">${currentLang === "hi" ? "विशेष जैविक उपचार आवश्यक नहीं है।" : "No special organic intervention required."}</p>`;

    // Tab 2: Chemical Treatments & 15L Knapsack Sprayer Recipe
    const knapsackText = document.getElementById("knapsack-recipe-text");
    if (knapsackText) {
        knapsackText.textContent = phd.knapsack_15l_recipe || "";
    }

    const chemicalList = document.getElementById("chemical-treatments-list");
    if (treat.chemical_treatments && treat.chemical_treatments.length > 0) {
        chemicalList.innerHTML = treat.chemical_treatments.map(item => `
            <div class="remedy-card chemical">
                <div class="remedy-title">🧪 ${escapeHtml(item.chemical)}</div>
                <div class="remedy-dosage-tag">${currentLang === "hi" ? "मात्रा" : "Dosage"}: ${escapeHtml(item.dosage)}</div>
                <div class="remedy-detail">${currentLang === "hi" ? "विधि/अंतराल" : "Interval"}: ${escapeHtml(item.interval)}</div>
            </div>
        `).join("");
    } else {
        chemicalList.innerHTML = `<div class="remedy-card"><div class="remedy-detail">✅ ${currentLang === "hi" ? "रासायनिक छिड़काव की आवश्यकता नहीं है। फसल स्वस्थ है।" : "No chemical spray needed. Crop condition appears healthy."}</div></div>`;
    }

    // Tab 3: PhD Pathology Panel
    document.getElementById("phd-taxonomy-text").textContent = phd.taxonomy || `${pred.category} — ${pred.pathogen}`;
    document.getElementById("phd-epidemiology-text").textContent = phd.epidemiology || data.symptoms_and_causes?.causes || "";
    document.getElementById("phd-differential-text").textContent = phd.differential_diagnosis || data.symptoms_and_causes?.symptoms || "";
    document.getElementById("phd-icar-text").textContent = phd.icar_recommendation || "";

    // Tab 4: Nutrient & Soil Health
    const defContent = document.getElementById("deficiency-content");
    let defHTML = `
        <div class="remedy-card deficiency">
            <div class="remedy-title">🌱 ${currentLang === "hi" ? "उर्वरक एवं पोषण अनुशंसा" : "Soil & Fertilizer Recommendation"}</div>
            <div class="remedy-detail">${escapeHtml(treat.fertilizer_recommendation || "Balanced NPK nutrition.")}</div>
        </div>
    `;
    if (spectral.suspected_deficiencies && spectral.suspected_deficiencies.length > 0) {
        spectral.suspected_deficiencies.forEach(d => {
            defHTML += `
                <div class="remedy-card deficiency">
                    <div class="remedy-title">⚠️ ${currentLang === "hi" ? "संभावित पोषक कमी" : "Suspected Deficiency"}: ${escapeHtml(d.nutrient)} (${d.confidence}%)</div>
                    <div class="remedy-detail">${escapeHtml(d.reason)}</div>
                    <div class="remedy-detail"><strong>${currentLang === "hi" ? "सुधार उपाय" : "Correction"}:</strong> ${escapeHtml(d.guide.correction)}</div>
                </div>
            `;
        });
    }
    defContent.innerHTML = defHTML;

    // Tab 5: Preventive Care
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

    // Alternatives Progress Bars
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

/* ---------------- Actions (WhatsApp, Print, Helpline Button) ---------------- */
function initActions() {
    const btnWhatsapp = document.getElementById("btn-whatsapp");
    const btnPrint = document.getElementById("btn-print");
    const btnNavChat = document.getElementById("btn-nav-chat");
    const chatDialog = document.getElementById("chat-modal");

    if (btnNavChat && chatDialog) {
        btnNavChat.addEventListener("click", () => chatDialog.showModal());
    }

    if (btnWhatsapp) {
        btnWhatsapp.addEventListener("click", () => {
            if (!currentDiagnosisData) {
                alert(currentLang === "hi" ? "कृपया पहले पत्ती की जांच करें।" : "Please diagnose a crop leaf first.");
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
                ? `🌿 *किसान मित्र (Kisan Mitra) फसल रोग पर्ची* 🌿\n\n` +
                  `📍 *फसल:* ${detectedCrop === "Potato" ? "आलू (Potato)" : "टमाटर (Tomato)"}\n` +
                  `🔍 *पहचान:* ${pred.hindi_name} (${pred.name})\n` +
                  `📊 *सटीकता:* ${pred.confidence_percent}%\n` +
                  `⚠️ *गंभीरता:* ${pred.severity}\n\n` +
                  `⚡ *15L स्प्रेयर पंप माप:* ${phd.knapsack_15l_recipe || ""}\n` +
                  `🧪 *रासायनिक दवा:* ${topChemical}\n` +
                  `🌱 *जैविक उपचार:* ${treat.organic_remedies[0] || "नीम का तेल (5ml/L)"}\n\n` +
                  `_किसान मित्र पीएचडी पौध रोग विज्ञान डॉक्टर द्वारा प्रमाणित_`
                : `🌿 *Kisan Mitra (किसान मित्र) Crop Prescription* 🌿\n\n` +
                  `📍 *Crop:* ${detectedCrop}\n` +
                  `🔍 *Diagnosis:* ${pred.name} (${pred.hindi_name})\n` +
                  `📊 *Accuracy:* ${pred.confidence_percent}%\n` +
                  `⚠️ *Severity:* ${pred.severity}\n\n` +
                  `⚡ *15L Knapsack Pump Recipe:* ${phd.knapsack_15l_recipe || ""}\n` +
                  `🧪 *Prescribed Chemical:* ${topChemical}\n` +
                  `🌱 *Organic Remedy:* ${treat.organic_remedies[0] || "Neem Oil 5ml/L"}\n\n` +
                  `_Verified by Kisan Mitra Tomato & Potato Pathology Doctor_`;

            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
        });
    }

    if (btnPrint) {
        btnPrint.addEventListener("click", () => window.print());
    }
}

/* ---------------- Native Modal Dialog (<dialog>) Kisan AI Chat ---------------- */
function initChat() {
    const chatBtn = document.getElementById("floating-chat-btn");
    const chatDialog = document.getElementById("chat-modal");
    const chatClose = document.getElementById("chat-close");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");

    if (!chatDialog) return;

    if (chatBtn) {
        chatBtn.addEventListener("click", () => chatDialog.showModal());
    }
    if (chatClose) {
        chatClose.addEventListener("click", () => chatDialog.close());
    }

    // Light-dismiss fallback for browsers without <dialog closedby="any">
    if (!("closedBy" in HTMLDialogElement.prototype)) {
        const isOutside = (e, dlg) => {
            const r = dlg.getBoundingClientRect();
            return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        };
        let pressedOutside = false;
        chatDialog.addEventListener("pointerdown", (e) => { pressedOutside = isOutside(e, chatDialog); });
        chatDialog.addEventListener("pointerup", (e) => {
            if (pressedOutside && isOutside(e, chatDialog)) chatDialog.close();
        });
    }

    const sendMsg = async () => {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;

        appendChatBubble(text, "user");
        chatInput.value = "";

        const diseaseContext = currentDiagnosisData ? currentDiagnosisData.prediction.name : "";

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
            appendChatBubble(data.reply, "bot");
        } catch (err) {
            appendChatBubble(
                currentLang === "hi"
                    ? "सर्वर से संपर्क नहीं हो सका। कृपया जांचें कि सर्वर चालू है।"
                    : "Unable to reach Kisan AI advisor. Please verify server connection.",
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

    // Quick prompt chips
    const quickChips = document.querySelectorAll(".quick-chip");
    quickChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const promptText = chip.textContent.trim() || chip.getAttribute("data-prompt");
            if (chatInput && promptText) {
                chatInput.value = promptText;
                sendMsg();
            }
        });
    });
}

function appendChatBubble(text, type) {
    const chatMessages = document.getElementById("chat-messages");
    if (!chatMessages) return;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${type === "user" ? "user" : "bot-bubble"}`;
    bubble.textContent = text;
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
