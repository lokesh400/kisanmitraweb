/**
 * Kisan Mitra (किसान मित्र) - Web Client Controller
 * Human-Crafted Light Theme & PhD-Grade Agronomic Doctor
 * Strictly English & Hindi Language Support
 */

let currentImageBlob = null;
let currentDiagnosisData = null;
let cameraStream = null;
let activeMode = "upload"; // 'upload' or 'camera'

document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initCropSelect();
    initModeTabs();
    initDropzone();
    initCamera();
    initQuickSamples();
    initProtocolTabs();
    initActions();
    initChat();
});

/* ---------------- Crop Focus Setup (Pill Group) ---------------- */
function initCropSelect() {
    const cropPills = document.querySelectorAll(".crop-btn, .crop-pill");
    const cropSelect = document.getElementById("crop-select");

    cropPills.forEach(pill => {
        pill.addEventListener("click", () => {
            cropPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            const selectedCrop = pill.getAttribute("data-crop") || "Auto";
            if (cropSelect) {
                cropSelect.value = selectedCrop;
            }

            if (currentImageBlob) {
                executeDiagnosis(currentImageBlob);
            }
        });
    });
}

/* ---------------- 2-Language Setup (English / Hindi only) ---------------- */
function initLanguage() {
    const savedLang = localStorage.getItem("kisan_lang") || "en";
    setLanguage(savedLang);

    const btnEn = document.getElementById("lang-btn-en");
    const btnHi = document.getElementById("lang-btn-hi");

    if (btnEn) {
        btnEn.addEventListener("click", () => {
            setLanguage("en");
            if (currentDiagnosisData) {
                renderDiagnosis(currentDiagnosisData);
            }
        });
    }

    if (btnHi) {
        btnHi.addEventListener("click", () => {
            setLanguage("hi");
            if (currentDiagnosisData) {
                renderDiagnosis(currentDiagnosisData);
            }
        });
    }
}

/* ---------------- Capture Mode Switcher (Upload vs Camera) ---------------- */
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
            if (dropzoneSection) dropzoneSection.style.display = "block";
            if (cameraSection) cameraSection.style.display = "none";
            stopCameraStream();
        });

        tabCamera.addEventListener("click", () => {
            activeMode = "camera";
            tabCamera.classList.add("active");
            tabUpload.classList.remove("active");
            if (dropzoneSection) dropzoneSection.style.display = "none";
            if (cameraSection) cameraSection.style.display = "block";
            startCameraStream();
        });
    }
}

/* ---------------- Dropzone & File Input ---------------- */
function initDropzone() {
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("file-input");
    const previewContainer = document.getElementById("preview-container");
    const imagePreview = document.getElementById("image-preview");
    const btnRemove = document.getElementById("btn-remove-preview");
    const btnDiagnose = document.getElementById("btn-diagnose");

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelected(e.target.files[0]);
        }
    });

    // Drag & Drop
    ["dragenter", "dragover"].forEach(name => {
        dropzone.addEventListener(name, (e) => {
            e.preventDefault();
            dropzone.classList.add("dragover");
        });
    });

    ["dragleave", "drop"].forEach(name => {
        dropzone.addEventListener(name, (e) => {
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
            if (currentImageBlob) {
                executeDiagnosis(currentImageBlob);
            }
        });
    }
}

function handleFileSelected(file) {
    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file (JPEG, PNG, WebP).");
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

        // Auto trigger diagnosis on selection
        executeDiagnosis(currentImageBlob);
    };
    reader.readAsDataURL(file);
}

