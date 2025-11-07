import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../utils/db.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

dotenv.config();

// Expanded dish pools per cuisine to support unique menus across 4 restaurants
const cuisines = {
  'North Indian': ['Butter Chicken','Paneer Tikka','Chole Bhature','Dal Makhani','Rogan Josh','Aloo Paratha','Tandoori Chicken','Gulab Jamun','Veg Biryani','Kadai Paneer','Malai Kofta','Palak Paneer','Rajma Chawal','Bhindi Masala','Chicken Tikka Masala','Naan','Jeera Rice','Lassi','Samosa','Kheer','Mutton Biryani','Baingan Bharta','Methi Chicken','Paneer Butter Masala','Fish Amritsari','Murgh Musallam','Chicken Korma','Lamb Kebab','Paneer Bhurji','Chicken Handi','Dal Tadka','Pani Puri','Sev Puri','Dahi Puri'],
  'South Indian': ['Masala Dosa','Idli Sambar','Medu Vada','Chicken Chettinad','Pongal','Uttapam','Pesarattu','Andhra Biryani','Curd Rice','Rasam Rice','Mysore Pak','Neer Dosa','Bisi Bele Bath','Kozhi Varuval','Mangalorean Fish Curry','Prawns Ghee Roast','Kothu Parotta','Filter Coffee','Lemon Rice','Coconut Chutney','Tomato Rice','Onion Rava Dosa','Ghee Roast Dosa','Set Dosa','Upma','Appam with Stew','Kuzhi Paniyaram','Idiyappam','Sambar Vada','Ragi Mudde','Avial','Veg Kurma','Chicken 65','Pepper Chicken'],
  'American': ['Cheeseburger','BBQ Ribs','Fried Chicken','Mac and Cheese','Buffalo Wings','Caesar Salad','Clam Chowder','Hot Dog','Pancakes','Apple Pie','Philly Cheesesteak','Cobb Salad','Chicken Sandwich','Onion Rings','Nacho Fries','Chili Dog','Milkshake','Buttermilk Biscuits','Cornbread','Tater Tots','Pulled Pork Sandwich','BLT','New York Cheesecake','Brownie Sundae','Shrimp Po boy','Chicken Pot Pie','Waffle','French Toast','Grilled Cheese','Meatloaf','Cajun Shrimp','Lobster Roll','Key Lime Pie','Chicago Deep Dish Pizza'],
  'Mexican': ['Tacos Al Pastor','Chicken Quesadilla','Beef Burrito','Guacamole','Churros','Enchiladas','Nachos','Tamales','Pozole','Fajitas','Elote','Sopes','Tortilla Soup','Molletes','Cochinita Pibil','Torta','Horchata','Barbacoa Tacos','Carnitas','Huevos Rancheros','Chile Relleno','Queso Fundido','Pollo Asado','Carne Asada','Flan','Tres Leches Cake','Agua Fresca','Huaraches','Gorditas','Birria Tacos','Adobada','Ceviche','Chilaquiles','Pico de Gallo','Salsa Roja'],
  'Asian': ['Pad Thai','Bibimbap','Pho','Satay','Tom Yum','Laksa','Nasi Goreng','Kebab','Spring Rolls','Chicken Teriyaki','Gyoza','Mango Sticky Rice','Hainanese Chicken Rice','Beef Rendang','Korean Fried Chicken','Som Tam','Char Kway Teow','Banh Mi','Dim Sum','Katsu Don','Miso Ramen','Yakiniku','Okonomiyaki','Bulgogi','Green Curry','Red Curry','Khao Soi','Dan Dan Noodles','Shabu Shabu','Sushi Roll','Kimchi Jjigae','Tteokbokki','Yakitori','Hokkien Mee','Sambal Prawns'],
  'Chinese': ['Kung Pao Chicken','Sweet and Sour Pork','Mapo Tofu','Chow Mein','Dumplings','Peking Duck','Fried Rice','Hot Pot','Sichuan Noodles','Baozi','Char Siu','Wonton Soup','Scallion Pancakes','Lo Mein','Ma La Xiang Guo','Steamed Fish','Three Cup Chicken','Xiao Long Bao','Egg Fried Rice','Chicken Manchurian','General Tso Chicken','Sesame Chicken','Orange Chicken','Beef and Broccoli','Egg Drop Soup','Tofu Stir Fry','Twice Cooked Pork','Crispy Chili Beef','Hakka Noodles','Chili Paneer','Honey Chili Potatoes','Chongqing Chicken','Schezwan Rice','Lemon Chicken','Chili Garlic Noodles'],
  'Japanese': ['Sushi Platter','Ramen','Tempura','Okonomiyaki','Katsu Curry','Udon','Sashimi','Takoyaki','Miso Soup','Gyudon','Tonkatsu','Chicken Karaage','Onigiri','Chawanmushi','Unagi Don','Oyakodon','Yakimeshi','Natto Roll','Matcha Ice Cream','Taiyaki','Dorayaki','Zaru Soba','Yakisoba','Gohan','Gomae Spinach','Agedashi Tofu','Gindara Saikyo','Kaisendon','Kaki Fry','Hamachi Kama','Teba Shio','Ankake Tofu','Hiyashi Chuka','Omurice','Melon Pan']
};

const restaurantsPerCuisine = 4;

const randomCoordsAround = ([lng, lat]) => [
  lng + (Math.random() - 0.5) * 0.1,
  lat + (Math.random() - 0.5) * 0.1
];

const cityCenter = [77.5946, 12.9716]; // Bangalore as example [lng, lat]

const imageFor = (cuisine, dish) =>
  `https://picsum.photos/seed/${encodeURIComponent(dish + '-' + cuisine)}/1200/800`;

const descriptors = ['Signature','Classic','Spicy','Deluxe','Chef Special','Herb','House','Royal','Fiery','Crispy','Tangy'];

// Creative name pools per cuisine
const namePools = {
  'North Indian': [
    'Saffron Sultans',
    'Royal Tandoor',
    'Masala Monarchs',
    'Punjab Pantry',
    'Nawab Nook',
    'Kesar Kettle'
  ],
  'South Indian': [
    'Dosa Dynasty',
    'Coconut Courtyard',
    'Udupi Utopia',
    'Chettinad Chronicles',
    'Idli Ink',
    'Spice Coast Kitchen'
  ],
  'American': [
    'Liberty Grillhouse',
    'Route 66 Smoke & Diner',
    'Brooklyn Belly',
    'Patriot Pit BBQ',
    'Downtown Deli Co.',
    'Copper Skillet Tavern'
  ],
  'Mexican': [
    'Casa Caliente',
    'Aztec Ember',
    'Frida’s Fuego',
    'Luna & Limes',
    'El Camino Taqueria',
    'Cactus Cantina'
  ],
  'Asian': [
    'Lotus Lantern',
    'Tiger Wok',
    'Bamboo Bowl',
    'Wok & Waves',
    'Eastern Ember',
    'Zen Spoon'
  ],
  'Chinese': [
    'Red Dragon Wok',
    'Golden Panda Pavilion',
    'Silk Lantern Kitchen',
    'Sichuan Spark',
    'Imperial Noodle House',
    'Jade Garden Court'
  ],
  'Japanese': [
    'Sakura Harbor',
    'Izakaya Iki',
    'Zen Maki Bar',
    'Nori Nook',
    'Wasabi Wave',
    'Shibuya Sushi Lab'
  ]
};

const imageForRestaurant = (cuisine, name) =>
  `https://picsum.photos/seed/${encodeURIComponent(name)}/1200/800`;

