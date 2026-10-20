/* Desi Sawad — site data. Edit this file to change the menu, gallery or chatbot answers.
   PRICES: set p to a number (SAR) to show a price, e.g. p: 25. Leave p: null to show "Price on WhatsApp". */
window.DS = window.DS || {};

DS.CONTACT = {
  phone: '+966 57 606 1979',
  tel: '+966576061979',
  wa: '966576061979',
  address: 'Sharah e Sahafa, Haroon Al Rashid Rd, As Sulay, Riyadh 14263',
  maps: 'https://www.google.com/maps/search/?api=1&query=Desi+Sawad+Restaurant+Haroon+Al+Rashid+Rd+As+Sulay+Riyadh',
  instagram: 'https://www.instagram.com/desisawad.sa/',
  tiktok: 'https://www.tiktok.com/@desisawad.sa',
  facebook: 'https://www.facebook.com/desisawad.sa',
  open: 6 * 60,        /* 6:00 AM, Riyadh time */
  close: 23 * 60 + 30  /* 11:30 PM */
};

DS.CATS = [
  { id: 'grill', name: 'Grill', em: 'off the flame', u: 'باربی کیو' },
  { id: 'karahi', name: 'Karahi', em: 'from the iron', u: 'کڑاہی' },
  { id: 'rice', name: 'Rice', em: 'from the handi', u: 'چاول' },
  { id: 'sides', name: 'Sides & bread', em: 'on the side', u: 'ساتھ میں' },
  { id: 'drinks', name: 'Drinks', em: 'ice cold', u: 'مشروبات' }
];

DS.MENU = [
  { id: 'seekh', cat: 'grill', n: 'Seekh Kebab', u: 'سیخ کباب', d: 'Spiced minced meat on the skewer, charred over open flame. Comes on cast iron over onions with green chilli.', img: 'seekh-kebab.webp', tag: 'Signature', p: null },
  { id: 'malai', cat: 'grill', n: 'Chicken Malai Boti', u: 'ملائی بوٹی', d: 'Boneless chicken in a cream marinade, grilled soft with golden, charred edges.', img: 'malai-boti.webp', tag: 'Fan favourite', p: null },
  { id: 'tikka', cat: 'grill', n: 'Chicken Tikka', u: 'چکن تکہ', d: 'Bone-in quarter, red-spiced and fire-grilled. Served sizzling with three dips.', img: 'tikka-leg.webp', p: null },
  { id: 'grilled', cat: 'grill', n: 'Grilled Chicken', u: 'گرلڈ چکن', d: 'Herb and spice crusted chicken pieces off the grill, on a bed of shredded cabbage.', img: 'grill-chicken.webp', p: null },
  { id: 'platter', cat: 'grill', n: 'Mixed Grill Platter', u: 'مکس گرل', d: 'Seekh, malai boti and tikka boti over rice with chutneys and salad. One platter, the whole table.', img: 'platter.webp', tag: 'For sharing', p: null },
  { id: 'karahi', cat: 'karahi', n: 'Chicken Karahi', u: 'چکن کڑاہی', d: 'Tomato, ginger and green chilli, cooked down in the iron karahi until the oil rises.', img: 'chicken-karahi.webp', tag: 'Signature', p: null },
  { id: 'white', cat: 'karahi', n: 'White Karahi', u: 'وائٹ کڑاہی', d: 'Creamy and peppery. Chicken simmered in cream and yoghurt, finished with green chilli.', img: 'white-karahi.webp', p: null },
  { id: 'biryani', cat: 'rice', n: 'Chicken Biryani', u: 'چکن بریانی', d: 'Layered long-grain rice and spiced chicken, steamed in the handi. Raita on the side.', img: 'biryani.webp', tag: 'Bestseller', p: null },
  { id: 'pulao', cat: 'rice', n: 'Chicken Pulao', u: 'چکن پلاؤ', d: 'Fragrant rice cooked in chicken yakhni with whole spices. Gentle and filling.', img: 'pulao-bhindi.webp', pos: '50% 50%', p: null },
  { id: 'bhindi', cat: 'sides', n: 'Bhindi Masala', u: 'بھنڈی', d: 'Okra stir-fried with onion, tomato and ginger.', img: 'pulao-bhindi.webp', pos: '100% 50%', p: null },
  { id: 'salad', cat: 'sides', n: 'Fresh Salad', u: 'سلاد', d: 'Cucumber, tomato and onion with lemon and chaat masala.', img: 'pulao-bhindi.webp', pos: '0% 50%', p: null },
  { id: 'naan', cat: 'sides', n: 'Naan & Roti', u: 'نان', d: 'Hot from the oven. One per person, and one more for the karahi.', p: null },
  { id: 'dips', cat: 'sides', n: 'Raita & Chutneys', u: 'چٹنی', d: 'Raita, imli, green chutney and garlic mayo. Ask for extra, we never say no.', p: null },
  { id: 'mint', cat: 'drinks', n: 'Mint Margarita', u: 'منٹ مارگریٹا', d: 'Crushed ice, fresh mint and lime, blended green and frosty.', img: 'opening-spread.webp', pos: '0% 70%', tag: 'Cold', p: null },
  { id: 'melon', cat: 'drinks', n: 'Watermelon Slush', u: 'تربوز', d: 'Fresh watermelon over crushed ice. Sweet, red and very cold.', img: 'opening-spread.webp', pos: '100% 70%', p: null }
];

