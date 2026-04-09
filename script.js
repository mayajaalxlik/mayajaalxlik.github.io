window.addEventListener('load', () => {
    const loader = document.getElementById('loaderView');
    const home = document.getElementById('homeView');
    setTimeout(() => {
        loader.classList.remove('show-view');
        setTimeout(() => {
            loader.classList.add('hidden-view');
            home.classList.remove('hidden-view');
            setTimeout(() => {
                home.classList.add('show-view');
            }, 50);
        }, 800);
    }, 2000);
});
function goToMeter() {
    const home = document.getElementById('homeView');
    const meter = document.getElementById('meterView');
    home.classList.remove('show-view');
    setTimeout(() => {
        home.classList.add('hidden-view');
        meter.classList.remove('hidden-view');
        setTimeout(() => {
            meter.classList.add('show-view');
            resetChars();
        }, 50);
    }, 800);
}
function animateChar(charId) {
    const leftChars = document.querySelectorAll('.char-left, .mobile-char-left');
    const rightChars = document.querySelectorAll('.char-right, .mobile-char-right');
    const activeCircle = document.getElementById(charId === 'p' ? 'char_p' : 'char_k');
    resetChars();
    if (activeCircle) {
        activeCircle.style.transform = "scale(1.3) translateY(-5px)";
        activeCircle.style.background = "var(--hot-pink)";
        activeCircle.style.color = "#fff";
    }
    if (charId === 'p') {
        leftChars.forEach(el => el.classList.add('expand-left'));
        rightChars.forEach(el => el.classList.add('dim-char'));
    } else if (charId === 'k') {
        rightChars.forEach(el => el.classList.add('expand-right'));
        leftChars.forEach(el => el.classList.add('dim-char'));
    }
}
function resetChars() {
    const leftChars = document.querySelectorAll('.char-left, .mobile-char-left');
    const rightChars = document.querySelectorAll('.char-right, .mobile-char-right');
    document.querySelectorAll('.avatar-circle').forEach(el => {
        el.style.transform = "scale(1)";
        el.style.background = "transparent";
        el.style.color = "var(--dark)";
    });
    leftChars.forEach(el => el.classList.remove('expand-left', 'dim-char'));
    rightChars.forEach(el => el.classList.remove('expand-right', 'dim-char'));
}
function updateBadges(n1, n2) {
    const b1 = document.getElementById('char_p');
    const b2 = document.getElementById('char_k');
    const char1 = n1 ? n1[0].toUpperCase() : 'P';
    const char2 = n2 ? n2[0].toUpperCase() : 'K';
    const full1 = n1 ? n1.toUpperCase() : 'PRADEEP RANGANATHAN';
    const full2 = n2 ? n2.toUpperCase() : 'KRITHI SHETTY';
    
    if(b1) {
        if(b1.querySelector('.short')) b1.querySelector('.short').textContent = char1;
        if(b1.querySelector('.full')) b1.querySelector('.full').textContent = full1;
    }
    if(b2) {
        if(b2.querySelector('.short')) b2.querySelector('.short').textContent = char2;
        if(b2.querySelector('.full')) b2.querySelector('.full').textContent = full2;
    }
}
document.getElementById('subject_a').addEventListener('input', e => {
    updateBadges(e.target.value, document.getElementById('subject_b').value);
});
document.getElementById('subject_b').addEventListener('input', e => {
    updateBadges(document.getElementById('subject_a').value, e.target.value);
});
let isScanning = false;
let hasScanned = false;
function getScore(n1, n2) {
    const combined = (n1 + n2).toLowerCase().replace(/\s/g, '');
    let hash = 0;
    for (let c of combined) hash = (hash * 31 + c.charCodeAt(0)) % 1000;
    return 65 + Math.floor((hash % 36));
}
function runKompanyScan() {
    if (isScanning) return;
    
    if (hasScanned) {
        document.getElementById('subject_a').value = '';
        document.getElementById('subject_b').value = '';
        document.getElementById('scoreNum').innerHTML = "00<span>%</span>";
        document.getElementById('scoreStatus').innerText = "READY TO SCAN";
        document.getElementById('scoreStatus').style.color = "var(--dark)";
        const quoteEl = document.getElementById('scoreQuote');
        if(quoteEl) quoteEl.style.display = "none";
        document.getElementById('action_buttons').classList.remove('show');
        document.getElementById('scanBtn').innerText = "GET YOUR LIK SCORE";
        updateBadges('', '');
        resetChars();
        hasScanned = false;
        return;
    }

    const nameA = document.getElementById('subject_a').value.trim();
    const nameB = document.getElementById('subject_b').value.trim();
    if (!nameA || !nameB) {
        alert("L.I.K. ERROR: PLEASE ENTER BOTH NAMES.");
        return;
    }

    // iOS Audio Context Unlock: 
    // Apple blocks speech synthesis fired inside async timeouts. To fix this, we fire a silent dummy utterance immediately synchronously with the button 'click' event.
    if ('speechSynthesis' in window) {
        const unlockUtterance = new SpeechSynthesisUtterance('');
        unlockUtterance.volume = 0;
        window.speechSynthesis.speak(unlockUtterance);
    }

    isScanning = true;
    const btn = document.getElementById('scanBtn');
    btn.disabled = true;
    const overlay = document.getElementById('robot_scan_overlay');
    const title = document.querySelector('.calcpreload-main-title');
    const counter = document.getElementById('scoreNum');
    document.getElementById('scoreNum').innerHTML = "00<span>%</span>";
    document.getElementById('scoreStatus').innerText = "SCANNING...";
    document.getElementById('scoreStatus').style.color = "var(--dark)";
    
    const quoteEl = document.getElementById('scoreQuote');
    if(quoteEl) quoteEl.style.display = "none";
    
    document.getElementById('action_buttons').classList.remove('show');
    overlay.classList.add('active');
    typingEffect(title, "SCANNING...");
    const targetScore = getScore(nameA, nameB);
    startCounter(counter, targetScore);
    setTimeout(() => {
        overlay.classList.remove('active');
        setTimeout(() => {
            counter.innerHTML = String(targetScore).padStart(2,'0') + "<span>%</span>";
            const pill = document.getElementById('scoreStatus');
            pill.innerText = "INSURANCE POLICY GENERATED";
            pill.style.color = "var(--hot-pink)";
            
            const quoteEl = document.getElementById('scoreQuote');
            if(quoteEl) {
                quoteEl.innerText = `👉🏻 ${getLoveQuote(targetScore)} 👈🏻`;
                quoteEl.style.display = "block";
            }

            document.getElementById('action_buttons').classList.add('show');
            btn.innerText = "CHECK AGAIN";
            btn.disabled = false;
            isScanning = false;
            hasScanned = true;
            playResultVoice(nameA, nameB, targetScore);
        }, 800);
    }, 6000);
}
function typingEffect(element, text, speed = 80) {
    element.innerText = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerText += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}