// Per-dish image overrides (keys are normalized/lowercase dish names)
const dishImageOverride = {
  'butter chicken': 'https://theyummydelights.com/wp-content/uploads/2018/07/Indian-butter-chicken-recipe.jpg',
  'chole bhature': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyta2FEc05FPDkoHtzey9a8nmlgumGb7lDew&s',
  'rogan josh': 'https://headbangerskitchen.com/wp-content/uploads/2024/08/ROGANJOSH-H2.jpg',
  'tandoori chicken': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu7hYKuW7OtjUTnPaKWq4rviVgBs2uhaceSw&s',
  'paneer tikka': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR05YUuPyqT5AQi5YQwwOv7n20lU7-M6BVj8Q&s',
  'dal makhani': 'https://www.sharmispassions.com/wp-content/uploads/2012/05/dal-makhani7-500x500.jpg',
  'aloo paratha': 'https://www.kingarthurbaking.com/sites/default/files/2025-07/Aloo-Paratha-_2025_Lifestyle_H_2435.jpg',
  'gulab jamun': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTrkSTYkhjRV2wggrSj3W1q_RdzdJIA8aT2w&s',
  'jeera rice': 'https://priyafoods.com/cdn/shop/files/JEERARICE_2.jpg?v=1701948113&width=1780',
  'samosa': 'https://static.toiimg.com/photo/61050397.cms',
  'mutton biryani': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT66d8jsPBIoaw0xeBZWHL_T9OQPOBJDKeAlg&s',
  'methi chicken': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_xpwVl0L-bR-e1stU-lUij-hNyAHE-BYgbg&s',
  'lassi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToT6aOEahBB7QHwX_knBjOqaPBq-TQA8m4kw&s',
  'kheer': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWq5RkgNtHG4LL98GYxvZaCmwn8gXF5eFl5Q&s',
  'baingan bharta': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Baigan_Bharta_from_Nagpur.JPG',
  'paneer butter masala': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQRQMKHs5qBBmBwVN6e7UTPlt3PpK2c6T8XA&s',
  'fish amritsari': 'https://www.yummyoyummy.com/wp-content/uploads/2020/06/img_2580.jpg',
  'chicken korma': 'https://madscookhouse.com/wp-content/uploads/2022/02/Chicken-Korma-Nut-Free-500x375.jpg',
  'paneer bhurji': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/02/paneer-bhurji-recipe.webp',
  'dal tadka': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZR7mDEzs4DAxRnAV9GKHEhXCYHiYBK1xAvw&s',
  'murgh musallam': 'https://i.ytimg.com/vi/8uySBudAK5s/maxresdefault.jpg',
  'lamb kebab': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI61TFKLBqjFaKVy5p6vSp0Ven_FpgiW-XJw&s',
  'chicken handi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGfvRjQ5-xDSAfQCuAPCl6shCHPCTvXK1jnA&s',
  'pani puri': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBIEkjFHJFxe3pjU9IooFnr9gI3SUZHsn1jA&s',
  'veg biryani': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNzEVhM9MfElGVoXOfpFUBth8hEhntyPpT2A&s',
  'malai kofta': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4cnHdUfexvHPI4ohvfY5-sDAZe1taV9_RHg&s',
  'rajma chawal': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXcuWx6YEXMgCYjrYPkoAgg3xib7U9VeoqcA&s',
  'chicken tikka masala': 'https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-Tikka-Masala-min.jpg',
  'kadai paneer': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-j1XdLKn31g1i4xhsLYgRw0eiuPzxMgyHpw&s',
  'palak paneer': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_I8R5TXGoabQURaYGUMiLe7d1GIcdpLdTLQ&s',
  'bhindi masala': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7bsY-eXotwHw7A9VdVvkVxvrE6awDMcUWPw&s',
  'naan': 'https://www.kingarthurbaking.com/sites/default/files/2021-02/naan-3.jpg',
  // South Indian additions
  'masala dosa': 'https://palatesdesire.com/wp-content/uploads/2022/09/Mysore-masala-dosa-recipe@palates-desire.jpg',
  'medu vada': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbaqeRbG_S1cgllKzjLsTTYIklzBXMJbBeSA&s',
  'pongal': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/01/pongal-ven-pongal-500x500.jpg',
  'pesarattu': 'https://cdn1.foodviva.com/static-content/food-images/andhra-recipes/pesarattu/pesarattu.jpg',
  'idli sambar': 'https://vaya.in/recipes/wp-content/uploads/2018/02/Idli-and-Sambar-1.jpg',
  'chicken chettinad': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSdYkqM5GJLHSlYcwoKA8KiT8ndmgJcamf5A&s',
  'uttapam': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM7GLIp0yAJVjO0InKL8gXEXCVmNPXkajwtA&s',
  'andhra biryani': 'https://curlytales.com/wp-content/uploads/2022/08/Untitled-design-2022-08-02T160130.319.jpg',
  'curd rice': 'https://www.chefkunalkapur.com/wp-content/uploads/2023/05/DSC09411-1300x731.jpg?v=1684031938',
  'mysore pak': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZmodTfT2tbH7hrFUYvpy53paHtARqULzq4Q&s',
  'bisi bele bath': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Bisi_Bele_Bath_%28Bisibelebath%29.JPG/1200px-Bisi_Bele_Bath_%28Bisibelebath%29.JPG',
  'mangalorean fish curry': 'https://blog.swiggy.com/wp-content/uploads/2024/09/Image-1_-Manglorean-Fish-Curry-1024x538.jpg',
  'rasam rice': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-wVN93MvbPm0bKkSoQPMSrmy18JgovMMI3g&s',
  'neer dosa': 'https://static.toiimg.com/thumb/53541904.cms?width=1200&height=900',
  'kozhi varuval': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWWsbSTBC_I9Zy4EsTOCs_kP22AbAJKpJdWg&s',
  'prawns ghee roast': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN5L_Dse1iN-xIYuRhTd5YHnGYFwN7MaEq6w&s',
  'kothu parotta': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQTFGKxyoYhOzOxIQalpDOtdkuMElBjdqsOw&s',
  'lemon rice': 'https://www.ohmyveg.co.uk/wp-content/uploads/2024/06/lemon-rice-1-2-e1722869866156.jpg',
  'tomato rice': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2GS_bRCrG-oI1X4H-nuz2J9p4S35K_2ihqQ&s',
  'ghee roast dosa': 'https://www.shutterstock.com/image-photo/dosa-ghee-roast-coconut-chutney-600nw-2484376905.jpg',
  'filter coffee': 'https://truesouth.in/cdn/shop/files/southindian1.jpg?v=1707477021',
  'coconut chutney': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgEralXG39ucYaVhHZ0LijRW7V3aYBt8HsaQ&s',
  'onion rava dosa': 'https://i0.wp.com/www.tomatoblues.com/wp-content/uploads/2012/02/rava-onion-dosa-1-scaled.jpg?fit=1696%2C2560&ssl=1',
  'set dosa': 'https://i0.wp.com/www.chitrasfoodbook.com/wp-content/uploads/2020/12/setdosarecipe-1.jpg?ssl=1',
  'upma': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWHMTQDALTpyB8sxVUrmiTHqvoDWnd2VxNg&s',
  'kuzhi paniyaram': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2016/04/paniyaram-recipe-1-500x500.jpg',
  'sambar vada': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVMFV57HoBznF7uj4vR-ZBeWp5PSDT7XxrAw&s',
  'avial': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1UZt5GLEq8oEloJUSk8bCCJTO9sJ1y5Oiww&s',
  'appam with stew': 'https://www.keralatourism.org/_next/image/?url=http%3A%2F%2F127.0.0.1%2Fktadmin%2Fimg%2Fpages%2Fmobile%2FAppam_and_Chicken_Stew20131126121303_88_1.jpg&w=3840&q=75',
  'idiyappam': 'https://happietrio.com/wp-content/uploads/2016/03/DSC_0614.jpg',
  'ragi mudde': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpBhj0hpmcR_-iuOx-Azvd9xhiA99TgZzUjw&s',
  'veg kurma': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/veg-kurma-vegetable-korma-recipe.jpg',
  // American additions
  'cheeseburger': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0RmsG_2crk1KJVfPZTKTqgGggWDtnyC-Rw&s',
  'fried chicken': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPK5vHLFn3BZiM3eQuMf33INLYluE3JqJO-A&s',
  'buffalo wings': 'https://www.budgetbytes.com/wp-content/uploads/2024/01/buffalo-wings-overhead-horizontal-WR-scaled.jpg',
  'clam chowder': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFSrzIZzx8PxeweJ3F04gL5LwZZwzpaMxsfw&s',
  'bbq ribs': 'https://www.southernliving.com/thmb/J02EQeOhOKHfmALt-jE_61idUck=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/oven-baked-baby-back-ribs-beauty-332-7deda00b7b4f4820a9c79f13ed09cfb9.jpg',
  'mac and cheese': 'https://www.pressurecookrecipes.com/wp-content/uploads/2022/12/instant-pot-mac-and-cheese.jpg',
  'caesar salad': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRrGzNTXgl2jlDBvY7vFbHRJeACtI2yP_oQw&s',
  'hot dog': 'https://www.licious.in/blog/wp-content/uploads/2016/07/Hot-Dogs.jpg',
  'pancakes': 'https://www.marthastewart.com/thmb/Vgb9cQSlegZz5fcoSbkkqyHPmHY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/338185-basic-pancakes-09-00b18f8418fd4e52bb2050173d083d04.jpg',
  'philly cheesesteak': 'https://thecozycook.com/wp-content/uploads/2025/06/Philly-Cheesesteaks-F.jpg',
  'chicken sandwich': 'https://c.ndtvimg.com/2021-07/vckh316o_grilled-chicken-sandwich_625x300_28_July_21.jpg',
  'nacho fries': 'https://thissillygirlskitchen.com/wp-content/uploads/2022/12/TACO-BELL-NACHO-FRIES-21-500x500.jpg',
  'apple pie': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtaQ0aurOfdFloFiQgxIOAIs4rOF6bpAMWWw&s',
  'cobb salad': 'https://www.herwholesomekitchen.com/wp-content/uploads/2021/02/cobbsaladrecipe-1.jpg',
  'onion rings': 'https://sweetsimplevegan.com/wp-content/uploads/2022/03/close_up_Vegan_beer_battered_crispy_onion_rings_sweet_simple_vegan_2.jpg',
  'chili dog': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiCMEqW4rA-UHM03ATqE3yi_2eF59pMzU8ag&s',
  'shrimp po boy': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrLIGIYwNMfxR_3XUOx5LtypjLUAkdJbLryQ&s',
  'waffle': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLn1eNROFGjJS5X9bWGcd18eNDRTC-2nvpmA&s',
  'grilled cheese': 'https://natashaskitchen.com/wp-content/uploads/2021/08/Grilled-Cheese-Sandwich-SQ-500x500.jpg',
  'cajun shrimp': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb6fppdTGfnfJJCkAA-aIFV8yPWyHbcmcQ9g&s',
  'chicken pot pie': 'https://www.recipetineats.com/tachyon/2018/10/Chicken-Pot-Pie_2.jpg',
  'french toast': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKTXs22mDRTi6I_3Hm91t72bmbpPrBZ2wUfQ&s',
  'meatloaf': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoZ30Qbxpd_LqSoIqfo4UHga6Joe9tLIU8KQ&s',
  'lobster roll': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbOmc_DU9XqjgseSeHRJVq5l6_zNR07RC5lQ&s',
  'tacos al pastor': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvTaNIl74Wj5rFVgrOGWZfvW2CG-bm_pCw6Q&s',
  'beef burrito': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLPkESqo_w2ycOUHA4jTxLr_QM3p_qbE8UuQ&s',
  'churros': 'https://thescranline.com/wp-content/uploads/2023/09/CHURROS-S-01.jpg',
  'nachos': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl8T8UuzATeCFGSYF77U-K-TraG5molGRc5w&s',
  'chicken quesadilla': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBAvhkIvHeHXcRNFqwxAiz_eJc3Qt9hj10vg&s',
  'guacamole': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ7_vP7FO_gEPUS5gFvZeTpkjoObMgdGz8cw&s',
  'enchiladas': 'https://www.everythingerica.com/wp-content/uploads/2014/07/Enchiladas.jpg.jpg',
  'tamales': 'https://buenofoods.com/wp-content/uploads/2022/09/Tamales-scaled.jpg',
  'pozole': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsUXkyEay69hr63Ui6Xgcm_JfspaFCMBL9ug&s',
  'elote': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnDSvXsMoxHXQNBjxEtcMtxAVsigIzBLmR7Q&s',
  'tortilla soup': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2q2OsD3X7qxWfLj7Rb6q6smnnMCSC4Acgrg&s',
  'cochinita pibil': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqbQCZQMBlEsz_HCHw5nZZLfHJVrIgNZEv2Q&s',
  'fajitas': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoETKLrBniCOf9ZrbLsfx1AywUzgE-SOTmPQ&s',
  'sopes': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHe6ASEbrKjepJ54v2r6kSg9QOyAoITNGFA&s',
  'molletes': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8FjUp_YEbLrLXpWkQZZc-7krMHDbUyAQ4hA&s',
  'torta': 'https://abeautifulmess.com/wp-content/uploads/2025/01/torta.jpg',
  'horchata': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqBYxYTwzxl_7Kz77C_Hn_Q5HoN7HkrDR4cg&s',
  'carnitas': 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2023/03/Carnitas-main.jpg',
  'chile relleno': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf0WTlNWs3tQlwr8GRrj9r2J7i3cMIv8AGbQ&s',
  'pollo asado': 'https://recetas.encolombia.com/wp-content/uploads/2012/12/Pollo-Asado-alHorno.jpg',
  'barbacoa tacos': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMMW6gsV8tHXpahHAkwefN5P8PT8K8NegbbQ&s',
  'huevos rancheros': 'https://feelgoodfoodie.net/wp-content/uploads/2022/05/Huevos-Rancheros-09.jpg',
  'queso fundido': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDi-WotVecPITXe0HNBO94MZkp4s78r-Zjew&s',
  'carne asada': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLNuC1Jm1Kit5M05BgTckiZvT8DREwCXlN7w&s',
  'flan': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk0wC1xJxDxs9bDkVIaQQEaso0ewg5d9HdpA&s',
  'agua fresca': 'https://everydaylatina.com/wp-content/uploads/2022/07/Pineapple-Agua-Fresca-Tiered-1200px-e1657407187312.jpg',
  'gorditas': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVdz-gCn2kIg2LaFzC4H7XKhLFQN6J5pOVhA&s',
  'adobada': 'https://images.ctfassets.net/3s5io6mnxfqz/27dcIVp4FsTZ6RWLt5Cfd2/6d87335d9ce5a85e88ee35253bfc14e4/adobada-tacos.jpeg',
  'tres leches cake': 'https://bakewithzoha.com/wp-content/uploads/2024/02/tres-leches-cake-7-scaled.jpg',
  'huaraches': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStPVIaw1W_2MoK8EIWV9PL-Q3wi5bAOc5Mug&s',
  'birria tacos': 'https://hips.hearstapps.com/hmg-prod/images/delish-202104-birriatacos-033-1619806490.jpg?crop=0.8891228070175439xw:1xh;center,top&resize=1200:*',
  'ceviche': 'https://www.foodandwine.com/thmb/KTcqJrZbH0_JQjDyyc6masu9dS8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/FAW-recipes-classic-ceviche-hero-5d7fb52b2fa447a2a2d462e3146d1732.jpg',

  // Asian (SEA/East Asia)
  'pad thai': 'https://www.tasteofhome.com/wp-content/uploads/2024/11/Vegetarian-Pad-Thai_EXPS_TOHcom24_197935_DR_11_20_01b.jpg',
  'pho': 'https://glebekitchen.com/wp-content/uploads/2017/12/phogaeggsbowltop.jpg',
  'tom yum': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRac4A5-BJcTPtwrfKPyD6VtTqFwMDfeDZoxQ&s',
  'nasi goreng': 'https://takestwoeggs.com/wp-content/uploads/2025/03/Overhead-plate-Nasi-Goreng-Indonesian-Fried-Rice.jpg',
  'bibimbap': 'https://www.seriouseats.com/thmb/9gYczIvS4R7ZvK19ahBns0xOG_k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20230113-Bibimbap-AmandaSuarez-hero-331e5e1ffa5b400fbb684e59b14d57c1.JPG',
  'satay': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBvwemucfwLp-q9iQtcfO8BqjJYmKMcfGOkQ&s',
  'laksa': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuzneOH28usqDYl0AcZT8ku02Dq7fMkMIJ-g&s',
  'kebab': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaN3Vr4oso27fl0dvAjDwn3rTgv1QEOA0v3g&s',
  'spring rolls': 'https://www.elmundoeats.com/wp-content/uploads/2024/02/Crispy-spring-rolls.jpg',
  'gyoza': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQSstpLE7w6qzA_x6iAqEcIWXJAsEUoUcHDQ&s',
  'hainanese chicken rice': 'https://www.singaporeanmalaysianrecipes.com/wp-content/uploads/2023/03/hainanese-chicken-rice-recipe-linsfood.jpg',
  'korean fried chicken': 'https://www.cherryonmysundae.com/wp-content/uploads/2012/06/korean-fried-chicken-feature.jpg',
  'chicken teriyaki': 'https://www.onceuponachef.com/images/2024/01/chicken-teriyaki.jpg',
  'mango sticky rice': 'https://takestwoeggs.com/wp-content/uploads/2021/07/Thai-Mango-Sticky-Rice-Takestwoeggs-Process-Final-sq.jpg',
  'beef rendang': 'https://www.seriouseats.com/thmb/f13Cq00vkjMqOF2ApkKRQsRF-U4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20241007-SEA-BeefRendang-QiAi-Hero1-37-bb47c42aabec4ac8aa66f49cfca1cf0f.jpg',
  'som tam': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y9fqncizxe3wDdKGNh9Yqhdz9NCxMNhzkg&s',
  'char kway teow': 'https://www.wokandskillet.com/wp-content/uploads/2016/07/Char-Kway-Teow.jpg',
  'dim sum': 'https://i.ndtvimg.com/i/2015-10/dimsum_625x350_51446202982.jpg',

  // Japanese
  'miso ramen': 'https://inquiringchef.com/wp-content/uploads/2022/11/Easy-Miso-Ramen_square-0723.jpg',
  'miso soup': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHiVJDXNlBNfB2HN466hk-KfSGtKokN_b2KA&s',
  'okonomiyaki': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8LsAqEzBtqN9cJMcs1BOYfCLG3o-cUQsVEw&s',
  'ramen': 'https://thecozycook.com/wp-content/uploads/2023/02/Homemade-Ramen-f.jpg',
  'banh mi': 'https://www.realsimple.com/thmb/kxn41Azn6e_bWDbyRp9jWOe-AZ8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/0724FEA-Banh-MiInspired-Pork-Burgers-c078dfc912a84b498bc644902c585499.jpg',
  'katsu don': 'https://asianinspirations.com.au/wp-content/uploads/2020/09/R02628_Tofu-Katsu-Don-(CSW-2020).jpg',
  'tonkatsu': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz8H5KR7KevcSgkhfd8YvoWzLWvl9eT3rssQ&s',
  'katsu curry': 'https://japan.recipetineats.com/wp-content/uploads/2021/12/Katsu_Curry_7011bsq.jpg',
  'yakiniku': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL3VWTK9Mqn624MACPL3ZXTOTvONsqmUv88A&s',
  'bulgogi': 'https://www.allrecipes.com/thmb/G_UXncCchkMVeELX8DQMEwJOdHI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/246172-Easy-Bulgogi-ddmfs-104-4x3-1-c0ddcab340474175a5d1c96bc2edabbc.jpg',
  'green curry': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWq9ygLcF1KhgZp7F88mMMgHuZ65qKrYIy1A&s',
  'khao soi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEdRO1G6oe3e6cYnvN9oBtzZ9CZJ0rC04waw&s',
  'shabu shabu': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVVGN7bI7L1xYh2H-660NdlehVmJ06eluywA&s',
  'kimchi jjigae': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQfODJYdBgvAkAqst-0ADykaOrHj8NzY7X-A&s',
  'red curry': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnIWfsDzzqBnLGVmOI9MuADMc0pJ_JqLGbiA&s',
  'dan dan noodles': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxlpu28gTZEaFzKcyB36_OvfYL4z-BDWIJsg&s',
  'sushi roll': 'https://sudachirecipes.com/wp-content/uploads/2024/01/ehomaki-thumb.jpg',
  'sushi platter': 'https://lh3.googleusercontent.com/proxy/01mMR_8z7d8JMzfGqV__STqABGwhmK2WZVFXPUEEyoGSIe2Ef1tBrWu7f4WgTMy-jMhX-MJeYRE5tejVJ7M_Ym5ap_uWsMszKP-7N6o7ZIFLu7m9j6zKFeotKuKZ4HW0d_T7faJych3prWQ',
  'tteokbokki': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVr_8q9DNZ7GuFY-vBV77VHu-frXlMmmAsIQ&s',
  'kung pao chicken': 'https://www.onceuponachef.com/images/2018/05/Kung-Pao-Chicken-16-1200x1480.jpg',
  'mapo tofu': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvL2UbhUKScxDv7U8nPSRUVUol3-FCapKSJw&s',
  'dumplings': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0oS7oEQcW6hutaLiiREiEeu6_emc_RAVb4g&s',
  'fried rice': 'https://www.onceuponachef.com/images/2023/12/Fried-Rice-Hero-12.jpg',
  'sweet and sour pork': 'https://dimsimlim.com/wp-content/uploads/2025/02/12001200-1-2.jpg',
  'chow mein': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt6xcml4w23ZJmADoMhrVqNG-9fefDs8HVjA&s',
  'peking duck': 'https://static01.nyt.com/images/2019/01/28/dining/kc-peking-duck/kc-peking-duck-threeByTwoLargeAt2X-v2.jpg',
  'hot pot': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmiUtFev8Mk6Z-bTEAhx6PMI8V1y13sSU97g&s',
  'sichuan noodles': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1Xk07bHs6fJZAoKE6RxDE-G5XdAIaqGA3Cg&s',
  'char siu': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6WzqinMHrcmJHF-YLf8tDlMva0otSUps3hQ&s',
  'scallion pancakes': 'https://www.foodandwine.com/thmb/y7S2-0u0UQK1mW0GcQbJZC_ivJ0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Scallion-Pancakes-with-Soy-Dipping-Sauce-FT-RECIPE0224-cd67cc0f637f4d8fadafdbdc2881b781.jpg',
  'ma la xiang guo': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgrjx6ww9gUXQ_9FkbU3SMpVrZ5vkU9JrQPA&s',
  'baozi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQCC0D_BCKsstT8qQs9Jxo-dtWQpHNn8ku2w&s',
  'wonton soup': 'https://www.allrecipes.com/thmb/oiO3k3uir05bhdLXCDh9lnEob8Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ALR-13199-wonton-soup-VAT-4x3-31bd1ef2795144ee93fed67a1cf3743d.jpg',
  'lo mein': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv8UG1Obmc8NSPCXO73g__rWCV25FaIB4Ydg&s',
  'steamed fish': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ10x7Tn3uuNujpE6K34UjjTyyv3_8zcpq16g&s',
  'tempura': 'https://takestwoeggs.com/wp-content/uploads/2023/09/Ebi-Tempura-Shrimp-Tempura-recipe-Takestwoeggs-sq.jpg',
  'three cup chicken': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJKIM8SFunE8qk-jmGiTQrDN-YyoCt6LzlKw&s',
  'egg fried rice': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg1UnXe-BZ232_XZUeU9Xmh8Jr8WEp0jVN1w&s',
  'general tso chicken': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSABfVsdLa1VytgZRgHPjK69o9CS1We36WWHw&s',
  'orange chicken': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS67rKb1vTH_gvk0dvK0iNJO5Gr1iTuJ83tCQ&s',
  'xiao long bao': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/A_Xiaolongbao_from_The_Modern_Shanghai.jpg/330px-A_Xiaolongbao_from_The_Modern_Shanghai.jpg',
  'chicken manchurian': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwWSd80MF1tT0E4QrDV9wLfUq2uWGwniEoew&s',
  'sesame chicken': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSviW9URrX-qV-4_YbsviLhSkA2yOn-nyRkVA&s',
  'beef and broccoli': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaP3oECBZF2T13gy8XoShKmDyRfOTZTfLp-Q&s',
  'egg drop soup': 'https://takestwoeggs.com/wp-content/uploads/2024/01/Chinese-Egg-Drop-Soup-Recipe-Takestwoeggs-2.jpg',
  'sashimi': 'https://www.manusmenu.com/wp-content/uploads/2016/06/salmon-sashimi-served-with-ponzu-and-wasabi.webp',
  'takoyaki': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Takoyaki.jpg/1200px-Takoyaki.jpg',
  'twice cooked pork': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbGOumKuJkTS_inceH3tCOn7ei_tJnCOKWdg&s',
  'hakka noodles': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3qVn_Z__YXx_Uxi5z3z028R3blJIZ8yS8OA&s',
  'honey chili potatoes': 'https://www.cookinwithmima.com/wp-content/uploads/2023/04/honey-chilli-fries.jpg',
  'tofu stir fry': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT74BtPokN2GPLB4nqQcMriXchfwr0niHWKw&s',
  'crispy chili beef': 'https://allwaysdelicious.com/wp-content/uploads/2022/04/crispy-beef-1a.jpg',
  'chili paneer': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/02/chilli-paneer-recipe.jpg',
  'chongqing chicken': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKCn4i_6s35dR4GgjDyNK_PKsIwk-ITCxfRQ&s',

  // Misc typos mapping
  'udon': 'https://cdn.prod.website-files.com/654369dcffba1c0eb478187e/671fee6204b5f3d906cd177b_IMG_1883.jpeg',
  'undo': 'https://cdn.prod.website-files.com/654369dcffba1c0eb478187e/671fee6204b5f3d906cd177b_IMG_1883.jpeg',
  'chow mwin': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt6xcml4w23ZJmADoMhrVqNG-9fefDs8HVjA&s',
  'pulled pork sanwich': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMuUCJumHAc0xWx-NKihGnTyEdq7b3FQ1hwQ&s',
  'chilli panner': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/02/chilli-paneer-recipe.jpg'
  ,
  // Additional Japanese entries from user
  'zaru soba': 'https://takestwoeggs.com/wp-content/uploads/2024/09/Cold-Soba-Noodles-Zaru-Soba-Noodle-Pull.jpg',
  'gohan': 'https://sudachirecipes.com/wp-content/uploads/2023/09/takikomi-gohan-thumb.jpg',
  'gomae spinach': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq1X4Ng36tP4eWTub5IGEdTGzoTubelH91AA&s',
  'gindara saikyo': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf6y21xYQizHaeChBPmaeEVxcATmLcSeRQSA&s',
  'kaki fry': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqx2cfjoaGv_3AhItkWetl1vBFQlslZZsE8Q&s',
  'teba shio': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwiS2YHV0vWCUiFPl__TDmdDX4R2dMA9pDEg&s',
  'agedashi tofu': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGP1_aRqVhNDSOuhpS8g4LW8B3L66AKtJajg&s',
  'kaisendon': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN9nT8g8BqWXijEm_mpF-JNZSAXGSLFJFRwA&s',
  'hamachi kama': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs5t9G5HUwEU-Zw0AFbTkfu3CCHIcY-afhrA&s',
  'ankake tofu': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR000H1Lh0nkaA9sWTfHyNjsPqFiBdW-4OZ4w&s',
  'onigiri': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj7BD0gM_HNELud0cf1MnP4qed7_vgKb4C9w&s',
  'unagi don': 'https://www.foodandwine.com/thmb/AmUde-l5To26AuR0TCnrlQdB9_k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Unadon-FT-RECPE0525-3bf50209748142709a091967336811d1.jpg',
  'gyudon': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr0gvGVuiz-9LBD_iVyK6QMyS5J0gHf9bq7A&s',
  'chicken karaage': 'https://www.cherryonmysundae.com/wp-content/uploads/2016/06/thai-chicken-karaage-feature-1.jpg',
  'chawanmushi': 'https://delishglobe.com/wp-content/uploads/2024/10/Japanese-Chawanmushi.png',
  'oyakodon': 'https://int.japanesetaste.com/cdn/shop/articles/how-to-make-oyakodon-chicken-and-egg-rice-bowl-at-home-japanese-taste.jpg?v=1737982261&width=5760',
  'yakimeshi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJJP5E4SgzwfceRraeVJrxCTSytrwWMRwt7Q&s',
  'matcha ice cream': 'https://www.justonecookbook.com/wp-content/uploads/2021/08/Green-Tea-Ice-Cream-0099-I-1.jpg',
  'dorayaki': 'https://www.thespruceeats.com/thmb/-xseebOwSzkn4MRb2h24jle_Se4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/japanese-dorayaki-recipe-2031077-hero-01-892a9d5eea884bc28858914ba9d80429.jpg',
  'yakisoba': 'https://norecipes.com/wp-content/uploads/2019/05/yakisoba-noodles-014-500x500.jpg',
  'natto roll': 'https://i.pinimg.com/736x/f0/e5/58/f0e5584f6496166a272d18b3c35d32ad.jpg',
  'taiyaki': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1jRLprtwTQ-OQDzpoRJUDrB0aoUsBnPbezg&s',
  // American duplicates (ensure presence)
  'milkshake': 'https://assets.epicurious.com/photos/647df8cad9749492c4d5d407/1:1/w_4506,h_4506,c_limit/StrawberryMilkshake_RECIPE_053123_3599.jpg',
  'cornbread': 'https://www.allrecipes.com/thmb/SyYjkBhJ93Gmi_85hOLf8nUssuA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/17891-golden-sweet-cornbread-ddmfs-beauty-4x3-BG-25990-bcabebac0323419abdf0497ee3383003.jpg',
  'pulled pork sandwich': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMuUCJumHAc0xWx-NKihGnTyEdq7b3FQ1hwQ&s',
  'new york cheesecake': 'https://www.allrecipes.com/thmb/v8JZdIICA1oerzX0L-KzyW2w9hM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/8350-chantals-new-york-cheesecake-DDMFS-4x3-426569e82b4142a6a1ed01e068544245.jpg',
  'buttermilk biscuits': 'https://preppykitchen.com/wp-content/uploads/2024/06/Buttermilk-Biscuits-Recipe-Card.jpg',
  'tater tots': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgoO4yWrDRdy0WeqGxD9x8q-OMmX1IugKWzA&s',
  'blt': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrt7M31sFMEoHfJB62oRN1xnJ87KxeWmp4bA&s',
  'brownie sundae': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrwJ6l4qBYrsE2dYga1ePO95ENDak-6BczYg&s'
};
const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)))