/* ---------------- WebRTC Live Camera ---------------- */
function initCamera() {
    const btnSnap = document.getElementById("btn-snap-photo");
    const btnSwitchCam = document.getElementById("btn-switch-camera");
    let facingMode = "environment"; // default to rear camera

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

                if (tabUpload) tabUpload.classList.add("active");
                if (tabCamera) tabCamera.classList.remove("active");
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
        const constraints = {
            video: {
                facingMode: { ideal: facing },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (video) {
            video.srcObject = cameraStream;
            video.style.display = "block";
            await video.play();
        }
        if (guideBox) guideBox.style.display = "block";
    } catch (err) {
        console.warn("Camera access failed or denied:", err);
        alert(currentLang === "hi" 
            ? "कैमरा उपलब्ध नहीं है। कृपया 'फोटो अपलोड करें' विकल्प का उपयोग करें।"
            : "Camera access is not available or blocked. Please use the 'Upload Photo' option.");
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

/* ---------------- Quick Reference Samples ---------------- */
function initQuickSamples() {
    const samplePills = document.querySelectorAll(".sample-pill, .sample-chip");
    samplePills.forEach(pill => {
        pill.addEventListener("click", async () => {
            const url = pill.getAttribute("data-sample-url");
            if (!url) return;

            // Auto-select crop
            const cropButtons = document.querySelectorAll(".crop-btn, .crop-pill");
            const cropSelect = document.getElementById("crop-select");

            if (url.includes("potato")) {
                cropButtons.forEach(b => b.classList.toggle("active", b.getAttribute("data-crop") === "Potato"));
                if (cropSelect) cropSelect.value = "Potato";
            } else if (url.includes("tomato") || url.includes("early_blight") || url.includes("late_blight") || url.includes("bacterial_spot") || url.includes("powdery_mildew")) {
                cropButtons.forEach(b => b.classList.toggle("active", b.getAttribute("data-crop") === "Tomato"));
                if (cropSelect) cropSelect.value = "Tomato";
            }

            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const file = new File([blob], url.split("/").pop(), { type: blob.type || "image/jpeg" });
                handleFileSelected(file);
            } catch (err) {
                console.error("Error loading sample:", err);
            }
        });
    });
}

/* ---------------- Protocol Tabs (5 Tabs) ---------------- */
function initProtocolTabs() {
    const tabs = document.querySelectorAll(".proto-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-pane, .tab-content").forEach(p => p.classList.remove("active"));

            tab.classList.add("active");
            const targetId = tab.getAttribute("data-tab");
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add("active");
        });
    });
}

