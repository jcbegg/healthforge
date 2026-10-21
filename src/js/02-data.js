/* ===== HealthForge: content library ===== */
const ROUTINES = {
  A:{id:'A',name:'Foundation Push-Pull',min:18,items:[['squat',3,'8-10'],['floorpress',3,'10'],['row',3,'10 per side'],['deadbug',3,'6 per side']]},
  B:{id:'B',name:'Hinge and Brace',min:18,items:[['hinge',3,'10'],['bridge',3,'12'],['pushup',3,'8-12'],['birddog',3,'6 per side']]},
  C:{id:'C',name:'Carry and Build',min:18,items:[['carry',3,'30-40 sec'],['squat',3,'10'],['row',3,'10 per side'],['bridge',3,'12']]}
};
const ROUTINE_ORDER=['A','B','C'];

const STRETCH_ROUTINES = [
  {id:'mini',name:'Minimum 3',desc:'The bare-minimum day: neck, reach, knee to chest.',items:['neck','reach','kneechest']},
  {id:'desk',name:'Desk reset',desc:'Between meetings: neck, chest, shoulders, upper back.',items:['neck','reach','twist','angel','chest']},
  {id:'backhip',name:'Back and hips',desc:'Loosen the low back, hips and hamstrings.',items:['kneechest','figure4','hipflexor','hamstring','twist']},
  {id:'reachmob',name:'Arm and reach mobility',desc:'Shoulders, chest and overhead range.',items:['reach','angel','chest','neck','twist']},
  {id:'wind',name:'Evening wind-down',desc:'Floor-based release before bed.',items:['kneechest','figure4','twist','neck']},
  {id:'full',name:'Full reset',desc:'Everything, head to toe.',items:['neck','chest','reach','angel','twist','hipflexor','hamstring','kneechest','figure4']}
];

const MEDITATIONS = [
  {id:'settle',title:'Settle',min:3,tag:'Quick reset',desc:'Land in your body after a meeting. No technique, just noticing.',cues:[
    'Let your eyes close or rest on a point on the floor. Nothing to fix right now.',
    'Notice where your body touches the chair or the floor. Feel the weight being held.',
    'Let sounds come and go. You do not have to follow any of them.',
    'If your mind is busy with work, that is fine. Notice it, and come back to the feeling of sitting here.',
    'Soften your jaw. Soften your hands.',
    'One more moment of simply being here. When you are ready, open your eyes.']},
  {id:'sound',title:'Sound anchor',min:3,tag:'Quick reset',desc:'Use the sounds around you as an anchor for attention.',cues:[
    'Settle in. Let your attention rest on whatever sounds are present.',
    'Near sounds, far sounds, the quiet between them. Just listening.',
    'When a thought pulls you away, notice it and return to listening.',
    'Listening without naming or judging.',
    'Let the sounds fade into the background. Open your eyes when ready.']},
  {id:'bodyscan5',title:'Body scan',min:5,tag:'Stiffness and tension',desc:'Move attention slowly through the body and release held tension.',cues:[
    'Get comfortable. Let your attention rest on your feet. Notice what is there, warmth, pressure, nothing at all.',
    'Move up through your calves and knees. Let them be heavy.',
    'Your hips and low back. This is where a lot of tension hides. Allow them to soften.',
    'Your belly. Let it be soft. There is nothing to hold in.',
    'Your chest and shoulders. Let your shoulders drop away from your ears.',
    'Your arms, hands and fingers. Let them rest.',
    'Your neck, jaw, the muscles around your eyes. Release what you can.',
    'Now the whole body at once, resting here. Open your eyes when ready.']},
  {id:'offload',title:'Work offload',min:5,tag:'After work',desc:'Put the day down before you walk into the evening.',cues:[
    'Sit comfortably. Let the day arrive in your mind, the meetings, the decisions, the people.',
    'Without judging, notice what is still loud. Name it silently: planning, worrying, replaying.',
    'For each one, imagine setting it on a shelf for tomorrow. It will still be there. You do not need to carry it tonight.',
    'Notice how your body feels right now. Where is the day sitting in it?',
    'Let that area soften. You are allowed to be done for today.',
    'Take a moment to decide one small kind thing for this evening.',
    'When you are ready, open your eyes.']},
  {id:'urge',title:'Urge surfing',min:5,tag:'Stress eating',desc:'Ride out a craving. Urges rise, peak and fall, usually within minutes.',cues:[
    'Sit and notice the urge to eat exactly as it is. You are not fighting it.',
    'Where do you feel it in the body? The throat, the stomach, the hands. Observe it like weather.',
    'Notice the thoughts attached to it. Tired. Stressed. Deserve. Just thoughts.',
    'The urge is like a wave. It rises, it peaks, it passes. Stay with it as it changes.',
    'Check in: is this hunger in the stomach, or a need for rest, comfort or relief?',
    'Whatever the answer, you have a choice now. Open your eyes when you are ready.']},
  {id:'open',title:'Open awareness',min:10,tag:'Deeper practice',desc:'A longer sit: rest attention on whatever arises, moment to moment.',cues:[
    'Settle. Let your body be supported. Close your eyes or lower your gaze.',
    'Rest attention on the sensations of sitting. Weight, contact, temperature.',
    'Now widen. Let sounds, sensations and thoughts all be welcome, one after another.',
    'When you realize you have been lost in thought, that is the practice. Gently return.',
    'Notice feelings as they appear. Tension, restlessness, calm. Let each one be as it is.',
    'You do not need to achieve a particular state. Awareness is already here.',
    'Notice the space around your thoughts, like sky around clouds.',
    'Let attention settle on the whole body once more.',
    'Take a few moments to arrive back in the room. Open your eyes when ready.']}
];