const normalize = (s) => String(s || '')
  .toLowerCase()
  // Do not remove 'crispy' because it is part of canonical dish names like 'crispy chili beef'
  .replace(/\b(signature|classic|spicy|deluxe|chef special|herb|house|royal|fiery|tangy)\b/gi, '')
  .replace(/\s+/g, ' ')
  .trim()

const proteinFromName = (name) => {
  const n = normalize(name)
  if (/(paneer|kadai paneer|malai kofta|palak paneer)/i.test(name)) return 'Paneer'
  if (/(chicken|tandoori|korma|karage|yakitori)/i.test(name)) return 'Chicken'
  if (/(mutton|lamb|rogan josh|gyudon)/i.test(name)) return 'Lamb'
  if (/(beef|rendang|beef and broccoli|meatloaf)/i.test(name)) return 'Beef'
  if (/(pork|char siu|bbq ribs)/i.test(name)) return 'Pork'
  if (/(fish|prawns|shrimp|lobster|sushi|unagi|salmon|tuna|ceviche)/i.test(name)) return 'Seafood'
  if (/(tofu|mapo tofu|agedashi)/i.test(name)) return 'Tofu'
  if (/(egg|omelette|omurice)/i.test(name)) return 'Egg'
  return ''
}

const baseByCuisine = {
  'North Indian': ['Onion','Tomato','Ginger','Garlic','Ghee','Cumin','Coriander','Turmeric','Garam Masala','Red Chili Powder','Kasuri Methi','Salt','Oil'],
  'South Indian': ['Onion','Tomato','Mustard Seeds','Curry Leaves','Urad Dal','Chana Dal','Tamarind','Turmeric','Green Chili','Asafoetida','Salt','Oil','Ghee'],
  'American': ['Salt','Black Pepper','Garlic Powder','Onion','Butter','Olive Oil'],
  'Mexican': ['Onion','Tomato','Garlic','Cilantro','Lime','Cumin','Chili Powder','Salt','Oil'],
  'Asian': ['Ginger','Garlic','Soy Sauce','Sesame Oil','Rice Vinegar','Scallions','Salt','Oil'],
  'Chinese': ['Ginger','Garlic','Scallions','Light Soy Sauce','Dark Soy Sauce','Shaoxing Wine','Sugar','Salt','Oil'],
  'Japanese': ['Dashi','Soy Sauce','Mirin','Sake','Sugar','Scallions','Sesame Oil','Salt']
}

