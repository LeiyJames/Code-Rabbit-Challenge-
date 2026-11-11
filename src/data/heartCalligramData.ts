export interface CalligramPhrase {
  id: string;
  text: string;
  x: number;
  y: number;
  size: number;
  bold?: boolean;
  italic?: boolean;
  font?: string;
  lang: string;
  countryCode: string;
  pron: string;
  is_center?: boolean;
  is_heart?: boolean;
}

export const CALLIGRAM_PHRASES: CalligramPhrase[] = [
      // Row 1 - Top Lobe Peaks
      { id: "phrase-1", text: "愛してる", x: 250, y: 166, size: 18, bold: true, font: "'Noto Sans JP', sans-serif", lang: "Japanese", countryCode: "JP", pron: "[Aishiteru]" },
      { id: "phrase-2", text: "사랑해", x: 340, y: 168, size: 18, bold: true, font: "'Noto Sans KR', sans-serif", lang: "Korean", countryCode: "KR", pron: "[Saranghae]" },
      { id: "phrase-3", text: "Volim te", x: 750, y: 167, size: 21, bold: true, lang: "Croatian", countryCode: "HR", pron: "[voh-leem teh]" },

      // Row 2
      { id: "phrase-4", text: "我爱你", x: 190, y: 200, size: 20, bold: true, font: "'Noto Sans SC', sans-serif", lang: "Chinese", countryCode: "CN", pron: "[Wǒ ài nǐ]" },
      { id: "phrase-5", text: "Te amo", x: 325, y: 206, size: 28, bold: true, lang: "Spanish", countryCode: "ES", pron: "[teh ah-moh]" },
      { id: "phrase-6", text: "Tôi yêu bạn", x: 660, y: 195, size: 18, bold: true, lang: "Vietnamese", countryCode: "VN", pron: "[toy yew bahn]" },
      { id: "phrase-7", text: "Kocham cię", x: 800, y: 200, size: 21, bold: true, lang: "Polish", countryCode: "PL", pron: "[koh-hahm chyeh]" },
      { id: "phrase-8", text: "我爱你", x: 420, y: 216, size: 14, font: "'Noto Sans SC', sans-serif", lang: "Chinese", countryCode: "CN", pron: "[Wǒ ài nǐ]" },

      // Row 3
      { id: "phrase-9", text: "Alskar dig", x: 150, y: 235, size: 16, italic: true, lang: "Swedish", countryCode: "SE", pron: "[el-skar day]" },
      { id: "phrase-10", text: "Te quimo", x: 265, y: 238, size: 14, lang: "Papiamento", countryCode: "AW", pron: "[teh kee-moh]" },
      { id: "phrase-11", text: "Tre älskar", x: 390, y: 238, size: 14, lang: "Swedish", countryCode: "SE", pron: "[treh el-skar]" },
      { id: "phrase-12", text: "Te iubesc", x: 650, y: 230, size: 25, bold: true, lang: "Romanian", countryCode: "RO", pron: "[teh yoo-besk]" },
      { id: "phrase-13", text: "أحبك", x: 855, y: 245, size: 32, bold: true, font: "'Noto Sans Arabic', sans-serif", lang: "Arabic", countryCode: "SA", pron: "[Uhibbuka]" },

      // Row 4
      { id: "phrase-14", text: "Ti amo", x: 130, y: 275, size: 25, bold: true, lang: "Italian", countryCode: "IT", pron: "[tee ah-moh]" },
      { id: "phrase-15", text: "Je t'aime", x: 335, y: 275, size: 36, font: "'Great Vibes', cursive", italic: true, lang: "French", countryCode: "FR", pron: "[zhuh tem]" },
      { id: "phrase-16", text: "Ma armastan sind", x: 610, y: 248, size: 14, lang: "Estonian", countryCode: "EE", pron: "[mah ahr-mahs-tahn]" },
      { id: "phrase-17", text: "Szeretlek", x: 560, y: 270, size: 15, lang: "Hungarian", countryCode: "HU", pron: "[seh-ret-lek]" },
      { id: "phrase-18", text: "Ljubim te", x: 690, y: 268, size: 15, lang: "Slovenian", countryCode: "SI", pron: "[lyoo-beem teh]" },
      { id: "phrase-19", text: "Ti voglio bene", x: 860, y: 290, size: 14, italic: true, lang: "Italian", countryCode: "IT", pron: "[tee vohl-yoh beh-neh]" },

      // Row 5 - Meeting at Center Cleft
      { id: "phrase-20", text: "Alskar dig", x: 150, y: 315, size: 20, italic: true, lang: "Swedish", countryCode: "SE", pron: "[el-skar day]" },
      { id: "phrase-21", text: "Tekhai dyek", x: 335, y: 325, size: 16, lang: "Romani", countryCode: "INTL", pron: "[teh-khay dyehk]" },
      { id: "phrase-22", text: "Mahal kita", x: 512, y: 295, size: 18, bold: true, lang: "Tagalog", countryCode: "PH", pron: "[mah-hal kee-tah]" },
      { id: "phrase-23", text: "Ik hou van jou", x: 525, y: 330, size: 16, lang: "Dutch", countryCode: "NL", pron: "[ik how vahn yow]" },
      { id: "phrase-24", text: "Я тебе кохаю", x: 675, y: 300, size: 18, bold: true, lang: "Ukrainian", countryCode: "UA", pron: "[Ya tebe kokhayu]" },
      { id: "phrase-25", text: "Jag älskar dig", x: 865, y: 320, size: 14, lang: "Swedish", countryCode: "SE", pron: "[yahg el-skar day]" },

      // Row 6
      { id: "phrase-26", text: "Seni seviyorum", x: 135, y: 345, size: 14, lang: "Turkish", countryCode: "TR", pron: "[seh-nee seh-vee-yoh-room]" },
      { id: "phrase-27", text: "T'estimo", x: 270, y: 354, size: 18, bold: true, lang: "Catalan", countryCode: "ES", pron: "[tes-tee-moo]" },
      { id: "phrase-28", text: "Volim te", x: 425, y: 365, size: 25, bold: true, lang: "Serbian", countryCode: "RS", pron: "[voh-leem teh]" },
      { id: "phrase-29", text: "Ljubim te", x: 560, y: 360, size: 14, lang: "Slovenian", countryCode: "SI", pron: "[lyoo-beem teh]" },
      { id: "phrase-30", text: "Te iubesc", x: 665, y: 375, size: 20, bold: true, lang: "Romanian", countryCode: "RO", pron: "[teh yoo-besk]" },
      { id: "phrase-31", text: "انحردخلال", x: 835, y: 355, size: 28, bold: true, font: "'Noto Sans Arabic', sans-serif", lang: "Arabic Calligraphy", countryCode: "SA", pron: "[Calligraphy]" },
      { id: "phrase-32", text: "Mi amas vin", x: 820, y: 385, size: 14, lang: "Esperanto", countryCode: "INTL", pron: "[mee ah-mahs veen]" },
      { id: "phrase-33", text: "Ich hab dich lieb", x: 670, y: 405, size: 14, lang: "German", countryCode: "DE", pron: "[ikh hahb dikh leeb]" },

      // Row 7 - Upper Mid Flanks
      { id: "phrase-34", text: "Aku cinta kamu", x: 140, y: 365, size: 14, lang: "Indonesian", countryCode: "ID", pron: "[ah-koo cheen-tah kah-moo]" },
      { id: "phrase-35", text: "Nwi civtskerra", x: 140, y: 388, size: 13, lang: "Georgian", countryCode: "GE", pron: "[traditional]" },
      { id: "phrase-36", text: "ninakupenda", x: 140, y: 415, size: 19, bold: true, lang: "Swahili", countryCode: "KE", pron: "[nee-nah-koo-pen-dah]" },
      { id: "phrase-37", text: "Rakimave", x: 265, y: 413, size: 15, lang: "Malagasy", countryCode: "MG", pron: "[rah-kee-mah-veh]" },
      { id: "phrase-38", text: "Aloha wau ia'oe", x: 505, y: 395, size: 15, lang: "Hawaiian", countryCode: "HW", pron: "[ah-loh-hah wow ee-ah-oy]" },
      { id: "phrase-39", text: "Tora dost daram", x: 535, y: 418, size: 13, lang: "Dari / Persian", countryCode: "AF", pron: "[toh-rah dohst dah-rahm]" },
      { id: "phrase-40", text: "Bese dug bedoce", x: 835, y: 430, size: 15, lang: "Traditional", countryCode: "INTL", pron: "[beseh doog]" },

      // Row 8 - Center Flanks
      { id: "phrase-41", text: "Ke a go rata", x: 145, y: 438, size: 13, lang: "Setswana", countryCode: "BW", pron: "[keh ah goh rah-tah]" },
      { id: "phrase-42", text: "Ndi kukonda", x: 155, y: 457, size: 13, lang: "Chichewa", countryCode: "MW", pron: "[n-dee koo-kohn-dah]" },
      { id: "phrase-43", text: "Ngiyakuthanda", x: 215, y: 475, size: 15, lang: "Zulu", countryCode: "ZA", pron: "[ngee-yah-koo-tahn-dah]" },
      { id: "phrase-44", text: "Te sakam", x: 765, y: 455, size: 18, bold: true, lang: "Macedonian", countryCode: "MK", pron: "[teh sah-kahm]" },
      { id: "phrase-45", text: "אני אוהב/ת אותך", x: 825, y: 480, size: 18, bold: true, font: "'Noto Sans Hebrew', sans-serif", lang: "Hebrew", countryCode: "IL", pron: "[Ani ohev/otakh]" },

      // THE GRAND CENTERPIECE (Exact position from artwork: x=475, y=455)
      { id: "phrase-46", text: "I love you", x: 475, y: 455, size: 58, bold: true, is_center: true, lang: "English", countryCode: "EN", pron: "[ay luhv yoo]" },

      // Row 9 - Lower Flanks
      { id: "phrase-47", text: "S'agapo", x: 150, y: 503, size: 25, bold: true, lang: "Greek", countryCode: "GR", pron: "[S-ah-gah-poh]" },
      { id: "phrase-48", text: "Te'abaik", x: 345, y: 525, size: 14, lang: "Sudanese", countryCode: "SD", pron: "[teh-ah-bayk]" },
      { id: "phrase-49", text: "دوستت دارم", x: 475, y: 530, size: 21, bold: true, font: "'Noto Sans Arabic', sans-serif", lang: "Persian", countryCode: "IR", pron: "[Dooset daram]" },
      { id: "phrase-50", text: "Te dua", x: 605, y: 525, size: 21, bold: true, lang: "Albanian", countryCode: "AL", pron: "[teh doo-ah]" },
      { id: "phrase-51", text: "Inhobbok", x: 755, y: 510, size: 15, lang: "Maltese", countryCode: "MT", pron: "[een-hohb-bohk]" },
      { id: "phrase-52", text: "T'amo", x: 855, y: 510, size: 19, bold: true, lang: "Italian", countryCode: "IT", pron: "[tah-moh]" },
      { id: "phrase-53", text: "Saya cinta padamu", x: 775, y: 540, size: 15, lang: "Malay", countryCode: "MY", pron: "[sah-yah cheen-tah]" },

      // Row 10 - Converging Body
      { id: "phrase-54", text: "Kimi o ai shiteru", x: 195, y: 535, size: 14, lang: "Japanese Romaji", countryCode: "JP", pron: "[kee-mee oh eye shee-teh-roo]" },
      { id: "phrase-55", text: "Em yêu anh", x: 205, y: 558, size: 14, lang: "Vietnamese", countryCode: "VN", pron: "[ehm yew ahn]" },
      { id: "phrase-56", text: "Ee dua", x: 330, y: 555, size: 17, bold: true, lang: "Albanian", countryCode: "AL", pron: "[eh doo-ah]" },
      { id: "phrase-57", text: "Kimi o ai shiteru", x: 465, y: 565, size: 14, lang: "Japanese", countryCode: "JP", pron: "[kee-mee oh eye shee-teh-roo]" },
      { id: "phrase-58", text: "Em yêu anh/em", x: 635, y: 570, size: 14, lang: "Vietnamese", countryCode: "VN", pron: "[ehm yew ahn]" },
      { id: "phrase-59", text: "사랑해요", x: 805, y: 570, size: 20, bold: true, font: "'Noto Sans KR', sans-serif", lang: "Korean", countryCode: "KR", pron: "[Saranghaeyo]" },

      // Row 11
      { id: "phrase-60", text: "사랑해요", x: 220, y: 590, size: 20, bold: true, font: "'Noto Sans KR', sans-serif", lang: "Korean", countryCode: "KR", pron: "[Saranghaeyo]" },
      { id: "phrase-61", text: "我爱你", x: 350, y: 600, size: 20, bold: true, font: "'Noto Sans SC', sans-serif", lang: "Chinese", countryCode: "CN", pron: "[Wǒ ài nǐ]" },
      { id: "phrase-62", text: "دوستت دارم", x: 485, y: 600, size: 18, font: "'Noto Sans Arabic', sans-serif", lang: "Persian", countryCode: "IR", pron: "[Dooset daram]" },
      { id: "phrase-63", text: "Kom indan", x: 635, y: 605, size: 13, lang: "Kurdish", countryCode: "KU", pron: "[kohm een-dahn]" },
      { id: "phrase-64", text: "Ua here au ia 'oe", x: 785, y: 600, size: 13, lang: "Tahitian", countryCode: "PF", pron: "[oo-ah heh-reh ow]" },

      // Row 12
      { id: "phrase-65", text: "Jeg elsker deg", x: 270, y: 630, size: 17, bold: true, lang: "Norwegian", countryCode: "NO", pron: "[yai el-sker dai]" },
      { id: "phrase-66", text: "Ihimama", x: 410, y: 628, size: 14, lang: "Somali", countryCode: "SO", pron: "[ee-hee-mah-mah]" },
      { id: "phrase-67", text: "Te dua", x: 525, y: 628, size: 18, bold: true, lang: "Albanian", countryCode: "AL", pron: "[teh doo-ah]" },
      { id: "phrase-68", text: "Szeretlek", x: 635, y: 630, size: 14, lang: "Hungarian", countryCode: "HU", pron: "[seh-ret-lek]" },
      { id: "phrase-69", text: "Szeretlek", x: 740, y: 625, size: 16, bold: true, lang: "Hungarian", countryCode: "HU", pron: "[seh-ret-lek]" },
      { id: "phrase-70", text: "Miluji tě", x: 720, y: 655, size: 14, lang: "Czech", countryCode: "CZ", pron: "[mee-loo-yee tyeh]" },
      { id: "phrase-71", text: "ฉันรักคุณ", x: 735, y: 680, size: 16, bold: true, font: "'Noto Sans Thai', sans-serif", lang: "Thai", countryCode: "TH", pron: "[Chan rak khun]" },

      // Row 13 - Tapering Inwards
      { id: "phrase-72", text: "Ljubavim te", x: 280, y: 662, size: 13, lang: "Croatian", countryCode: "HR", pron: "[lyoo-bah-veem]" },
      { id: "phrase-73", text: "Luhavim ne", x: 395, y: 662, size: 13, lang: "Slavic", countryCode: "INTL", pron: "[loo-hah-veem]" },
      { id: "phrase-74", text: "Bhalobasha kori", x: 610, y: 672, size: 17, bold: true, font: "'Noto Sans Bengali', sans-serif", lang: "Bengali", countryCode: "BD", pron: "[bhah-loh-bah-shah]" },
      { id: "phrase-75", text: "Ene", x: 270, y: 692, size: 13, lang: "Kurdish", countryCode: "KU", pron: "[eh-neh]" },
      { id: "phrase-76", text: "T' dua", x: 345, y: 698, size: 18, bold: true, lang: "Albanian", countryCode: "AL", pron: "[t-doo-ah]" },
      { id: "phrase-77", text: "Aishiteru", x: 460, y: 698, size: 18, bold: true, lang: "Japanese", countryCode: "JP", pron: "[eye-shee-teh-roo]" },
      { id: "phrase-78", text: "Ik hou fan dy", x: 640, y: 708, size: 13, lang: "Frisian", countryCode: "NL", pron: "[ik how fahn dye]" },

      // Row 14
      { id: "phrase-79", text: "Ta gra agam ort", x: 465, y: 728, size: 14, lang: "Irish", countryCode: "IE", pron: "[tah graw ah-gum]" },
      { id: "phrase-80", text: "Grá agam ort", x: 625, y: 728, size: 17, bold: true, lang: "Irish", countryCode: "IE", pron: "[graw ah-gum ort]" },
      { id: "phrase-81", text: "Taim i'nghàn", x: 640, y: 748, size: 13, lang: "Scottish Gaelic", countryCode: "SCT", pron: "[tahm een-yahn]" },
      { id: "phrase-82", text: "我爱你", x: 355, y: 745, size: 20, bold: true, font: "'Noto Sans SC', sans-serif", lang: "Chinese", countryCode: "CN", pron: "[Wǒ ài nǐ]" },

      // Row 15 - Bottom Converging Tip
      { id: "phrase-83", text: "Люблю тебя", x: 495, y: 765, size: 18, bold: true, lang: "Russian", countryCode: "RU", pron: "[Lyublyu tebya]" },
      { id: "phrase-84", text: "Ti amo", x: 625, y: 772, size: 19, bold: true, lang: "Italian", countryCode: "IT", pron: "[tee ah-moh]" },
      { id: "phrase-85", text: "Te iubesc", x: 400, y: 792, size: 18, bold: true, lang: "Romanian", countryCode: "RO", pron: "[teh yoo-besk]" },
      { id: "phrase-86", text: "Kocham cię", x: 560, y: 802, size: 18, bold: true, lang: "Polish", countryCode: "PL", pron: "[koh-hahm chyeh]" },

      // Row 16 - Final Point
      { id: "phrase-87", text: "Karena kamu", x: 505, y: 828, size: 16, bold: true, lang: "Indonesian", countryCode: "ID", pron: "[kah-reh-nah kah-moo]" },
      { id: "phrase-88", text: "I mog di", x: 505, y: 858, size: 17, bold: true, lang: "Bavarian German", countryCode: "DE", pron: "[ee mohg dee]" },
      { id: "phrase-89", text: "Heart", x: 505, y: 888, size: 24, is_heart: true, lang: "Love Symbol", countryCode: "LOVE", pron: "[Eternal Love]" }
    
];

export const POINT_COORDINATES = new Set(['505,888', '505,858', '505,828']);

export const LEFT_OUTLINE_ORDER = [
  '400,792', '355,745', '345,698', '270,692', '280,662',
  '270,630', '220,590', '205,558', '195,535', '150,503',
  '155,457', '145,438', '140,415', '140,388', '140,365',
  '135,345', '150,315', '130,275', '150,235', '190,200',
  '250,166', '340,168', '325,206', '335,275', '420,216',
  '512,295'
];

export const RIGHT_OUTLINE_ORDER = [
  '560,802', '625,772', '640,748', '625,728', '640,708',
  '735,680', '720,655', '740,625', '785,600', '805,570',
  '775,540', '855,510', '825,480', '765,455', '835,430',
  '820,385', '835,355', '865,320', '860,290', '855,245',
  '800,200', '750,167', '660,195', '650,230', '610,248',
  '560,270', '525,330'
];