const URGE_ALTS = [
  {t:'Walk 5 minutes',s:'Step on the treadmill at an easy pace. Urges fall fast with movement.',act:'walk5'},
  {t:'Sit with it for 3 minutes',s:'Short guided mindfulness: Urge surfing.',act:'med:urge'},
  {t:'Stretch your neck and shoulders',s:'Releases the physical stress you may be feeling.',act:'str:desk'},
  {t:'Tall glass of water, then wait',s:'Thirst and stress often feel like hunger.',act:null},
  {t:'Planned snack: protein first',s:'If you are genuinely a bit hungry, choose a protein option from your list.',act:'fuel'},
  {t:'Write one line about what is bothering you',s:'Naming the stress takes some of the load off.',act:'note'}
];
const TRIGGERS=['Meeting aftermath','Work pressure','Tired','Bored','Anxious or overwhelmed','Social drain','Habit or time of day','Other'];
const DRAINERS=['One-on-one conversation','Team meeting','Conflict or hard feedback','Big decision','Constant interruptions','Presenting','Other'];
const RECHARGE=['Quiet walk','Short meditation','Time alone, no screens','Tinkering on a project','Stretch','Music'];

/* meals: p protein g, k kcal, ing = [item, aisle] */
const MEALS = {
 b:[
  {id:'b1',n:'Greek yogurt and berries',d:'1 cup plain nonfat Greek yogurt, 3/4 cup berries, 2 tbsp chopped nuts',k:330,p:30,ing:[['Plain nonfat Greek yogurt','Dairy'],['Mixed berries (frozen is fine)','Frozen'],['Walnuts or almonds','Pantry']]},
  {id:'b2',n:'Protein shake and banana',d:'1 scoop low-sugar whey, 1 cup milk or unsweetened soy, banana, 1 tbsp peanut butter',k:360,p:34,ing:[['Low-sugar whey protein','Pantry'],['Unsweetened soy milk or milk','Dairy'],['Bananas','Produce'],['Peanut butter','Pantry']]},
  {id:'b3',n:'Cottage cheese and fruit',d:'1 cup cottage cheese, pineapple or peaches, walnuts',k:310,p:30,ing:[['Cottage cheese','Dairy'],['Canned pineapple or peaches in juice','Pantry'],['Walnuts or almonds','Pantry']]},
  {id:'b4',n:'Protein oats (no cook)',d:'1/2 cup oats, 1 scoop whey, chia, water or milk. Stir, rest 5 min, microwave if you like it warm.',k:380,p:32,ing:[['Rolled oats','Pantry'],['Low-sugar whey protein','Pantry'],['Chia seeds','Pantry'],['Berries','Frozen']]}
 ],
 l:[
  {id:'l1',n:'Rotisserie chicken rice bowl',d:'5 oz chicken, microwave brown rice pouch, frozen broccoli, olive oil drizzle',k:520,p:46,ing:[['Rotisserie chicken (skin off)','Deli'],['Microwave brown rice pouch','Pantry'],['Frozen broccoli','Frozen'],['Olive oil','Pantry']]},
  {id:'l2',n:'Tuna wrap and hummus',d:'Tuna pouch, whole-grain wrap, hummus, cucumber slices',k:450,p:38,ing:[['Tuna pouches','Pantry'],['Whole-grain wraps','Bakery'],['Hummus','Deli'],['Cucumber','Produce']]},
  {id:'l3',n:'Turkey and black bean bowl',d:'5 oz deli turkey (low sugar), 1/2 cup black beans, salsa, 1/4 avocado',k:480,p:42,ing:[['Low-sugar deli turkey','Deli'],['Canned black beans','Pantry'],['Salsa','Pantry'],['Avocado','Produce']]},
  {id:'l4',n:'Shrimp and quinoa bowl',d:'Precooked shrimp, quinoa pouch, frozen stir-fry vegetables',k:470,p:40,ing:[['Precooked shrimp','Frozen'],['Microwave quinoa pouch','Pantry'],['Frozen stir-fry vegetables','Frozen']]}
 ],
 d:[
  {id:'d1',n:'Chicken, sweet potato, green beans',d:'6 oz precooked chicken, microwaved sweet potato, steamed green beans',k:600,p:50,ing:[['Precooked chicken breast','Deli'],['Sweet potatoes','Produce'],['Frozen green beans','Frozen']]},
  {id:'d2',n:'Salmon, rice and broccoli',d:'Frozen salmon fillet (air fryer or microwave), rice pouch, broccoli',k:620,p:42,ing:[['Frozen salmon fillets','Frozen'],['Microwave brown rice pouch','Pantry'],['Frozen broccoli','Frozen']]},
  {id:'d3',n:'Turkey taco bowl',d:'Lean ground turkey (batch-cooked), beans, salsa, cheese, microwave rice',k:600,p:46,ing:[['Lean ground turkey','Meat'],['Canned black beans','Pantry'],['Salsa','Pantry'],['Shredded cheese','Dairy'],['Microwave brown rice pouch','Pantry']]},
  {id:'d4',n:'Chicken stir-fry bowl',d:'Precooked chicken strips, frozen stir-fry vegetables, low-sugar stir-fry sauce, quinoa',k:560,p:46,ing:[['Precooked chicken strips','Deli'],['Frozen stir-fry vegetables','Frozen'],['Low-sugar stir-fry sauce','Pantry'],['Microwave quinoa pouch','Pantry']]}
 ],
 s:[
  {id:'s1',n:'Greek yogurt cup + berries',d:'Plain nonfat, a handful of berries',k:130,p:18,ing:[['Plain nonfat Greek yogurt','Dairy'],['Mixed berries (frozen is fine)','Frozen']]},
  {id:'s2',n:'Cottage cheese + pineapple',d:'3/4 cup cottage cheese, a few pineapple pieces',k:150,p:17,ing:[['Cottage cheese','Dairy'],['Canned pineapple or peaches in juice','Pantry']]},
  {id:'s3',n:'Turkey jerky + apple',d:'Low-sugar jerky, one small apple',k:170,p:15,ing:[['Low-sugar turkey jerky','Pantry'],['Apples','Produce']]},
  {id:'s4',n:'Edamame',d:'1 cup microwaved edamame, light salt',k:190,p:17,ing:[['Frozen edamame','Frozen']]},
  {id:'s5',n:'Protein shake',d:'1 scoop low-sugar whey with water or milk',k:150,p:25,ing:[['Low-sugar whey protein','Pantry']]},
  {id:'s6',n:'String cheese + almonds',d:'1 string cheese, 12 almonds',k:200,p:12,ing:[['String cheese','Dairy'],['Walnuts or almonds','Pantry']]}
 ],
 e:[
  {id:'e1',n:'Warm tea + air-popped popcorn',d:'3 cups popcorn, unsweetened herbal tea',k:100,p:3,ing:[['Air-pop popcorn kernels','Pantry'],['Herbal tea','Pantry']]},
  {id:'e2',n:'Sugar-free cocoa with protein',d:'1 scoop chocolate whey in hot milk or water',k:140,p:24,ing:[['Low-sugar whey protein','Pantry']]},
  {id:'e3',n:'Frozen berries and yogurt',d:'Warm slightly, stir into yogurt for a dessert feel',k:140,p:18,ing:[['Plain nonfat Greek yogurt','Dairy'],['Mixed berries (frozen is fine)','Frozen']]},
  {id:'e4',n:'Pickles and turkey roll-ups',d:'Deli turkey slices wrapped around pickles',k:90,p:14,ing:[['Low-sugar deli turkey','Deli'],['Pickles','Pantry']]}
 ]
};
const MEAL_LABELS={b:'Breakfast',l:'Lunch',d:'Dinner',s:'Snack',e:'Evening ritual'};
const PLATE_RULES = [
  ['Protein first','Every meal starts with a palm-sized serving or two of protein. It is the biggest lever for fullness.'],
  ['Eat protein and vegetables before carbs','Doing this blunts the blood-sugar spike, which matters with insulin resistance.'],
  ['Carbs: one fist','Choose slow carbs: oats, beans, quinoa, brown rice, sweet potato, fruit. Skip sweet drinks and added sugar.'],
  ['Vegetables: cooked or frozen','Frozen cooked vegetables like broccoli, green beans and stir-fry mixes. No leafy salads needed.'],
  ['10 minutes of walking after dinner','The easiest evidence-based way to flatten the post-meal glucose rise, and it interrupts the couch-and-snack habit.'],
  ['Close the kitchen after dinner','Pick a time. After that, only your Evening Ritual options from the list.']
];

