const initialTemplates = [
  {
    name: 'Content Calendar Reminder',
    slug: 'content-calendar-reminder',
    description: 'Template story vertikal dengan foto melayang, doodle panah, dan catatan kalender konten.',
    category: 'Reminder',
    ratio: '9:16',
    canvas: { width: 1080, height: 1920 },
    previewImage: '/images/templates/content-calendar-reminder-preview.png',
    referenceImage: '/images/references/content-calendar-reminder-ref.png',
    background: {
      type: 'image-gradient',
      color: '#f7eee5',
      image: '/images/backgrounds/soft-desk-calendar.jpg',
      gradient: 'linear-gradient(180deg, rgba(255,248,238,0.25), rgba(255,231,207,0.75))'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 105,
        y: 315,
        width: 415,
        height: 520,
        radius: 28,
        rotation: -6,
        zIndex: 3,
        shadow: '0 26px 70px rgba(0,0,0,0.25)',
        caption: 'content idea',
        fit: 'cover',
        filter: 'warm'
      },
      {
        id: 'photo_2',
        x: 545,
        y: 680,
        width: 390,
        height: 485,
        radius: 28,
        rotation: 5,
        zIndex: 4,
        shadow: '0 26px 70px rgba(0,0,0,0.24)',
        caption: 'shoot day',
        fit: 'cover',
        filter: 'normal'
      },
      {
        id: 'photo_3',
        x: 170,
        y: 1085,
        width: 450,
        height: 560,
        radius: 28,
        rotation: -3,
        zIndex: 5,
        shadow: '0 26px 70px rgba(0,0,0,0.22)',
        caption: 'final post',
        fit: 'cover',
        filter: 'soft'
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'title',
        text: 'Content Calendar',
        x: 86,
        y: 135,
        width: 910,
        fontSize: 82,
        fontFamily: 'Playfair Display',
        fontWeight: 800,
        color: '#2c211b',
        align: 'left',
        rotation: 0,
        zIndex: 8
      },
      {
        id: 'subtitle',
        type: 'subtitle',
        text: 'plan, capture, publish',
        x: 90,
        y: 230,
        width: 800,
        fontSize: 34,
        fontFamily: 'Inter',
        fontWeight: 500,
        color: '#5f4b42',
        align: 'left',
        rotation: 0,
        zIndex: 8
      },
      {
        id: 'date',
        type: 'date',
        text: '{{date}}',
        x: 735,
        y: 1610,
        width: 250,
        fontSize: 30,
        fontFamily: 'Inter',
        fontWeight: 600,
        color: '#2c211b',
        align: 'right',
        rotation: 0,
        zIndex: 8
      },
      {
        id: 'note',
        type: 'note',
        text: 'little reminder: make it simple but meaningful.',
        x: 95,
        y: 1715,
        width: 890,
        fontSize: 34,
        fontFamily: 'Inter',
        fontWeight: 500,
        color: '#3b2c25',
        align: 'center',
        rotation: 0,
        zIndex: 8
      }
    ],
    decorations: [
      { id: 'arrow_1', type: 'doodle-arrow', x: 655, y: 385, width: 190, height: 110, rotation: 14, color: '#2f251f', zIndex: 7 },
      { id: 'sparkle_1', type: 'sparkle', x: 820, y: 245, width: 86, height: 86, rotation: 0, color: '#ffffff', zIndex: 7 },
      { id: 'heart_1', type: 'heart', x: 735, y: 1190, width: 72, height: 72, rotation: -8, color: '#ff6f91', zIndex: 7 }
    ],
    isActive: true
  },
  {
    name: 'Weekly Memory Board',
    slug: 'weekly-memory-board',
    description: 'Template papan memori mingguan dengan 4 foto acak, tanggal, dan catatan kecil.',
    category: 'Gallery',
    ratio: '4:5',
    canvas: { width: 1080, height: 1350 },
    previewImage: '/images/templates/weekly-memory-board-preview.png',
    referenceImage: '/images/references/weekly-memory-board-ref.png',
    background: {
      type: 'gradient',
      color: '#f5f0e8',
      image: '',
      gradient: 'linear-gradient(135deg, #fff8ed, #efe7ff)'
    },
    photoSlots: [
      { id: 'photo_1', x: 95, y: 245, width: 410, height: 350, radius: 24, rotation: -4, zIndex: 3, shadow: '0 20px 55px rgba(0,0,0,0.18)', caption: 'monday', fit: 'cover', filter: 'normal' },
      { id: 'photo_2', x: 560, y: 215, width: 410, height: 420, radius: 24, rotation: 4, zIndex: 4, shadow: '0 20px 55px rgba(0,0,0,0.18)', caption: 'little joy', fit: 'cover', filter: 'warm' },
      { id: 'photo_3', x: 110, y: 685, width: 435, height: 405, radius: 24, rotation: 3, zIndex: 5, shadow: '0 20px 55px rgba(0,0,0,0.17)', caption: 'memory', fit: 'cover', filter: 'soft' },
      { id: 'photo_4', x: 590, y: 710, width: 370, height: 350, radius: 24, rotation: -5, zIndex: 4, shadow: '0 20px 55px rgba(0,0,0,0.17)', caption: 'weekend', fit: 'cover', filter: 'bright' }
    ],
    textElements: [
      { id: 'title', type: 'title', text: 'Weekly Memory', x: 80, y: 90, width: 900, fontSize: 72, fontFamily: 'Playfair Display', fontWeight: 800, color: '#251c17', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'date', type: 'date', text: '{{date}}', x: 80, y: 1170, width: 920, fontSize: 32, fontFamily: 'Inter', fontWeight: 600, color: '#5c4d45', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'note', type: 'note', text: 'a soft collection of this week', x: 120, y: 1230, width: 840, fontSize: 30, fontFamily: 'Inter', fontWeight: 500, color: '#74665f', align: 'center', rotation: 0, zIndex: 8 }
    ],
    decorations: [
      { id: 'tape_1', type: 'tape', x: 205, y: 212, width: 170, height: 45, rotation: -8, color: '#f6d7a9', zIndex: 7 },
      { id: 'star_1', type: 'star', x: 825, y: 110, width: 65, height: 65, rotation: 14, color: '#ffcf56', zIndex: 7 },
      { id: 'line_1', type: 'hand-line', x: 145, y: 1135, width: 790, height: 24, rotation: 0, color: '#cdbfb5', zIndex: 7 }
    ],
    isActive: true
  },
  {
    name: 'Moodboard Aesthetic',
    slug: 'moodboard-aesthetic',
    description: 'Template moodboard dengan 5 slot foto, paper texture, tape, dan komposisi kreatif.',
    category: 'Moodboard',
    ratio: '1:1',
    canvas: { width: 1080, height: 1080 },
    previewImage: '/images/templates/moodboard-aesthetic-preview.png',
    referenceImage: '/images/references/moodboard-aesthetic-ref.png',
    background: {
      type: 'image-gradient',
      color: '#f2ede4',
      image: '/images/backgrounds/paper-texture.jpg',
      gradient: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(238,226,211,0.85))'
    },
    photoSlots: [
      { id: 'photo_1', x: 78, y: 190, width: 360, height: 420, radius: 18, rotation: -6, zIndex: 3, shadow: '0 18px 45px rgba(0,0,0,0.2)', caption: 'mood', fit: 'cover', filter: 'vintage' },
      { id: 'photo_2', x: 498, y: 150, width: 500, height: 300, radius: 18, rotation: 3, zIndex: 4, shadow: '0 18px 45px rgba(0,0,0,0.18)', caption: 'color', fit: 'cover', filter: 'warm' },
      { id: 'photo_3', x: 485, y: 500, width: 250, height: 270, radius: 18, rotation: -2, zIndex: 5, shadow: '0 18px 45px rgba(0,0,0,0.16)', caption: 'detail', fit: 'cover', filter: 'normal' },
      { id: 'photo_4', x: 760, y: 505, width: 245, height: 300, radius: 18, rotation: 5, zIndex: 5, shadow: '0 18px 45px rgba(0,0,0,0.16)', caption: 'idea', fit: 'cover', filter: 'soft' },
      { id: 'photo_5', x: 135, y: 655, width: 310, height: 280, radius: 18, rotation: 4, zIndex: 4, shadow: '0 18px 45px rgba(0,0,0,0.17)', caption: 'vibes', fit: 'cover', filter: 'fade' }
    ],
    textElements: [
      { id: 'title', type: 'title', text: 'Moodboard', x: 78, y: 80, width: 925, fontSize: 68, fontFamily: 'Playfair Display', fontWeight: 800, color: '#2d241f', align: 'left', rotation: 0, zIndex: 8 },
      { id: 'subtitle', type: 'subtitle', text: 'visual notes & memories', x: 80, y: 985, width: 920, fontSize: 30, fontFamily: 'Inter', fontWeight: 500, color: '#74675d', align: 'right', rotation: 0, zIndex: 8 }
    ],
    decorations: [
      { id: 'circle_1', type: 'circle-doodle', x: 650, y: 55, width: 180, height: 80, rotation: -8, color: '#d7a86e', zIndex: 7 },
      { id: 'tape_1', type: 'tape', x: 560, y: 135, width: 185, height: 45, rotation: -6, color: '#f5d7ae', zIndex: 7 },
      { id: 'sparkle_1', type: 'sparkle', x: 88, y: 620, width: 70, height: 70, rotation: 0, color: '#ffffff', zIndex: 7 }
    ],
    isActive: true
  },
  {
    name: 'Polaroid Story',
    slug: 'polaroid-story',
    description: 'Template story dengan tiga polaroid melayang dan caption pendek.',
    category: 'Polaroid',
    ratio: '9:16',
    canvas: { width: 1080, height: 1920 },
    previewImage: '/images/templates/polaroid-story-preview.png',
    referenceImage: '/images/references/polaroid-story-ref.png',
    background: {
      type: 'gradient',
      color: '#fffaf4',
      image: '',
      gradient: 'linear-gradient(180deg, #fff8ef, #f5e2d0)'
    },
    photoSlots: [
      { id: 'photo_1', x: 140, y: 330, width: 500, height: 590, radius: 18, rotation: -7, zIndex: 3, shadow: '0 26px 70px rgba(0,0,0,0.22)', caption: 'first memory', fit: 'cover', filter: 'warm' },
      { id: 'photo_2', x: 430, y: 825, width: 500, height: 590, radius: 18, rotation: 7, zIndex: 4, shadow: '0 26px 70px rgba(0,0,0,0.22)', caption: 'second memory', fit: 'cover', filter: 'soft' },
      { id: 'photo_3', x: 120, y: 1210, width: 500, height: 590, radius: 18, rotation: -4, zIndex: 5, shadow: '0 26px 70px rgba(0,0,0,0.22)', caption: 'last memory', fit: 'cover', filter: 'normal' }
    ],
    textElements: [
      { id: 'title', type: 'title', text: 'Polaroid Story', x: 85, y: 120, width: 910, fontSize: 78, fontFamily: 'Playfair Display', fontWeight: 800, color: '#31231d', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'date', type: 'date', text: '{{date}}', x: 90, y: 1810, width: 900, fontSize: 32, fontFamily: 'Inter', fontWeight: 600, color: '#5a4a43', align: 'center', rotation: 0, zIndex: 8 }
    ],
    decorations: [
      { id: 'heart_1', type: 'heart', x: 830, y: 265, width: 70, height: 70, rotation: 12, color: '#ff7890', zIndex: 7 },
      { id: 'sparkle_1', type: 'sparkle', x: 155, y: 215, width: 78, height: 78, rotation: 0, color: '#ffffff', zIndex: 7 },
      { id: 'arrow_1', type: 'doodle-arrow', x: 720, y: 1500, width: 175, height: 95, rotation: -18, color: '#46342b', zIndex: 7 }
    ],
    isActive: true
  },
  {
    name: 'Daily Reminder',
    slug: 'daily-reminder',
    description: 'Template reminder harian dengan satu foto utama, checklist, tanggal, dan catatan kecil.',
    category: 'Reminder',
    ratio: '4:5',
    canvas: { width: 1080, height: 1350 },
    previewImage: '/images/templates/daily-reminder-preview.png',
    referenceImage: '/images/references/daily-reminder-ref.png',
    background: {
      type: 'gradient',
      color: '#f7f3ed',
      image: '',
      gradient: 'linear-gradient(180deg, #fffdf8, #eee1d1)'
    },
    photoSlots: [
      { id: 'photo_1', x: 140, y: 300, width: 800, height: 650, radius: 36, rotation: 0, zIndex: 3, shadow: '0 24px 65px rgba(0,0,0,0.2)', caption: 'today', fit: 'cover', filter: 'soft' }
    ],
    textElements: [
      { id: 'title', type: 'title', text: 'Daily Reminder', x: 90, y: 100, width: 900, fontSize: 76, fontFamily: 'Playfair Display', fontWeight: 800, color: '#26201b', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'note', type: 'note', text: 'one small step is still progress', x: 120, y: 1010, width: 840, fontSize: 38, fontFamily: 'Inter', fontWeight: 600, color: '#41342c', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'date', type: 'date', text: '{{date}}', x: 120, y: 1090, width: 840, fontSize: 30, fontFamily: 'Inter', fontWeight: 500, color: '#7a6b62', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'checklist', type: 'note', text: '□ capture  □ smile  □ save', x: 120, y: 1180, width: 840, fontSize: 32, fontFamily: 'Inter', fontWeight: 500, color: '#6b5d55', align: 'center', rotation: 0, zIndex: 8 }
    ],
    decorations: [
      { id: 'sparkle_1', type: 'sparkle', x: 845, y: 185, width: 70, height: 70, rotation: 0, color: '#ffffff', zIndex: 7 },
      { id: 'line_1', type: 'hand-line', x: 250, y: 970, width: 580, height: 25, rotation: 0, color: '#d1bfae', zIndex: 7 }
    ],
    isActive: true
  },
  {
    name: 'Birthday Gallery',
    slug: 'birthday-gallery',
    description: 'Template ulang tahun dengan foto melayang, balon, sparkle, dan tulisan happy birthday.',
    category: 'Birthday',
    ratio: '9:16',
    canvas: { width: 1080, height: 1920 },
    previewImage: '/images/templates/birthday-gallery-preview.png',
    referenceImage: '/images/references/birthday-gallery-ref.png',
    background: {
      type: 'gradient',
      color: '#fff0f5',
      image: '',
      gradient: 'linear-gradient(180deg, #fff0f7, #ffe0ec)'
    },
    photoSlots: [
      { id: 'photo_1', x: 115, y: 360, width: 410, height: 500, radius: 30, rotation: -5, zIndex: 3, shadow: '0 24px 60px rgba(110,30,70,0.22)', caption: 'smile', fit: 'cover', filter: 'bright' },
      { id: 'photo_2', x: 560, y: 430, width: 380, height: 470, radius: 30, rotation: 6, zIndex: 4, shadow: '0 24px 60px rgba(110,30,70,0.2)', caption: 'wish', fit: 'cover', filter: 'warm' },
      { id: 'photo_3', x: 190, y: 980, width: 700, height: 560, radius: 34, rotation: -1, zIndex: 5, shadow: '0 24px 60px rgba(110,30,70,0.22)', caption: 'birthday moment', fit: 'cover', filter: 'soft' }
    ],
    textElements: [
      { id: 'title', type: 'title', text: 'Happy Birthday', x: 80, y: 130, width: 920, fontSize: 86, fontFamily: 'Playfair Display', fontWeight: 900, color: '#7c294a', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'subtitle', type: 'subtitle', text: 'today is your special day', x: 100, y: 235, width: 880, fontSize: 34, fontFamily: 'Inter', fontWeight: 600, color: '#9c5571', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'date', type: 'date', text: '{{date}}', x: 130, y: 1640, width: 820, fontSize: 32, fontFamily: 'Inter', fontWeight: 600, color: '#7c294a', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'note', type: 'note', text: 'make a wish and keep shining', x: 130, y: 1710, width: 820, fontSize: 34, fontFamily: 'Inter', fontWeight: 500, color: '#8d4965', align: 'center', rotation: 0, zIndex: 8 }
    ],
    decorations: [
      { id: 'balloon_1', type: 'balloon', x: 80, y: 210, width: 90, height: 130, rotation: -10, color: '#ff8ab3', zIndex: 7 },
      { id: 'balloon_2', type: 'balloon', x: 900, y: 250, width: 90, height: 130, rotation: 10, color: '#ffd166', zIndex: 7 },
      { id: 'sparkle_1', type: 'sparkle', x: 850, y: 1020, width: 75, height: 75, rotation: 0, color: '#ffffff', zIndex: 7 }
    ],
    isActive: true
  },
  {
    name: 'Couple Memory',
    slug: 'couple-memory',
    description: 'Template pasangan dengan dua slot foto, dekorasi hati, dan catatan romantis.',
    category: 'Couple',
    ratio: '4:5',
    canvas: { width: 1080, height: 1350 },
    previewImage: '/images/templates/couple-memory-preview.png',
    referenceImage: '/images/references/couple-memory-ref.png',
    background: {
      type: 'gradient',
      color: '#fff5f4',
      image: '',
      gradient: 'linear-gradient(135deg, #fff7f2, #ffe3e1)'
    },
    photoSlots: [
      { id: 'photo_1', x: 120, y: 285, width: 410, height: 590, radius: 30, rotation: -4, zIndex: 3, shadow: '0 22px 58px rgba(140,60,70,0.2)', caption: 'you', fit: 'cover', filter: 'soft' },
      { id: 'photo_2', x: 555, y: 330, width: 410, height: 590, radius: 30, rotation: 5, zIndex: 4, shadow: '0 22px 58px rgba(140,60,70,0.2)', caption: 'me', fit: 'cover', filter: 'warm' }
    ],
    textElements: [
      { id: 'title', type: 'title', text: 'Our Little Memory', x: 80, y: 105, width: 920, fontSize: 74, fontFamily: 'Playfair Display', fontWeight: 850, color: '#63303b', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'note', type: 'note', text: 'a tiny moment, a big feeling', x: 120, y: 1005, width: 840, fontSize: 36, fontFamily: 'Inter', fontWeight: 600, color: '#7e4a52', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'date', type: 'date', text: '{{date}}', x: 120, y: 1085, width: 840, fontSize: 30, fontFamily: 'Inter', fontWeight: 500, color: '#9a6870', align: 'center', rotation: 0, zIndex: 8 }
    ],
    decorations: [
      { id: 'heart_1', type: 'heart', x: 500, y: 225, width: 82, height: 82, rotation: 0, color: '#ff718d', zIndex: 7 },
      { id: 'heart_2', type: 'heart', x: 180, y: 935, width: 58, height: 58, rotation: -12, color: '#ff9aaa', zIndex: 7 },
      { id: 'sparkle_1', type: 'sparkle', x: 840, y: 955, width: 70, height: 70, rotation: 0, color: '#ffffff', zIndex: 7 }
    ],
    isActive: true
  },
  {
    name: 'Graduation Gallery',
    slug: 'graduation-gallery',
    description: 'Template wisuda elegan dengan foto utama, detail kecil, nama, dan tanggal.',
    category: 'Graduation',
    ratio: '4:5',
    canvas: { width: 1080, height: 1350 },
    previewImage: '/images/templates/graduation-gallery-preview.png',
    referenceImage: '/images/references/graduation-gallery-ref.png',
    background: {
      type: 'gradient',
      color: '#f8f6ef',
      image: '',
      gradient: 'linear-gradient(180deg, #fffdf8, #ede7d5)'
    },
    photoSlots: [
      { id: 'photo_1', x: 150, y: 280, width: 780, height: 610, radius: 34, rotation: 0, zIndex: 3, shadow: '0 24px 65px rgba(0,0,0,0.2)', caption: 'main moment', fit: 'cover', filter: 'normal' },
      { id: 'photo_2', x: 125, y: 820, width: 285, height: 345, radius: 24, rotation: -5, zIndex: 4, shadow: '0 20px 50px rgba(0,0,0,0.16)', caption: 'detail', fit: 'cover', filter: 'warm' },
      { id: 'photo_3', x: 670, y: 830, width: 285, height: 345, radius: 24, rotation: 5, zIndex: 4, shadow: '0 20px 50px rgba(0,0,0,0.16)', caption: 'proud', fit: 'cover', filter: 'soft' }
    ],
    textElements: [
      { id: 'title', type: 'title', text: 'Graduation Day', x: 80, y: 105, width: 920, fontSize: 76, fontFamily: 'Playfair Display', fontWeight: 850, color: '#2b241a', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'subtitle', type: 'subtitle', text: 'finally made it', x: 120, y: 205, width: 840, fontSize: 32, fontFamily: 'Inter', fontWeight: 600, color: '#78664d', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'date', type: 'date', text: '{{date}}', x: 120, y: 1210, width: 840, fontSize: 30, fontFamily: 'Inter', fontWeight: 600, color: '#544533', align: 'center', rotation: 0, zIndex: 8 }
    ],
    decorations: [
      { id: 'sparkle_1', type: 'sparkle', x: 835, y: 150, width: 70, height: 70, rotation: 0, color: '#d4af37', zIndex: 7 },
      { id: 'line_1', type: 'hand-line', x: 250, y: 940, width: 580, height: 22, rotation: 0, color: '#d4af37', zIndex: 7 }
    ],
    isActive: true
  },
  {
    name: 'Travel Dump',
    slug: 'travel-dump',
    description: 'Template perjalanan dengan empat slot foto, lokasi, tanggal, dan nuansa map paper.',
    category: 'Travel',
    ratio: '9:16',
    canvas: { width: 1080, height: 1920 },
    previewImage: '/images/templates/travel-dump-preview.png',
    referenceImage: '/images/references/travel-dump-ref.png',
    background: {
      type: 'image-gradient',
      color: '#efe2cf',
      image: '/images/backgrounds/map-paper.jpg',
      gradient: 'linear-gradient(180deg, rgba(255,250,240,0.25), rgba(230,210,185,0.85))'
    },
    photoSlots: [
      { id: 'photo_1', x: 105, y: 330, width: 420, height: 480, radius: 24, rotation: -5, zIndex: 3, shadow: '0 23px 58px rgba(0,0,0,0.22)', caption: 'place', fit: 'cover', filter: 'warm' },
      { id: 'photo_2', x: 555, y: 405, width: 405, height: 480, radius: 24, rotation: 5, zIndex: 4, shadow: '0 23px 58px rgba(0,0,0,0.2)', caption: 'view', fit: 'cover', filter: 'normal' },
      { id: 'photo_3', x: 150, y: 930, width: 380, height: 450, radius: 24, rotation: 4, zIndex: 4, shadow: '0 23px 58px rgba(0,0,0,0.2)', caption: 'walk', fit: 'cover', filter: 'vintage' },
      { id: 'photo_4', x: 565, y: 1010, width: 390, height: 440, radius: 24, rotation: -4, zIndex: 5, shadow: '0 23px 58px rgba(0,0,0,0.2)', caption: 'moment', fit: 'cover', filter: 'soft' }
    ],
    textElements: [
      { id: 'title', type: 'title', text: 'Travel Dump', x: 80, y: 115, width: 920, fontSize: 84, fontFamily: 'Playfair Display', fontWeight: 850, color: '#2f261d', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'location', type: 'subtitle', text: 'your favorite place', x: 120, y: 225, width: 840, fontSize: 34, fontFamily: 'Inter', fontWeight: 600, color: '#675747', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'date', type: 'date', text: '{{date}}', x: 120, y: 1580, width: 840, fontSize: 32, fontFamily: 'Inter', fontWeight: 600, color: '#554536', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'note', type: 'note', text: 'collect the view, keep the feeling', x: 120, y: 1660, width: 840, fontSize: 34, fontFamily: 'Inter', fontWeight: 500, color: '#6d5b4a', align: 'center', rotation: 0, zIndex: 8 }
    ],
    decorations: [
      { id: 'pin_1', type: 'map-pin', x: 830, y: 280, width: 78, height: 78, rotation: 0, color: '#d95f43', zIndex: 7 },
      { id: 'line_1', type: 'dashed-line', x: 190, y: 1480, width: 700, height: 36, rotation: 0, color: '#8b735d', zIndex: 7 },
      { id: 'star_1', type: 'star', x: 160, y: 250, width: 70, height: 70, rotation: -8, color: '#f2b84b', zIndex: 7 }
    ],
    isActive: true
  },
  {
    name: 'Minimal Gallery Card',
    slug: 'minimal-gallery-card',
    description: 'Template minimal clean dengan satu foto utama, dua foto kecil, judul, subtitle, dan tanggal.',
    category: 'Minimal',
    ratio: '4:5',
    canvas: { width: 1080, height: 1350 },
    previewImage: '/images/templates/minimal-gallery-card-preview.png',
    referenceImage: '/images/references/minimal-gallery-card-ref.png',
    background: {
      type: 'solid',
      color: '#ffffff',
      image: '',
      gradient: ''
    },
    photoSlots: [
      { id: 'photo_1', x: 105, y: 265, width: 870, height: 620, radius: 36, rotation: 0, zIndex: 3, shadow: '0 22px 60px rgba(0,0,0,0.14)', caption: 'main', fit: 'cover', filter: 'normal' },
      { id: 'photo_2', x: 130, y: 930, width: 250, height: 260, radius: 24, rotation: -3, zIndex: 4, shadow: '0 16px 40px rgba(0,0,0,0.12)', caption: 'small 1', fit: 'cover', filter: 'soft' },
      { id: 'photo_3', x: 405, y: 930, width: 250, height: 260, radius: 24, rotation: 0, zIndex: 4, shadow: '0 16px 40px rgba(0,0,0,0.12)', caption: 'small 2', fit: 'cover', filter: 'warm' }
    ],
    textElements: [
      { id: 'title', type: 'title', text: 'Minimal Gallery', x: 95, y: 90, width: 890, fontSize: 72, fontFamily: 'Inter', fontWeight: 800, color: '#111111', align: 'left', rotation: 0, zIndex: 8 },
      { id: 'subtitle', type: 'subtitle', text: 'clean photo collection', x: 98, y: 175, width: 880, fontSize: 30, fontFamily: 'Inter', fontWeight: 500, color: '#6a6a6a', align: 'left', rotation: 0, zIndex: 8 },
      { id: 'date', type: 'date', text: '{{date}}', x: 690, y: 1015, width: 280, fontSize: 28, fontFamily: 'Inter', fontWeight: 600, color: '#111111', align: 'right', rotation: 0, zIndex: 8 },
      { id: 'note', type: 'note', text: 'simple, neat, memorable.', x: 690, y: 1065, width: 280, fontSize: 25, fontFamily: 'Inter', fontWeight: 500, color: '#6a6a6a', align: 'right', rotation: 0, zIndex: 8 }
    ],
    decorations: [
      { id: 'line_1', type: 'hand-line', x: 95, y: 225, width: 890, height: 18, rotation: 0, color: '#e5e5e5', zIndex: 7 }
    ],
    isActive: true
  },
  {
    name: 'Soft Story Poster',
    slug: 'soft-story-poster',
    description: 'Template story lembut dengan background blur, satu foto utama, dua foto kecil, dan doodle sparkle.',
    category: 'Story',
    ratio: '9:16',
    canvas: { width: 1080, height: 1920 },
    previewImage: '/images/templates/soft-story-poster-preview.png',
    referenceImage: '/images/references/soft-story-poster-ref.png',
    background: {
      type: 'gradient',
      color: '#eef2ff',
      image: '',
      gradient: 'linear-gradient(180deg, #f8fbff, #e8ecff)'
    },
    photoSlots: [
      { id: 'photo_1', x: 135, y: 360, width: 810, height: 920, radius: 44, rotation: 0, zIndex: 3, shadow: '0 28px 80px rgba(40,60,120,0.22)', caption: 'main story', fit: 'cover', filter: 'soft' },
      { id: 'photo_2', x: 120, y: 1240, width: 330, height: 360, radius: 30, rotation: -5, zIndex: 5, shadow: '0 22px 55px rgba(40,60,120,0.18)', caption: 'detail', fit: 'cover', filter: 'warm' },
      { id: 'photo_3', x: 625, y: 1255, width: 330, height: 360, radius: 30, rotation: 5, zIndex: 5, shadow: '0 22px 55px rgba(40,60,120,0.18)', caption: 'soft', fit: 'cover', filter: 'bright' }
    ],
    textElements: [
      { id: 'title', type: 'title', text: 'Soft Story', x: 90, y: 120, width: 900, fontSize: 86, fontFamily: 'Playfair Display', fontWeight: 850, color: '#1f2748', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'subtitle', type: 'subtitle', text: 'a gentle frame for today', x: 120, y: 230, width: 840, fontSize: 34, fontFamily: 'Inter', fontWeight: 500, color: '#66709a', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'date', type: 'date', text: '{{date}}', x: 120, y: 1690, width: 840, fontSize: 32, fontFamily: 'Inter', fontWeight: 600, color: '#1f2748', align: 'center', rotation: 0, zIndex: 8 },
      { id: 'note', type: 'note', text: 'keep this little moment forever', x: 120, y: 1755, width: 840, fontSize: 32, fontFamily: 'Inter', fontWeight: 500, color: '#66709a', align: 'center', rotation: 0, zIndex: 8 }
    ],
    decorations: [
      { id: 'sparkle_1', type: 'sparkle', x: 835, y: 285, width: 80, height: 80, rotation: 0, color: '#ffffff', zIndex: 7 },
      { id: 'sparkle_2', type: 'sparkle', x: 150, y: 1320, width: 72, height: 72, rotation: 0, color: '#ffffff', zIndex: 7 },
      { id: 'circle_1', type: 'circle-doodle', x: 245, y: 1570, width: 580, height: 90, rotation: -2, color: '#aeb8ef', zIndex: 7 }
    ],
    isActive: true
  }
];

module.exports = initialTemplates;