function startCounter(element, targetScore) {
    let count = 0;
    const interval = setInterval(() => {
        count = (count + Math.floor(Math.random() * 5) + 1) % 100;
        element.innerHTML = String(count).padStart(2,'0') + "<span>%</span>";
    }, 100);
    element.dataset.intervalId = interval;
    setTimeout(() => {
        clearInterval(interval);
    }, 5800);
}
function getLoveQuote(score) {
    const numScore = parseInt(score);
    if(numScore >= 65 && numScore < 70) return "Your love feels real… but not official.";
    else if(numScore >= 70 && numScore < 80) return "It’s giving soft launch energy.";
    else if(numScore >= 80 && numScore < 90) return "Couple goals loading…";
    else if(numScore >= 90 && numScore < 100) return "One step away from hard launch.";
    else if(numScore == 100) return "Couple goals unlocked, you're in the end game now.";
    return "Love is in the air!";
}
function playResultVoice(nameA, nameB, score) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const quote = getLoveQuote(score);
        const textToSpeech = `${nameA} and ${nameB}...... Your score is ${score} percent....... ${quote}....... Download and share it in your Instagram stories.`;
        const msg = new SpeechSynthesisUtterance();
        msg.text = textToSpeech;
        msg.lang = 'en-US';
        msg.rate = 0.95;
        msg.pitch = 1.1;
        window.speechSynthesis.speak(msg);
    }
}
function createScoreCanvas() {
    return new Promise((resolve) => {
        const nameA = document.getElementById('subject_a').value || "P";
        const nameB = document.getElementById('subject_b').value || "K";
        const scoreText = document.getElementById('scoreNum').innerText;
        const score = scoreText.replace('%', '');
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext("2d");
        const templateImg = new Image();
        templateImg.crossOrigin = "Anonymous";
        templateImg.onload = () => {
            ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
            ctx.textAlign = "center";
            let msg = getLoveQuote(score);
            ctx.fillStyle = "#222";
            ctx.font = "40px 'Survival Instinx', sans-serif";
            ctx.fillText("Hey, our LIK Score is guessed as", 540, 460);
            ctx.fillStyle = "#FF0A6C";
            ctx.font = "280px 'Drixel', sans-serif";
            ctx.fillText(`${score}%`, 540, 770);
            ctx.fillStyle = "#222";
            ctx.font = "60px 'Survival Instinx', sans-serif";
            ctx.fillText(`${nameA.toUpperCase()} & ${nameB.toUpperCase()}`, 540, 950);
            ctx.fillStyle = "#222";
            ctx.font = "32px 'Survival Instinx', sans-serif";
            ctx.fillText(msg, 540, 1020);
            resolve(canvas);
        };
        templateImg.onerror = () => {
            const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
            gradient.addColorStop(0, "#FF0A6C");
            gradient.addColorStop(1, "#FFE600");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#fff";
            ctx.font = "60px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`${nameA.toUpperCase()} ❤️ ${nameB.toUpperCase()}`, 540, 700);
            ctx.fillStyle = "#222";
            ctx.font = "400px 'Survival Instinx', monospace";
            ctx.fillText(`${score}%`, 540, 1200);
            resolve(canvas);
        };
        templateImg.src = "LIK STORY SILDE.jpg.jpeg";
    });
}

