export interface DailyAyahItem {
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  arabicText: string;
  hindiTranslation: string;
  englishTranslation: string;
  theme: string;
}

export const DAILY_AYAHS: DailyAyahItem[] = [
  {
    surahNumber: 2,
    surahName: "سُورَةُ البَقَرَةِ",
    surahEnglishName: "Al-Baqarah",
    ayahNumber: 255,
    arabicText: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ",
    hindiTranslation: "अल्लाह, जिसके सिवा कोई सच्चा पूज्य नहीं, वह हमेशा ज़िंदा और सबको क़ायम रखने वाला है। न उसे ऊँघ आती है और न नींद।",
    englishTranslation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep.",
    theme: "Ayat al-Kursi (Divine Majesty & Protection)"
  },
  {
    surahNumber: 94,
    surahName: "سُورَةُ الشَّرْحِ",
    surahEnglishName: "Ash-Sharh",
    ayahNumber: 5,
    arabicText: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    hindiTranslation: "तो बेशक तंगी और कठिनाई के साथ ही आसानी है।",
    englishTranslation: "For indeed, with hardship [will be] ease.",
    theme: "Hope & Patience"
  },
  {
    surahNumber: 94,
    surahName: "سُورَةُ الشَّرْحِ",
    surahEnglishName: "Ash-Sharh",
    ayahNumber: 6,
    arabicText: "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    hindiTranslation: "यक़ीनन तंगी के साथ आसानी है।",
    englishTranslation: "Indeed, with hardship [will be] ease.",
    theme: "Assurance of Relief"
  },
  {
    surahNumber: 13,
    surahName: "سُورَةُ الرَّعْدِ",
    surahEnglishName: "Ar-Ra'd",
    ayahNumber: 28,
    arabicText: "ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ ۗ أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
    hindiTranslation: "जो लोग ईमान लाए और जिनके दिलों को अल्लाह के ज़िक्र से सुकून हासिल होता है। याद रखो! अल्लाह के ज़िक्र ही से दिलों को इत्मीनान मिलता है।",
    englishTranslation: "Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.",
    theme: "Peace of Heart (Zikr)"
  },
  {
    surahNumber: 39,
    surahName: "سُورَةُ الزُّمَرِ",
    surahEnglishName: "Az-Zumar",
    ayahNumber: 53,
    arabicText: "قُلْ يَٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا",
    hindiTranslation: "कह दो कि ऐ मेरे बन्दो जिन्होंने अपनी जानों पर ज़्यादती की है, अल्लाह की रहमत से मायूस न हो, बेशक अल्लाह सारे गुनाह माफ़ कर देता है।",
    englishTranslation: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'",
    theme: "Boundless Mercy & Forgiveness"
  },
  {
    surahNumber: 2,
    surahName: "سُورَةُ البَقَرَةِ",
    surahEnglishName: "Al-Baqarah",
    ayahNumber: 286,
    arabicText: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ",
    hindiTranslation: "अल्लाह किसी जान पर उसकी ताक़त और बिसात से ज़्यादा बोझ नहीं डालता।",
    englishTranslation: "Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained.",
    theme: "Comfort in Tribulations"
  },
  {
    surahNumber: 65,
    surahName: "سُورَةُ الطَّلَاقِ",
    surahEnglishName: "At-Talaaq",
    ayahNumber: 3,
    arabicText: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥٓ",
    hindiTranslation: "और उसे ऐसी जगह से रोज़ी देगा जहाँ का उसे गुमान भी न होगा, और जो कोई अल्लाह पर भरोसा रखेगा तो वह उसके लिए काफ़ी है।",
    englishTranslation: "And will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him.",
    theme: "Tawakkul (Reliance on Allah)"
  },
  {
    surahNumber: 3,
    surahName: "سُورَةُ آلِ عِمْرَانَ",
    surahEnglishName: "Aal-i-Imran",
    ayahNumber: 139,
    arabicText: "وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    hindiTranslation: "और न हिम्मत हारो और न रंज करो, तुम ही ग़ालिब रहोगे अगर तुम मोमिन हो।",
    englishTranslation: "So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
    theme: "Steadfast Faith & Strength"
  },
  {
    surahNumber: 2,
    surahName: "سُورَةُ البَقَرَةِ",
    surahEnglishName: "Al-Baqarah",
    ayahNumber: 152,
    arabicText: "فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ",
    hindiTranslation: "तो तुम मुझे याद रखो मैं तुम्हें याद रखूँगा, और मेरा शुक्र अदा करो और मेरी नाशुुक्री मत करो।",
    englishTranslation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    theme: "Gratitude & Remembrance"
  },
  {
    surahNumber: 2,
    surahName: "سُورَةُ البَقَرَةِ",
    surahEnglishName: "Al-Baqarah",
    ayahNumber: 186,
    arabicText: "وَإِذَا سَأَلَكَ عِبَادِى عَنِّى فَإِنِّى قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ ٱلدَّاعِ إِذَا دَعَانِ",
    hindiTranslation: "और जब मेरे बन्दे तुमसे मेरे बारे में पूछें तो (कह दो कि) मैं तो करीब ही हूँ, पुकारने वाला जब मुझे पुकारता है तो मैं उसकी दुआ सुनता हूँ।",
    englishTranslation: "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
    theme: "Allah is Always Near"
  },
  {
    surahNumber: 1,
    surahName: "سُورَةُ ٱلْفَاتِحَةِ",
    surahEnglishName: "Al-Faatiha",
    ayahNumber: 6,
    arabicText: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
    hindiTranslation: "हमें सीधा रास्ता दिखा।",
    englishTranslation: "Guide us to the straight path.",
    theme: "The Prayer for Guidance"
  },
  {
    surahNumber: 55,
    surahName: "سُورَةُ الرَّحْمَٰنِ",
    surahEnglishName: "Ar-Rahmaan",
    ayahNumber: 13,
    arabicText: "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ",
    hindiTranslation: "तो (ऐ जिन्न और इंसान!) तुम अपने रब की कौन-कौन सी नेमतों को झुठलाओगे?",
    englishTranslation: "So which of the favors of your Lord would you deny?",
    theme: "Reflecting on Blessings"
  }
];

export function getDailyAyah(): DailyAyahItem {
  // Deterministic daily selection based on days since epoch in UTC/local date
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - startOfYear.getTime()) + ((startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = Math.abs(dayOfYear) % DAILY_AYAHS.length;
  return DAILY_AYAHS[index];
}
