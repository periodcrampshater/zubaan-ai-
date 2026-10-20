# Zubaan AI — Prototype v3

A voice-first, premium dark-mode UI prototype for a multilingual assistant designed for everyday Pakistan.

## What works in this prototype
- Responsive layout for desktop and mobile.
- Language selector for Roman Urdu, Urdu, English, Punjabi, Sindhi, and Pashto. Some new mode-specific labels are currently best supported in Roman Urdu/English and need native-speaker review.
- Browser speech-to-text when the browser supports the Web Speech API. This may need internet and is **not offline voice AI**.
- Student mode with notes saved in the current browser and a basic calculator.
- Shopkeeper mode with a tiny demo ledger saved in the current browser.
- General help, student, shopkeeper, farmer, and debate modes with mode-specific prompt suggestions.
- Larger-text control, keyboard focus styles, responsive layout, and an offline-cached app shell.

## Important limitations
- This is **not yet a generative AI assistant**. Questions are not sent to an AI model and the prototype does not answer arbitrary questions.
- Notes and demo ledger entries are stored only in this browser on this device. They are not synced or backed up. Do not use sensitive real business data yet.
- Speech recognition depends on browser/device support and may send audio to the browser vendor's speech service. Do not assume it is private or offline.
- The farmer and political debate modes are interface concepts only; they do not currently verify claims or provide expert agricultural advice.
- Language coverage, accessibility, accuracy, and offline behavior require testing with real users and native speakers.

## Run on Windows with Node.js
1. Open this folder in File Explorer.
2. Click the address bar, type `cmd`, and press Enter.
3. Run: `npx -y http-server -p 8000`
4. In Chrome, open `http://localhost:8000`.
5. Keep the Command Prompt window open while testing.

If an older version is cached, close the tab, stop the server with `Ctrl+C`, start it again, and hard refresh the page (`Ctrl+Shift+R`). If needed, clear the site's data for `localhost:8000` in Chrome.

## Next engineering stage
Integrate a real local or cloud language model behind a clear, privacy-conscious interface; evaluate answers in each supported language; then test low-RAM Android devices and genuine offline inference separately.