DS.GALLERY = [
  { f: 'seekh-kebab.webp', t: 'Seekh Kebab', c: 'grill', s: 'Off the flame, onto cast iron' },
  { f: 'biryani.webp', t: 'Chicken Biryani', c: 'food', s: 'Every grain, a craving' },
  { f: 'interior-majlis.webp', t: 'The Majlis', c: 'room', s: 'Floor seating by the open kitchen' },
  { f: 'chicken-karahi.webp', t: 'Chicken Karahi', c: 'food', s: 'Your next craving' },
  { f: 'malai-boti.webp', t: 'Malai Boti', c: 'grill', s: 'Cream marinade, soft char' },
  { f: 'platter.webp', t: 'Mixed Grill Platter', c: 'food', s: 'Gather around good food' },
  { f: 'storefront.webp', t: 'The Storefront', c: 'room', s: 'Haroon Al Rashid Road, As Sulay' },
  { f: 'white-karahi.webp', t: 'White Karahi', c: 'food', s: 'A spoonful of comfort' },
  { f: 'sizzler-table.webp', t: 'Opening Night', c: 'opening', s: 'Two trays, six dips' },
  { f: 'grill-chicken.webp', t: 'Grilled Chicken', c: 'grill', s: 'From the grill, with love' },
  { f: 'interior-hall.webp', t: 'The Dining Hall', c: 'room', s: 'Black marble, white linen' },
  { f: 'tikka-leg.webp', t: 'Chicken Tikka', c: 'grill', s: 'Bone-in, red-spiced, sizzling' },
  { f: 'opening-spread.webp', t: 'The Opening Spread', c: 'opening', s: 'Karahi, platter and coolers' },
  { f: 'malai-boti-2.webp', t: 'Fresh Off The Grill', c: 'opening', s: 'Malai boti, just landed' },
  { f: 'pulao-bhindi.webp', t: 'Pulao & Bhindi', c: 'food', s: 'Home-style, every day' },
  { f: 'sizzler-pair.webp', t: 'Sizzler Trays', c: 'opening', s: 'With naan on the side' }
];

/* Chatbot knowledge. k = keywords (English, Roman Urdu and Urdu). a = reply (HTML allowed).
   type adds a rich card: 'hours' | 'location' | 'dishes' (with ids) | 'book' | 'order' | 'wa' */