const specificByDish = {
  // North Indian core
  'butter chicken': ['Chicken','Tomatoes','Butter','Cream','Ginger','Garlic','Garam Masala'],
  'paneer tikka': ['Paneer','Yogurt','Ginger Garlic Paste','Lemon Juice','Chili Powder','Turmeric','Garam Masala','Capsicum','Onion','Salt','Oil'],
  'chole bhature': ['Chickpeas','Flour','Spices','Oil'],
  'dal makhani': ['Black Lentils','Kidney Beans','Butter','Cream','Spices'],
  'rogan josh': ['Lamb','Yogurt','Onions','Kashmiri Chilies','Spices'],
  'aloo paratha': ['Wheat Flour','Potatoes','Spices','Butter'],
  'tandoori chicken': ['Chicken','Yogurt','Spices','Lemon'],
  'veg biryani': ['Rice','Mixed Vegetables','Spices','Saffron'],
  'kadai paneer': ['Paneer','Bell Peppers','Onions','Kadai Masala'],
  'malai kofta': ['Paneer','Potatoes','Cream','Cashews','Tomato','Onion','Ginger','Garlic','Garam Masala','Cardamom','Sugar','Salt','Oil'],
  'palak paneer': ['Paneer','Spinach','Cream','Spices'],
  'rajma chawal': ['Kidney Beans','Rice','Spices','Onions'],
  'chicken tikka masala': ['Chicken','Tomatoes','Cream','Spices'],
  'naan': ['Flour','Yogurt','Yeast','Butter'],
  'jeera rice': ['Basmati Rice','Cumin Seeds','Ghee','Bay Leaf','Salt'],
  'lassi': ['Yogurt','Water','Sugar','Cardamom'],
  'samosa': ['All Purpose Flour','Potatoes','Green Peas','Coriander','Cumin','Green Chili','Amchur','Salt','Oil'],
  'gulab jamun': ['Milk Powder','Flour','Sugar Syrup','Rose Water'],
  'kheer': ['Rice','Milk','Sugar','Nuts'],
  'mutton biryani': ['Basmati Rice','Mutton','Onion','Tomato','Yogurt','Mint','Coriander','Whole Spices','Saffron','Ghee','Fried Onions','Salt'],
  'baingan bharta': ['Eggplant','Onions','Tomatoes','Spices'],
  'bhindi masala': ['Okra','Onions','Spices','Oil'],
  'paneer butter masala': ['Paneer','Tomatoes','Butter','Cream','Spices'],
  'methi chicken': ['Chicken','Fenugreek Leaves','Spices','Yogurt'],
  'kali dal': ['Black Lentils','Butter','Cream','Spices'],
  'egg bhurji': ['Eggs','Onion','Tomato','Spices'],
  'kalai kan': ['Black Lentils','Butter','Cream','Spices'],
  'cancer bhurji': ['Eggs','Onion','Tomato','Spices'],
  'fish amritsari': ['Fish','Gram Flour','Ajwain','Ginger Garlic Paste','Lemon Juice','Chili Powder','Turmeric','Salt','Oil'],
  'murgh musallam': ['Chicken','Onion','Tomato','Yogurt','Ginger','Garlic','Garam Masala','Saffron','Ghee','Almonds','Raisins','Salt'],
  'chicken korma': ['Chicken','Onion','Yogurt','Cashew Paste','Ginger','Garlic','Cardamom','Cinnamon','Cloves','Ghee','Salt'],
  'lamb kebab': ['Lamb Mince','Onion','Garlic','Coriander','Cumin','Garam Masala','Chili Flakes','Salt','Oil'],
  'paneer bhurji': ['Paneer','Onion','Tomato','Green Chili','Coriander','Turmeric','Cumin','Garam Masala','Salt','Oil'],
  'chicken handi': ['Chicken','Onion','Tomato','Yogurt','Ginger','Garlic','Garam Masala','Coriander','Cumin','Cream','Salt','Oil'],
  'dal tadka': ['Toor Dal','Onion','Tomato','Green Chili','Cumin','Garlic','Ghee','Mustard Seeds','Curry Leaves','Turmeric','Salt'],
  'pani puri': ['Semolina','All Purpose Flour','Potatoes','Chickpeas','Tamarind Chutney','Mint Water','Cumin','Chaat Masala','Salt'],
  'sev puri': ['Puri','Potatoes','Onion','Tomato','Green Chutney','Tamarind Chutney','Sev','Chaat Masala','Salt'],
  'dahi puri': ['Puri','Potatoes','Onion','Tomato','Yogurt','Green Chutney','Tamarind Chutney','Sev','Chaat Masala','Salt'],

  // South Indian
  'masala dosa': ['Rice','Black Lentils (Urad Dal)','Potatoes','Onions','Mustard Seeds','Curry Leaves','Turmeric','Salt','Cooking Oil','Ghee'],
  'idli sambar': ['Rice','Urad Dal (Black Gram)','Salt','Toor Dal (Pigeon Peas)','Tamarind','Sambar Powder','Vegetables (Drumstick, Pumpkin, Carrot)','Turmeric','Mustard Seeds','Asafoetida'],
  'medu vada': ['Urad Dal (Black Gram)','Black Pepper','Cumin Seeds','Curry Leaves','Ginger','Coconut Pieces','Salt','Oil (for Frying)'],
  'chicken chettinad': ['Chicken','Dried Red Chilies','Coriander Seeds','Cumin Seeds','Fennel Seeds','Black Pepper','Coconut','Poppy Seeds','Curry Leaves','Onions','Tomatoes','Ginger-Garlic Paste','Salt','Oil'],
  'pongal': ['Rice','Moong Dal (Split Yellow Lentils)','Ghee','Black Pepper','Cumin Seeds','Ginger','Cashews','Curry Leaves','Salt'],
  'uttapam': ['Rice','Urad Dal (Black Gram)','Salt','Onions','Tomatoes','Green Chilies','Cilantro'],
  'pesarattu': ['Whole Green Gram (Moong Dal)','Rice','Ginger','Green Chilies','Cumin Seeds','Salt','Oil'],
  'andhra biryani': ['Basmati Rice','Chicken or Mutton','Yogurt','Fried Onions','Mint','Cilantro','Ginger-Garlic Paste','Green Chilies','Cloves','Cardamom','Cinnamon','Bay Leaf','Salt'],
  'curd rice': ['Cooked Rice','Yogurt','Milk','Ginger','Green Chilies','Curry Leaves','Mustard Seeds','Urad Dal','Chana Dal','Cilantro'],
  'rasam rice': ['Cooked Rice','Tamarind','Tomatoes','Toor Dal','Rasam Powder (Coriander, Cumin, Pepper, Chili, Turmeric)','Mustard Seeds','Cumin Seeds','Garlic','Curry Leaves','Cilantro'],
  'mysore pak': ['Chickpea Flour (Besan)','Ghee','Sugar','Water'],
  'neer dosa': ['Rice','Salt','Oil'],
  'bisi bele bath': ['Rice','Toor Dal','Tamarind','Jaggery','Blend of Vegetables','Spice Powder (Dried Red Chilies, Coriander Seeds, Chana Dal, Coconut)','Mustard Seeds','Curry Leaves','Ghee'],
  'kozhi varuval': ['Chicken','Coconut','Dried Red Chilies','Coriander Seeds','Fennel Seeds','Black Pepper','Curry Leaves','Onions','Tomatoes'],
  'mangalorean fish curry': ['Fish','Coconut','Kashmiri Red Chilies','Tamarind','Ginger','Garlic','Turmeric','Fenugreek Seeds'],
  'prawns ghee roast': ['Prawns','Ghee','Dried Red Chilies','Garlic','Tamarind','Curry Leaves','Coriander','Cumin','Pepper'],
  'kothu parotta': ['Shredded Parotta','Eggs or Meat','Onions','Tomatoes','Green Chilies','Turmeric','Chili Powder','Curry Leaves','Salt','Oil'],
  'filter coffee': ['Coffee Beans (with Chicory Blend)','Water','Milk','Sugar'],
  'lemon rice': ['Cooked Rice','Lemon Juice','Mustard Seeds','Curry Leaves','Peanuts','Turmeric','Green Chili','Urad Dal','Chana Dal','Salt','Oil'],
  'coconut chutney': ['Fresh Coconut','Chana Dal','Green Chilies','Ginger','Yogurt or Water','Salt','Mustard Seeds (Tempering)','Curry Leaves (Tempering)'],
  'tomato rice': ['Cooked Rice','Tomatoes','Onions','Ginger-Garlic Paste','Turmeric','Chili Powder','Mustard Seeds','Curry Leaves','Salt','Oil'],
  'onion rava dosa': ['Semolina (Rava/Sooji)','Rice Flour','All Purpose Flour','Onions','Green Chilies','Cumin Seeds','Pepper','Curry Leaves','Salt','Oil'],
  'ghee roast dosa': ['Rice','Urad Dal','Fenugreek','Ghee','Salt'],
  'set dosa': ['Rice','Urad Dal','Poha','Fenugreek','Salt','Oil'],
  'upma': ['Semolina (Rava/Sooji)','Onions','Green Chilies','Ginger','Mustard Seeds','Urad Dal','Chana Dal','Curry Leaves','Lemon Juice','Ghee','Salt'],
  'appam with stew': ['Appam: Fermented Rice Batter','Coconut Milk','Sugar','Salt','Stew: Vegetables or Chicken','Coconut Milk','Cinnamon','Cardamom','Cloves'],
  'kuzhi paniyaram': ['Idli/Dosa Batter','Onions','Green Chilies','Cilantro','Mustard Seeds','Curry Leaves','Oil','Salt'],
  'idiyappam': ['Rice Flour','Hot Water','Salt'],
  'sambar vada': ['Urad Dal','Green Chili','Ginger','Curry Leaves','Mustard Seeds','Toor Dal','Tamarind','Sambar Powder','Salt','Oil'],
  'ragi mudde': ['Ragi Flour','Water','Salt'],
  'avial': ['Mixed Vegetables','Coconut','Cumin','Green Chili','Yogurt','Curry Leaves','Coconut Oil','Salt'],
  'veg kurma': ['Mixed Vegetables','Onion','Tomato','Coconut','Poppy Seeds','Cashews','Yogurt','Coriander Seeds','Cumin Seeds','Fennel Seeds','Garam Masala','Salt','Oil'],
  'chicken 65': ['Chicken','Cornflour','Egg','Kashmiri Chili','Ginger Garlic Paste','Curry Leaves','Yogurt','Lemon Juice','Salt','Oil'],
  'pepper chicken': ['Chicken','Black Pepper','Onion','Ginger','Garlic','Curry Leaves','Fennel','Coriander','Salt','Oil'],

  // American
  'cheeseburger': ['Ground Beef Patty','American Cheese','Cheddar Cheese','Hamburger Bun','Lettuce','Tomato','Onion','Pickles','Ketchup','Mustard','Mayonnaise'],
  'bbq ribs': ['Pork Ribs','Paprika','Brown Sugar','Garlic Powder','Onion Powder','Salt','Black Pepper','Cumin','BBQ Sauce','Tomato Base','Vinegar','Molasses','Spices'],
  'fried chicken': ['Chicken Pieces','Buttermilk','Flour','Salt','Black Pepper','Paprika','Garlic Powder','Onion Powder','Cayenne','Vegetable Oil'],
  'mac and cheese': ['Elbow Macaroni','Cheddar Cheese','Milk','Cream','Butter','Flour','Breadcrumbs'],
  'hot dog': ['Beef Frankfurter','Pork Frankfurter','Hot Dog Bun','Mustard','Ketchup','Chopped Onions','Relish','Sauerkraut','Cheese'],
  'pancakes': ['All-Purpose Flour','Sugar','Baking Powder','Salt','Milk','Eggs','Melted Butter','Vanilla Extract','Maple Syrup','Butter'],
  'apple pie': ['Pie Crust','Flour','Butter','Shortening','Salt','Water','Apples','Sugar','Cinnamon','Nutmeg','Lemon Juice','Cornstarch'],
  'philly cheesesteak': ['Thinly Sliced Ribeye','Top Round Beef','Hoagie Roll','Grilled Onions','Bell Peppers','Cheez Whiz','Provolone','American Cheese'],
  'cobb salad': ['Romaine Lettuce','Iceberg Lettuce','Grilled Chicken Breast','Hard-Boiled Eggs','Bacon','Avocado','Tomatoes','Blue Cheese','Red Wine Vinaigrette','Ranch Dressing'],
  'chicken sandwich': ['Breaded Chicken Breast','Grilled Chicken Breast','Hamburger Bun','Brioche Bun','Lettuce','Tomato','Pickles','Mayonnaise','Buttermilk Ranch','Honey Mustard'],
  'onion rings': ['Sliced Onions','Flour','Cornstarch','Cornmeal','Baking Powder','Salt','Cold Water','Beer','Oil'],

  // Extras
  'nacho fries': ['Thick-Cut French Fries','Melted Cheese Sauce','Cheddar','Nacho Cheese','Seasoned Ground Beef','Chorizo','Jalapeños','Sour Cream','Pico de Gallo','Guacamole'],
  'chili dog': ['Beef Hot Dog','Pork Hot Dog','Steamed Bun','Chili','Ground Beef','Tomatoes','Beans','Chili Powder','Cumin','Shredded Cheese','Onions','Mustard'],
  'brownie sundae': ['Fudgy Brownie','Vanilla Ice Cream','Chocolate Syrup','Whipped Cream','Chopped Nuts','Maraschino Cherry'],
  'milkshake': ['Vanilla Ice Cream','Milk','Chocolate Syrup','Fruit','Cookies','Whipped Cream'],
  'buttermilk biscuits': ['All-Purpose Flour','Baking Powder','Baking Soda','Salt','Cold Butter','Shortening','Buttermilk','Melted Butter'],
  'cornbread': ['Cornmeal','All-Purpose Flour','Sugar','Baking Powder','Salt','Eggs','Milk','Buttermilk','Melted Butter','Oil'],
  'tater tots': ['Grated Potatoes','Flour','Cornstarch','Salt','Oil'],
  'pulled pork sandwich': ['Slow-Cooked Pork Shoulder','Soft Bun','Brioche','Potato Roll','BBQ Sauce','Coleslaw'],
  'blt': ['Bacon','Lettuce','Tomato','Mayonnaise','Toasted White Bread','Sourdough'],
  'new york cheesecake': ['Cream Cheese','Sugar','Eggs','Sour Cream','Heavy Cream','Vanilla Extract','Graham Cracker Crust','Graham Cracker Crumbs','Butter','Sugar'],
  'shrimp po boy': ['Crispy Fried Shrimp','French Bread','Baguette','Shredded Lettuce','Tomatoes','Pickles','Remoulade Sauce','Mayonnaise','Cajun Seasoning','Mustard','Capers','Herbs'],
  'chicken pot pie': ['Cooked Chicken','Carrots','Peas','Corn','Celery','Butter','Flour','Chicken Broth','Milk','Cream','Thyme','Parsley','Pie Crust'],
  'waffle': ['All-Purpose Flour','Sugar','Baking Powder','Salt','Eggs','Milk','Melted Butter','Vanilla Extract','Maple Syrup','Butter'],
  'french toast': ['Brioche','Challah','Sliced Bread','Eggs','Milk','Cream','Cinnamon','Vanilla Extract','Butter','Syrup','Powdered Sugar','Fruit'],
  'grilled cheese': ['Bread','White Bread','Sourdough','Whole Wheat','American Cheese','Cheddar','Butter'],
  'meatloaf': ['Ground Beef','Pork','Breadcrumbs','Crushed Crackers','Milk','Egg','Onion','Garlic','Worcestershire Sauce','Ketchup','Tomato Paste','Salt','Pepper'],
  'cajun shrimp': ['Large Shrimp','Cajun Seasoning','Paprika','Garlic Powder','Onion Powder','Cayenne','Oregano','Thyme','Black Pepper','Butter','Oil','Garlic','Rice','Crusty Bread'],
  'lobster roll': ['Cooked Lobster Meat','Split-Top Brioche Roll','Hot Dog Roll','Butter','Mayonnaise','Lemon','Herbs','Chives','Celery'],
  'buffalo wings': ['Chicken Wings','Frying Oil','Cayenne Hot Sauce','Butter','Ranch Dressing','Blue Cheese Dressing','Celery Sticks'],
  'caesar salad': ['Romaine Lettuce','Croutons','Parmesan Cheese','Anchovy Paste','Garlic','Dijon Mustard','Lemon Juice','Egg Yolk','Worcestershire Sauce','Olive Oil','Optional Grilled Chicken'],
  'clam chowder': ['Clams','Potatoes','Onions','Celery','Butter','Flour','Heavy Cream','Milk','Clam Juice','Broth','Thyme','Salt','Pepper'],

  // Mexican
  'tacos al pastor': ['Corn Tortillas','Marinated Pork','Dried Chilies','Achiote Paste','Pineapple','Vinegar','Spices','Sliced Pineapple','Onion','Cilantro','Lime Juice'],
  'chicken quesadilla': ['Flour Tortilla','Corn Tortilla','Shredded Chicken','Oaxaca Cheese','Cheddar','Monterey Jack','Salsa','Sour Cream','Guacamole'],
  'beef burrito': ['Large Flour Tortilla','Seasoned Ground Beef','Shredded Beef','Rice','Refried Beans','Cheese','Salsa','Sour Cream','Guacamole'],
  'guacamole': ['Ripe Avocados','Lime Juice','Salt','Red Onion','Tomatoes','Cilantro','Jalapeño'],
  'enchiladas': ['Corn Tortillas','Shredded Chicken','Shredded Beef','Enchilada Sauce','Dried Chilies','Broth','Spices','Cheese','Onion','Cilantro'],
  'nachos': ['Tortilla Chips','Melted Cheese','Cheddar','Jalapeños','Black Olives','Green Onions','Sour Cream','Guacamole','Salsa','Ground Beef','Shredded Chicken'],
  'tamales': ['Masa','Corn Husks','Banana Leaves','Shredded Pork','Chicken','Cheese','Vegetables','Lard','Vegetable Shortening','Salt','Broth'],
  'pozole': ['Hominy','Pork Shoulder','Onion','Garlic','Dried Chilies','Guajillo','Ancho','Oregano','Bay Leaf','Salt','Cabbage','Radishes','Lime','Chopped Onion','Cilantro'],
  'fajitas': ['Chicken','Beef Skirt Steak','Bell Peppers','Onion','Flour Tortillas','Corn Tortillas','Guacamole','Sour Cream','Salsa','Cheese'],
  'elote': ['Grilled Corn','Mayonnaise','Crema','Cotija','Feta','Chili Powder','Paprika','Lime Juice','Cilantro'],
  'sopes': ['Masa','Refried Beans','Shredded Chicken','Beef','Lettuce','Crumbled Cheese','Salsa','Sour Cream'],
  'tortilla soup': ['Chicken Broth','Fried Corn Tortilla Strips','Tomatoes','Onion','Garlic','Pasilla Chilies','Chipotle Chilies','Avocado','Shredded Chicken','Queso Fresco','Crema','Lime'],
  'molletes': ['Bolillo','Crusty Bread','Refried Beans','Melted Cheese','Oaxaca','Cheddar','Pico de Gallo','Salsa'],
  'cochinita pibil': ['Pork Shoulder','Achiote Paste','Bitter Orange Juice','Orange Juice','Lime Juice','Garlic','Onion','Banana Leaves','Pickled Red Onions','Corn Tortillas'],
  'torta': ['Bolillo','Telera','Refried Beans','Milanesa','Carnitas','Chorizo','Avocado','Tomato','Onion','Jalapeños','Oaxaca Cheese','Panela Cheese'],
  'flan': ['Sugar (Caramel)','Evaporated Milk','Sweetened Condensed Milk','Whole Milk','Cream','Eggs','Egg Yolks','Vanilla Extract'],
  'tres leches cake': ['Sponge Cake','Evaporated Milk','Sweetened Condensed Milk','Heavy Cream','Whole Milk','Whipped Cream','Strawberries','Vanilla'],
  'agua fresca': ['Fresh Fruit','Water','Sugar','Lime Juice','Ice'],
  'huaraches': ['Masa Base','Refried Beans','Shredded Chicken','Beef','Crumbled Cheese','Lettuce','Salsa','Crema'],
  'gorditas': ['Corn Masa Pockets','Refried Beans','Shredded Chicken','Beef','Cheese','Lettuce','Salsa','Crema'],
  'birria tacos': ['Corn Tortillas','Birria Stewed Meat','Goat','Beef','Onion','Cilantro','Consommé','Dried Chilies','Guajillo','Ancho','Spices'],
  'adobada': ['Pork','Dried Chilies','Guajillo','Ancho','Pasilla','Vinegar','Garlic','Oregano','Spices','Onion','Cilantro','Corn Tortillas'],
  'ceviche': ['Fresh Fish','Shrimp','Lime Juice','Lemon Juice','Tomatoes','Onion','Cilantro','Jalapeño','Serrano','Avocado','Cucumber','Tostadas','Saltine Crackers'],
  'horchata': ['White Rice','Water','Cinnamon Sticks','Sugar','Vanilla Extract','Almonds'],
  'barbacoa tacos': ['Corn Tortillas','Beef (Cheek or Shoulder)','Dried Chilies','Guajillo','Chipotle','Garlic','Cumin','Oregano','Bay Leaf','Onion','Cilantro','Lime'],
  'carnitas': ['Pork Shoulder','Lard','Oil','Orange Juice','Milk','Salt','Garlic','Onion','Cumin','Bay Leaves','Corn Tortillas','Salsa'],
  'huevos rancheros': ['Fried Eggs','Corn Tortillas','Tomato','Onion','Garlic','Jalapeño','Serrano','Cumin','Broth','Refried Beans','Queso Fresco','Feta','Avocado','Cilantro'],
  'chile relleno': ['Poblano Peppers','Oaxaca Cheese','Monterey Jack','Egg Batter','Tomato Sauce','Ranchero Sauce','Onion','Garlic'],
  'queso fundido': ['Oaxaca Cheese','Chihuahua Cheese','Chorizo','Mushrooms','Flour Tortillas','Corn Tortillas'],
  'pollo asado': ['Chicken','Lime Juice','Orange Juice','Garlic','Cumin','Paprika','Oregano','Achiote','Chipotle','Rice','Beans','Tortillas'],
  'carne asada': ['Flank Steak','Skirt Steak','Lime Juice','Garlic','Cumin','Salt','Pepper','Soy Sauce','Beer','Grilled Onions','Bell Peppers','Corn Tortillas','Guacamole','Salsa'],
  
  // Asian (extended specifics from user)
  'pad thai': ['Rice Noodles','Tamarind Paste','Fish Sauce','Palm Sugar','Dried Shrimp','Garlic','Shallots','Red Chili Pepper','Bean Sprouts','Egg','Tofu','Chicken','Shrimp'],
  'pho': ['Beef Broth','Rice Noodles','Beef (Brisket or Flank)','Onions','Ginger','Star Anise','Cinnamon Sticks','Cloves','Bean Sprouts','Basil','Lime','Chili'],
  'tom yum': ['Lemongrass','Galangal','Kaffir Lime Leaves','Lime Juice','Fish Sauce','Chili Peppers','Mushrooms','Shrimp','Chicken'],
  'nasi goreng': ['Rice','Kecap Manis','Shallots','Garlic','Chili','Shrimp Paste','Egg','Chicken','Prawns'],
  'bibimbap': ['Steamed Rice','Spinach','Carrots','Zucchini','Bean Sprouts','Gochujang','Fried Egg','Beef','Sesame Oil'],
  'satay': ['Chicken','Beef','Pork','Turmeric','Coriander','Cumin','Lemongrass','Peanut Sauce'],
  'laksa': ['Rice Noodles','Coconut Milk','Fish Stock','Shrimp Paste','Lemongrass','Galangal','Chilies','Shrimp','Fish Cakes','Tofu Puffs','Bean Sprouts'],
  'kebab': ['Lamb','Beef','Chicken','Cumin','Coriander','Paprika','Yogurt Sauce','Pita','Vegetables'],

  // Tiger Wok menu specifics
  'spring rolls': ['Rice Paper Wrappers','Minced Pork','Shrimp','Vermicelli Noodles','Carrots','Cabbage','Mint','Cilantro','Glass Noodles','Wood Ear Mushrooms','Dipping Sauce'],
  'gyoza': ['Dumpling Wrappers','Ground Pork','Cabbage','Chives','Ginger','Garlic','Soy Sauce','Sesame Oil'],
  'hainanese chicken rice': ['Poached Chicken','Rice','Chicken Broth','Ginger','Garlic','Chili Sauce','Dark Soy Sauce','Cucumber'],
  'korean fried chicken': ['Chicken','Flour','Cornstarch','Frying Oil','Gochujang','Garlic','Ginger','Sugar','Vinegar','Sesame Oil','Sesame Seeds'],
  'chicken teriyaki': ['Chicken Thigh','Soy Sauce','Mirin','Sake','Sugar','Garlic','Ginger','Sesame Seeds','Green Onions'],
  'mango sticky rice': ['Glutinous Rice','Mango','Coconut Milk','Sugar','Salt','Toasted Mung Beans','Sesame Seeds'],
  'beef rendang': ['Beef','Coconut Milk','Lemongrass','Galangal','Turmeric','Ginger','Garlic','Shallots','Chilies','Kaffir Lime Leaves','Cinnamon','Star Anise','Cardamom','Tamarind Paste'],
  'som tam': ['Green Papaya','Cherry Tomatoes','Long Beans','Garlic','Chilies','Palm Sugar','Fish Sauce','Lime Juice','Dried Shrimp','Peanuts'],

  // Additional specifics (user-provided)
  'char kway teow': ['Flat Rice Noodles','Shrimp','Cockles','Bean Sprouts','Chives','Eggs','Pork Lard','Soy Sauce','Chili Paste','Garlic'],
  'banh mi': ['Baguette','Pickled Carrots','Pickled Daikon','Cilantro','Cucumber','Jalapeño','Pâté','Mayonnaise','Grilled Pork','Chicken','Tofu'],
  'har gow': ['Shrimp','Bamboo Shoots','Water Chestnuts','Wheat Starch Wrapper'],
  'siu mai': ['Ground Pork','Shrimp','Mushrooms','Green Onions','Wonton Wrapper'],
  'char siu bao': ['Steamed Bun','BBQ Pork','Hoisin Sauce','Sugar'],
  'katsu don': ['Pork Cutlet','Steamed Rice','Egg','Onion','Dashi','Mirin','Soy Sauce'],
  'yakiniku': ['Thinly Sliced Beef','Onion','Bell Peppers','Mushrooms','Tare Sauce','Soy Sauce','Mirin','Sugar','Garlic','Sesame Seeds'],
  'bulgogi': ['Thinly Sliced Beef','Soy Sauce','Sugar','Sesame Oil','Garlic','Ginger','Green Onions','Sesame Seeds'],

  // More Asian and Korean/Japanese specifics
  'green curry': ['Green Curry Paste','Coconut Milk','Thai Eggplant','Bamboo Shoots','Bell Peppers','Basil Leaves','Fish Sauce','Palm Sugar','Chicken','Shrimp','Lemongrass','Galangal','Kaffir Lime Leaves','Garlic','Shallots'],
  'red curry': ['Red Curry Paste','Coconut Milk','Bamboo Shoots','Bell Peppers','Thai Basil','Fish Sauce','Palm Sugar','Beef','Chicken','Tofu','Lemongrass','Galangal','Kaffir Lime Leaves','Garlic','Shallots'],
  'khao soi': ['Egg Noodles','Coconut Milk','Yellow Curry Paste','Turmeric','Coriander','Cumin','Chili','Chicken','Beef','Pickled Mustard Greens','Crispy Fried Noodles','Shallots','Lime','Cilantro'],
  'dan dan noodles': ['Wheat Noodles','Ground Pork','Preserved Mustard Greens','Zha Cai','Chili Oil','Sichuan Peppercorns','Soy Sauce','Black Vinegar','Garlic','Scallions','Sesame Paste','Peanut Butter'],
  'shabu shabu': ['Thinly Sliced Beef','Pork','Napa Cabbage','Enoki Mushrooms','Shiitake Mushrooms','Tofu','Green Onions','Udon Noodles','Kombu Broth','Bonito Flakes'],
  'sushi roll': ['Sushi Rice','Nori','Tuna','Salmon','Crab','Shrimp','Avocado','Cucumber','Cream Cheese','Tempura'],
  'kimchi jjigae': ['Kimchi','Pork Belly','Beef','Tofu','Green Onions','Garlic','Ginger','Gochujang','Anchovy Broth','Kelp Broth'],
  'tteokbokki': ['Rice Cakes','Gochujang','Fish Cakes','Green Onions','Anchovy Stock','Sugar'],

  // Chinese
  'kung pao chicken': ['Diced Chicken','Peanuts','Cashews','Dried Red Chilies','Sichuan Peppercorns','Garlic','Ginger','Scallions','Soy Sauce','Vinegar','Sugar','Cornstarch','Sesame Oil'],
  'mapo tofu': ['Soft Tofu','Ground Pork','Doubanjiang','Sichuan Peppercorns','Garlic','Ginger','Scallions','Soy Sauce','Chili Oil','Stock','Oil'],
  'chow mein': ['Wheat Noodles','Chicken','Beef','Shrimp','Cabbage','Bean Sprouts','Carrots','Celery','Onions','Garlic','Soy Sauce','Oyster Sauce','Sesame Oil','Oil'],
  'dumplings': ['Wheat Wrappers','Ground Pork','Cabbage','Garlic','Ginger','Scallions','Soy Sauce','Sesame Oil','Salt'],
  'sweet and sour pork': ['Pork Loin','Batter','Deep-Frying Oil','Red Bell Pepper','Green Bell Pepper','Pineapple Chunks','Onions','Ketchup','Vinegar','Sugar','Soy Sauce','Cornstarch Slurry','Sesame Oil'],
  'peking duck': ['Whole Duck','Maltose Syrup','Five-Spice Powder','Cucumber','Scallions','Hoisin Sauce','Thin Pancakes','Bao Buns','Salt'],
  'fried rice': ['Cooked Cooled Jasmine Rice','Long-Grain Rice','Eggs','Peas','Carrots','Onions','Garlic','Soy Sauce','Sesame Oil','Chicken','Shrimp','Ham'],
  'egg drop soup': ['Chicken Broth','Cornstarch','Egg','Scallions','Sesame Oil','Salt','White Pepper'],
  'twice cooked pork': ['Pork Belly','Bell Peppers','Leek','Doubanjiang','Soy Sauce','Garlic','Ginger','Scallions','Chili Peppers'],
  'hakka noodles': ['Egg Noodles','Cabbage','Carrots','Spring Onions','Garlic','Soy Sauce','Chili Sauce','Chicken','Shrimp','Tofu'],
  'honey chili potatoes': ['Potato Wedges','Cornstarch','Honey','Chili Sauce','Soy Sauce','Garlic','Green Onions','Sesame Seeds'],
  'tofu stir fry': ['Firm Tofu','Medium Tofu','Bell Peppers','Broccoli','Carrots','Garlic','Ginger','Soy Sauce','Oyster Sauce','Cornstarch Slurry'],
  'crispy chili beef': ['Beef Strips','Cornstarch','Dried Red Chilies','Sichuan Peppercorns','Garlic','Ginger','Soy Sauce','Sugar','Green Onions'],
  'chili paneer': ['Paneer','Bell Peppers','Onion','Garlic','Ginger','Soy Sauce','Chili Sauce','Cornstarch','Green Chilies'],
  'chongqing chicken': ['Chicken','Dried Red Chilies','Sichuan Peppercorns','Garlic','Ginger','Scallions','Soy Sauce','Chili Oil'],
  'three cup chicken': ['Chicken Thighs','Chicken Drumsticks','Soy Sauce','Shaoxing Wine','Rice Wine','Sesame Oil','Garlic','Ginger','Scallions','Thai Basil'],
  'egg fried rice': ['Cooked Rice','Eggs','Peas','Carrots','Onions','Garlic','Soy Sauce','Sesame Oil'],
  'chicken manchurian': ['Diced Chicken','Cornstarch','Soy Sauce','Vinegar','Sugar','Garlic','Ginger','Green Chilies','Spring Onions'],
  'general tso chicken': ['Chicken','Batter','Frying Oil','Dried Chilies','Garlic','Ginger','Soy Sauce','Vinegar','Sugar','Cornstarch'],
  'sesame chicken': ['Chicken','Batter','Frying Oil','Sesame Seeds','Soy Sauce','Vinegar','Sugar','Garlic','Ginger','Cornstarch Slurry'],
  'orange chicken': ['Chicken','Batter','Frying Oil','Orange Zest','Orange Juice','Soy Sauce','Vinegar','Sugar','Garlic','Ginger','Cornstarch'],
  'beef and broccoli': ['Beef Slices','Broccoli Florets','Garlic','Ginger','Soy Sauce','Oyster Sauce','Sugar','Cornstarch','Sesame Oil'],
  'hot pot': ['Spicy Sichuan Broth','Chilies','Sichuan Peppercorns','Mild Mushroom Broth','Seafood Broth','Thinly Sliced Beef','Lamb','Seafood','Tofu','Mushrooms','Leafy Greens','Noodles','Sesame Dipping Sauce','Soy-Garlic Dipping Sauce'],
  'wonton soup': ['Wonton Wrappers','Pork','Shrimp','Ginger','Garlic','Scallions','Chicken Stock','Soy Sauce','Sesame Oil','Bok Choy'],
  'scallion pancakes': ['Flour','Scallions','Sesame Oil','Salt','Oil'],
  'lo mein': ['Soft Wheat Noodles','Chicken','Beef','Shrimp','Tofu','Cabbage','Carrots','Bok Choy','Onions','Garlic','Soy Sauce','Oyster Sauce','Sesame Oil'],
  'ma la xiang guo': ['Beef Slices','Tofu Puffs','Lotus Root','Mushrooms','Potatoes','Leafy Greens','Sichuan Peppercorns','Dried Chilies','Doubanjiang','Garlic','Ginger','Oil'],
  'xiao long bao': ['Dumpling Wrappers','Pork','Ginger','Scallions','Soy Sauce','Shaoxing Wine','Gelatinous Stock'],
  'baozi': ['Yeast Dough','Ground Pork','Cabbage','Ginger','Garlic','Soy Sauce','Sesame Oil','Red Bean Paste','Lotus Seed Paste'],
  'char siu': ['Pork Shoulder','Hoisin Sauce','Honey','Soy Sauce','Shaoxing Wine','Five-Spice Powder','Garlic','Red Fermented Tofu','Red Food Coloring'],

  // Japanese
  'sushi platter': ['Sushi Rice','Nori','Tuna','Salmon','Yellowtail','Avocado','Cucumber','Crab Stick','Wasabi','Pickled Ginger'],
  'ramen': ['Ramen Noodles','Pork Broth','Chicken Broth','Chashu Pork','Nori','Menma','Green Onions','Soft-Boiled Egg','Sesame Seeds'],
  'unagi don': ['Grilled Eel','Rice','Eel Sauce','Soy Sauce','Mirin','Sugar'],
  'chicken karaage': ['Chicken Thighs','Soy Sauce','Ginger','Garlic','Sake','Mirin','Cornstarch','Potato Starch','Flour'],
  'chawanmushi': ['Egg','Dashi','Soy Sauce','Mirin','Chicken','Shrimp','Shiitake Mushrooms','Ginkgo Nuts'],
  'oyakodon': ['Chicken','Egg','Onion','Rice','Dashi','Soy Sauce','Mirin','Sugar'],
  'tempura': ['Shrimp','Eggplant','Sweet Potato','Zucchini','Tempura Batter (Flour, Cornstarch, Ice Water)','Tentsuyu (Dashi, Soy Sauce, Mirin)'],
  'yakimeshi': ['Fried Rice','Eggs','Carrots','Onions','Green Peas','Soy Sauce','Chicken','Pork','Shrimp'],
  'matcha ice cream': ['Matcha Powder','Milk','Cream','Sugar','Egg Yolks'],
  'dorayaki': ['Flour','Sugar','Honey','Eggs','Baking Powder','Azuki Red Bean Paste'],
  'yakisoba': ['Wheat Noodles','Cabbage','Carrots','Onions','Pork','Chicken','Soy Sauce','Worcestershire-Style Sauce','Bonito Flakes'],
  'natto roll': ['Sushi Rice','Natto','Nori','Cucumber','Avocado','Soy Sauce','Wasabi'],
  'taiyaki': ['Flour','Sugar','Milk','Eggs','Azuki Red Bean Paste','Chocolate','Custard'],
  'zaru soba': ['Buckwheat Soba Noodles','Tsuyu (Dashi, Soy Sauce, Mirin)','Grated Daikon Radish','Green Onions','Wasabi','Nori'],
  'gohan': ['Steamed White Rice','Furikake','Japanese Short-Grain Rice','Water'],
  'gomae spinach': ['Spinach','Sesame Paste','Soy Sauce','Sugar','Sesame Seeds','Vinegar'],
  'agedashi tofu': ['Tofu','Potato Starch','Dashi','Soy Sauce','Mirin','Grated Daikon','Green Onion','Bonito Flakes'],
  'kinpira gobo': ['Burdock Root','Carrot','Soy Sauce','Mirin','Sesame Oil','Chili Pepper'],
  'kaisendon': ['Sushi Rice','Tuna','Salmon','Sea Urchin','Squid','Ikura','Wasabi','Pickled Ginger'],
  'kaki fry': ['Oysters','Panko Breadcrumbs','Flour','Egg','Cabbage','Tonkatsu Sauce'],
  'hamachi kama': ['Yellowtail Collar','Salt','Lemon','Daikon Radish'],
  'teba shio': ['Chicken Wings','Salt','Sake','Lemon'],
  'ankake tofu': ['Soft Tofu','Dashi','Soy Sauce','Mirin','Cornstarch','Mushrooms','Bamboo Shoots'],
  'katsu curry': ['Breaded Pork Cutlet','Curry Roux (Onions, Carrots, Potatoes, Stock, Curry Powder)','Steamed Rice'],
  'okonomiyaki': ['Flour','Eggs','Shredded Cabbage','Pork Belly','Squid','Green Onions','Bonito Flakes','Dried Seaweed','Japanese Mayonnaise','Okonomiyaki Sauce'],
  'udon': ['Udon Noodles','Dashi Broth','Green Onions','Tempura Pieces','Kamaboko','Tofu'],
  'sashimi': ['Tuna','Salmon','Sea Bass','Yellowtail','Wasabi','Pickled Ginger'],
  'takoyaki': ['Flour','Dashi','Eggs','Octopus','Green Onions','Pickled Ginger','Tenkasu','Takoyaki Sauce','Japanese Mayonnaise','Bonito Flakes','Dried Seaweed'],
  'gyudon': ['Beef','Onion','Dashi','Soy Sauce','Mirin','Sugar','Rice'],
  'tonkatsu': ['Pork Cutlet','Flour','Egg','Panko Breadcrumbs','Cabbage','Tonkatsu Sauce'],
  'onigiri': ['Rice','Nori','Tuna Mayo','Umeboshi','Salmon','Salt']
}

