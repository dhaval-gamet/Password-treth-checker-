// AI पासवर्ड सलाह फंक्शन
function aiPasswordRecommendation(password) {
  const commonPatterns = ["123456", "password", "qwerty", "abc123", "password1"];
  const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
  const upperCase = /[A-Z]/;
  const lowerCase = /[a-z]/;
  const numbers = /[0-9]/;
  
  let score = 0;
  let advice = "यह पासवर्ड ठीक है, लेकिन इसे और बेहतर बनाया जा सकता है!";
  let improvementTips = [];
  
  // बहुत ही सामान्य पासवर्ड चेक करना
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    advice = "⚠️ यह पासवर्ड बहुत ही सामान्य है, तुरंत बदलें!";
    score -= 2;
  }
  
  // पासवर्ड की लंबाई चेक करना
  if (password.length >= 8) score += 2;
  if (password.length >= 12) score += 3;
  if (password.length >= 16) score += 5;
  else {
    improvementTips.push("✅ पासवर्ड को 12-14 अक्षरों से बड़ा करें।");
  }
  
  // अपर और लोअर केस चेक करना
  if (upperCase.test(password) && lowerCase.test(password)) {
    score += 2;
  } else {
    improvementTips.push("✅ पासवर्ड में बड़े और छोटे अक्षर मिलाकर बनाएं।");
  }
  
  // संख्याएँ चेक करना
  if (numbers.test(password)) {
    score += 2;
  } else {
    improvementTips.push("✅ पासवर्ड में कम से कम एक नंबर जोड़ें।");
  }
  
  // विशेष अक्षर चेक करना
  if (specialChars.test(password)) {
    score += 3;
  } else {
    improvementTips.push("✅ पासवर्ड में स्पेशल कैरेक्टर (!@#$%^&) जोड़ें।");
  }
  
  // zxcvbn से स्ट्रेंथ चेक
  const zxcvbnResult = zxcvbn(password);
  score = Math.max(score, zxcvbnResult.score * 2); // zxcvbn स्कोर (0-4) को 0-8 में बदलें
  const crackTime = zxcvbnResult.crack_times_display.offline_slow_hashing_1e4_per_second;
  
  // स्कोर को 1-10 के बीच सीमित करना
  if (score < 1) score = 1;
  if (score > 10) score = 10;
  
  // पासवर्ड की ताकत के हिसाब से सलाह देना
  let strength = "";
  if (score <= 3) {
    strength = "⚠️ बहुत कमजोर";
    advice = "यह पासवर्ड बहुत कमजोर है! इसे तुरंत बदलें! 😅";
  } else if (score <= 6) {
    strength = "🟡 सामान्य";
    advice = "यह पासवर्ड ठीक है, लेकिन और मजबूत करें! 😎";
  } else if (score <= 8) {
    strength = "🟢 अच्छा";
    advice = "बढ़िया! यह पासवर्ड सुरक्षित है। 🔒";
  } else {
    strength = "✅ बहुत मजबूत";
    advice = "शानदार! यह पासवर्ड बहुत ही मजबूत है! 🚀";
  }
  
  // डायनामिक पासवर्ड सुझाव
  const length = parseInt(document.getElementById("passwordLength")?.value) || 16;
  let suggestedPassword = generateStrongPassword(password, length);
  
  return { score, strength, advice, improvementTips, suggestedPassword, crackTime };
}

// पासवर्ड स्ट्रेंथ चेक फंक्शन
function checkStrength() {
  try {
    const password = document.getElementById("password").value;
    const strengthBar = document.getElementById("strength-bar");
    const result = document.getElementById("result");
    const aiAdvice = document.getElementById("ai-advice");
    const strengthScore = document.getElementById("strengthScore");
    const suggestedPassword = document.getElementById("suggested-password");
    
    if (!password) {
      result.innerHTML = "❌ कृपया पासवर्ड दर्ज करें!";
      aiAdvice.innerHTML = "";
      strengthBar.style.background = "gray";
      strengthScore.innerHTML = "";
      suggestedPassword.innerHTML = "";
      return;
    }
    
    const recommendation = aiPasswordRecommendation(password);
    
    // स्ट्रेंथ बार अपडेट
    const colors = ["red", "orange", "yellow", "green", "darkgreen"];
    const strengthIndex = Math.min(Math.floor(recommendation.score / 2), 4);
    strengthBar.style.background = colors[strengthIndex];
    
    result.innerHTML = `
      🛡 अनुमानित क्रैकिंग समय: <b>${recommendation.crackTime}</b><br>
    `;
    aiAdvice.innerHTML = recommendation.advice;
    strengthScore.innerHTML = `📊 स्कोर: ${recommendation.score}/10 (${recommendation.strength})`;
    suggestedPassword.innerHTML = `✨ सुझाया गया पासवर्ड: <b>${recommendation.suggestedPassword}</b>`;
  } catch (error) {
    console.error("त्रुटि:", error);
    document.getElementById("result").innerHTML = "❌ कुछ गलत हुआ, कृपया पुनः प्रयास करें!";
  }
}

