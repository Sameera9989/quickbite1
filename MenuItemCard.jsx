import useCart from '../stores/cart'

export default function MenuItemCard({ item, restaurant, onView, onReport }) {
  const cart = useCart()
  const onErr = (e) => { e.currentTarget.src = 'https://placehold.co/200x140?text=Food' }
  const dishImageMap = {
    'butter chicken': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/07/chicken-butter-masala-recipe.jpg',
    'chole bhature': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyta2FEc05FPDkoHtzey9a8nmlgumGb7lDew&s',
    'rogan josh': 'https://silkroadrecipes.com/wp-content/uploads/2024/11/Rogan-Josh-Indian-Lamb-Curry-square.jpg',
    'tandoori chicken': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF8Qr5LJKkMhy33hyPFDbsOdcIkc2Lzd8d7g&s',
    'paneer tikka': 'https://www.krumpli.co.uk/wp-content/uploads/2024/12/Paneer-Tikka-Kebabs-2-1200-720x540.jpg',
    'dal makhni': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnDWcxE3nXYImBIy87369VvBja8vUKU5gbMg&s',
    'dal makhani': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnDWcxE3nXYImBIy87369VvBja8vUKU5gbMg&s',
    'gulab jamun': 'https://www.cadburydessertscorner.com/hubfs/dc-website-2022/articles/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know.webp',
    'aloo paratha': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvRHhYqj0d8jP56rugIb617rD2VAOhMBHkJg&s',
    'veg biryani': 'https://www.bigbasket.com/media/uploads/recipe/w-l/1030_1.jpg',
    'malai kofta': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsT8TUD-NzEQeESGXCTvbEFMbcMp-heDW-Kw&s',
    'rajma chawal': 'https://stackeatfoods.com/wp-content/uploads/2024/01/34_Rajma_Chawal.png',
    'chicken tikka masala': 'https://dantoombs.com/wp-content/uploads/2025/06/Chicken-tikka-masala-720x720.jpg',
    'kadai paneer': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/04/kadai-paneer-recipe.jpg',
    'palak paneer': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_I8R5TXGoabQURaYGUMiLe7d1GIcdpLdTLQ&s',
    'bhindi masala': 'https://greedyeats.com/wp-content/uploads/2023/08/Bhindi-Masala.jpg',
    'naan': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrg17t81Pbgk3UxMCRkPzNKpYK4Ciqb1buag&s',
    'jeera rice': 'https://priyafoods.com/cdn/shop/files/JEERARICE_2.jpg?v=1701948113&width=1780',
    'samosa': 'https://static.toiimg.com/photo/61050397.cms',
    'mutton biryani': 'https://www.licious.in/blog/wp-content/uploads/2019/11/Mutton-Biryani-1-1024x1024.jpg',
    'methi chicken': 'https://sinfullyspicy.com/wp-content/uploads/2021/09/Featured-image.jpg',
    'lassi': 'https://static.toiimg.com/thumb/53505451.cms?imgsize=133638&width=800&height=800',
    'kheer': 'https://mypahadidukan.com/cdn/shop/articles/Kesar_Kheer_Recipe_ad0e3b6b-d2aa-45b9-89e0-a7e986ea0bec.jpg?v=1761216555',
    'baingan bharta': 'https://images.archanaskitchen.com/images/recipes/indian/main-course/north-indian-vegetarian-recipes/sabzi-recipes/Baingan_Bharta_Sabzi_Recipe_Smoked_Roasted_Eggplant_with_Green_Chillies_and_Ginger_1_2c1296f86f.jpg',
    'paneer butter masala': 'https://www.indianveggiedelight.com/wp-content/uploads/2017/09/instant-pot-paneer-butter-masala-featured.jpg',
    'fish amritsari': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSZHF05y7lm1YHmeLKhrGD1TTKPAfzW32-_w&s',
    'chicken korma': 'https://images.slurrp.com/prod/recipe_images/transcribe/main%20course/shahi-chicken-korma.webp?impolicy=slurrp-20210601&width=1200&height=675',
    'paneer bhurji': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1gdW5sJWNeMMoMqavEsKve4l-3WApTeyAPw&s',
    'dal tadka': 'https://www.indianveggiedelight.com/wp-content/uploads/2019/07/dal_tadka.jpg',
    'murgh musallam': 'https://i.ytimg.com/vi/8uySBudAK5s/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBDSj0eLZpB2cUzD_11cHBgxNuM6A',
    'lamb kebab': 'https://www.sugarsaltmagic.com/wp-content/uploads/2023/01/Greek-Lamb-Kebabs-Lamb-Souvlaki-12FEAT-500x500.jpg',
    'chicken handi': 'https://www.indianrecipeinfo.com/wp-content/uploads/2021/12/Chicken-Handi-Recipe.jpg',
    'pani puri': 'https://i.ndtvimg.com/i/2017-01/gol-gappa_650x400_71485331632.jpg',
    // South Indian provided
    'masala dosa': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/masala-dosa-recipe-500x500.jpg',
    'medu vada': 'https://madhurasrecipe.com/wp-content/uploads/2021/12/poha_vada_featured.jpg',
    'pongal': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/01/pongal-ven-pongal-500x500.jpg',
    'pesarattu': 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWIPvfBagC49ck0dRWg_H7XkH7_-Lg1YPD_ytGWk49S_fxhmMP1l-Sg3Gj_utUfboTh4EOIq8M37OJtACQC1zNtAssQ82NSk10sZTgroUdyfPmaBNWYC21vtmLp_qBEEefuqvROchs3RFs/s1600/upma+pesarattu.jpg',
    'idli sambar': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPM3bEVgmErY6bprabE2YvFEhihABpwjLpnQ&s',
    'chicken chettinad': 'https://swatisani.net/kitchen/wp-content/uploads/2015/10/IMG_9350.jpg',
    'uttapam': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa-b8FocWAeGh2z3FTzbgoYayg_5JDZQW_6g&s',
    'andhra biryani': 'https://curlytales.com/wp-content/uploads/2022/08/Untitled-design-2022-08-02T160130.319.jpg',
    'curd rice': 'https://upload.wikimedia.org/wikipedia/commons/5/58/Curd_Rice.jpg',
    'mysore pak': 'https://www.agarwalbhavansweets.com/cdn/shop/files/SPL.MYSOREPAK.png?v=1711617304',
    'bisi bele bath': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjlv1en-VvKlt9hBlYk9UZaCQI_yFRyHXWdA&s',
    'mangalorean fish curry': 'https://spicesandaromas.com/wp-content/uploads/2021/09/mangalorean-fish-curry.jpg',
    'rasam rice': 'https://s3-ap-south-1.amazonaws.com/betterbutterbucket-silver/subhashni-venkatesh15177622165a7736a8fd848.jpeg',
    'neer dosa': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBEK1zCb0mA_bPXJsjY24OmM8WoJMycIBgUQ&s',
    'kozhi varuval': 'https://i0.wp.com/www.foodfashionparty.com/wp-content/uploads/2018/06/tomato-chicken4.jpg?ssl=1',
    'prawns ghee roast': 'https://www.cookwithkushi.com/wp-content/uploads/2024/05/best_mangalorean_prawns_ghee_roast.jpg',
    'kothu parotta': 'https://www.licious.in/blog/wp-content/uploads/2020/06/KUTTU-PORATTA.jpg',
    'lemon rice': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUIdGPJu-OU_rY5cPXqHomH1wzcTMts2Xlzw&s',
    'tomato rice': 'https://i0.wp.com/aartimadan.com/wp-content/uploads/2020/08/Tomato-Rice-Recipe.jpg?fit=1000%2C561&ssl=1',
    'ghee roast dosa': 'https://www.shutterstock.com/image-photo/dosa-ghee-roast-coconut-chutney-600nw-2484376905.jpg',
    'filter coffee': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE6pI0D6lhFpi-VhjEicqvtiksmAVr5KKd7A&s',
    'coconut chutney': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgEralXG39ucYaVhHZ0LijRW7V3aYBt8HsaQ&s',
    'onion rava dosa': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUOYSUvc161zbNkuMddufrBzV8Unsc-MAiXg&s',
    'set dosa': 'https://hindi.news24online.com/wp-content/uploads/2022/11/Instant-Set-Dosa-10-Minute-Recipe.jpg',
    'upma': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWHMTQDALTpyB8sxVUrmiTHqvoDWnd2VxNg&s',
    'kuzhi paniyaram': 'https://i0.wp.com/binjalsvegkitchen.com/wp-content/uploads/2019/01/Kuzhi-Paniyaram-H2.jpg?resize=600%2C900&ssl=1',
    'sambar vada': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhj-RaGC7dTwqciHEyd_8u_KE5EkZ20Afhrg&s',
    'avial': 'https://i.ndtvimg.com/i/2018-02/aviyal_620x350_81517900508.jpg',
    'appam with stew': 'https://www.keralatourism.org/_next/image/?url=http%3A%2F%2F127.0.0.1%2Fktadmin%2Fimg%2Fpages%2Fmobile%2FAppam_and_Chicken_Stew20131126121303_88_1.jpg&w=3840&q=75',
    'idiyappam': 'https://i0.wp.com/smithakalluraya.com/wp-content/uploads/2018/10/idiyappam-2.jpg?resize=720%2C912&ssl=1',
    'ragi mudde': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpBhj0hpmcR_-iuOx-Azvd9xhiA99TgZzUjw&s',
    'veg kurma': 'https://www.themadraslounge.se/wp-content/uploads/2024/03/Veg-Kurma.jpg',
    // American provided
    'cheeseburger': 'https://www.sargento.com/assets/Uploads/Recipe/Image/cheddarbaconcheeseburger__FocusFillWyIwLjAwIiwiMC4wMCIsODAwLDQ3OF0_CompressedW10.jpg',
    'cheese burger': 'https://www.sargento.com/assets/Uploads/Recipe/Image/cheddarbaconcheeseburger__FocusFillWyIwLjAwIiwiMC4wMCIsODAwLDQ3OF0_CompressedW10.jpg',
    'fried chicken': 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2023/2/23/FNK_Indian-Fried-Chicken_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1677264108617.webp',
    'buffalo wings': 'https://www.livinglou.com/wp-content/uploads/2017/01/buffalo-honey-chicken-wings.jpg',
    'clam chowder': 'https://s23209.pcdn.co/wp-content/uploads/2015/04/241217_DD_easy-clam-chowder_451edit.jpg',
    'bbq ribs': 'https://www.southernliving.com/thmb/J02EQeOhOKHfmALt-jE_61idUck=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/oven-baked-baby-back-ribs-beauty-332-7deda00b7b4f4820a9c79f13ed09cfb9.jpg',
    'mac and cheese': 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2022%2F03%2F19%2F238691-Simple-Macaroni-And-Cheese-mfs_006.jpg&w=160&q=60&c=sc&poi=auto&orient=true&h=90',
    'caesar salad': 'https://shwetainthekitchen.com/wp-content/uploads/2022/09/vegetarian-caesar-salad.jpg',
    'hot dog': 'https://www.belbrandsfoodservice.com/wp-content/uploads/2018/05/recipe-desktop-merkts-cheesy-hot-dawg.jpg',
    'pancakes': 'https://www.andy-cooks.com/cdn/shop/articles/20240619074934-andy-20cooks-20-20fluffy-20pancakes-20recipe_abeb50a7-5c13-40b9-a186-a10e3818b1c6.jpg?v=1719271389',
    'philly cheesesteak': 'https://krystelscooking.com/wp-content/uploads/2024/01/phillynew5-500x500.png',
    'chicken sandwich': 'https://theyummydelights.com/wp-content/uploads/2025/07/shredded-chicken-sandwich-1.jpg',
    'nacho fries': 'https://thegirlonbloor.com/wp-content/uploads/2020/09/Taco-Bell-Nacho-Fries-13.jpg',
    'apple pie': 'https://www.southernliving.com/thmb/bbDY1d_ySIrCFcq8WNBkR-3x6pU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2589601_Mailb_Mailbox_Apple_Pie_003-da802ff7a8984b2fa9aa0535997ab246.jpg',
    'cobb salad': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM9nN1GpUNEra4tfhg79w1_GthyIuDbSdykA&s',
    'onion rings': 'https://www.spicebangla.com/wp-content/uploads/2024/07/Crispy-Onion-Rings.webp',
    'chili dog': 'https://keytomylime.com/wp-content/uploads/2022/01/BEST-Hot-Dog-Chili-Recipe.jpg',
    'milkshake': 'https://cookilicious.com/wp-content/uploads/2025/01/Brownie-Milkshake-Recipe-20-scaled.jpg',
    'cornbread': 'https://www.allrecipes.com/thmb/SyYjkBhJ93Gmi_85hOLf8nUssuA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/17891-golden-sweet-cornbread-ddmfs-beauty-4x3-BG-25990-bcabebac0323419abdf0497ee3383003.jpg',
    'pulled pork sandwich': 'https://www.southernliving.com/thmb/ZmYvdih3_mffmqzMXjDsGVhhULw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Carolina-Pulled-Pork-Sandwiches_Audit3624_beauty-87-4828653074324470984a1205baf0545d.jpg',
    'new york cheesecake': 'https://www.seriouseats.com/thmb/deFCx8YVoK5b_rXrIco5oc2Qo4I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2019__05__20190520-cheesecake-vicky-wasik-34-16488b3671ae47b5b29eb7124dbaf938.jpg',
    'buttermilk biscuits': 'https://www.southernliving.com/thmb/Sff0k2haW2IgxKDaDw88yKcwK4Y=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Buttermilk-Biscuits_Audit3624_beauty-128-ef88f86fcd4f4a76af694a3d169e7e49.jpg',
    'tater tots': 'https://www.allrecipes.com/thmb/blnt8KKeSxDjxZc4tRbng5xZAv8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/homemade-tater-tots-allrecipes-video-4x3-98bb3e26ac6846c0be8f495fab3046fa.jpg',
    'blt': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMo5hwc_rkTmPfvq7nyDT0YVvZzVBgWApKxQ&s',
    'brownie sundae': 'https://dirtydishesmessykisses.com/wp-content/uploads/2024/10/brownie-sundae-recipe-1730416956.jpg',
    'shrimp po boy': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZ61ecKU82sIeNQy1O27GOFe7ryi1npbsyA&s',
    'waffle': 'https://www.designeatrepeat.com/wp-content/uploads/2024/11/chocolate-chip-waffles-featured.jpg',
    'grilled cheese': 'https://natashaskitchen.com/wp-content/uploads/2021/08/Grilled-Cheese-Sandwich-SQ-500x500.jpg',
    'cajun shrimp': 'https://www.dinneratthezoo.com/wp-content/uploads/2020/10/cajun-shrimp-4.jpg',
    'chicken pot pie': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ue1lS_W4BBo1-Go9qXvJweuje7pCbglMuA&s',
    'french toast': 'https://tastesbetterfromscratch.com/wp-content/uploads/2022/09/French-Toast-1-500x500.jpg',
    'meatloaf': 'https://natashaskitchen.com/wp-content/uploads/2024/10/The-Best-Meatloaf-Recipe-9.jpg',
    'lobster roll': 'https://www.sizzlefish.com/cdn/shop/articles/20250901155709-connecticut-20style-20lobster-20rolls-20img-201-min_0b49bd09-a1a5-42ec-96b9-10569813d446.jpg?v=1756823942',
    // Mexican provided
    'tacos al pastor': 'https://thestayathomechef.com/wp-content/uploads/2024/04/Classic-Tacos-Al-Pastor_Square-1.jpg',
    'beef burrito': 'https://embed.widencdn.net/img/beef/hpmyvvgxd4/1120x840px/Beef%20Breakfast%20Burritos_2?keep=c&u=7fueml',
    'churros': 'https://hips.hearstapps.com/hmg-prod/images/churros-index-661d4692d05e4.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*',
    'nachos': 'https://recipesblob.oetker.in/assets/b72049329c8742b98daf790c9ef937bd/1272x764/loaded-nachos.jpg',
    'chicken quesadilla': 'https://www.spendwithpennies.com/wp-content/uploads/2020/01/Chicken-Quesadillas-1.jpg',
    'guacamole': 'https://www.allrecipes.com/thmb/6RyFPH5N4KKmZhNY0Giob_Jj3wc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-14231-guacamole-4x3-f7a3b5752c7f4f3fb934d03a8b548826.jpg',
    'enchiladas': 'https://www.everythingerica.com/wp-content/uploads/2014/07/Enchiladas.jpg.jpg',
    'tamales': 'https://keviniscooking.com/wp-content/uploads/2023/08/Pork-Tamales-Rojos-sauce.jpg'
  }
  const preferredImage = item?.image || dishImageMap[String(item?.name || '').toLowerCase().trim()]
  return (
    <div className="rounded border bg-white dark:bg-zinc-900 p-3 flex gap-3">
      <img src={preferredImage} onError={onErr} alt={item.name} referrerPolicy="no-referrer" loading="lazy" className="h-20 w-24 object-cover rounded"/>
      <div className="flex-1">
        <div className="font-semibold">{item.name}</div>
        <div className="text-sm text-zinc-500">₹{item.price}</div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => onView?.(item)} className="px-2 py-1 rounded border">Ingredients</button>
          <button onClick={() => cart.add(item, restaurant)} className="px-2 py-1 rounded bg-primary text-white">Add to Cart</button>
          <button onClick={() => onReport?.(item)} className="px-2 py-1 rounded border">Report Issue</button>
        </div>
      </div>
    </div>
  )
}
