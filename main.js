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

      // स्कोर को 1-10 के बीच सीमित करना
      if (score < 1) score = 1;
      if (score > 10) score = 10;

      // पासवर्ड की ताकत के हिसाब से सलाह देना
      let strength = "";
      if (score <= 3) {
        strength = "⚠️ Very week";
        advice = "ओ भाई! इतना कमजोर पासवर्ड? यह तो कोई भी गेस कर लेगा! 😅";
      } else if (score <= 6) {
        strength = "🟡 normal";
        advice = "यह पासवर्ड ठीक है, लेकिन थोड़ा और मेहनत करो! 😎";
      } else if (score <= 8) {
        strength = "🟢Good";
        advice = "बढ़िया! अब कोई इसे आसानी से नहीं तोड़ पाएगा। 🔒";
      } else {
        strength = "✅ Very strong";
        advice = "कमाल है! यह पासवर्ड बहुत ही मजबूत है! 🚀";
      }
      // उदाहरण के लिए एक सुझाया गया पासवर्ड (डमी)
      let suggestedPassword = "DummySuggested123!";

      return { score, strength, advice, improvementTips, suggestedPassword };
    }

    // पासवर्ड स्ट्रेंथ चेक फंक्शन
    function checkStrength() {
      let password = document.getElementById("password").value;
      let strengthBar = document.getElementById("strength-bar");
      let result = document.getElementById("result");
      let aiAdvice = document.getElementById("ai-advice");
      let strength = 0;

      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;

      let colors = ["red", "orange", "yellow", "green"];
      strengthBar.style.background = colors[strength];

      if (!password) {
        result.innerHTML = "❌ Plise Enter your Password!";
        aiAdvice.innerHTML = "";
        return;
      }

      let entropy = calculateEntropy(password);
      let crackTime = calculateCrackTime(entropy);
      let superTime = superComputerTime(entropy);

      result.innerHTML = `
            🛡Estimated cracking time. <b>${crackTime}</b><br>
            🖥️ Normal Computer: ${crackTime} <br>
            🚀Super Computer: ${superTime}
        `;
      
      let recommendation = aiPasswordRecommendation(password);
      aiAdvice.innerHTML = recommendation.advice;
      document.getElementById("strengthScore").innerHTML = `📊 Score: ${recommendation.score}/10 (${recommendation.strength})`;
    }

    // एंट्रोपी कैलकुलेशन
    function calculateEntropy(password) {
      let charset = 0;
      if (/[a-z]/.test(password)) charset += 26;
      if (/[A-Z]/.test(password)) charset += 26;
      if (/[0-9]/.test(password)) charset += 10;
      if (/[^a-zA-Z0-9]/.test(password)) charset += 32;

      return password.length * Math.log2(charset);
    }

    // क्रैक टाइम कैलकुलेशन (नॉर्मल कंप्यूटर)
    function calculateCrackTime(entropy) {
      let seconds = Math.pow(2, entropy) / 1000000;
      let years = seconds / (60 * 60 * 24 * 365);

      if (years < 0.00001) return "📉 It will be cracked immediately";
      if (years < 1) return `${Math.round(years * 12)}Month`;
      if (years < 100) return `${Math.round(years)} Year`;
      return `${Math.round(years / 1000)}000+ Year 🔥`;
    }

    // क्रैक टाइम कैलकुलेशन (सुपर कंप्यूटर)
    function superComputerTime(entropy) {
      let seconds = Math.pow(2, entropy) / 1000000000;
      let years = seconds / (60 * 60 * 24 * 365);

      if (years < 0.00001) return "📉 Instantly cracked!";
      if (years < 1) return `${Math.round(years * 12)}Month `;
      if (years < 100) return `${Math.round(years)} Year`;
      return `${Math.round(years / 1000)}000+ Year 🚀`;
    }

    // फ़िशिंग चेक फंक्शन
    function checkPhishing() {
      let url = document.getElementById("urlInput").value.trim();
      let resultBox = document.getElementById("phishing-result");

      try {
        let domain = new URL(url).hostname;
        let blacklist = ["phishingsite.com", "fakebank.com"];

        if (blacklist.includes(domain)) {
          resultBox.innerHTML = `⚠️ यह वेबसाइट खतरनाक है!`;
          resultBox.className = "phishing-warning";
        } else {
          resultBox.innerHTML = `✅ वेबसाइट सुरक्षित लगती है।`;
          resultBox.className = "";
        }
      } catch (error) {
        resultBox.innerHTML = "❌ कृपया मान्य URL दर्ज करें!";
        resultBox.className = "phishing-warning";
      }
    }

    // मजबूत पासवर्ड जनरेट करने का फंक्शन
    function generateStrongPassword(oldPassword) {
      let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
      let strongPassword = "";

      for (let i = 0; i < 12; i++) {
        strongPassword += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      if (/\d{4}/.test(oldPassword)) {
        strongPassword = strongPassword.replace(/\d/, "@");
      }
      if (/^[a-zA-Z]+$/.test(oldPassword)) {
        strongPassword += "1!";
      }

      return strongPassword;
    }

    function suggestStrongPassword() {
      let oldPassword = document.getElementById("password").value;
      document.getElementById("suggested-password").innerText = generateStrongPassword(oldPassword);
    }
    async function checkBreach() {
    let password = document.getElementById("password").value;
    let hash = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(password));
    let hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    let prefix = hashHex.slice(0, 5);
    
    let response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    let text = await response.text();

    let breached = text.includes(hashHex.slice(5));
    document.getElementById("breach-result").innerText = breached ? "⚠️ This password has been leaked bef" : "✅ The password seems secure!";
}
    
   function openMyPage() {
  window.open("openpage.html", "_blank");
}
   function Chatbot() {
     window.open("Chatbot.html", "_blank");
   }
   function fishing() {
     window.open("fishing.html", "_blank");
   }
    // डार्क मोड टॉगल फंक्शन
    function toggleDarkMode() {
      document.body.classList.toggle("dark-mode");
    }

    // पेज लोड होते ही सेव किए गए पासवर्ड दिखाएं
  showPasswords();