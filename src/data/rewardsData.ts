import type { CapsuleCategory, Reward } from '../types';

export interface CategoryMeta {
  name: string;
  subtitle: string;
  colorHex: string;
  bgHex: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  description: string;
}

export const CATEGORIES: Record<CapsuleCategory, CategoryMeta> = {
  blue: {
    name: 'CLOUDY DAYS',
    subtitle: 'Warm reassurance & stormy day shields',
    colorHex: '#315BFF',
    bgHex: '#EBF0FF',
    badgeBg: 'bg-[#315BFF]',
    textColor: 'text-[#315BFF]',
    borderColor: 'border-[#315BFF]',
    description: 'Comforting messages, reassurance, and emergency calm.',
  },
  yellow: {
    name: 'HAPPY PILLS',
    subtitle: 'Emergency serotonin & goofy laughs',
    colorHex: '#FFD027',
    bgHex: '#FFFBE6',
    badgeBg: 'bg-[#FFD027]',
    textColor: 'text-[#B88700]',
    borderColor: 'border-[#FFD027]',
    description: 'Funny notes, jokes, compliments, and playful vibes.',
  },
  pink: {
    name: 'SWEET NOTHINGS',
    subtitle: 'Heartfelt appreciation & love letters',
    colorHex: '#FF4F87',
    bgHex: '#FFF0F5',
    badgeBg: 'bg-[#FF4F87]',
    textColor: 'text-[#FF4F87]',
    borderColor: 'border-[#FF4F87]',
    description: 'Appreciation, affectionate notes, and personal messages.',
  },
  green: {
    name: 'LUCKY CHARMS',
    subtitle: 'Auspicious wishes & future adventures',
    colorHex: '#00C974',
    bgHex: '#E8FBF2',
    badgeBg: 'bg-[#00C974]',
    textColor: 'text-[#008F52]',
    borderColor: 'border-[#00C974]',
    description: 'Wishes, prayers, and future adventures together.',
  },
  purple: {
    name: 'MYSTERY MEAT',
    subtitle: 'Absurd surprises & weird little mini-games',
    colorHex: '#8A3FFC',
    bgHex: '#F4EEFF',
    badgeBg: 'bg-[#8A3FFC]',
    textColor: 'text-[#8A3FFC]',
    borderColor: 'border-[#8A3FFC]',
    description: 'Unexpected surprises, absurd content, mini-games, and random events.',
  },
  gold: {
    name: 'SPECIAL DROP',
    subtitle: 'Legendary birthday golden loot',
    colorHex: '#FFB800',
    bgHex: '#FFF8E1',
    badgeBg: 'bg-[#FFB800]',
    textColor: 'text-[#B37E00]',
    borderColor: 'border-[#FFB800]',
    description: 'Exclusive rewards, special surprises, and birthday tokens.',
  },
};