DS.KB = [
  { k: ['salam', 'assalam', 'aoa', 'hello', 'hi', 'hey', 'salaam', 'السلام', 'سلام'], a: 'Wa Alaikum Assalam! Welcome to <b>Desi Sawad</b>. I can show you the menu, take your order to WhatsApp, book a table or tell you how to find us.' },
  { k: ['time', 'timing', 'timings', 'hour', 'hours', 'open', 'close', 'closing', 'kab', 'khula', 'band', 'waqt', 'وقت', 'کب'], a: 'We are open <b>every day, 6:00 AM to 11:30 PM</b> (Riyadh time).', type: 'hours' },
  { k: ['where', 'location', 'address', 'direction', 'directions', 'map', 'kahan', 'pata', 'sulay', 'haroon', 'reach', 'route', 'کہاں', 'پتہ'], a: 'We are on <b>Haroon Al Rashid Road in As Sulay</b>, Riyadh.', type: 'location' },
  { k: ['menu', 'dish', 'dishes', 'food', 'khana', 'eat', 'serve', 'kya milta', 'کھانا', 'مینو'], a: 'Here are the dishes people order most. Tap <b>Add</b> and I will put them in your order.', type: 'dishes', ids: ['seekh', 'karahi', 'biryani', 'malai', 'white', 'mint'] },
  { k: ['order', 'buy', 'mangwana', 'mangwa', 'online', 'cart', 'آرڈر'], a: 'Ordering is easy: add dishes, choose takeaway, delivery or dine-in, and your order opens in WhatsApp for us to confirm.', type: 'order' },
  { k: ['price', 'prices', 'cost', 'rate', 'kitne', 'kitna', 'paisa', 'sar', 'riyal', 'expensive', 'cheap', 'qeemat', 'قیمت'], a: 'Prices move with the market, so we confirm <b>today’s prices on WhatsApp</b> with your total, before anything goes on the fire.', type: 'wa' },
  { k: ['book', 'booking', 'reserve', 'reservation', 'table', 'seat', 'jagah', 'بکنگ'], a: 'Let’s save you a seat. Choose a table or the majlis, tell us the time and number of guests, and we confirm on WhatsApp.', type: 'book' },
  { k: ['deliver', 'delivery', 'home', 'ghar', 'jahez', 'hungerstation', 'keeta', 'talabat', 'ڈلیوری'], a: 'For delivery, build your order and pick <b>Delivery</b> with your address. We confirm on WhatsApp whether we reach your area and how long it takes.', type: 'order' },
  { k: ['takeaway', 'take away', 'pickup', 'pick up', 'parcel', 'to go'], a: 'Yes, takeaway is available. Build your order, pick <b>Takeaway</b>, and we tell you when it is ready.', type: 'order' },
  { k: ['majlis', 'floor', 'seating', 'family', 'families', 'ladies', 'cushion'], a: 'We have <b>majlis floor seating</b> with cushions, right by the open kitchen, plus regular tables. Ask for majlis when you book.', type: 'book' },
  { k: ['karahi', 'kadhai', 'kadai', 'کڑاہی'], a: 'Two karahis, both served in the iron: <b>Chicken Karahi</b> (tomato, ginger, green chilli) and <b>White Karahi</b> (cream, yoghurt, black pepper).', type: 'dishes', ids: ['karahi', 'white'] },
  { k: ['biryani', 'biriyani', 'rice', 'chawal', 'pulao', 'pilau', 'بریانی'], a: 'Our <b>Chicken Biryani</b> is layered and steamed in the handi, with raita. Something gentler? Try the <b>Chicken Pulao</b>.', type: 'dishes', ids: ['biryani', 'pulao'] },
  { k: ['seekh', 'kebab', 'kabab', 'bbq', 'grill', 'barbecue', 'tikka', 'boti', 'malai', 'tandoori', 'کباب'], a: 'Everything off the grill comes <b>sizzling on cast iron</b> with onions and three dips: imli, garlic mayo and green chutney.', type: 'dishes', ids: ['seekh', 'malai', 'tikka', 'grilled', 'platter'] },
  { k: ['platter', 'sharing', 'share', 'mix grill', 'mixed'], a: 'The <b>Mixed Grill Platter</b> has seekh, malai boti and tikka boti over rice, with chutneys. Made for the whole table.', type: 'dishes', ids: ['platter'] },
  { k: ['drink', 'drinks', 'margarita', 'mint', 'slush', 'watermelon', 'juice', 'cold', 'thanda', 'pepsi', 'soft drink'], a: 'Our coolers are the <b>Mint Margarita</b> and <b>Watermelon Slush</b>. Soft drinks are in the fridge too.', type: 'dishes', ids: ['mint', 'melon'] },
  { k: ['spicy', 'spice', 'mirch', 'chilli', 'chili', 'hot', 'mild', 'teekha', 'تیز'], a: 'Tell us your level in the order notes: mild, medium or proper desi. White karahi is the gentlest. Chicken karahi has a real kick.' },
  { k: ['breakfast', 'nashta', 'morning', 'subah', 'halwa', 'puri', 'paratha', 'chai', 'tea', 'ناشتہ'], a: 'We open at <b>6 AM</b> every day. Message us to ask what is on the morning menu today.', type: 'wa' },
  { k: ['halal', 'حلال'], a: 'Yes, all our meat is halal.' },
  { k: ['bread', 'naan', 'roti', 'chapati', 'tandoor', 'نان', 'روٹی'], a: 'Naan and roti come hot. Order one per person, plus one more for the karahi gravy.', type: 'dishes', ids: ['naan'] },
  { k: ['dip', 'dips', 'sauce', 'chutney', 'raita', 'imli', 'mayo'], a: 'Grills come with <b>imli</b>, <b>garlic mayo</b> and <b>green chutney</b>. Extra raita any time, just ask.' },
  { k: ['group', 'party', 'event', 'birthday', 'office', 'big', 'catering', 'gathering', 'dawat', 'دعوت'], a: 'Groups are very welcome. Book with your guest count and anything special in the note. For catering or a big dawat, message us the details.', type: 'book' },
  { k: ['phone', 'call', 'number', 'contact', 'whatsapp', 'رابطہ', 'نمبر'], a: 'Call or WhatsApp us on <b>+966 57 606 1979</b>.', type: 'wa' },
  { k: ['instagram', 'insta', 'tiktok', 'facebook', 'social', 'follow', 'reel'], a: 'Find us as <b>@desisawad.sa</b> on Instagram, TikTok and Facebook.' },
  { k: ['opening', 'grand', 'new', 'launch', 'start', 'when did'], a: 'We opened on <b>19 October 2026</b> with a grand opening at 6 PM Saudi time. Come and say salam.' },
  { k: ['kid', 'kids', 'child', 'children', 'baby', 'high chair', 'bachay', 'بچے'], a: 'Families with kids are very welcome. Mention it in your booking note and we will set things up.', type: 'book' },
  { k: ['pay', 'payment', 'card', 'cash', 'mada', 'apple pay', 'stc'], a: 'Ask us on WhatsApp or at the counter about payment options.', type: 'wa' },
  { k: ['veg', 'vegetarian', 'vegan', 'sabzi', 'daal', 'dal', 'سبزی'], a: 'From the vegetarian side: <b>bhindi masala</b>, fresh salad, naan and raita. Ask on WhatsApp for today’s daal or sabzi.', type: 'dishes', ids: ['bhindi', 'salad', 'naan'] },
  { k: ['parking', 'park', 'car'], a: 'We are right on Haroon Al Rashid Road. Message us and we will guide you to the easiest spot.', type: 'location' },
  { k: ['wifi', 'charging', 'tv', 'football', 'cricket', 'match'], a: 'Ask the team when you arrive and they will sort you out.' },
  { k: ['thank', 'thanks', 'shukriya', 'jazak', 'great', 'nice', 'awesome', 'love', 'شکریہ'], a: 'Shukriya! Hope to see you at Desi Sawad soon.' }
];