/* ---------------- Diagnosis API Execution ---------------- */
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
        btnDiagnose.innerHTML = `⏳ <span>${getLocalizedText("btn_diagnosing", "Analyzing Pathology...")}</span>`;
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
            throw new Error(`Server status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        currentDiagnosisData = data;
        renderDiagnosis(data);
    } catch (err) {
        console.error("Diagnosis failure:", err);
        alert(`Diagnosis failed: ${err.message}. Please verify server connection.`);
        if (emptyState) emptyState.style.display = "flex";
    } finally {
        if (loadingState) loadingState.style.display = "none";
        if (btnDiagnose) {
            btnDiagnose.disabled = false;
            btnDiagnose.innerHTML = `🔍 <span>${getLocalizedText("btn_diagnose", "Diagnose Crop Health")}</span>`;
        }
    }
}

/* ---------------- Render Diagnosis & PhD Report ---------------- */
function renderDiagnosis(data) {
    const resultDetails = document.getElementById("result-details");
    const emptyState = document.getElementById("empty-state");

    if (emptyState) emptyState.style.display = "none";
    if (resultDetails) resultDetails.style.display = "block";

    // Handle Unclear Leaf Warning
    if (data.status === "unclear_leaf") {
        document.getElementById("disease-name").textContent = data.prediction.name;
        document.getElementById("disease-hindi").textContent = data.message || "कृपया पत्ते पर कैमरा केंद्रित करें।";
        document.getElementById("disease-pathogen").textContent = "Vegetation Detected: " + (data.vegetation_percentage || 0) + "% (Minimum required: 10%)";
        document.getElementById("confidence-text").textContent = "0%";
        
        const sevBadge = document.getElementById("severity-badge");
        sevBadge.textContent = "Unclear Photo";
        sevBadge.style.backgroundColor = "#dc2626";

        document.getElementById("organic-remedies-list").innerHTML = `
            <div class="remedy-card" style="border-left-color: #dc2626;">
                <div class="remedy-title">⚠️ Photo Tip</div>
                <div class="remedy-detail">The uploaded photo does not contain enough plant leaf foliage. Make sure the leaf fills the camera frame and is well illuminated in natural daylight.</div>
            </div>
        `;
        document.getElementById("chemical-treatments-list").innerHTML = "<p class='remedy-detail'>No chemical advice for non-leaf photo.</p>";
        document.getElementById("knapsack-recipe-text").textContent = "Please upload a clear leaf photo to generate 15L sprayer recipe.";
        document.getElementById("phd-taxonomy-text").textContent = "N/A";
        document.getElementById("phd-epidemiology-text").textContent = "N/A";
        document.getElementById("phd-differential-text").textContent = "N/A";
        document.getElementById("phd-icar-text").textContent = "N/A";
        document.getElementById("deficiency-content").innerHTML = "<p class='remedy-detail'>Retake photo with clear leaf blade.</p>";
        document.getElementById("preventive-list").innerHTML = "<p class='remedy-detail'>Focus lens directly on affected plant area.</p>";
        document.getElementById("alternatives-container").innerHTML = "";
        return;
    }

    const pred = data.prediction;
    const treat = data.treatment_plan;
    const spectral = data.spectral_deficiency_analysis;
    const phd = data.phd_pathology || {};

    // Crop Badge & Title
    const cropBadge = document.getElementById("disease-crop-badge");
    if (cropBadge) {
        cropBadge.textContent = (data.crop || pred.crop || "TOMATO").toUpperCase();
        cropBadge.style.backgroundColor = (data.crop === "Potato") ? "#d97706" : "#15803d";
    }

    const localized = typeof getDiseaseLocalizedName === 'function' ? getDiseaseLocalizedName(pred.name, currentLang) : (pred.hindi_name || "");
    document.getElementById("disease-name").textContent = pred.name;
    document.getElementById("disease-hindi").textContent = localized !== pred.name ? localized : (pred.hindi_name || "");
    document.getElementById("disease-pathogen").textContent = `Pathogen: ${pred.pathogen}`;
    document.getElementById("confidence-text").textContent = `${pred.confidence_percent}%`;

    // Severity Badge
    const sevBadge = document.getElementById("severity-badge");
    sevBadge.textContent = pred.severity;
    sevBadge.style.backgroundColor = pred.badge_color || "#15803d";

    // Tab 1: Organic Remedies
    const organicList = document.getElementById("organic-remedies-list");
    organicList.innerHTML = treat.organic_remedies.map(item => `
        <div class="remedy-card">
            <div class="remedy-title">🌿 ${item}</div>
        </div>
    `).join("") || "<p class='remedy-detail'>No special organic intervention required.</p>";

    // Tab 2: Chemical Treatments & 15L Knapsack Sprayer Pump Recipe
    const knapsackText = document.getElementById("knapsack-recipe-text");
    if (knapsackText) {
        knapsackText.textContent = phd.knapsack_15l_recipe || "Dissolve recommended fungicide in 15 Liters clean water with 10ml wetting agent/sticker. Spray thoroughly during early morning hours.";
    }

    const chemicalList = document.getElementById("chemical-treatments-list");
    if (treat.chemical_treatments && treat.chemical_treatments.length > 0) {
        chemicalList.innerHTML = treat.chemical_treatments.map(item => `
            <div class="remedy-card chemical">
                <div class="remedy-title">🧪 ${item.chemical}</div>
                <div class="remedy-dosage-tag">Dosage: ${item.dosage}</div>
                <div class="remedy-detail" style="margin-top: 6px;">Interval: ${item.interval}</div>
            </div>
        `).join("");
    } else {
        chemicalList.innerHTML = "<p class='remedy-detail'>No chemical pesticide needed. Crop is in healthy condition.</p>";
    }

    // Tab 3: PhD Pathology Panel
    const taxText = document.getElementById("phd-taxonomy-text");
    const epiText = document.getElementById("phd-epidemiology-text");
    const diffText = document.getElementById("phd-differential-text");
    const icarText = document.getElementById("phd-icar-text");

    if (taxText) taxText.textContent = phd.taxonomy || `${pred.category} — ${pred.pathogen}`;
    if (epiText) epiText.textContent = phd.epidemiology || (data.symptoms_and_causes ? data.symptoms_and_causes.causes : "Warm, humid weather triggers pathogen multiplication.");
    if (diffText) diffText.textContent = phd.differential_diagnosis || "Distinctive target lesions or water-soaked necrotic patches characteristic of this solanaceous condition.";
    if (icarText) icarText.textContent = phd.icar_recommendation || "Maintain 3-year non-solanaceous crop rotation, destroy infected debris post-harvest, and use certified disease-free seed/tubers.";

    // Tab 4: Deficiency & Soil Health
    const defContent = document.getElementById("deficiency-content");
    let defHTML = `
        <div class="remedy-card deficiency">
            <div class="remedy-title">🌱 Soil & Fertilizer Recommendation</div>
            <div class="remedy-detail">${treat.fertilizer_recommendation || "Balanced NPK (19:19:19) foliar nutrition."}</div>
        </div>
    `;
    if (spectral.suspected_deficiencies && spectral.suspected_deficiencies.length > 0) {
        spectral.suspected_deficiencies.forEach(d => {
            defHTML += `
                <div class="remedy-card deficiency" style="border-left-color: #d97706;">
                    <div class="remedy-title">⚠️ Suspected ${d.nutrient} (${d.confidence}% Match)</div>
                    <div class="remedy-detail">${d.reason}</div>
                    <div class="remedy-detail" style="margin-top: 6px; color: #15803d; font-weight: 600;"><strong>Correction:</strong> ${d.guide.correction}</div>
                </div>
            `;
        });
    }
    defContent.innerHTML = defHTML;

    // Tab 5: Preventive Measures
    const prevList = document.getElementById("preventive-list");
    prevList.innerHTML = treat.preventive_measures.map(item => `
        <div class="remedy-card">
            <div class="remedy-title">🛡️ ${item}</div>
        </div>
    `).join("");

    // Spectral Stats & Stacked Bar
    const greenPct = spectral.green_ratio_pct || 0;
    const yellowPct = spectral.yellow_chlorosis_pct || 0;
    const brownPct = spectral.brown_necrosis_pct || 0;

    const barGreen = document.getElementById("spectral-bar-green");
    const barYellow = document.getElementById("spectral-bar-yellow");
    const barBrown = document.getElementById("spectral-bar-brown");

    if (barGreen) barGreen.style.width = `${greenPct}%`;
    if (barYellow) barYellow.style.width = `${yellowPct}%`;
    if (barBrown) barBrown.style.width = `${brownPct}%`;

    document.getElementById("spectral-green").textContent = `${greenPct}%`;
    document.getElementById("spectral-yellow").textContent = `${yellowPct}%`;
    document.getElementById("spectral-brown").textContent = `${brownPct}%`;

    // Differential Alternatives Progress Breakdown
    const altContainer = document.getElementById("alternatives-container");
    altContainer.innerHTML = data.top_predictions.map(c => `
        <div class="alt-row">
            <span class="alt-label">${c.label}</span>
            <div class="alt-bar-bg">
                <div class="alt-bar-fill" style="width: ${c.confidence}%"></div>
            </div>
            <span class="alt-percent">${c.confidence}%</span>
        </div>
    `).join("");

    // Voice Narration Setup
    const summaryText = currentLang === "hi" 
        ? `${pred.hindi_name}। रोग की गंभीरता: ${pred.severity}। तुरंत 15 लीटर पंप दवा या जैविक उपचार करें।` 
        : pred.voice_summary;
    
    const btnVoice = document.getElementById("btn-voice-read");
    if (btnVoice) {
        btnVoice.onclick = () => {
            if (isSpeaking) {
                stopAudio();
            } else {
                speakText(summaryText, currentLang === "hi" ? "hi-IN" : "en-IN");
            }
        };
    }
}

/* ---------------- WhatsApp & Actions ---------------- */
function initActions() {
    const btnWhatsapp = document.getElementById("btn-whatsapp");
    const btnPrint = document.getElementById("btn-print");
    const btnNavChat = document.getElementById("btn-nav-chat");
    const chatModal = document.getElementById("chat-modal");

    if (btnNavChat && chatModal) {
        btnNavChat.addEventListener("click", () => {
            chatModal.style.display = "flex";
        });
    }

    if (btnWhatsapp) {
        btnWhatsapp.addEventListener("click", () => {
            if (!currentDiagnosisData) {
                alert(currentLang === "hi" ? "कृपया पहले पत्ती की जांच करें।" : "Please diagnose a crop leaf first.");
                return;
            }
            const pred = currentDiagnosisData.prediction;
            const treat = currentDiagnosisData.treatment_plan;
            const phd = currentDiagnosisData.phd_pathology || {};
            const topChemical = treat.chemical_treatments[0]?.chemical || "None required";
            const detectedCrop = currentDiagnosisData.crop || pred.crop || "Tomato";

            const msg = (currentLang === "hi")
                ? `🌿 *किसान मित्र (Kisan Mitra) कृषि दवा पर्ची* 🌿\n\n` +
                  `📍 *फसल:* ${detectedCrop === "Potato" ? "आलू (Potato)" : "टमाटर (Tomato)"}\n` +
                  `🔍 *रोग की पहचान:* ${pred.name} (${pred.hindi_name})\n` +
                  `📊 *सटीकता:* ${pred.confidence_percent}%\n` +
                  `⚠️ *गंभीरता:* ${pred.severity}\n\n` +
                  `⚡ *15L स्प्रेयर पंप माप:* ${phd.knapsack_15l_recipe || "35-40g दवा प्रति 15 लीटर पानी"}\n` +
                  `🧪 *रासायनिक दवा:* ${topChemical}\n` +
                  `🌱 *जैविक उपचार:* ${treat.organic_remedies[0] || "नीम का तेल (5ml/L)"}\n\n` +
                  `_किसान मित्र पौध रोग विज्ञान डॉक्टर द्वारा प्रमाणित_`
                : `🌿 *Kisan Mitra (किसान मित्र) Crop Prescription* 🌿\n\n` +
                  `📍 *Crop:* ${detectedCrop}\n` +
                  `🔍 *Diagnosis:* ${pred.name} (${pred.hindi_name})\n` +
                  `📊 *Accuracy:* ${pred.confidence_percent}%\n` +
                  `⚠️ *Severity:* ${pred.severity}\n\n` +
                  `⚡ *15L Knapsack Pump Recipe:* ${phd.knapsack_15l_recipe || "35-40g per 15L water tank"}\n` +
                  `🧪 *Prescribed Chemical:* ${topChemical}\n` +
                  `🌱 *Organic Remedy:* ${treat.organic_remedies[0] || "Neem Oil 5ml/L"}\n\n` +
                  `_Verified by Kisan Mitra Tomato & Potato AI Doctor_`;

            const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, "_blank");
        });
    }

    if (btnPrint) {
        btnPrint.addEventListener("click", () => {
            window.print();
        });
    }
}

/* ---------------- Kisan AI Chat Advisor & Quick Prompts ---------------- */
function initChat() {
    const chatBtn = document.getElementById("floating-chat-btn");
    const chatModal = document.getElementById("chat-modal");
    const chatClose = document.getElementById("chat-close");
    const chatSend = document.getElementById("chat-send");
    const chatInput = document.getElementById("chat-input");

    if (chatBtn && chatModal) {
        chatBtn.addEventListener("click", () => chatModal.style.display = "flex");
    }
    if (chatClose && chatModal) {
        chatClose.addEventListener("click", () => chatModal.style.display = "none");
    }
    if (chatModal) {
        chatModal.addEventListener("click", (e) => {
            if (e.target === chatModal) chatModal.style.display = "none";
        });
    }

    // Quick prompt pills
    const quickChips = document.querySelectorAll(".quick-prompt-chip");
    quickChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const promptText = chip.getAttribute("data-prompt") || chip.textContent.trim();
            if (chatInput) {
                chatInput.value = promptText;
                sendMsg();
            }
        });
    });

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
            appendChatBubble(currentLang === "hi" 
                ? "सर्वर से संपर्क नहीं हो सका। कृपया जांचें कि बैकएंड चालू है।" 
                : "Unable to reach Kisan AI advisor. Please verify server connection.", "bot");
        }
    };

    if (chatSend) chatSend.addEventListener("click", sendMsg);
    if (chatInput) {
        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") sendMsg();
        });
    }
}

function appendChatBubble(text, type) {
    const chatMessages = document.getElementById("chat-messages");
    if (!chatMessages) return;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${type}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