export const REWARDS: Reward[] = [
  // --- BLUE: CLOUDY DAYS (Comfort & Reassurance) ---
  {
    id: 'blue-01',
    category: 'blue',
    categoryName: 'CLOUDY DAYS',
    rarity: 'COMMON',
    title: 'Emergency Raincheck on Life',
    sticker: '🌧️',
    tagline: 'Take a breath. You are doing enough.',
    content:
      'Levina, whenever things feel overwhelming, remember you are allowed to pause. You do not need to figure out the next five years today. Drink one glass of water, exhale your shoulders away from your ears, and let the storm pass. It always does.',
    quote: '"Even the heaviest rain runs out of drops eventually."',
  },
  {
    id: 'blue-02',
    category: 'blue',
    categoryName: 'CLOUDY DAYS',
    rarity: 'COMMON',
    title: 'The "It\'s Okay to Be a Potato" Certificate',
    sticker: '🥔',
    tagline: 'Zero guilt productivity waiver.',
    content:
      'This certifies that Levina has full diplomatic immunity from having to be "productive" today. You can wrap yourself in a blanket burrito, scroll silly cat videos, and exist purely as a happy carbohydrate. Recharging is essential work.',
    quote: '"Certified cozy by Loomy."',
  },
  {
    id: 'blue-03',
    category: 'blue',
    categoryName: 'CLOUDY DAYS',
    rarity: 'RARE',
    title: 'Soundtrack to Sinking Into Bed',
    sticker: '🎧',
    tagline: 'Quiet comfort for restless late nights.',
    content:
      'When your mind is racing at 2:00 AM, send me a ping or put on your comfort playlist. You carry so much with so much grace, but you do not have to carry it alone. You are deeply valued, exactly as you are right now.',
    quote: '"Sleep well, Levi. Tomorrow gets a fresh clean slate."',
  },
  {
    id: 'blue-04',
    category: 'blue',
    categoryName: 'CLOUDY DAYS',
    rarity: 'LEGENDARY',
    title: 'The Permanent Shelter Token',
    sticker: '🛡️',
    tagline: 'Unconditional safe harbor.',
    content:
      'No matter how bad a day goes, no matter if you made a silly mistake or feel like the world is against you: my door and ears are forever open. No judgment, no unsolicited lectures—just warm food, your favorite snacks, and a safe harbor.',
    quote: '"Non-expiring and redeemable anytime forever."',
  },

  // --- YELLOW: HAPPY PILLS (Humor & Serotonin) ---
  {
    id: 'yellow-01',
    category: 'yellow',
    categoryName: 'HAPPY PILLS',
    rarity: 'COMMON',
    title: 'Official Levi Praise & Compliment',
    sticker: '💊',
    tagline: 'Prescription: Take with a smile.',
    content:
      'Scientifically verified fact: The room becomes at least 37% more lively and chaotic the moment Levina enters it. Your laugh is dangerously contagious, and your humor is second to none. Please never tone down your quirks!',
    quote: '"Side effects include spontaneous giggles."',
  },
  {
    id: 'yellow-02',
    category: 'yellow',
    categoryName: 'HAPPY PILLS',
    rarity: 'COMMON',
    title: 'The Overthinking Deflector Shield',
    sticker: '🧠',
    tagline: 'Zap away 3:00 AM cringe memories.',
    content:
      'Did you just replay that slightly awkward thing you said 3 weeks ago? Beep boop! The Overthinking Shield has activated. That person definitely forgot it 4 seconds later because they were too busy worrying about their own haircut. You are cool, Levi.',
    quote: '"Don\'t let brain goblins live rent-free!"',
  },
  {
    id: 'yellow-03',
    category: 'yellow',
    categoryName: 'HAPPY PILLS',
    rarity: 'RARE',
    title: 'Unlimited Free Complain Coupon',
    sticker: '🗣️',
    tagline: 'Vent without filter.',
    content:
      'Present this token to initiate a 30-minute unhinged vent session about anyone or anything annoying. I will actively nod, fuel your outrage, gas you up, and say things like "OMG who did that to you, let\'s slash their tires (metaphorically)".',
    quote: '"100% agreement guaranteed."',
  },
  {
    id: 'yellow-04',
    category: 'yellow',
    categoryName: 'HAPPY PILLS',
    rarity: 'LEGENDARY',
    title: 'The Golden Serotonin Bomb',
    sticker: '💣',
    tagline: 'Maximum joy explosion.',
    content:
      'WARNING: HIGH VOLTAGE HAPPINESS. Look at yourself in the mirror right now and admit that you are an absolute icon. You survived 100% of your hardest days so far, and you look gorgeous while doing it. Happy Birthday, superstar!',
    quote: '"10/10 would choose you as bestie in every multiverse."',
  },

  // --- PINK: SWEET NOTHINGS (Appreciation & Love) ---
  {
    id: 'pink-01',
    category: 'pink',
    categoryName: 'SWEET NOTHINGS',
    rarity: 'COMMON',
    title: 'A Small Note of Genuine Gratitude',
    sticker: '💌',
    tagline: 'For being you.',
    content:
      'Thank you for being in my life, Levina. Life is weird and busy, but having someone as genuine, funny, and warm-hearted as you makes the ride so much sweeter. Thank you for your kindness and your effortless company.',
    quote: '"Grateful every single day."',
  },
  {
    id: 'pink-02',
    category: 'pink',
    categoryName: 'SWEET NOTHINGS',
    rarity: 'COMMON',
    title: 'The Little Things I Notice',
    sticker: '🌸',
    tagline: 'The subtle superpowers of Levi.',
    content:
      'I love how thoughtful you are, how your eyes light up when you talk about things you love, and the little habits that are quintessentially Levina. The world is often loud and fake, but you are genuinely, wonderfully real.',
    quote: '"Never lose that authentic sparkle."',
  },
  {
    id: 'pink-03',
    category: 'pink',
    categoryName: 'SWEET NOTHINGS',
    rarity: 'RARE',
    title: 'An Unapologetic Ode to Levina',
    sticker: '🎀',
    tagline: 'A collectible love note.',
    content:
      'If friendship was a gashapon machine, pulling you on the first try was the ultimate luck roll. You make ordinary days feel memorable. I hope this year brings you people who treasure your heart as much as you deserve.',
    quote: '"A limited-edition human being."',
  },
  {
    id: 'pink-04',
    category: 'pink',
    categoryName: 'SWEET NOTHINGS',
    rarity: 'LEGENDARY',
    title: 'The Birthday Heart Anchor',
    sticker: '💖',
    tagline: 'A love note that never fades.',
    content:
      'Dearest Levina, on your birthday, I want to wish you peace of mind, unshakeable confidence, and endless laughter. You deserve all the good things coming your way. Thank you for making my corner of the universe so much brighter.',
    quote: '"Always in your corner, today and tomorrow."',
  },

  // --- GREEN: LUCKY CHARMS (Wishes & Future Adventures) ---
  {
    id: 'green-01',
    category: 'green',
    categoryName: 'LUCKY CHARMS',
    rarity: 'COMMON',
    title: 'The Boba / Iced Coffee Pact',
    sticker: '🧋',
    tagline: 'One drink on my tab.',
    content:
      'Redeemable anytime: One cup of your favorite sweet drink, extra ice or 50% sugar just the way you like it. We sit, sip, and gossip or enjoy comfortable silence. Valid until consumed.',
    quote: '"Sweet treats cure 99% of bad moods."',
  },
  {
    id: 'green-02',
    category: 'green',
    categoryName: 'LUCKY CHARMS',
    rarity: 'COMMON',
    title: 'Auspicious Birthday Blessing',
    sticker: '🍀',
    tagline: 'Luck buff: +100 Luck for 365 Days.',
    content:
      'May all traffic lights turn green for you. May your favorite items always be on discount. May you find money in your winter coat pockets. And may your Wi-Fi never buffer during the best part of the show!',
    quote: '"Universe RNG heavily tilted in your favor."',
  },
  {
    id: 'green-03',
    category: 'green',
    categoryName: 'LUCKY CHARMS',
    rarity: 'RARE',
    title: 'The Spontaneous Trip Ticket',
    sticker: '🗺️',
    tagline: 'Adventure is calling.',
    content:
      'A promise for our next adventure! Whether it\'s exploring a hidden cafe, an arcade date, a random night drive to find the best street food, or a weekend getaway. You pick the date, I bring the snacks and music.',
    quote: '"Passport to spontaneous memories."',
  },
  {
    id: 'green-04',
    category: 'green',
    categoryName: 'LUCKY CHARMS',
    rarity: 'LEGENDARY',
    title: 'The Grand Prosperity Wish',
    sticker: '✨',
    tagline: 'A golden path for Levina\'s year.',
    content:
      'In this new age chapter of your life: May your bank account flourish, your career steps feel fulfilling, your skin stay clear, your mental health stay strong, and your heart be completely content. You deserve it all, Levi!',
    quote: '"May your wildest dreams find their way to reality."',
  },

  // --- PURPLE: MYSTERY MEAT (Surprises & Absurd Fun) ---
  {
    id: 'purple-01',
    category: 'purple',
    categoryName: 'MYSTERY MEAT',
    rarity: 'COMMON',
    title: 'The Absurd Birthday Truth Dare',
    sticker: '🎲',
    tagline: 'A strange little challenge.',
    content:
      'You must immediately send me the 7th picture in your camera roll with ZERO context or explanation. If it\'s a screenshot of a receipt or an ugly selfie, even better. Do it now!',
    quote: '"Curiosity killed the cat, but Levi obeys the loot."',
  },
  {
    id: 'purple-02',
    category: 'purple',
    categoryName: 'MYSTERY MEAT',
    rarity: 'COMMON',
    title: 'Cryptic Fortune Cookie',
    sticker: '🥠',
    tagline: 'What the stars say today...',
    content:
      '"Someone whose name starts with L and ends with EVINA is going to have an outrageously successful week. Beware of cats demanding cuddles and snacks that mysteriously vanish into your stomach."',
    quote: '"The mystical orb has spoken."',
  },
  {
    id: 'purple-03',
    category: 'purple',
    categoryName: 'MYSTERY MEAT',
    rarity: 'RARE',
    title: 'The Reverse Birthday Gift (My Roast & Confession)',
    sticker: '🎭',
    tagline: 'A goofy confession.',
    content:
      'Here is a secret: Whenever you send a funny meme, I laugh out loud even if I reply 10 minutes later acting casual. You are genuinely the funniest person I know, even when you\'re being utterly chaotic.',
    quote: '"Top tier comedic genius detected."',
  },
  {
    id: 'purple-04',
    category: 'purple',
    categoryName: 'MYSTERY MEAT',
    rarity: 'LEGENDARY',
    title: 'The Mystery Jackpot Pass',
    sticker: '👾',
    tagline: 'Wildcard of the arcade.',
    content:
      'You have obtained the coveted Mystery Wildcard! You can command me to perform ONE ridiculous favor (within reason and legal limits): e.g. sing a song voice note in a terrible accent, draw an intentionally bad portrait of you, or buy you dessert.',
    quote: '"Use wisely, chaos goblin."',
  },

  // --- GOLD: SPECIAL DROP (Exclusive Birthday Drops) ---
  {
    id: 'gold-01',
    category: 'gold',
    categoryName: 'SPECIAL DROP',
    rarity: 'SPECIAL',
    title: 'The Real World Birthday Gift Reveal',
    sticker: '👑',
    tagline: 'VIP COLLECTIBLE NO. 01',
    content:
      'SURPRISE! This arcade is just the opening act. There is a real-world gift / treat waiting for you! Please reach out to Loomy with the secret password: "LOOT MASTER LEVI" to claim your physical present & celebration date!',
    quote: '"Happy Birthday, Levina! You are truly one of a kind."',
    badgeLabel: 'REAL GIFT VOUCHER',
  },
  {
    id: 'gold-02',
    category: 'gold',
    categoryName: 'SPECIAL DROP',
    rarity: 'SPECIAL',
    title: 'Loomy\'s Time Capsule Letter',
    sticker: '⭐',
    tagline: 'VIP COLLECTIBLE NO. 02',
    content:
      'A special letter for Levina: Years may pass, hair may change, cities might shift, but our bond remains rock solid. Remember how far you\'ve come, celebrate who you\'ve become, and smile for everything still to come.',
    quote: '"Forever in your fan club."',
    badgeLabel: 'SPECIAL MEMORY',
  },
  {
    id: 'gold-03',
    category: 'gold',
    categoryName: 'SPECIAL DROP',
    rarity: 'SPECIAL',
    title: 'The Golden Feast Ticket',
    sticker: '🎂',
    tagline: 'VIP COLLECTIBLE NO. 03',
    content:
      'A celebratory birthday dinner / lunch feast! Your choice of restaurant, any meal, fully treated with zero calorie counting allowed today. Cake candles will be lit, and a wish must be made!',
    quote: '"Birthday calories do not count by law."',
    badgeLabel: 'DINNER ON ME',
  },
  {
    id: 'gold-04',
    category: 'gold',
    categoryName: 'SPECIAL DROP',
    rarity: 'SPECIAL',
    title: 'The Crown of Infinite Good Vibes',
    sticker: '🏆',
    tagline: 'VIP COLLECTIBLE NO. 04',
    content:
      'Congratulations on unlocking the Golden Crown! You are officially the Queen of Loomy\'s Lucky Loot. May your day be filled with warm hugs, belly laughs, sweet treats, and all the love you deserve.',
    quote: '"Long live Birthday Queen Levina!"',
    badgeLabel: 'HALL OF FAME',
  },
];
