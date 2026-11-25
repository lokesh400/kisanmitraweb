/**
 * Kisan Mitra (किसान मित्र) - Web & Mobile Client Controller
 * Handles Camera feed, image capture, diagnosis API, voice readout, WhatsApp sharing, and chat.
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
    initSamples();
    initProtocolTabs();
    initActions();
    initChat();
});

/* ---------------- Crop Focus Setup ---------------- */
function initCropSelect() {
    const cropSelect = document.getElementById("crop-select");
    if (cropSelect) {
        cropSelect.addEventListener("change", () => {
            if (currentImageBlob) {
                executeDiagnosis(currentImageBlob);
            }
        });
    }
}

/* ---------------- Language Setup ---------------- */
function initLanguage() {
    const savedLang = localStorage.getItem("kisan_lang") || "en";
    const select = document.getElementById("lang-select");
    if (select) {
        select.value = savedLang;
        setLanguage(savedLang);
        select.addEventListener("change", (e) => {
            setLanguage(e.target.value);
            if (currentDiagnosisData) {
                renderDiagnosis(currentDiagnosisData);
            }
        });
    }
}

/* ---------------- Capture Mode Switcher ---------------- */
function initModeTabs() {
    const tabUpload = document.getElementById("tab-mode-upload");
    const tabCamera = document.getElementById("tab-mode-camera");
    const dropzoneSection = document.getElementById("dropzone-section");
    const cameraSection = document.getElementById("camera-section");

    tabUpload.addEventListener("click", () => {
        activeMode = "upload";
        tabUpload.classList.add("active");
        tabCamera.classList.remove("active");
        dropzoneSection.style.display = "block";
        cameraSection.style.display = "none";
        stopCameraStream();
    });

    tabCamera.addEventListener("click", () => {
        activeMode = "camera";
        tabCamera.classList.add("active");
        tabUpload.classList.remove("active");
        dropzoneSection.style.display = "none";
        cameraSection.style.display = "block";
        startCameraStream();
    });
}

/* ---------------- Dropzone & File Input ---------------- */
function initDropzone() {
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("file-input");
    const previewContainer = document.getElementById("preview-container");
    const imagePreview = document.getElementById("image-preview");
    const btnRemove = document.getElementById("btn-remove-preview");
    const btnDiagnose = document.getElementById("btn-diagnose");

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

    btnRemove.addEventListener("click", () => {
        currentImageBlob = null;
        fileInput.value = "";
        previewContainer.style.display = "none";
        dropzone.style.display = "flex";
        btnDiagnose.disabled = true;
    });

    btnDiagnose.addEventListener("click", () => {
        if (currentImageBlob) {
            executeDiagnosis(currentImageBlob);
        }
    });
}

function handleFileSelected(file) {
    if (!file.type.startsWith("image/")) {
        alert("Please upload an image file (JPEG, PNG, WebP).");
        return;
    }
    currentImageBlob = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewContainer = document.getElementById("preview-container");
        const imagePreview = document.getElementById("image-preview");
        const dropzone = document.getElementById("dropzone");
        const btnDiagnose = document.getElementById("btn-diagnose");

        imagePreview.src = e.target.result;
        previewContainer.style.display = "block";
        dropzone.style.display = "none";
        btnDiagnose.disabled = false;
        
        // Auto trigger diagnosis on sample or file upload
        executeDiagnosis(currentImageBlob);
    };
    reader.readAsDataURL(file);
}