const getIngredients = (cuisine, dish) => {
  const base = baseByCuisine[cuisine] || ['Salt','Oil']
  const norm = normalize(dish)
  if (specificByDish[norm]) return uniq(specificByDish[norm])
  const protein = proteinFromName(dish)
  const add = []
  if (/biryani/i.test(dish)) add.push('Basmati Rice','Whole Spices','Mint','Coriander','Fried Onions','Yogurt')
  if (/dosa|idli/i.test(dish)) add.push('Rice','Urad Dal','Fenugreek Seeds')
  if (/uttapam/i.test(dish)) add.push('Onion','Tomato','Green Chili','Coriander')
  if (/sambar/i.test(dish)) add.push('Toor Dal','Tamarind','Sambar Powder','Mustard Seeds','Curry Leaves')
  if (/noodles|ramen|lo mein|yakisoba|dan dan/i.test(dish)) add.push('Noodles','Soy Sauce','Garlic','Ginger')
  if (/fried rice|yakimeshi/i.test(dish)) add.push('Rice','Egg','Soy Sauce','Scallions')
  if (/taco|burrito|quesadilla|tortilla/i.test(dish)) add.push('Tortillas','Cheese','Salsa')
  if (/soup/i.test(dish)) add.push('Stock')
  if (/salad/i.test(dish)) add.push('Lettuce','Tomato','Cucumber','Dressing')
  if (/burger|sandwich|hot dog/i.test(dish)) add.push('Bun','Lettuce','Tomato','Onion')
  if (/dumpling|gyoza|bao/i.test(dish)) add.push('Flour','Ginger','Garlic','Soy Sauce')
  return uniq([...base, protein, ...add])
}

