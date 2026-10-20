
"use strict";

/* Zubaan AI — frontend controller */

const $ = (id) => document.getElementById(id);

const LANGUAGE_NAMES = {
  roman: "Roman Urdu",
  ur: "Urdu",
  en: "English",
  pa: "Punjabi in Shahmukhi script",
  sd: "Sindhi",
  ps: "Pashto"
};

const SPEECH_LANGUAGES = {
  roman: "ur-PK",
  ur: "ur-PK",
  en: "en-US",
  pa: "pa-PK",
  sd: "sd-PK",
  ps: "ps-PK"
};

const RTL_LANGUAGES = ["ur", "pa", "sd", "ps"];

const MODE_NAMES = {
  general: "general",
  student: "student",
  shopkeeper: "shopkeeper",
  farmer: "farmer",
  debate: "debate"
};

const TEXT = {
  roman: {
    brandTag: "Aap ki zubaan mein madad",
    connection: "Internet mojood hai",
    welcomeKicker: "ASSAN. SAADA. SAB KE LIYE.",
    welcomeTitle: "Aaj aap ko kis cheez mein madad chahiye?",
    welcomeSubtitle: "Apni zubaan mein sawal poochhein. Zubaan AI aap ki madad karega.",
    welcomeIntro: "Likhein ya awaaz se batayein. Mushkil alfaaz ki zaroorat nahi.",
    assistantLabel: "Zubaan AI",
    privacyLabel: "Aap ka sawal AI service ko bheja jayega.",
    voiceTitle: "Bol kar sawal poochhein",
    voiceOverline: "VOICE ASSISTANT",
    voiceHint: "Microphone dabayein aur bolna shuru karein.",
    voiceStart: "Microphone dabayein",
    voiceListening: "Sun raha hoon... ab boliye",
    voiceUnsupported: "Aap ke browser mein voice input supported nahi. Neeche likh kar sawal poochhein.",
    questionLabel: "Aap ka sawal",
    questionPlaceholder: "Yahan apna sawal likhein...",
    askButtonText: "Jawab hasil karein",
    composerHint: "Enter se sawal bhejein",
    answerTitle: "Aap ka jawab",
    answerMeta: "AI ka jawab",
    copyAnswerLabel: "Jawab copy karein",
    speakAnswerLabel: "Jawab sunayein",
    clearAnswerLabel: "Jawab band karein",
    workspacesTitle: "Aap kis kaam mein madad chahte hain?",
    workspacesIntro: "Apne kaam ke mutabiq ek option chunein.",
    stepLabel: "APNA KAAM CHUNEIN",
    modeGeneral: "Rozmarra ki madad",
    modeGeneralSub: "Aam sawalat aur roz ke kaam",
    modeStudent: "Parhai",
    modeStudentSub: "Homework, maths aur science",
    modeShopkeeper: "Dukandari",
    modeShopkeeperSub: "Hisab, stock aur customers",
    modeFarmer: "Kheti baari",
    modeFarmerSub: "Fasal, pani aur zameen",
    modeDebate: "Debate aur speeches",
    modeDebateSub: "Taqreer, daleel aur tayyari",
    modeStatus: "Selected mode",
    modeStatusText: "Aap ka kaam select ho gaya hai.",
    quickEyebrow: "QUICK QUESTIONS",
    suggestionsTitle: "Yahan se shuru karein",
    suggestionOne: "Percentage kaise nikalte hain?",
    suggestionTwo: "English mein message likh dein.",
    suggestionThree: "Meri dukaan ka stock kaise manage karun?",
    recentEyebrow: "YOUR ACTIVITY",
    recentTitle: "Recent chats",
    clearHistory: "History saaf karein",
    emptyHistoryText: "Abhi koi recent chat nahi.",
    newChatLabel: "Nayi chat",
    largeTextLabel: "Bara text",
    helpButtonLabel: "About Zubaan AI",
    footerTag: "Zubaan AI",
    footerNote: "Aasaan madad, aap ki zubaan mein.",
    aboutTitle: "Zubaan AI ke baare mein",
    aboutText: "Zubaan AI mukhtalif zubanon mein sawalat ke jawab aur rozmarra ke kaamon mein madad ke liye banaya gaya hai.",
    aboutPrivacy: "Aap ka sawal jawab banane ke liye online AI service ko bheja jata hai. Sensitive ya private maloomat share na karein.",
    aboutDone: "Samajh gaya",
    closeLabel: "Band karein",
    thinking: "Jawab tayar ho raha hai...",
    waiting: "Meherbani karke thora intezar karein.",
    emptyQuestion: "Pehle apna sawal likhein.",
    errorTitle: "Jawab nahi mil saka",
    errorText: "Dobara koshish karein. Agar masla rahe to internet ya AI service check karni hogi.",
    copied: "Jawab copy ho gaya.",
    copyFailed: "Copy nahi ho saka. Jawab select karke copy karein.",
    historyCleared: "Recent chats saaf ho gayi hain.",
    confirmClearHistory: "Kya aap recent chats saaf karna chahte hain?",
    micDenied: "Microphone ki permission nahi mili. Browser settings check karein.",
    micError: "Voice input shuru nahi ho saka. Sawal type karke bhej dein.",
    noSpeech: "Awaaz samajh nahi aayi. Dobara koshish karein.",
    speakUnavailable: "Aap ke browser mein text-to-speech supported nahi.",
    offline: "Internet connection nahi hai",
    modeNames: {
      general: "Rozmarra ki madad",
      student: "Parhai",
      shopkeeper: "Dukandari",
      farmer: "Kheti baari",
      debate: "Debate aur speeches"
    }
  },

  en: {
    brandTag: "Help in your language",
    connection: "Connected to the internet",
    welcomeKicker: "SIMPLE. CLEAR. FOR EVERYONE.",
    welcomeTitle: "What would you like help with today?",
    welcomeSubtitle: "Ask questions in your language. Zubaan AI is here to help.",
    welcomeIntro: "Type your question or speak. No technical words needed.",
    assistantLabel: "Zubaan AI",
    privacyLabel: "Your question will be sent to an AI service.",
    voiceTitle: "Ask by speaking",
    voiceOverline: "VOICE ASSISTANT",
    voiceHint: "Tap the microphone and start speaking.",
    voiceStart: "Tap the microphone",
    voiceListening: "Listening... speak now",
    voiceUnsupported: "Voice input is not supported by this browser. Type your question below.",
    questionLabel: "Your question",
    questionPlaceholder: "Type your question here...",
    askButtonText: "Get an answer",
    composerHint: "Press Enter to send",
    answerTitle: "Your answer",
    answerMeta: "AI response",
    copyAnswerLabel: "Copy answer",
    speakAnswerLabel: "Read answer aloud",
    clearAnswerLabel: "Close answer",
    workspacesTitle: "What would you like help with?",
    workspacesIntro: "Choose a topic that matches your task.",
    stepLabel: "CHOOSE YOUR TASK",
    modeGeneral: "Everyday help",
    modeGeneralSub: "General questions and daily tasks",
    modeStudent: "Study",
    modeStudentSub: "Homework, maths and science",
    modeShopkeeper: "Shopkeeping",
    modeShopkeeperSub: "Accounts, stock and customers",
    modeFarmer: "Farming",
    modeFarmerSub: "Crops, water and soil",
    modeDebate: "Debates and speeches",
    modeDebateSub: "Speeches, arguments and preparation",
    modeStatus: "Selected mode",
    modeStatusText: "Your task has been selected.",
    quickEyebrow: "QUICK QUESTIONS",
    suggestionsTitle: "Start here",
    suggestionOne: "How do I calculate a percentage?",
    suggestionTwo: "Help me write a message in English.",
    suggestionThree: "How can I manage my shop inventory?",
    recentEyebrow: "YOUR ACTIVITY",
    recentTitle: "Recent chats",
    clearHistory: "Clear history",
    emptyHistoryText: "No recent chats yet.",
    newChatLabel: "New chat",
    largeTextLabel: "Larger text",
    helpButtonLabel: "About Zubaan AI",
    footerTag: "Zubaan AI",
    footerNote: "Simple help, in your language.",
    aboutTitle: "About Zubaan AI",
    aboutText: "Zubaan AI helps people ask questions and get support with everyday tasks in different languages.",
    aboutPrivacy: "Your question is sent to an online AI service to generate a response. Avoid sharing sensitive or private information.",
    aboutDone: "Got it",
    closeLabel: "Close",
    thinking: "Preparing your answer...",
    waiting: "Please wait a moment.",
    emptyQuestion: "Please write your question first.",
    errorTitle: "Could not get an answer",
    errorText: "Please try again. Your internet connection or the AI service may need checking.",
    copied: "Answer copied.",
    copyFailed: "Could not copy. Please select and copy the answer manually.",
    historyCleared: "Recent chats cleared.",
    confirmClearHistory: "Do you want to clear your recent chats?",
    micDenied: "Microphone permission was denied. Check your browser settings.",
    micError: "Voice input could not start. Please type your question.",
    noSpeech: "No speech was detected. Please try again.",
    speakUnavailable: "Text-to-speech is not supported by this browser.",
    offline: "No internet connection",
    modeNames: {
      general: "Everyday help",
      student: "Study",
      shopkeeper: "Shopkeeping",
      farmer: "Farming",
      debate: "Debates and speeches"
    }
  },

  ur: {
    brandTag: "آپ کی زبان میں مدد",
    connection: "انٹرنیٹ موجود ہے",
    welcomeKicker: "آسان۔ سادہ۔ سب کے لیے۔",
    welcomeTitle: "آج آپ کو کس کام میں مدد چاہیے؟",
    welcomeSubtitle: "اپنی زبان میں سوال پوچھیں۔ زُبان AI آپ کی مدد کرے گا۔",
    welcomeIntro: "لکھیں یا بول کر بتائیں۔ مشکل الفاظ کی ضرورت نہیں۔",
    assistantLabel: "زُبان AI",
    privacyLabel: "آپ کا سوال AI سروس کو بھیجا جائے گا۔",
    voiceTitle: "بول کر سوال پوچھیں",
    voiceOverline: "آواز سے مدد",
    voiceHint: "مائیکروفون دبائیں اور بولنا شروع کریں۔",
    voiceStart: "مائیکروفون دبائیں",
    voiceListening: "سن رہا ہے... اب بولیں",
    voiceUnsupported: "اس براؤزر میں آواز سے سوال پوچھنے کی سہولت نہیں۔ نیچے لکھیں۔",
    questionLabel: "آپ کا سوال",
    questionPlaceholder: "یہاں اپنا سوال لکھیں...",
    askButtonText: "جواب حاصل کریں",
    composerHint: "سوال بھیجنے کے لیے Enter دبائیں",
    answerTitle: "آپ کا جواب",
    answerMeta: "AI کا جواب",
    copyAnswerLabel: "جواب کاپی کریں",
    speakAnswerLabel: "جواب سنیں",
    clearAnswerLabel: "جواب بند کریں",
    workspacesTitle: "آپ کس کام میں مدد چاہتے ہیں؟",
    workspacesIntro: "اپنے کام کے مطابق ایک انتخاب کریں۔",
    stepLabel: "اپنا کام منتخب کریں",
    modeGeneral: "روزمرہ کی مدد",
    modeGeneralSub: "عام سوالات اور روز کے کام",
    modeStudent: "پڑھائی",
    modeStudentSub: "ہوم ورک، حساب اور سائنس",
    modeShopkeeper: "دکانداری",
    modeShopkeeperSub: "حساب، اسٹاک اور گاہک",
    modeFarmer: "کاشت کاری",
    modeFarmerSub: "فصل، پانی اور زمین",
    modeDebate: "مباحثہ اور تقریر",
    modeDebateSub: "تقریر، دلائل اور تیاری",
    modeStatus: "منتخب کام",
    modeStatusText: "آپ کا کام منتخب ہو گیا ہے۔",
    quickEyebrow: "فوری سوالات",
    suggestionsTitle: "یہاں سے شروع کریں",
    suggestionOne: "فیصد کیسے نکالتے ہیں؟",
    suggestionTwo: "انگریزی میں پیغام لکھ دیں۔",
    suggestionThree: "دکان کا اسٹاک کیسے سنبھالوں؟",
    recentEyebrow: "آپ کی سرگرمی",
    recentTitle: "حالیہ گفتگو",
    clearHistory: "گفتگو صاف کریں",
    emptyHistoryText: "ابھی کوئی حالیہ گفتگو نہیں۔",
    newChatLabel: "نئی گفتگو",
    largeTextLabel: "بڑا متن",
    helpButtonLabel: "زُبان AI کے بارے میں",
    footerTag: "زُبان AI",
    footerNote: "آپ کی زبان میں آسان مدد۔",
    aboutTitle: "زُبان AI کے بارے میں",
    aboutText: "زُبان AI مختلف زبانوں میں سوالات کے جواب اور روزمرہ کے کاموں میں مدد کے لیے بنایا گیا ہے۔",
    aboutPrivacy: "جواب بنانے کے لیے آپ کا سوال آن لائن AI سروس کو بھیجا جاتا ہے۔ حساس یا نجی معلومات شیئر نہ کریں۔",
    aboutDone: "سمجھ گیا",
    closeLabel: "بند کریں",
    thinking: "جواب تیار ہو رہا ہے...",
    waiting: "براہِ کرم تھوڑا انتظار کریں۔",
    emptyQuestion: "پہلے اپنا سوال لکھیں۔",
    errorTitle: "جواب نہیں مل سکا",
    errorText: "دوبارہ کوشش کریں۔ انٹرنیٹ یا AI سروس چیک کرنے کی ضرورت ہو سکتی ہے۔",
    copied: "جواب کاپی ہو گیا۔",
    copyFailed: "کاپی نہیں ہو سکا۔ جواب منتخب کرکے کاپی کریں۔",
    historyCleared: "حالیہ گفتگو صاف ہو گئی۔",
    confirmClearHistory: "کیا آپ حالیہ گفتگو صاف کرنا چاہتے ہیں؟",
    micDenied: "مائیکروفون کی اجازت نہیں ملی۔ براؤزر کی ترتیبات چیک کریں۔",
    micError: "آواز سے سوال شروع نہیں ہو سکا۔ براہِ کرم سوال لکھیں۔",
    noSpeech: "آواز سمجھ نہیں آئی۔ دوبارہ کوشش کریں۔",
    speakUnavailable: "اس براؤزر میں جواب سننے کی سہولت نہیں۔",
    offline: "انٹرنیٹ کنکشن موجود نہیں",
    modeNames: {
      general: "روزمرہ کی مدد",
      student: "پڑھائی",
      shopkeeper: "دکانداری",
      farmer: "کاشت کاری",
      debate: "مباحثہ اور تقریر"
    }
  },

  pa: {
    brandTag: "تہاڈی بولی وچ مدد",
    connection: "انٹرنیٹ موجود اے",
    welcomeKicker: "سوکھا۔ سادہ۔ ساریاں لئی۔",
    welcomeTitle: "اج تہاڈے نوں کس کم وچ مدد چاہیدی اے؟",
    welcomeSubtitle: "اپنی بولی وچ سوال پچھو۔ زُبان AI تہاڈی مدد کرے گا۔",
    welcomeIntro: "لکھو یا بول کے دسو۔ اوکھے لفظاں دی لوڑ نئیں۔",
    assistantLabel: "زُبان AI",
    privacyLabel: "تہاڈا سوال AI سروس نوں بھیجیا جائے گا۔",
    voiceTitle: "بول کے سوال پچھو",
    voiceOverline: "آواز نال مدد",
    voiceHint: "مائیکروفون دباؤ تے بولنا شروع کرو۔",
    voiceStart: "مائیکروفون دباؤ",
    voiceListening: "سن ریا واں... ہن بولو",
    voiceUnsupported: "تہاڈے براؤزر وچ آواز نال سوال دی سہولت نئیں۔ تھلے لکھو۔",
    questionLabel: "تہاڈا سوال",
    questionPlaceholder: "ایتھے اپنا سوال لکھو...",
    askButtonText: "جواب لو",
    composerHint: "سوال بھیجن لئی Enter دباؤ",
    answerTitle: "تہاڈا جواب",
    answerMeta: "AI دا جواب",
    copyAnswerLabel: "جواب کاپی کرو",
    speakAnswerLabel: "جواب سنو",
    clearAnswerLabel: "جواب بند کرو",
    workspacesTitle: "تسی کس کم وچ مدد چاہندے او؟",
    workspacesIntro: "اپنے کم دے حساب نال اک آپشن چنو۔",
    stepLabel: "اپنا کم چنو",
    modeGeneral: "روز دے کم",
    modeGeneralSub: "عام سوال تے روز دے کم",
    modeStudent: "پڑھائی",
    modeStudentSub: "گھر دا کم، حساب تے سائنس",
    modeShopkeeper: "دکانداری",
    modeShopkeeperSub: "حساب، اسٹاک تے گاہک",
    modeFarmer: "کھیتی باڑی",
    modeFarmerSub: "فصل، پانی تے زمین",
    modeDebate: "بحث تے تقریر",
    modeDebateSub: "تقریر، دلیل تے تیاری",
    modeStatus: "چنیا ہویا کم",
    modeStatusText: "تہاڈا کم چن لیا گیا اے۔",
    quickEyebrow: "فوری سوال",
    suggestionsTitle: "ایتھوں شروع کرو",
    suggestionOne: "فیصد کِویں کڈھدے نیں؟",
    suggestionTwo: "انگریزی وچ پیغام لکھ دیو۔",
    suggestionThree: "دکان دا اسٹاک کِویں سنبھالاں؟",
    recentEyebrow: "تہاڈی سرگرمی",
    recentTitle: "پچھلی گلاں",
    clearHistory: "پچھلی گلاں صاف کرو",
    emptyHistoryText: "ہن تک کوئی پچھلی گل نئیں۔",
    newChatLabel: "نئی گل بات",
    largeTextLabel: "وڈا لکھیا",
    helpButtonLabel: "زُبان AI بارے",
    footerTag: "زُبان AI",
    footerNote: "تہاڈی بولی وچ سوکھی مدد۔",
    aboutTitle: "زُبان AI بارے",
    aboutText: "زُبان AI مختلف بولیاں وچ سوالاں دے جواب تے روز دے کم وچ مدد لئی بنایا گیا اے۔",
    aboutPrivacy: "جواب لئی تہاڈا سوال آن لائن AI سروس نوں بھیجیا جاندا اے۔ نجی معلومات نہ بھیجو۔",
    aboutDone: "ٹھیک اے",
    closeLabel: "بند کرو",
    thinking: "جواب تیار ہو ریا اے...",
    waiting: "ذرا انتظار کرو۔",
    emptyQuestion: "پہلاں اپنا سوال لکھو۔",
    errorTitle: "جواب نئیں مل سکیا",
    errorText: "فیر کوشش کرو۔ انٹرنیٹ یا AI سروس چیک کرنی پے سکدی اے۔",
    copied: "جواب کاپی ہو گیا۔",
    copyFailed: "کاپی نئیں ہو سکیا۔ جواب چن کے کاپی کرو۔",
    historyCleared: "پچھلی گلاں صاف ہو گئیاں۔",
    confirmClearHistory: "کی تسی پچھلی گلاں صاف کرنا چاہندے او؟",
    micDenied: "مائیکروفون دی اجازت نئیں ملی۔ براؤزر سیٹنگز چیک کرو۔",
    micError: "آواز نال سوال شروع نئیں ہو سکیا۔ سوال لکھ کے بھیجو۔",
    noSpeech: "آواز سمجھ نئیں آئی۔ فیر کوشش کرو۔",
    speakUnavailable: "ایس براؤزر وچ جواب سنن دی سہولت نئیں۔",
    offline: "انٹرنیٹ کنکشن نئیں",
    modeNames: {
      general: "روز دے کم",
      student: "پڑھائی",
      shopkeeper: "دکانداری",
      farmer: "کھیتی باڑی",
      debate: "بحث تے تقریر"
    }
  },

  sd: {
    brandTag: "توهان جي ٻوليءَ ۾ مدد",
    connection: "انٽرنيٽ موجود آهي",
    welcomeKicker: "آسان. سادو. سڀني لاءِ.",
    welcomeTitle: "اڄ توهان کي ڪهڙي ڪم ۾ مدد گهرجي؟",
    welcomeSubtitle: "پنهنجي ٻوليءَ ۾ سوال پڇو. زُبان AI توهان جي مدد ڪندو.",
    welcomeIntro: "لکو يا ڳالهائي ٻڌايو. ڏکين لفظن جي ضرورت ناهي.",
    assistantLabel: "زُبان AI",
    privacyLabel: "توهان جو سوال AI سروس ڏانهن موڪليو ويندو.",
    voiceTitle: "ڳالهائي سوال پڇو",
    voiceOverline: "آواز سان مدد",
    voiceHint: "مائڪروفون دٻايو ۽ ڳالهائڻ شروع ڪريو.",
    voiceStart: "مائڪروفون دٻايو",
    voiceListening: "ٻڌي رهيو آهي... هاڻي ڳالهايو",
    voiceUnsupported: "هن برائوزر ۾ آواز سان سوال ڪرڻ جي سهولت ناهي. هيٺ لکو.",
    questionLabel: "توهان جو سوال",
    questionPlaceholder: "هتي پنهنجو سوال لکو...",
    askButtonText: "جواب حاصل ڪريو",
    composerHint: "سوال موڪلڻ لاءِ Enter دٻايو",
    answerTitle: "توهان جو جواب",
    answerMeta: "AI جو جواب",
    copyAnswerLabel: "جواب ڪاپي ڪريو",
    speakAnswerLabel: "جواب ٻڌو",
    clearAnswerLabel: "جواب بند ڪريو",
    workspacesTitle: "توهان کي ڪهڙي ڪم ۾ مدد گهرجي؟",
    workspacesIntro: "پنهنجي ڪم مطابق هڪ اختيار چونڊيو.",
    stepLabel: "پنهنجو ڪم چونڊيو",
    modeGeneral: "روزمره جي مدد",
    modeGeneralSub: "عام سوال ۽ روز جا ڪم",
    modeStudent: "پڙهائي",
    modeStudentSub: "گهر جو ڪم، حساب ۽ سائنس",
    modeShopkeeper: "دڪانداري",
    modeShopkeeperSub: "حساب، اسٽاڪ ۽ گراهڪ",
    modeFarmer: "زراعت",
    modeFarmerSub: "فصل، پاڻي ۽ زمين",
    modeDebate: "بحث ۽ تقريرون",
    modeDebateSub: "تقرير، دليل ۽ تياري",
    modeStatus: "چونڊيل ڪم",
    modeStatusText: "توهان جو ڪم چونڊيو ويو آهي.",
    quickEyebrow: "فوري سوال",
    suggestionsTitle: "هتان شروع ڪريو",
    suggestionOne: "سيڪڙو ڪيئن ڪڍجي؟",
    suggestionTwo: "انگريزي ۾ پيغام لکي ڏيو.",
    suggestionThree: "دڪان جو اسٽاڪ ڪيئن سنڀاليان؟",
    recentEyebrow: "توهان جي سرگرمي",
    recentTitle: "تازيون ڳالهيون",
    clearHistory: "تاريخ صاف ڪريو",
    emptyHistoryText: "اڃا ڪا تازي ڳالهه ناهي.",
    newChatLabel: "نئين ڳالهه",
    largeTextLabel: "وڏو متن",
    helpButtonLabel: "زُبان AI بابت",
    footerTag: "زُبان AI",
    footerNote: "توهان جي ٻوليءَ ۾ آسان مدد.",
    aboutTitle: "زُبان AI بابت",
    aboutText: "زُبان AI مختلف ٻولين ۾ سوالن جا جواب ۽ روزمره جي ڪمن ۾ مدد لاءِ ٺاهيو ويو آهي.",
    aboutPrivacy: "جواب ٺاهڻ لاءِ توهان جو سوال آن لائن AI سروس ڏانهن موڪليو ويندو. ذاتي معلومات نه موڪليو.",
    aboutDone: "سمجهي ويس",
    closeLabel: "بند ڪريو",
    thinking: "جواب تيار ٿي رهيو آهي...",
    waiting: "مهرباني ڪري ٿورو انتظار ڪريو.",
    emptyQuestion: "پهريان پنهنجو سوال لکو.",
    errorTitle: "جواب نه ملي سگهيو",
    errorText: "ٻيهر ڪوشش ڪريو. انٽرنيٽ يا AI سروس چيڪ ڪرڻي پئجي سگهي ٿي.",
    copied: "جواب ڪاپي ٿي ويو.",
    copyFailed: "ڪاپي نه ٿي سگهيو. جواب چونڊي ڪاپي ڪريو.",
    historyCleared: "تازيون ڳالهيون صاف ٿي ويون.",
    confirmClearHistory: "ڇا توهان تازيون ڳالهيون صاف ڪرڻ چاهيو ٿا؟",
    micDenied: "مائڪروفون جي اجازت نه ملي. برائوزر سيٽنگون چيڪ ڪريو.",
    micError: "آواز سان سوال شروع نه ٿي سگهيو. سوال لکي موڪليو.",
    noSpeech: "آواز سمجهه ۾ نه آئي. ٻيهر ڪوشش ڪريو.",
    speakUnavailable: "هن برائوزر ۾ جواب ٻڌڻ جي سهولت ناهي.",
    offline: "انٽرنيٽ ڪنيڪشن موجود ناهي",
    modeNames: {
      general: "روزمره جي مدد",
      student: "پڙهائي",
      shopkeeper: "دڪانداري",
      farmer: "زراعت",
      debate: "بحث ۽ تقريرون"
    }
  },

  ps: {
    brandTag: "ستاسو په ژبه مرسته",
    connection: "انټرنېټ شته",
    welcomeKicker: "اسانه. روښانه. د ټولو لپاره.",
    welcomeTitle: "نن له کوم کار سره مرسته غواړئ؟",
    welcomeSubtitle: "په خپله ژبه پوښتنه وکړئ. زُبان AI ستاسو مرسته کوي.",
    welcomeIntro: "خپله پوښتنه ولیکئ یا یې په خبرو ووایئ.",
    assistantLabel: "زُبان AI",
    privacyLabel: "ستاسو پوښتنه AI خدمت ته لېږل کېږي.",
    voiceTitle: "په خبرو پوښتنه وکړئ",
    voiceOverline: "غږیز مرستیال",
    voiceHint: "مایکروفون کېکاږئ او خبرې پیل کړئ.",
    voiceStart: "مایکروفون کېکاږئ",
    voiceListening: "اورم... اوس خبرې وکړئ",
    voiceUnsupported: "په دې براوزر کې غږیزه پوښتنه نشته. لاندې خپله پوښتنه ولیکئ.",
    questionLabel: "ستاسو پوښتنه",
    questionPlaceholder: "خپله پوښتنه دلته ولیکئ...",
    askButtonText: "ځواب ترلاسه کړئ",
    composerHint: "د لېږلو لپاره Enter کېکاږئ",
    answerTitle: "ستاسو ځواب",
    answerMeta: "د AI ځواب",
    copyAnswerLabel: "ځواب کاپي کړئ",
    speakAnswerLabel: "ځواب واورئ",
    clearAnswerLabel: "ځواب بند کړئ",
    workspacesTitle: "له کوم کار سره مرسته غواړئ؟",
    workspacesIntro: "د خپل کار لپاره یو انتخاب وکړئ.",
    stepLabel: "خپل کار وټاکئ",
    modeGeneral: "ورځني کارونه",
    modeGeneralSub: "عمومي پوښتنې او ورځني کارونه",
    modeStudent: "زده کړه",
    modeStudentSub: "کورنی کار، ریاضي او ساینس",
    modeShopkeeper: "دوکانداري",
    modeShopkeeperSub: "حساب، سټاک او پېرودونکي",
    modeFarmer: "کرنه",
    modeFarmerSub: "حاصلات، اوبه او خاوره",
    modeDebate: "مناظرې او ویناوې",
    modeDebateSub: "وینا، دلیل او چمتووالی",
    modeStatus: "ټاکل شوی کار",
    modeStatusText: "ستاسو کار وټاکل شو.",
    quickEyebrow: "چټکې پوښتنې",
    suggestionsTitle: "له دې ځایه پیل وکړئ",
    suggestionOne: "سلنه څنګه حساب کړم؟",
    suggestionTwo: "په انګلیسي کې پیغام ولیکئ.",
    suggestionThree: "د دوکان سټاک څنګه اداره کړم؟",
    recentEyebrow: "ستاسو فعالیت",
    recentTitle: "وروستۍ خبرې",
    clearHistory: "تاریخچه پاکه کړئ",
    emptyHistoryText: "تر اوسه وروستۍ خبرې نشته.",
    newChatLabel: "نوې خبرې",
    largeTextLabel: "لوی متن",
    helpButtonLabel: "د زُبان AI په اړه",
    footerTag: "زُبان AI",
    footerNote: "ستاسو په ژبه اسانه مرسته.",
    aboutTitle: "د زُبان AI په اړه",
    aboutText: "زُبان AI په بېلابېلو ژبو کې د پوښتنو ځوابونو او ورځنیو کارونو لپاره جوړ شوی دی.",
    aboutPrivacy: "ستاسو پوښتنه د ځواب جوړولو لپاره آنلاین AI خدمت ته لېږل کېږي. شخصي معلومات مه شریکوئ.",
    aboutDone: "سمه ده",
    closeLabel: "بندول",
    thinking: "ځواب چمتو کېږي...",
    waiting: "مهرباني وکړئ لږ انتظار وکړئ.",
    emptyQuestion: "لومړی خپله پوښتنه ولیکئ.",
    errorTitle: "ځواب ترلاسه نه شو",
    errorText: "بیا هڅه وکړئ. کېدای شي انټرنېټ یا AI خدمت وکتل شي.",
    copied: "ځواب کاپي شو.",
    copyFailed: "کاپي نه شو. ځواب وټاکئ او کاپي یې کړئ.",
    historyCleared: "وروستۍ خبرې پاکې شوې.",
    confirmClearHistory: "ایا وروستۍ خبرې پاکول غواړئ؟",
    micDenied: "د مایکروفون اجازه نشته. د براوزر تنظیمات وګورئ.",
    micError: "غږیزه پوښتنه پیل نه شوه. خپله پوښتنه ولیکئ.",
    noSpeech: "غږ ونه پېژندل شو. بیا هڅه وکړئ.",
    speakUnavailable: "په دې براوزر کې د ځواب اورېدو اسانتیا نشته.",
    offline: "انټرنېټ نشته",
    modeNames: {
      general: "ورځني کارونه",
      student: "زده کړه",
      shopkeeper: "دوکانداري",
      farmer: "کرنه",
      debate: "مناظرې او ویناوې"
    }
  }
};

