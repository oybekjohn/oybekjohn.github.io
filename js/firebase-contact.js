/* ============================================
   Firebase Contact Form Handler
   Stores messages in Firestore
   ============================================ */

(function () {
  'use strict';

  // Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyB8AcKX09nOLXu1KNpsrkR5za7XWPuPG8U",
    authDomain: "oybekjohn-github-io.firebaseapp.com",
    projectId: "oybekjohn-github-io",
    storageBucket: "oybekjohn-github-io.firebasestorage.app",
    messagingSenderId: "873624728809",
    appId: "1:873624728809:web:e3f83b5cbeffaad11cac78",
    measurementId: "G-YRQCL9GMCZ"
  };

  // Wait for Firebase SDK to load
  function waitForFirebase(callback) {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      callback();
    } else {
      setTimeout(() => waitForFirebase(callback), 100);
    }
  }

  waitForFirebase(() => {
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const successMsg = document.getElementById('contactSuccess');
    const errorMsg = document.getElementById('contactError');

    if (!form) return;

    // Rate limiting
    const RATE_LIMIT = 3;
    const RATE_WINDOW = 3600000; // 1 hour in ms
    let submissions = JSON.parse(sessionStorage.getItem('cf_submissions') || '[]');

    function isRateLimited() {
      const now = Date.now();
      submissions = submissions.filter(t => now - t < RATE_WINDOW);
      sessionStorage.setItem('cf_submissions', JSON.stringify(submissions));
      return submissions.length >= RATE_LIMIT;
    }

    function showMessage(el, duration) {
      el.classList.add('visible');
      setTimeout(() => el.classList.remove('visible'), duration || 5000);
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get values
      const name = form.querySelector('#contactName').value.trim();
      const email = form.querySelector('#contactEmail').value.trim();
      const message = form.querySelector('#contactMessage').value.trim();

      // Validation
      if (!name || !email || !message) {
        errorMsg.textContent = translations[document.documentElement.lang]?.contact_error_required || 'Please fill in all fields.';
        showMessage(errorMsg);
        return;
      }

      if (!validateEmail(email)) {
        errorMsg.textContent = translations[document.documentElement.lang]?.contact_error_email || 'Please enter a valid email.';
        showMessage(errorMsg);
        return;
      }

      if (message.length < 10) {
        errorMsg.textContent = translations[document.documentElement.lang]?.contact_error_short || 'Message is too short.';
        showMessage(errorMsg);
        return;
      }

      // Rate limit check
      if (isRateLimited()) {
        errorMsg.textContent = translations[document.documentElement.lang]?.contact_error_rate || 'Too many messages. Please try again later.';
        showMessage(errorMsg);
        return;
      }

      // Disable button
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');

      try {
        await db.collection('messages').add({
          name: name,
          email: email,
          message: message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          lang: document.documentElement.lang || 'en',
          userAgent: navigator.userAgent,
          read: false
        });

        // Track submission for rate limiting
        submissions.push(Date.now());
        sessionStorage.setItem('cf_submissions', JSON.stringify(submissions));

        // Success
        form.reset();
        showMessage(successMsg, 6000);

      } catch (err) {
        console.error('Firebase error:', err);
        errorMsg.textContent = translations[document.documentElement.lang]?.contact_error_general || 'Something went wrong. Please try again.';
        showMessage(errorMsg);
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });
  });

})();