async function seed() {
  await connectDB();
  await mongoose.connection.db.dropDatabase();
  console.log('Database cleared');

  for (const [cuisine, dishes] of Object.entries(cuisines)) {
    for (let r = 1; r <= restaurantsPerCuisine; r++) {
      const coords = randomCoordsAround(cityCenter);
      // Pick a creative name
      const pool = namePools[cuisine] || [];
      const picked = pool[(r - 1) % Math.max(pool.length, 1)] || `${cuisine} House ${r}`;
      const rest = await Restaurant.create({
        name: picked,
        address: `${r} ${cuisine} Street, Food City`,
        location: { type: 'Point', coordinates: coords },
        distance: Math.round(Math.random() * 10 + 2),
        cuisines: [cuisine],
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
        image: imageForRestaurant(cuisine, picked)
      });

      // Ensure 8 unique items per restaurant with no overlap between restaurants of the same cuisine
      const itemsPerRestaurant = 8;
      const start = (r - 1) * itemsPerRestaurant;
      const slice = dishes.slice(start, start + itemsPerRestaurant);
      const list = [...slice];
      // If dish pool is smaller than required window, generate unique variants
      while (list.length < itemsPerRestaurant) {
        const base = dishes[(start + list.length) % dishes.length];
        const suffix = descriptors[(start + list.length) % descriptors.length];
        list.push(`${base} ${suffix}`);
      }
      for (const dish of list) {
        const price = 120 + Math.floor(Math.random() * 480);
        const img = dishImageOverride[normalize(dish)] || imageFor(cuisine, dish);
        await MenuItem.create({
          restaurant: rest._id,
          name: dish,
          image: img,
          price,
          ingredients: getIngredients(cuisine, dish)
        });
      }
    }
  }
  console.log('Seeding completed');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