let currentLanguage = "roman";
let currentMode = "general";
let recognition = null;
let isListening = false;
let currentReply = "";
let requestInProgress = false;

const HISTORY_KEY = "zubaan-ai-recent-chats-v2";
const MAX_HISTORY = 8;

function t(key) {
  return TEXT[currentLanguage]?.[key] ?? TEXT.roman[key] ?? key;
}

function setText(id, value) {
  const el = $(id);
  if (el && value !== undefined) el.textContent = value;
}

function setHidden(id, hidden) {
  const el = $(id);
  if (el) el.hidden = hidden;
}

function showToast(message) {
  const toast = $("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  if (showToast.timeout) clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function updateConnection() {
  const connection = $("connection");
  const label = $("connectionText");
  if (!connection || !label) return;

  const online = navigator.onLine;
  connection.classList.toggle("online", online);
  connection.classList.toggle("offline", !online);
  label.textContent = online ? t("connection") : t("offline");
}

function updateModeUI() {
  document.querySelectorAll("[data-mode]").forEach((button) => {
    const active = button.dataset.mode === currentMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  setText("modeStatus", t("modeStatus"));
  setText("modeStatusText", t("modeStatusText"));
}

function renderLanguage() {
  const dictionary = TEXT[currentLanguage] || TEXT.roman;

  document.documentElement.lang =
    currentLanguage === "roman" ? "ur-Latn" : currentLanguage;

  document.documentElement.dir =
    RTL_LANGUAGES.includes(currentLanguage) ? "rtl" : "ltr";

  document.body.dir =
    RTL_LANGUAGES.includes(currentLanguage) ? "rtl" : "ltr";

  const textIds = [
    "brandTag", "welcomeKicker", "welcomeTitle", "welcomeSubtitle",
    "welcomeIntro", "assistantLabel", "privacyLabel", "voiceTitle",
    "voiceOverline", "voiceHint", "questionLabel", "askButtonText",
    "composerHint", "answerTitle", "answerMeta", "copyAnswerLabel",
    "speakAnswerLabel", "workspacesTitle", "workspacesIntro", "stepLabel",
    "modeGeneral", "modeGeneralSub", "modeStudent", "modeStudentSub",
    "modeShopkeeper", "modeShopkeeperSub", "modeFarmer", "modeFarmerSub",
    "modeDebate", "modeDebateSub", "quickEyebrow", "suggestionsTitle",
    "suggestionOne", "suggestionTwo", "suggestionThree", "recentEyebrow",
    "recentTitle", "clearHistory", "emptyHistoryText", "newChatLabel",
    "largeTextLabel", "footerTag", "footerNote", "aboutTitle",
    "aboutText", "aboutPrivacy", "aboutDone"
  ];

  textIds.forEach((id) => {
    if (dictionary[id] !== undefined) setText(id, dictionary[id]);
  });

  const question = $("question");
  if (question) question.placeholder = t("questionPlaceholder");

  const voiceButton = $("voiceButton");
  if (voiceButton) {
    voiceButton.setAttribute("aria-label", t("voiceStart"));
    voiceButton.title = t("voiceStart");
  }

  const helpButton = $("helpButton");
  if (helpButton) {
    helpButton.setAttribute("aria-label", t("helpButtonLabel"));
    helpButton.title = t("helpButtonLabel");
  }

  const largeText = $("largeText");
  if (largeText) {
    largeText.setAttribute("aria-label", t("largeTextLabel"));
  }

  document.querySelectorAll("[data-question]").forEach((button) => {
    const index = Number(button.dataset.suggestionIndex);
    if (Number.isInteger(index) && index >= 0 && index < 3) {
      button.dataset.question = [
        t("suggestionOne"),
        t("suggestionTwo"),
        t("suggestionThree")
      ][index];
    }
  });

  updateModeUI();
  updateConnection();
  renderHistory();

  if (isListening) {
    setText("voiceStatus", t("voiceListening"));
  }
}

function getHistory() {
  try {
    const value = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveHistory(question, reply, mode) {
  try {
    const history = getHistory();

    history.unshift({
      question,
      reply,
      mode,
      time: Date.now()
    });

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history.slice(0, MAX_HISTORY))
    );
  } catch (error) {
    console.warn("Could not save recent chats:", error);
  }

  renderHistory();
}

function renderHistory() {
  const list = $("recentList");
  if (!list) return;

  list.replaceChildren();
  const history = getHistory();

  setHidden("emptyHistoryText", history.length > 0);

  history.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "recent-item";
    button.textContent = item.question;
    button.title = item.question;

    button.addEventListener("click", () => {
      const question = $("question");
      if (question) {
        question.value = item.question;
        question.focus();
      }

      if (item.reply) {
        currentReply = item.reply;
        setText("answerTitle", t("answerTitle"));
        setText("answerText", item.reply);
        setText("answerMeta", t("modeNames")?.[item.mode] || t("answerMeta"));
        setHidden("answer", false);
      }

      if (item.mode && MODE_NAMES[item.mode]) {
        currentMode = item.mode;
        updateModeUI();
      }
    });

    list.appendChild(button);
  });
}

function selectMode(mode) {
  if (!MODE_NAMES[mode]) return;

  currentMode = mode;
  updateModeUI();

  const question = $("question");
  if (question) question.focus();
}

async function askAI(message) {
  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      language: LANGUAGE_NAMES[currentLanguage] || "Roman Urdu",
      mode: currentMode
    })
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The AI service returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  if (!data || typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("The AI service returned no answer.");
  }

  return data.reply.trim();
}

