# Word Unfolded

A Bible reading plan + study app: read the whole Bible by your chosen date, with context for every book, a word bank for every chapter, God's words in purple (OT), highlights, notes, a SOAP journal, mini tests, flashcards and exams (Major Prophets + New Testament).

Live: https://trueyxl.github.io/word-unfolded/

## Files
- `index.html`, `style.css`, `app.js`: the app (no build step)
- `data/books.js`: 66 book introductions (author, audience, date, geography, purpose)
- `data/prophets.js`: Major Prophets context every 3–5 chapters + Bible-college study questions
- `data/summaries-*.js`: one-line chapter summaries (flashcards + "which chapter?" questions)
- `data/exams-*.js`: exam banks + NT essay prompts
- `data/glossary.js`: word bank terms
- `sw.js`: offline support

## Translations
In-app text: World English Bible (public domain) and KJV via bible-api.com.
NIV / ESV / NLT / AMPC / NKJV are copyrighted, so they open on BibleGateway.

## Turning on real accounts (optional, ~5 min)
By default each person makes a profile (name + 4-digit PIN) saved on their device.
For Google/email sign-in that syncs across devices:
1. console.firebase.google.com → Add project → "word-unfolded".
2. Build → Authentication → Get started → enable **Google** and **Email/Password**.
3. Authentication → Settings → Authorized domains → add `trueyxl.github.io`.
4. Build → Firestore Database → Create database (production). Rules:
   ```
   rules_version = '2';
   service cloud.firestore { match /databases/{db}/documents {
     match /users/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid; }
   } }
   ```
5. Project settings → Your apps → Web (</>) → copy the config into `firebase-config.js`
   (`window.FIREBASE_CONFIG = {...}`), commit and push.