async function downloadLIK() {
    const canvas = await createScoreCanvas();
    const link = document.createElement("a");
    link.download = "MAYAJAALxLIK_SCORE.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

async function shareLIK() {
    const scoreText = document.getElementById('scoreNum').innerText;
    const score = scoreText.replace('%', '');
    const text = `Hey! I checked our LIK Score in mayaxlik.in and it resulted as ${score}%\nCheck yours now in mayaxlik.in now! ✨`;
    
    const canvas = await createScoreCanvas();
    canvas.toBlob(async (blob) => {
        const file = new File([blob], "MAYAJAALxLIK_SCORE.png", { type: "image/png" });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: "LIK Score",
                    text: text,
                    files: [file]
                });
            } catch (err) {
                console.log('Share dismissed or failed', err);
                showShareOptions(text);
            }
        } else if (navigator.share) {
            try {
                await navigator.share({
                    title: "LIK Score",
                    text: text
                });
            } catch(err) {
                console.log('Share with text dismissed or failed', err);
                showShareOptions(text);
            }
        } else {
            showShareOptions(text);
        }
    }, "image/png");
}

function showShareOptions(text) {
    if(document.querySelector('.share-popup-container')) return;
    const popup = document.createElement("div");
    popup.className = "share-popup-container";
    popup.innerHTML = `
        <div class="share-popup">
            <h3>Share your LIK Score</h3>
            <button class="popup-btn" onclick="downloadLIK()">📸 Instagram App</button>
            <button class="popup-btn" onclick="openWhatsApp('${encodeURIComponent(text)}')">🟢 WhatsApp</button>
            <button class="popup-btn" onclick="openTwitter('${encodeURIComponent(text)}')">🐦 X (Twitter)</button>
            <button class="popup-btn close-btn" onclick="this.closest('.share-popup-container').remove()">❌ Close</button>
        </div>
    `;
    document.body.appendChild(popup);
}
function openWhatsApp(text) {
    window.open(`https://wa.me/?text=${text}`, "_blank");
}
function openTwitter(text) {
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
}