async function submitQuestion(message) {
  const question = $("question");
  const answer = $("answer");
  const answerText = $("answerText");
  const submitButton = $("questionForm")?.querySelector(
    'button[type="submit"]'
  );

  const cleanMessage = String(message || "").trim();

  if (!cleanMessage) {
    if (question) {
      question.setCustomValidity(t("emptyQuestion"));
      question.reportValidity();
      question.focus();
    } else {
      showToast(t("emptyQuestion"));
    }
    return;
  }

  if (requestInProgress) return;

  requestInProgress = true;
  if (submitButton) submitButton.disabled = true;

  setText("askButtonText", t("thinking"));
  setText("answerTitle", t("answerTitle"));
  setText("answerMeta", t("waiting"));

  if (answerText) answerText.textContent = t("waiting");
  setHidden("answer", false);

  if (answer) {
    answer.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  try {
    const reply = await askAI(cleanMessage);
    currentReply = reply;

    if (answerText) answerText.textContent = reply;

    setText("answerTitle", t("answerTitle"));
    setText("answerMeta", t("modeNames")?.[currentMode] || t("answerMeta"));

    saveHistory(cleanMessage, reply, currentMode);
  } catch (error) {
    console.error("Zubaan AI request failed:", error);

    currentReply = "";
    setText("answerTitle", t("errorTitle"));

    if (answerText) {
      answerText.textContent =
        error.message && error.message.length < 220
          ? `${t("errorText")}\n\n${error.message}`
          : t("errorText");
    }

    setText("answerMeta", "");
  } finally {
    requestInProgress = false;
    if (submitButton) submitButton.disabled = false;
    setText("askButtonText", t("askButtonText"));
  }
}

function setupVoiceInput() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const voiceButton = $("voiceButton");
  if (!voiceButton) return;

  if (!SpeechRecognition) {
    voiceButton.addEventListener("click", () => {
      showToast(t("voiceUnsupported"));
      setText("voiceStatus", t("voiceUnsupported"));
    });
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  function startListening() {
    if (isListening) {
      recognition.stop();
      return;
    }

    recognition.lang = SPEECH_LANGUAGES[currentLanguage] || "ur-PK";

    try {
      recognition.start();
    } catch (error) {
      console.warn("Voice recognition could not start:", error);
      showToast(t("micError"));
    }
  }

  voiceButton.addEventListener("click", startListening);

  recognition.onstart = () => {
    isListening = true;
    voiceButton.classList.add("listening");
    voiceButton.setAttribute("aria-pressed", "true");
    setText("voiceStatus", t("voiceListening"));
  };

  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    const question = $("question");
    if (question && transcript.trim()) {
      question.value = transcript.trim();
      question.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  recognition.onerror = (event) => {
    console.warn("Speech recognition error:", event.error);

    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      showToast(t("micDenied"));
    } else if (event.error === "no-speech") {
      showToast(t("noSpeech"));
    } else {
      showToast(t("micError"));
    }
  };

  recognition.onend = () => {
    isListening = false;
    voiceButton.classList.remove("listening");
    voiceButton.setAttribute("aria-pressed", "false");
    setText("voiceStatus", t("voiceHint"));
  };
}

function speakAnswer() {
  if (!currentReply) return;

  if (!("speechSynthesis" in window)) {
    showToast(t("speakUnavailable"));
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(currentReply);
  utterance.lang = SPEECH_LANGUAGES[currentLanguage] || "ur-PK";
  utterance.rate = 0.92;

  window.speechSynthesis.speak(utterance);
}

async function copyAnswer() {
  if (!currentReply) return;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(currentReply);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = currentReply;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      const copied = document.execCommand("copy");
      textarea.remove();

      if (!copied) throw new Error("Copy command failed");
    }

    showToast(t("copied"));
  } catch (error) {
    console.error("Copy failed:", error);
    showToast(t("copyFailed"));
  }
}