const BADGES = [
  {id:'first',n:'First check-in',g:'today',test:c=>c.checkins>=1},
  {id:'wk',n:'Seven active days',g:'bolt',test:c=>c.active>=7},
  {id:'d30',n:'30 active days',g:'flag',test:c=>c.active>=30},
  {id:'forge1',n:'First strength session',g:'dumbbell',test:c=>c.strength>=1},
  {id:'forge10',n:'10 strength sessions',g:'dumbbell',test:c=>c.strength>=10},
  {id:'walk',n:'10 hours walked',g:'move',test:c=>c.walkMin>=600},
  {id:'med10',n:'10 meditations',g:'mind',test:c=>c.meds>=10},
  {id:'urge5',n:'5 urges handled',g:'urge',test:c=>c.urgesHandled>=5},
  {id:'l5',n:'5 lb down',g:'scale',test:c=>c.lost>=5},
  {id:'l10',n:'10 lb down',g:'scale',test:c=>c.lost>=10},
  {id:'l20',n:'Phase 1: 20 lb',g:'trophy',test:c=>c.lost>=20},
  {id:'waist',n:'Waist down 2 in',g:'ruler',test:c=>c.waistLost>=2}
];
const RANKS=['Boot','Calibrate','Baseline','Stable','Optimize','Tuned','Resilient','Forged'];