// मजबूत पासवर्ड जनरेट करने का फंक्शन
function generateStrongPassword(oldPassword, length = 16) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let strongPassword = "";
  length = Math.max(12, Math.min(length, 32)); // न्यूनतम 12, अधिकतम 32
  
  // कम से कम एक-एक अक्षर सुनिश्चित करें
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const number = "0123456789";
  const special = "!@#$%^&*()-_=+";
  
  strongPassword += lower[Math.floor(Math.random() * lower.length)];
  strongPassword += upper[Math.floor(Math.random() * upper.length)];
  strongPassword += number[Math.floor(Math.random() * number.length)];
  strongPassword += special[Math.floor(Math.random() * special.length)];
  
  // बाकी अक्षर रैंडम
  for (let i = 4; i < length; i++) {
    strongPassword += chars[Math.floor(Math.random() * chars.length)];
  }
  
  // पासवर्ड को शफल करें
  strongPassword = strongPassword.split("").sort(() => Math.random() - 0.5).join("");
  
  // पुराने पासवर्ड के आधार पर छोटे बदलाव
  if (/\d{4}/.test(oldPassword)) {
    strongPassword = strongPassword.replace(/\d/, "@");
  }
  if (/^[a-zA-Z]+$/.test(oldPassword)) {
    strongPassword += "1!";
  }
  
  return strongPassword;
}

// पासवर्ड सुझाव फंक्शन
function suggestStrongPassword() {
  const password = document.getElementById("password").value;
  const length = parseInt(document.getElementById("passwordLength")?.value) || 16;
  document.getElementById("suggested-password").innerText = generateStrongPassword(password, length);
}

// पासवर्ड ब्रैच चेक
async function checkBreach() {
  try {
    const password = document.getElementById("password").value;
    const breachResult = document.getElementById("breach-result");
    if (!password) {
      breachResult.innerText = "❌ कृपया पासवर्ड दर्ज करें!";
      return;
    }
    
    const hash = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(password));
    const hashHex = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
    const prefix = hashHex.slice(0, 5);
    
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) throw new Error("API अनुरोध विफल");
    const text = await response.text();
    
    const breached = text.includes(hashHex.slice(5));
    breachResult.innerText = breached ?
      "⚠️ यह पासवर्ड पहले लीक हो चुका है!" :
      "✅ यह पासवर्ड सुरक्षित है!";
  } catch (error) {
    document.getElementById("breach-result").innerText = "❌ ब्रैच जांच में त्रुटि!";
    console.error("त्रुटि:", error);
  }
}

// डार्क मोड टॉगल
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// अन्य पेज खोलने के फंक्शन
function openMyPage() {
  window.open("openpage.html", "_blank");
}

function Chatbot() {
  window.open("Chatbot.html", "_blank");
}
function fishinghtml() {
  window.open("fishing.html", "_blank")
}
function Advancetoolshtml() {
  window.open("Advance tools.html", "_blank")}
  // Ta

// पासवर्ड कॉपी फंक्शन
function copySuggestedPassword() {
  const suggestedPassword = document.getElementById("suggested-password").innerText;
  navigator.clipboard.writeText(suggestedPassword).then(() => {
    alert("पासवर्ड कॉपी किया गया!");
  }).catch(err => {
    console.error("कॉपी करने में त्रुटि:", err);
  });
}

// पासवर्ड दिखाएं/छिपाएं फंक्शन
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.getElementById("toggleIcon");
  
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}