function clearAnswer() {
  currentReply = "";
  setHidden("answer", true);
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function startNewChat() {
  if (recognition && isListening) recognition.stop();

  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  const question = $("question");
  if (question) {
    question.value = "";
    question.setCustomValidity("");
    question.focus();
  }

  clearAnswer();
  setText("voiceStatus", t("voiceHint"));
}

function setupAboutDialog() {
  const dialog = $("aboutDialog");
  const helpButton = $("helpButton");
  const closeButton = $("closeAbout");
  const doneButton = $("aboutDone");

  if (helpButton && dialog) {
    helpButton.addEventListener("click", () => {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
    });
  }

  [closeButton, doneButton].forEach((button) => {
    if (!button || !dialog) return;

    button.addEventListener("click", () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    });
  });
}

function setupEvents() {
  const languageSelect = $("language");

  if (languageSelect) {
    currentLanguage = TEXT[languageSelect.value]
      ? languageSelect.value
      : "roman";

    languageSelect.addEventListener("change", () => {
      currentLanguage = TEXT[languageSelect.value]
        ? languageSelect.value
        : "roman";

      renderLanguage();
    });
  }

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      selectMode(button.dataset.mode);
    });
  });

  document.querySelectorAll("[data-question]").forEach((button, index) => {
    button.dataset.suggestionIndex = String(index % 3);

    button.addEventListener("click", () => {
      const question = $("question");
      if (!question) return;

      question.value = button.dataset.question || button.textContent.trim();
      question.focus();
    });
  });

  const form = $("questionForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitQuestion($("question")?.value || "");
    });
  }

  const question = $("question");
  if (question) {
    question.addEventListener("input", () => {
      question.setCustomValidity("");
    });
  }

  const newChat = $("newChat");
  if (newChat) newChat.addEventListener("click", startNewChat);

  const clear = $("clearAnswer");
  if (clear) clear.addEventListener("click", clearAnswer);

  const copy = $("copyAnswer");
  if (copy) copy.addEventListener("click", copyAnswer);

  const speak = $("speakAnswer");
  if (speak) speak.addEventListener("click", speakAnswer);

  const largeText = $("largeText");
  if (largeText) {
    largeText.addEventListener("click", () => {
      const enabled = document.body.classList.toggle("large-text");
      largeText.setAttribute("aria-pressed", String(enabled));
    });
  }

  const clearHistory = $("clearHistory");
  if (clearHistory) {
    clearHistory.addEventListener("click", () => {
      if (!window.confirm(t("confirmClearHistory"))) return;

      try {
        localStorage.removeItem(HISTORY_KEY);
      } catch (error) {
        console.warn("Could not clear recent chats:", error);
      }

      renderHistory();
      showToast(t("historyCleared"));
    });
  }

  window.addEventListener("online", updateConnection);
  window.addEventListener("offline", updateConnection);

  setupVoiceInput();
  setupAboutDialog();
}

function initZubaanAI() {
  setupEvents();
  renderLanguage();
  updateModeUI();
  renderHistory();
  updateConnection();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initZubaanAI);
} else {
  initZubaanAI();
}
