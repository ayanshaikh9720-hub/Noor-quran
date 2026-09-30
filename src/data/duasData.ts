import { DuaItem } from '../types/quran';

export const DUA_CATEGORIES = [
  'All',
  'Morning Duas',
  'Evening Duas',
  'Protection',
  'Travel',
  'Forgiveness',
  'Rizq',
  'Parents',
  'Anxiety/Difficulty',
  'Ramadan'
] as const;

export const DUAS_DATA: DuaItem[] = [
  // Morning Duas
  {
    id: 'morn-1',
    title: 'Morning Awakening (सुबह जागने की दुआ)',
    category: 'Morning Duas',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Alhamdu lillahil-lathee ahyana ba'da ma amatana wa-ilayhin-nushoor",
    hindiMeaning: "सब तारीफ़ उस अल्लाह के लिए है जिसने हमें मौत (नींद) के बाद ज़िन्दगी बख़्शी और उसी की तरफ़ उठकर जाना है।",
    englishMeaning: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    source: "Sahih al-Bukhari 6312",
    targetCount: 1
  },
  {
    id: 'morn-2',
    title: 'Sayyidul Istighfar (सैय्यिदुल इस्तिग़फ़ार)',
    category: 'Morning Duas',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa-ana 'abduka, wa-ana 'ala 'ahdika wa-wa'dika mastata'tu, a'oothu bika min sharri ma sana'tu, aboo'u laka bini'matika 'alayya, wa-aboo'u bithanbee faghfir lee fa-innahu la yaghfiruth-thunooba illa anta",
    hindiMeaning: "ऐ अल्लाह! तू ही मेरा रब है, तेरे सिवा कोई माबूद नहीं। तूने ही मुझे पैदा किया और मैं तेरा बन्दा हूँ और अपनी ताक़त के मुताबिक़ तेरे अहद और वादे पर क़ायम हूँ। मैं अपनी बुराइयों के शर से तेरी पनाह चाहता हूँ। मैं तेरे अपने ऊपर किए एहसानों का इक़रार करता हूँ और अपने गुनाहों का एतिराफ़ करता हूँ, पस मुझे बख़्श दे क्योंकि तेरे सिवा गुनाहों को कोई माफ़ नहीं कर सकता।",
    englishMeaning: "O Allah, You are my Lord, none has the right to be worshiped but You. You created me and I am Your servant, and I abide to Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.",
    source: "Sahih al-Bukhari 6306",
    targetCount: 1
  },
  {
    id: 'morn-3',
    title: 'Morning Protection Dua (सुबह की हिफ़ाज़त)',
    category: 'Morning Duas',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Asbahna wa-asbahal-mulku lillahi, walhamdu lillahi, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa-lahul-hamdu wa-huwa 'ala kulli shay'in qadeer",
    hindiMeaning: "हमने सुबह की और सारी हुकूमत अल्लाह के लिए सुबह में दाखिल हुई, सब तारीफ़ अल्लाह के लिए है, अल्लाह के सिवा कोई माबूद नहीं, वह अकेला है, उसका कोई साझी नहीं, उसी का मुल्क है और उसी की तारीफ़ है और वह हर चीज़ पर क़ादिर है।",
    englishMeaning: "We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah alone, without partner.",
    source: "Sahih Muslim 2723",
    targetCount: 1
  },

  // Evening Duas
  {
    id: 'eve-1',
    title: 'Evening Dhikr (शाम का ज़िक्र व पनाह)',
    category: 'Evening Duas',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Amsayna wa-amsal-mulku lillahi, walhamdu lillahi, la ilaha illallahu wahdahu la shareeka lah",
    hindiMeaning: "हमने शाम की और अल्लाह की सारी सल्तनत ने शाम की, सब तारीफ़ अल्लाह के लिए है, अल्लाह के सिवा कोई माबूद नहीं, वह अकेला है उसका कोई शरीक नहीं।",
    englishMeaning: "We have entered upon evening and the whole kingdom of Allah has entered upon evening, and all praise is for Allah.",
    source: "Sahih Muslim 2723",
    targetCount: 1
  },
  {
    id: 'eve-2',
    title: 'Evening Shield (बुरे असरात से हिफ़ाज़त)',
    category: 'Evening Duas',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'oothu bikalimatil-lahit-tammati min sharri ma khalaq",
    hindiMeaning: "मैं अल्लाह के मुकम्मल कलिमात की पनाह लेता हूँ हर उस चीज़ के शर से जो उसने पैदा की है।",
    englishMeaning: "I seek refuge in the perfect words of Allah from the evil of that which He has created.",
    source: "Sahih Muslim 2709 (शाम में 3 मर्तबा)",
    targetCount: 3
  },

  // Protection
  {
    id: 'prot-1',
    title: 'Immunity from Any Harm (हर नुक़सान से हिफ़ाज़त)',
    category: 'Protection',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahi allathee la yadurru ma'asmihi shay'un fil-ardi wala fis-sama'i wa-huwas-samee'ul-'aleem",
    hindiMeaning: "अल्लाह के नाम के साथ, जिसकी बरकत से ज़मीन और आसमान में कोई चीज़ नुक़सान नहीं पहुँचा सकती, और वही खूब सुनने वाला और जानने वाला है।",
    englishMeaning: "In the name of Allah, with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.",
    source: "Sunan Abu Dawood 5088, At-Tirmidhi 3388 (3 times morning & evening)",
    targetCount: 3
  },
  {
    id: 'prot-2',
    title: 'Leaving Home Protection (घर से निकलते वक़्त की दुआ)',
    category: 'Protection',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: "Bismillahi tawakkaltu 'alallahi, wa-la hawla wa-la quwwata illa billah",
    hindiMeaning: "अल्लाह के नाम के साथ, मैंने अल्लाह पर भरोसा किया, और गुनाहों से बचने और नेकी करने की ताक़त अल्लाह की तौफ़ीक़ के बग़ैर नहीं।",
    englishMeaning: "In the name of Allah, I place my trust in Allah, and there is neither might nor power except by Allah.",
    source: "Sunan Abu Dawood 5095, At-Tirmidhi 3426",
    targetCount: 1
  },

  // Travel
  {
    id: 'trav-1',
    title: 'Supplication for Travel (सफ़र की दुआ)',
    category: 'Travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: "Subhana allathee sakh-khara lana hatha wa-ma kunna lahu muqrineen, wa-inna ila Rabbina lamunqaliboon",
    hindiMeaning: "पाक है वह ज़ात जिसने इसे हमारे ताबे कर दिया, हालाँकि हम इसे क़ाबू में नहीं कर सकते थे, और बेशक हम अपने रब ही की तरफ़ लौटने वाले हैं।",
    englishMeaning: "Glory unto Him who has subjected this to us, and we were not capable of it on our own. And verily, unto our Lord we shall return.",
    source: "Surah Az-Zukhruf (43:13-14) / Sahih Muslim 1342",
    targetCount: 1
  },

  // Forgiveness
  {
    id: 'forg-1',
    title: 'Prophet Yunus Dua in Distress (हज़रत यूनुस अलैहिस्सलाम की दुआ)',
    category: 'Forgiveness',
    arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: "La ilaha illa anta subhanaka innee kuntu minaz-zalimeen",
    hindiMeaning: "तेरे सिवा कोई माबूद नहीं, तू पाक है, बेशक मैं ही क़ुसूरवारों (ज़ालिमों) में से था।",
    englishMeaning: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    source: "Surah Al-Anbiya (21:87) / At-Tirmidhi 3505",
    targetCount: 1
  },
  {
    id: 'forg-2',
    title: 'Rabbana Forgiveness & Mercy (रब्बना मग़फ़िरत की दुआ)',
    category: 'Forgiveness',
    arabic: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration: "Rabbana-ghfir lana thunoobana wa-israfana fee amrina wa-thabbit aqdamana wan-surna 'alal-qawmil-kafireen",
    hindiMeaning: "ऐ हमारे रब! हमारे गुनाह माफ़ फ़रमा और हमारे कामों में हमसे जो ज़्यादती हुई उसे बख़्श दे, हमारे क़दमों को जमाए रख और काफ़िरों की क़ौम के मुक़ाबले में हमारी मदद फ़रमा।",
    englishMeaning: "Our Lord, forgive us our sins and the excess [committed] in our affairs and plant firmly our feet and give us victory over the disbelieving people.",
    source: "Surah Aal-i-Imran (3:147)",
    targetCount: 1
  },

  // Rizq
  {
    id: 'rizq-1',
    title: 'Seeking Provision & Knowledge (हलाल रोज़ी व इल्म की दुआ)',
    category: 'Rizq',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    transliteration: "Allahumma innee as'aluka 'ilman nafi'an, wa-rizqan tayyiban, wa-'amalan mutaqabbalan",
    hindiMeaning: "ऐ अल्लाह! मैं तुझसे नफ़ा देने वाले इल्म, पाकीज़ा रिज़्क़ और क़ुबूल होने वाले अमल का सवाल करता हूँ।",
    englishMeaning: "O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.",
    source: "Sunan Ibn Majah 925",
    targetCount: 1
  },
  {
    id: 'rizq-2',
    title: 'Prophet Musa Prayer for Need (हज़रत मूसा की दुआ)',
    category: 'Rizq',
    arabic: 'رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
    transliteration: "Rabbi innee lima anzalta ilayya min khayrin faqeer",
    hindiMeaning: "ऐ मेरे रब! तू जो भी भलाई (नेमत व रोज़ी) मेरी तरफ़ उतारे, मैं उसका मोहताज हूँ।",
    englishMeaning: "My Lord, indeed I am, for whatever good You would send down to me, in need.",
    source: "Surah Al-Qasas (28:24)",
    targetCount: 1
  },

  // Parents
  {
    id: 'par-1',
    title: 'Dua for Parents (माँ-बाप के लिए दुआ)',
    category: 'Parents',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: "Rabbir-hamhuma kama rabbayanee sagheera",
    hindiMeaning: "ऐ मेरे रब! तू उन दोनों (माँ-बाप) पर रहम फ़रमा जैसा कि उन्होंने बचपन में मुझे पाला और तरबियत दी।",
    englishMeaning: "My Lord, have mercy upon them as they brought me up [when I was] small.",
    source: "Surah Al-Isra (17:24)",
    targetCount: 1
  },
  {
    id: 'par-2',
    title: 'Dua for Parents & Believers (माँ-बाप और मोमिनीन की मग़फ़िरत)',
    category: 'Parents',
    arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    transliteration: "Rabbana-ghfir lee wali-walidayya wa-lil-mu'mineena yawma yaqoomul-hisaab",
    hindiMeaning: "ऐ हमारे रब! मुझे, मेरे वालिदैन को और तमाम मोमिनों को उस दिन माफ़ फ़रमा जिस दिन हिसाब क़ायम होगा।",
    englishMeaning: "Our Lord, forgive me and my parents and the believers the Day the account is established.",
    source: "Surah Ibrahim (14:41)",
    targetCount: 1
  },

  // Anxiety/Difficulty
  {
    id: 'anx-1',
    title: 'Relief from Anxiety & Sorrow (रंज व ग़म और क़र्ज़ से नजात)',
    category: 'Anxiety/Difficulty',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transliteration: "Allahumma innee a'oothu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa-dala'id-dayni wa-ghalabatir-rijal",
    hindiMeaning: "ऐ अल्लाह! मैं तेरी पनाह चाहता हूँ फ़िक्र और ग़म से, लाचारी और सुस्ती से, कंजूसी और बुज़दिली से, क़र्ज़ के बोझ से और लोगों के दबाव से।",
    englishMeaning: "O Allah, I seek refuge in You from grief and sadness, from weakness and laziness, from miserliness and cowardice, from being overcome by debt and being overpowered by others.",
    source: "Sahih al-Bukhari 2893",
    targetCount: 1
  },
  {
    id: 'anx-2',
    title: 'Dua for Ease in Difficult Tasks (कठिनाई को आसान करने की दुआ)',
    category: 'Anxiety/Difficulty',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    transliteration: "Allahumma la sahla illa ma ja'altahu sahla, wa-anta taj'alul-hazna itha shi'ta sahla",
    hindiMeaning: "ऐ अल्लाह! कोई काम आसान नहीं मगर वही जिसे तू आसान कर दे, और जब तू चाहता है तो मुश्किल को आसान बना देता है।",
    englishMeaning: "O Allah, there is no ease except in that which You have made easy, and You make the difficulty, if You wish, easy.",
    source: "Sahih Ibn Hibban 974",
    targetCount: 1
  },

  // Ramadan
  {
    id: 'ram-1',
    title: 'Dua Upon Breaking Fast / Iftar (इफ़्तार की दुआ)',
    category: 'Ramadan',
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration: "Thahabaz-zama'u wab-tallatil-'urooq, wa-thabatal-ajru in sha Allah",
    hindiMeaning: "प्यास बुझ गई, नसें तर हो गईं और अल्लाह ने चाहा तो सवाब साबित हो गया।",
    englishMeaning: "The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
    source: "Sunan Abu Dawood 2357",
    targetCount: 1
  },
  {
    id: 'ram-2',
    title: 'Laylatul Qadr Supplication (शब-ए-क़द्र की दुआ)',
    category: 'Ramadan',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'annee",
    hindiMeaning: "ऐ अल्लाह! तू बहुत माफ़ करने वाला है, माफ़ करने को पसंद फ़रमाता है, पस मुझे माफ़ फ़रमा दे।",
    englishMeaning: "O Allah, You are forgiving and You love to forgive, so forgive me.",
    source: "Jami' at-Tirmidhi 3513 (हज़रत आइशा रज़ि. से रिवायत)",
    targetCount: 1
  }
];