/* ---------------- WebRTC Live Camera ---------------- */
function initCamera() {
    const btnSnap = document.getElementById("btn-snap-photo");
    const btnSwitchCam = document.getElementById("btn-switch-camera");
    let facingMode = "environment"; // default to rear camera on smartphones

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
            // Switch to preview mode
            activeMode = "upload";
            document.getElementById("tab-mode-upload").classList.add("active");
            document.getElementById("tab-mode-camera").classList.remove("active");
            document.getElementById("camera-section").style.display = "none";
            document.getElementById("dropzone-section").style.display = "block";

            handleFileSelected(new File([blob], "camera_leaf.jpg", { type: "image/jpeg" }));
        }, "image/jpeg", 0.92);
    });

    btnSwitchCam.addEventListener("click", () => {
        facingMode = facingMode === "environment" ? "user" : "environment";
        startCameraStream(facingMode);
    });
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
        video.srcObject = cameraStream;
        video.style.display = "block";
        guideBox.style.display = "block";
        await video.play();
    } catch (err) {
        console.warn("Camera access failed or denied:", err);
        alert("Camera access was blocked or is not available. You can use the 'Upload Photo' option or native camera.");
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

/* ---------------- Preloaded Samples ---------------- */
function initSamples() {
    const sampleChips = document.querySelectorAll(".sample-chip");
    sampleChips.forEach(chip => {
        chip.addEventListener("click", async () => {
            const url = chip.getAttribute("data-sample-url");
            if (!url) return;

            if (url.includes("potato")) {
                const cropSelect = document.getElementById("crop-select");
                if (cropSelect) cropSelect.value = "Potato";
            } else if (url.includes("tomato") || url.includes("early_blight") || url.includes("late_blight") || url.includes("bacterial_spot") || url.includes("yellow_leaf_curl") || url.includes("powdery_mildew")) {
                const cropSelect = document.getElementById("crop-select");
                if (cropSelect && cropSelect.value !== "Auto") cropSelect.value = "Tomato";
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

/* ---------------- Protocol Tabs ---------------- */
function initProtocolTabs() {
    const tabs = document.querySelectorAll(".proto-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

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

    emptyState.style.display = "none";
    resultDetails.style.display = "none";
    loadingState.style.display = "flex";
    btnDiagnose.disabled = true;

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
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        currentDiagnosisData = data;
        renderDiagnosis(data);
    } catch (err) {
        console.error("Diagnosis failure:", err);
        alert(`Diagnosis failed: ${err.message}. Ensure backend server is running.`);
        emptyState.style.display = "flex";
    } finally {
        loadingState.style.display = "none";
        btnDiagnose.disabled = false;
    }
}

/* ---------------- Render Diagnosis Results ---------------- */
function renderDiagnosis(data) {
    const resultDetails = document.getElementById("result-details");
    const emptyState = document.getElementById("empty-state");

    emptyState.style.display = "none";
    resultDetails.style.display = "block";

    // Handle Unclear Leaf Warning
    if (data.status === "unclear_leaf") {
        document.getElementById("disease-name").textContent = data.prediction.name;
        document.getElementById("disease-hindi").textContent = data.message || "कृपया पत्ते पर कैमरा केंद्रित करें।";
        document.getElementById("disease-pathogen").textContent = "Vegetation Detected: " + (data.vegetation_percentage || 0) + "% (Minimum required: 10%)";
        document.getElementById("confidence-text").textContent = "0%";
        
        const sevBadge = document.getElementById("severity-badge");
        sevBadge.textContent = "Unclear Photo";
        sevBadge.style.backgroundColor = "#ef4444";
        sevBadge.style.color = "#fff";

        document.getElementById("organic-remedies-list").innerHTML = `
            <div class="remedy-card" style="border-left-color: #ef4444;">
                <div class="remedy-title">⚠️ Photo Tip</div>
                <div class="remedy-detail">The uploaded photo does not contain enough plant leaf foliage. Make sure the leaf fills the camera frame and is well illuminated.</div>
            </div>
        `;
        document.getElementById("chemical-treatments-list").innerHTML = "<p class='remedy-detail'>No chemical advice for non-leaf photo.</p>";
        document.getElementById("deficiency-content").innerHTML = "<p class='remedy-detail'>Retake photo with clear leaf.</p>";
        document.getElementById("preventive-list").innerHTML = "<p class='remedy-detail'>Focus lens directly on the leaf blade.</p>";
        document.getElementById("alternatives-container").innerHTML = "";
        return;
    }

    const pred = data.prediction;
    const treat = data.treatment_plan;
    const spectral = data.spectral_deficiency_analysis;

    // Header info (Show crop prefix if non-tomato)
    const displayName = (data.crop && data.crop !== "Tomato" && !pred.name.startsWith(data.crop)) 
        ? `${data.crop} - ${pred.name}` 
        : pred.name;

    document.getElementById("disease-name").textContent = displayName;
    const localized = typeof getDiseaseLocalizedName === 'function' ? getDiseaseLocalizedName(pred.name, currentLang) : (pred.hindi_name || "");
    document.getElementById("disease-hindi").textContent = localized !== pred.name ? localized : (pred.hindi_name || "");
    document.getElementById("disease-pathogen").textContent = `Pathogen: ${pred.pathogen}`;
    document.getElementById("confidence-text").textContent = `${pred.confidence_percent}%`;

    // Severity Badge
    const sevBadge = document.getElementById("severity-badge");
    sevBadge.textContent = pred.severity;
    sevBadge.style.backgroundColor = pred.badge_color || "#10b981";
    sevBadge.style.color = "#fff";

    // Tab 1: Organic Remedies
    const organicList = document.getElementById("organic-remedies-list");
    organicList.innerHTML = treat.organic_remedies.map(item => `
        <div class="remedy-card">
            <div class="remedy-title">🌿 ${item}</div>
        </div>
    `).join("") || "<p class='remedy-detail'>No special organic intervention required.</p>";

    // Tab 2: Chemical Treatments & Dosages
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
        chemicalList.innerHTML = "<p class='remedy-detail'>No chemical pesticide needed. Crop is in good health.</p>";
    }

    // Tab 3: Nutrient & Deficiency Advice
    const defContent = document.getElementById("deficiency-content");
    let defHTML = `
        <div class="remedy-card deficiency">
            <div class="remedy-title">🌱 Fertilizer Recommendation</div>
            <div class="remedy-detail">${treat.fertilizer_recommendation || "Balanced NPK."}</div>
        </div>
    `;
    if (spectral.suspected_deficiencies && spectral.suspected_deficiencies.length > 0) {
        spectral.suspected_deficiencies.forEach(d => {
            defHTML += `
                <div class="remedy-card deficiency" style="border-left-color: #f59e0b;">
                    <div class="remedy-title">⚠️ Suspected ${d.nutrient} (${d.confidence}% Match)</div>
                    <div class="remedy-detail">${d.reason}</div>
                    <div class="remedy-detail" style="margin-top: 6px; color: #a7f3d0;"><strong>Correction:</strong> ${d.guide.correction}</div>
                </div>
            `;
        });
    }
    defContent.innerHTML = defHTML;

    // Tab 4: Preventive Care
    const prevList = document.getElementById("preventive-list");
    prevList.innerHTML = treat.preventive_measures.map(item => `
        <div class="remedy-card">
            <div class="remedy-title">🛡️ ${item}</div>
        </div>
    `).join("");

    // Spectral Stats
    document.getElementById("spectral-green").textContent = `${spectral.green_ratio_pct}%`;
    document.getElementById("spectral-yellow").textContent = `${spectral.yellow_chlorosis_pct}%`;
    document.getElementById("spectral-brown").textContent = `${spectral.brown_necrosis_pct}%`;

    // Alternatives Progress Breakdown
    const altContainer = document.getElementById("alternatives-container");
    altContainer.innerHTML = data.top_predictions.map(c => `
        <div class="alt-row">
            <span style="min-width: 140px;">${c.label}</span>
            <div class="alt-bar-bg">
                <div class="alt-bar-fill" style="width: ${c.confidence}%"></div>
            </div>
            <span style="font-weight: 700; width: 45px; text-align: right;">${c.confidence}%</span>
        </div>
    `).join("");

    // Auto update voice speech text
    const summaryText = currentLang === "hi" 
        ? `${pred.hindi_name}। गंभीरता: ${pred.severity}। तुरंत जैविक या रासायनिक उपचार करें।` 
        : pred.voice_summary;
    
    document.getElementById("btn-voice-read").onclick = () => {
        if (isSpeaking) {
            stopAudio();
        } else {
            speakText(summaryText, currentLang === "hi" ? "hi-IN" : "en-IN");
        }
    };
}

/* ---------------- WhatsApp & Prescription Print Actions ---------------- */
function initActions() {
    const btnWhatsapp = document.getElementById("btn-whatsapp");
    const btnPrint = document.getElementById("btn-print");
    const btnSdk = document.getElementById("btn-mobile-sdk");
    const modalSdk = document.getElementById("sdk-modal");
    const closeSdk = document.getElementById("close-sdk-modal");

    btnWhatsapp.addEventListener("click", () => {
        if (!currentDiagnosisData) {
            alert("Please diagnose a leaf first.");
            return;
        }
        const pred = currentDiagnosisData.prediction;
        const treat = currentDiagnosisData.treatment_plan;
        const topChemical = treat.chemical_treatments[0]?.chemical || "None required";
        const topDosage = treat.chemical_treatments[0]?.dosage || "";

        const detectedCrop = currentDiagnosisData.crop || pred.crop || "Tomato";
        const msg = `🌿 *Kisan Mitra (किसान मित्र) Crop Prescription* 🌿\n\n` +
            `📍 *Crop:* ${detectedCrop}\n` +
            `🔍 *Diagnosis:* ${pred.name} (${pred.hindi_name})\n` +
            `📊 *Confidence:* ${pred.confidence_percent}%\n` +
            `⚠️ *Severity:* ${pred.severity}\n\n` +
            `🧪 *Recommended Spray:* ${topChemical}\n` +
            `💧 *Dosage:* ${topDosage}\n` +
            `🌱 *Organic Remedy:* ${treat.organic_remedies[0] || "Neem Oil 5ml/L"}\n\n` +
            `_Generated by Kisan Mitra AI Platform (Tomato & Potato Specialist)_`;

        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, "_blank");
    });

    btnPrint.addEventListener("click", () => {
        window.print();
    });

    if (btnSdk && modalSdk) {
        btnSdk.addEventListener("click", () => modalSdk.style.display = "flex");
        closeSdk.addEventListener("click", () => modalSdk.style.display = "none");
        modalSdk.addEventListener("click", (e) => {
            if (e.target === modalSdk) modalSdk.style.display = "none";
        });
    }
}

/* ---------------- Kisan AI Chat Advisor ---------------- */
function initChat() {
    const chatBtn = document.getElementById("floating-chat-btn");
    const chatModal = document.getElementById("chat-modal");
    const chatClose = document.getElementById("chat-close");
    const chatSend = document.getElementById("chat-send");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    chatBtn.addEventListener("click", () => chatModal.style.display = "flex");
    chatClose.addEventListener("click", () => chatModal.style.display = "none");
    chatModal.addEventListener("click", (e) => {
        if (e.target === chatModal) chatModal.style.display = "none";
    });

    const sendMsg = async () => {
        const text = chatInput.value.trim();
        if (!text) return;

        // Append user bubble
        appendChatBubble(text, "user");
        chatInput.value = "";

        // Context
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
            appendChatBubble("Unable to reach Kisan AI server. Please verify backend connection.", "bot");
        }
    };

    chatSend.addEventListener("click", sendMsg);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMsg();
    });
}

function appendChatBubble(text, type) {
    const chatMessages = document.getElementById("chat-messages");
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${type}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
