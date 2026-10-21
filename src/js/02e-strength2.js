/* ===== HealthForge: strength library, expansion pack =====
   Same format as 02b: X(id, name, category, equipment, [knee,back,shoulder load 1-3], sets, reps, cue, safety, figure) */
const HANG=[3,8,3,6], FWD=[88,6,88,4], OVH=[180,12,180,0];
const QUAD2={P:[0,20,0],lean:90,HL:[-9,1,24],HR:[9,1,24],FL:[-7,2,-17],FR:[7,2,-17],kp:[0.1,-1,0.6],ep:[0.1,-0.5,-0.5],toe:-1};
const PUSHTOP={P:[0,23.7,25.5],N:[0,39.6,43.2],F:[0,0,5],H:[17.8,46,9]};

/* ---- LEGS ---- */
X('bw_boxsquat','Bodyweight box squat','Legs',['bodyweight','bench'],[2,1,1],3,'10-12',
 'Reach your arms forward for balance. Sit your hips back and down until you lightly touch the bench, then stand up by pushing through your whole foot.',
 'The easiest squat to learn. The bench sets your depth so your knees are never forced.',
 {eq:[benchBox(-42,-8)],v2:'front',p:[{P:[0,35.4,0],lean:5,F:[0,0,9],A:FWD},{P:[0,19.5,-13],lean:40,hp:-25,F:[0,0,9],A:FWD}]});
X('db_boxsquat','Dumbbell box squat','Legs',['dumbbell','bench'],[2,1,1],3,'8-10',
 'Hold a dumbbell in each hand at your sides. Sit back and down until you lightly touch the bench, then stand tall.',
 'Holding weights at your sides keeps your chest upright. Pick a weight you can control on the way down.',
 {w:['L','R'],eq:[benchBox(-42,-8)],v2:'front',p:[{P:[0,35.4,0],lean:5,F:[0,0,9],A:HANG},{P:[0,19.5,-13],lean:40,hp:-25,F:[0,0,9],A:HANG}]});
X('mb_squat_press','Medicine ball squat to press','Legs',['medball'],[2,1,2],3,'8',
 'Hold the ball at your chest and squat down to the bench height. As you stand, press the ball straight overhead. Bring it back to your chest as you sit down again.',
 'Skip the press on days your shoulders are cranky and just do a goblet squat.',
 {w:['ball'],eq:[benchBox(-42,-8)],v2:'front',p:[{P:[0,19.5,-13],lean:40,hp:-25,F:[0,0,9],A:GOBLET},{P:[0,35.4,0],lean:2,F:[0,0,9],A:OVH}]});
X('splitsq','Split squat','Legs',['dumbbell','bodyweight'],[3,1,1],2,'8 per side',
 'Take a long staggered stance and keep your feet where they are. Lower your back knee straight down toward the floor, then push through your front heel to rise. No stepping.',
 'Easier to balance than a lunge since the feet stay put. Shorten the stance if your front knee complains.',
 {w:['L','R'],v2:'front',p:[{P:[0,31,0],lean:3,FR:[9,0,13],FL:[-9,2,-17],kpL:[-0.1,-0.5,-0.3],A:HANG},{P:[0,20,0],lean:3,FR:[9,0,13],FL:[-9,2,-17],kpL:[-0.1,-0.9,-0.3],A:HANG}]});
X('gob_splitsq','Goblet split squat','Legs',['kettlebell','dumbbell'],[3,1,1],2,'8 per side',
 'Hold one weight at your chest in a staggered stance. Lower your back knee toward the floor, keeping your torso tall, then drive up through your front heel.',
 'Holding the weight in front keeps your torso upright and your back happy.',
 {w:['mid'],v2:'front',p:[{P:[0,31,0],lean:3,FR:[9,0,13],FL:[-9,2,-17],kpL:[-0.1,-0.5,-0.3],A:GOBLET},{P:[0,20,0],lean:3,FR:[9,0,13],FL:[-9,2,-17],kpL:[-0.1,-0.9,-0.3],A:GOBLET}]});
X('gob_revlunge','Goblet reverse lunge','Legs',['kettlebell','dumbbell'],[3,1,1],2,'6 per side',
 'Hold one weight at your chest. Step one foot back, lower until your back knee hovers above the floor, then push through your front heel to stand.',
 'Stepping backward is kinder to the knees than stepping forward. Hold a wall if you need balance.',
 {w:['mid'],v2:'front',p:[{P:[0,35.2,0],lean:4,F:[0,0,9],A:GOBLET},{P:[0,22,-14],lean:6,FR:[9,0,0],FL:[-9,6,-34],kpL:[-0.1,-0.9,-0.3],A:GOBLET}]});
X('wallsit','Wall sit','Legs',['bodyweight'],[2,1,1],3,'20-40 sec',
 'Lean your back against a wall and slide down until your thighs are close to level, with your knees over your ankles. Hold, breathing steadily, then slide back up.',
 'Stop higher up if you feel pressure in your kneecaps. A shallow wall sit still counts.',
 {eq:[wallBox(-9)],v2:'front',p:[{P:[0,19.5,-5],F:[0,12,9],A:FWD},{P:[0,18.5,-5],F:[0,12,9],A:FWD}]});

/* ---- GLUTES AND HINGE ---- */
X('kb_dl','Kettlebell deadlift','Glutes and hinge',['kettlebell'],[1,2,1],3,'8-10',
 'Stand with the kettlebell between your feet. Push your hips back, soften your knees and grip the handle with a flat back. Stand up by driving your hips forward, then lower it back to the floor with control.',
 'Raise the kettlebell on a low box if reaching the floor rounds your back.',
 {w:['mid'],v2:'front',p:[{P:[0,27,-12],lean:62,hp:-35,F:[0,0,12],A:[10,6,0,-20]},{P:[0,35.4,0],lean:3,F:[0,0,9],A:[8,6,4,-28]}]});
X('sumo_dl','Kettlebell sumo deadlift','Glutes and hinge',['kettlebell'],[2,1,1],3,'8-10',
 'Take a wide stance with toes turned out and the kettlebell between your feet. Bend down with a long back, grip the handle and stand up by pushing the floor apart.',
 'The wide stance shortens the range for the back. A good choice if standard deadlifts irritate it.',
 {w:['mid'],v2:'front',p:[{P:[0,25,-6],lean:50,hp:-30,F:[0,0,19],kp:[0.6,0,0.5],A:[5,6,3,-28]},{P:[0,33,0],lean:4,F:[0,0,19],kp:[0.5,0,0.6],A:[8,6,4,-28]}]});
X('rdl','Dumbbell Romanian deadlift','Glutes and hinge',['dumbbell'],[1,2,1],3,'10',
 'Hold a dumbbell in each hand in front of your thighs. Push your hips straight back with soft knees, sliding the weights down your legs to mid-shin. Squeeze your glutes to stand.',
 'Stop when you feel your hamstrings stretch. Never round your back to go lower.',
 {w:['L','R'],v2:'front',p:[{P:[0,35.4,0],lean:3,F:[0,0,9],A:HANG},{P:[0,32.5,-11],lean:68,hp:-42,F:[0,0,9],A:HANG}]});
X('sl_rdl','Kickstand Romanian deadlift','Glutes and hinge',['dumbbell','bodyweight'],[1,2,1],2,'8 per side',
 'Stand on one leg with the other foot resting lightly behind you for balance, like a kickstand. Hinge forward with a flat back, letting a dumbbell slide down your front leg, then stand.',
 'Most of your weight stays on the front leg. Hold a wall with one hand if balance is a struggle.',
 {w:['R'],v2:'front',p:[{P:[0,35,0],FR:[9,0,2],FL:[-9,0,-8],A:HANG},{P:[0,31,-8],lean:60,hp:-35,FR:[9,0,2],FL:[-9,0.5,-8],A:HANG}]});
X('bridge_march','Marching glute bridge','Glutes and hinge',['bodyweight'],[1,1,1],3,'6 per side',
 'Lift into a glute bridge and hold your hips level. Slowly lift one foot off the floor with your knee over your hip, set it down, then switch. Your hips should not drop or twist.',
 'Core and glute control with no joint stress. Go slowly and keep your hips level.',
 {eq:[matBox],v2:'top',p:[{P:[0,16,0],N:[0,3.2,-20.6],hp:35,A:[88,12,88,8],F:FEET_UP,kp:KNEE_UP},{P:[0,16,0],N:[0,3.2,-20.6],hp:35,A:[88,12,88,8],FR:[9,0,22],kpR:KNEE_UP,FL:[-9,33,18],kpL:[-0.1,1,0]}]});
X('bridge_bench','Feet-elevated glute bridge','Glutes and hinge',['bench','bodyweight'],[1,1,1],3,'10',
 'Lie on your back with your heels on the bench and knees bent. Press through your heels and lift your hips until your body makes a line from shoulders to knees. Squeeze, then lower.',
 'The raised feet make your glutes and hamstrings work harder. Keep your ribs down.',
 {eq:[benchBox(18,48,17),matBox],v2:'top',p:[{P:[0,3.5,0],N:[0,3.2,-24],A:[88,12,88,8],F:[17.8,28,9],kp:[0.1,1,0.2]},{P:[0,14,0],N:[0,3.2,-21],hp:30,A:[88,12,88,8],F:[17.8,28,9],kp:[0.1,1,0.2]}]});
X('quad_ext','Quadruped leg extension','Glutes and hinge',['bodyweight'],[2,1,1],3,'8 per side',
 'On hands and knees with a folded mat under your knees. Keeping your back flat, press one foot straight back and up until your leg is in line with your body. Squeeze your glute, then return.',
 'Do not arch your lower back to lift higher. If kneeling hurts, do bridges instead.',
 {eq:[matBox],v2:'top',tf:1,toe:-1,p:[{...QUAD2},{...QUAD2,FR:[7,21,-34],kpR:[0.1,-1,0.1]}]});
X('superman','Prone superman hold','Glutes and hinge',['bodyweight'],[1,2,1],3,'8 slow reps',
 'Lie face down with your arms reaching forward. Lift your arms, chest and legs a few inches off the floor, pause for a breath, then lower with control. Keep your neck long and look at the floor.',
 'Lift only a little. If your lower back pinches, lift just your arms or your legs.',
 {eq:[matBox],v2:'top',tf:1,nofoot:true,p:[{P:[0,4,0],N:[0,4.4,24],A:FWD,T:[-90,3,-90,3],fit:false,nofoot:true},{P:[0,4,0],N:[0,11,22],hp:-10,A:[95,6,95,4],T:[-100,3,-100,3],fit:false,nofoot:true}]});

/* ---- PUSH ---- */
X('stand_press','Standing dumbbell overhead press','Push',['dumbbell'],[1,2,2],3,'8-10',
 'Stand tall with the dumbbells at shoulder height. Brace your abs, press straight overhead until your arms are straight, then lower to your shoulders.',
 'Do not lean back as you press. Use the seated version if your lower back arches.',
 {w:['L','R'],v2:'front',p:[{A:[0,40,180,-10]},{A:OVH}]});
X('front_raise','Front raise','Push',['dumbbell'],[1,1,2],2,'10',
 'Hold light dumbbells in front of your thighs. Raise your arms straight in front of you to shoulder height with soft elbows, then lower slowly.',
 'Light weights and no swinging. Stop at shoulder height.',
 {w:['L','R'],v2:'front',p:[{A:HANG},{A:FWD}]});
X('oh_tri','Overhead triceps extension','Push',['dumbbell'],[1,1,2],2,'10',
 'Hold one dumbbell with both hands overhead. Bend only at the elbows to lower it behind your head, then straighten your arms back up. Keep your elbows pointing forward.',
 'Keep your ribs down so your back does not arch. Use a light weight.',
 {w:['mid'],v2:'front',p:[{A:[180,10,180,0]},{A:[180,10,-20,4]}]});
X('sa_floorpress','Single-arm floor press','Push',['dumbbell','bodyweight'],[1,1,1],3,'8 per arm',
 'Lie on the floor with your knees bent, one dumbbell in one hand. Lower your elbow until it rests on the floor, then press the weight straight up. Finish a set, then switch hands.',
 'The floor stops your elbow at a safe depth. Your free arm rests on the floor.',
 {w:['R'],eq:[matBox],v2:'front',p:[{...LIE,AR:[60,70,180,0],AL:[0,88,0,88],F:FEET_UP,kp:KNEE_UP},{...LIE,AR:OVH,AL:[0,88,0,88],F:FEET_UP,kp:KNEE_UP}]});
X('mb_chest_pass','Medicine ball wall chest pass','Push',['medball'],[1,1,1],3,'10',
 'Stand an arm span and a half from a wall, ball at your chest. Push it forward at the wall with both hands, catch it on the rebound and bring it back to your chest.',
 'Use a ball that bounces back safely. Keep your knees soft and your feet planted.',
 {w:['ball'],eq:[wallBox(44)],v2:'top',p:[{P:[0,35.4,0],F:[0,0,9],A:GOBLET},{P:[0,35.4,2],lean:6,F:[0,0,9],A:FWD}]});
X('mb_slam','Medicine ball overhead slam','Push',['medball'],[1,2,2],3,'8',
 'Hold the ball overhead and reach tall. Slam it down onto the floor in front of your feet by hinging at the hips, then pick it up and repeat.',
 'Use a ball that does not bounce. Keep your back flat as you pick it up.',
 {w:['ball'],v2:'front',p:[{P:[0,35.4,0],F:[0,0,9],A:OVH},{P:[0,31,-6],lean:45,hp:-20,F:[0,0,9],A:[35,8,25,4]}]});

/* ---- PULL ---- */
X('alt_curl','Alternating biceps curl','Pull',['dumbbell'],[1,1,1],2,'10 per arm',
 'Stand tall with a dumbbell in each hand. Curl one up to your shoulder while the other stays down, lower it, then switch. Keep your elbows by your sides.',
 'Smooth and unhurried. No swinging from the hips.',
 {w:['L','R'],v2:'front',p:[{A:HANG},{AR:[5,6,160,0],AL:HANG}]});
X('hammer_curl','Hammer curl','Pull',['dumbbell'],[1,1,1],2,'10',
 'Hold the dumbbells with your palms facing each other, like holding a hammer. Curl both up toward your shoulders, then lower slowly.',
 'The neutral wrist position is comfortable on elbows and forearms.',
 {w:['L','R'],v2:'front',p:[{A:HANG},{A:[5,6,160,0]}]});
X('seated_curl','Seated biceps curl','Pull',['dumbbell','bench'],[1,1,1],2,'10',
 'Sit tall on the bench with the dumbbells hanging at your sides. Curl both up toward your shoulders, pause, then lower slowly.',
 'Sitting removes any urge to swing, so the biceps do the work.',
 {w:['L','R'],eq:[benchBox(-24,16,17)],v2:'front',p:[{...SIT,A:HANG},{...SIT,A:[5,6,160,0]}]});
X('upright_row','Dumbbell upright row (short range)','Pull',['dumbbell'],[1,1,2],2,'10',
 'Hold light dumbbells in front of your thighs. Lift them up your body toward your chest, with your elbows leading out to the sides, then lower slowly.',
 'Stop at chest height, not higher, to protect your shoulders. Skip it if you feel pinching.',
 {w:['L','R'],v2:'front',p:[{A:HANG},{HR:[7,52,8],HL:[-7,52,8],epR:[1,0.4,0.2],epL:[-1,0.4,0.2]}]});
X('seated_revfly','Seated reverse fly','Pull',['dumbbell','bench'],[1,1,1],2,'12',
 'Sit on the bench and fold forward with a flat back, light dumbbells hanging below. Raise both arms out to the sides to shoulder height, squeezing your shoulder blades, then lower.',
 'Sitting supports your legs and lets you focus on the upper back. Very light weights.',
 {w:['L','R'],eq:[benchBox(-24,16,17)],v2:'front',p:[{...SIT,lean:55,hp:-30,A:[5,6,3,-10]},{...SIT,lean:55,hp:-30,A:[0,85,0,80]}]});

/* ---- CORE ---- */
X('crunch','Reaching crunch','Core',['bodyweight'],[1,2,1],3,'10',
 'Lie on your back with your knees bent and arms reaching toward your knees. Curl your head and shoulders a few inches off the floor, exhale, then lower slowly.',
 'Small movement, no neck pulling. Keep your chin slightly tucked.',
 {eq:[matBox],v2:'top',p:[{...LIE,A:[88,12,88,8],F:FEET_UP,kp:KNEE_UP},{P:[0,3.5,0],N:[0,11,-21],hp:20,A:[88,12,88,8],F:FEET_UP,kp:KNEE_UP}]});
X('rev_crunch','Reverse crunch','Core',['bodyweight'],[1,2,1],3,'8-10',
 'Lie on your back with your knees bent over your hips and arms by your sides. Curl your knees toward your chest so your hips lift slightly off the floor, then lower slowly.',
 'Use your abs, not momentum. Do not roll up onto your neck.',
 {eq:[matBox],v2:'top',p:[{...LIE,A:[88,12,88,8],TL:[180,4,90,0],TR:[180,4,90,0],fit:false},{...LIE,P:[0,7,2],A:[88,12,88,8],TL:[200,4,120,0],TR:[200,4,120,0],fit:false}]});
X('flutter','Flutter kicks','Core',['bodyweight'],[1,2,1],3,'20 sec',
 'Lie on your back with your legs straight, hands under your hips and your lower back pressed to the floor. Kick your legs up and down in small, alternating scissors.',
 'Keep your lower back on the floor. Raise your feet higher or bend your knees if it lifts.',
 {eq:[matBox],v2:'top',p:[{P:[0,3.5,0],N:[0,10,-22],hp:15,A:[88,12,88,8],TR:[100,2,100,2],TL:[115,2,115,2],fit:true},{P:[0,3.5,0],N:[0,10,-22],hp:15,A:[88,12,88,8],TR:[115,2,115,2],TL:[100,2,100,2],fit:true}]});
X('incline_mtn','Incline mountain climber','Core',['bench'],[2,1,2],3,'20 sec',
 'Hands on the bench, body in a straight line. Drive one knee toward your chest, then switch legs in a steady rhythm. Keep your hips low and your breathing smooth.',
 'The bench makes it far easier on shoulders and wrists than the floor version. Slow it down any time.',
 {eq:[benchBox(40,70,17)],v2:'front',p:[{...PUSHTOP,FR:[9,10,15],kpR:[0.1,1,0.3]},{...PUSHTOP,FL:[-9,10,15],kpL:[-0.1,1,0.3]}]});
X('incline_plank','Incline plank','Core',['bench'],[1,1,2],3,'20-40 sec',
 'Hands on the bench under your shoulders, body in a straight line from head to heels. Brace your abs, squeeze your glutes and hold, breathing steadily.',
 'The easiest plank for shoulders. Lower the incline gradually as you get stronger.',
 {eq:[benchBox(40,70,17)],v2:'front',p:[{...PUSHTOP},{...PUSHTOP,P:[0,24.2,25.5]}]});
X('march','High-knee march','Core',['bodyweight'],[1,1,1],3,'20 sec',
 'Stand tall and march in place, lifting each knee toward hip height while your opposite arm swings forward. Stay tall and keep your abs braced.',
 'A gentle way to warm up or break up long sitting. Hold a wall if balance is tricky.',
 {v2:'front',p:[{P:[0,35.4,0],F:[0,0,9],FL:[-9,24,16],kpL:[-0.1,0.2,1],AL:[-20,8,-20,6],AR:[40,8,40,6]},{P:[0,35.4,0],F:[0,0,9],FR:[9,24,16],kpR:[0.1,0.2,1],AR:[-20,8,-20,6],AL:[40,8,40,6]}]});
X('side_bend','Dumbbell side bend','Core',['dumbbell'],[1,2,1],2,'10 per side',
 'Hold one dumbbell at your side and stand tall. Slowly bend sideways toward the weight, then use the muscles on the opposite side to straighten up. Switch hands after the set.',
 'Move straight sideways, not forward or back. Keep the weight light.',
 {w:['R'],v2:'front',p:[{A:HANG},{sway:14,ht:6,A:HANG}]});
X('mb_twist','Standing medicine ball twist','Core',['medball'],[1,2,1],3,'10 per side',
 'Hold the ball at your chest with your feet hip-width apart. Rotate your upper body to one side, letting your back heel come up slightly, then rotate to the other side.',
 'Turn from your ribs, not your lower back. Smooth, controlled turns.',
 {w:['ball'],v2:'top',p:[{P:[0,35.4,0],F:[0,0,9],yaw:35,A:GOBLET},{P:[0,35.4,0],F:[0,0,9],yaw:-35,A:GOBLET}]});

/* ---- CARRY ---- */
X('oh_carry','Overhead carry','Carry',['kettlebell','dumbbell'],[1,2,3],3,'20-30 sec',
 'Press a light weight in each hand overhead, ribs down and arms straight. Walk slowly in a short loop, keeping the weights stacked over your shoulders.',
 'Shoulder-demanding. Use light weights and stop if your back arches.',
 {w:['L','R'],v2:'front',p:[{...WALK0,A:OVH},{...WALK1,A:OVH}]});
X('waiter','Waiter carry','Carry',['kettlebell','dumbbell'],[1,2,2],3,'20-30 sec per side',
 'Press one light weight overhead and hold the other arm at your side. Walk slowly with your ribs down and your torso upright. Switch arms.',
 'Trains your core to resist leaning. Light weight only.',
 {w:['R'],v2:'front',p:[{...WALK0,AR:OVH,AL:[2,8,2,6]},{...WALK1,AR:OVH,AL:[2,8,2,6]}]});
X('goblet_carry','Goblet carry','Carry',['kettlebell','dumbbell'],[1,1,1],3,'30 sec',
 'Hold one weight at your chest with both hands, elbows tucked. Walk slowly, standing tall and keeping your ribs over your hips.',
 'Excellent posture trainer for desk work. No joint stress.',
 {w:['mid'],v2:'front',p:[{...WALK0,A:GOBLET},{...WALK1,A:GOBLET}]});
X('rack_carry','Rack carry','Carry',['kettlebell'],[1,1,2],3,'30 sec per side',
 'Hold one kettlebell at your shoulder, elbow tucked. Walk slowly and stay completely upright, without leaning away from the weight. Switch sides.',
 'Your core works hard to keep you from tipping. Keep the other shoulder level.',
 {w:['R'],v2:'front',p:[{...WALK0,AR:GOBLET,AL:[2,8,2,6]},{...WALK1,AR:GOBLET,AL:[2,8,2,6]}]});

/* ---- OVERHEAD DUMBBELL AND KETTLEBELL LIFTS ---- */
const RACK=[0,40,180,-10];
X('arnold','Seated Arnold press','Push',['dumbbell','bench'],[1,1,2],3,'8-10',
 'Sit tall on the bench with the dumbbells in front of your chest, palms facing you. Press up overhead while turning your palms to face forward, then reverse the turn as you lower.',
 'The rotation is slow and smooth. Use a lighter weight than your standard overhead press, and stop if your shoulders pinch.',
 {w:['L','R'],eq:[benchBox(-24,16,17)],v2:'front',p:[{...SIT,A:[40,10,150,-40]},{...SIT,A:OVH}]});
X('sa_press','Standing single-arm overhead press','Push',['dumbbell','kettlebell'],[1,2,2],3,'8 per arm',
 'Hold one weight at your shoulder with your other arm relaxed. Brace your abs, press the weight straight overhead until your arm is straight, then lower it to your shoulder. Finish a set, then switch.',
 'Keep your ribs down and do not lean sideways. The one-arm version challenges your core as well.',
 {w:['R'],v2:'front',p:[{AR:RACK,AL:HANG},{AR:OVH,AL:HANG}]});
X('sa_seat_press','Seated single-arm overhead press','Push',['dumbbell','bench'],[1,1,2],3,'8 per arm',
 'Sit tall on the bench with one dumbbell at your shoulder. Press it straight overhead, then lower it under control. Switch arms after the set.',
 'Sitting takes your legs and lower back out of the movement, so your shoulder does the work.',
 {w:['R'],eq:[benchBox(-24,16,17)],v2:'front',p:[{...SIT,AR:RACK,AL:[8,6,8,4]},{...SIT,AR:OVH,AL:[8,6,8,4]}]});
X('alt_press','Alternating overhead dumbbell press','Push',['dumbbell'],[1,2,2],3,'8 per arm',
 'Hold a dumbbell at each shoulder. Press one overhead while the other stays racked, lower it, then press the other. Keep your torso still.',
 'Stay tall and do not arch your back. Light to moderate weights.',
 {w:['L','R'],v2:'front',p:[{AR:OVH,AL:RACK},{AL:OVH,AR:RACK}]});
X('push_press','Dumbbell push press','Push',['dumbbell'],[2,2,2],3,'6-8',
 'Hold the dumbbells at your shoulders. Dip your knees a few inches, then drive up through your legs and use that momentum to press the weights overhead. Lower to your shoulders and repeat.',
 'The legs start the lift, which lets you move heavier weight with less shoulder strain. Keep the dip small and your torso upright.',
 {w:['L','R'],v2:'front',p:[{P:[0,32,0],F:[0,0,9],kp:[0.2,0,0.8],A:RACK},{P:[0,35.4,0],F:[0,0,9],A:OVH}]});
X('thruster','Dumbbell thruster','Legs',['dumbbell'],[2,1,2],3,'8',
 'Hold the dumbbells at your shoulders. Squat down to the bench, then stand up and press the weights overhead in one smooth motion. Lower them to your shoulders as you sit into the next rep.',
 'A full-body lift that gets your heart rate up. Use light weights and a controlled pace.',
 {w:['L','R'],eq:[benchBox(-42,-8)],v2:'front',p:[{P:[0,19.5,-13],lean:40,hp:-25,F:[0,0,9],A:RACK},{P:[0,35.4,0],lean:2,F:[0,0,9],A:OVH}]});
X('hk_press','Half-kneeling single-arm press','Push',['dumbbell','kettlebell'],[2,1,2],2,'8 per arm',
 'Kneel on a folded mat with one foot forward and a weight at the shoulder on the kneeling side. Squeeze your glute, then press the weight overhead and lower it with control. Switch sides.',
 'The kneeling position keeps you from arching your back. Pad your knee well, or use the standing press instead.',
 {w:['R'],eq:[matBox],v2:'front',p:[{P:[0,18.5,0],FR:[9,0,17],FL:[-9,2,-18],kpL:[-0.1,-1,0.3],AR:RACK,AL:[0,35,30,-55]},{P:[0,18.5,0],FR:[9,0,17],FL:[-9,2,-18],kpL:[-0.1,-1,0.3],AR:OVH,AL:[0,35,30,-55]}]});
X('lat_to_press','Lateral raise to overhead press','Push',['dumbbell'],[1,1,2],2,'8',
 'Hold light dumbbells at your sides. Raise your arms out to shoulder height, continue up overhead until your arms are straight, then lower back down the same arc.',
 'Light weights only. Move slowly and keep your neck relaxed.',
 {w:['L','R'],v2:'front',p:[{A:[10,88,10,88]},{A:OVH}]});
X('y_raise','Dumbbell Y raise','Push',['dumbbell'],[1,1,2],2,'10',
 'Hold very light dumbbells in front of your thighs. Raise your arms up and out in a Y shape until they are overhead, thumbs pointing back, then lower slowly.',
 'This works the muscles that hold your shoulder blades in place. Use the lightest weights you own.',
 {w:['L','R'],v2:'front',p:[{A:HANG},{A:[160,40,160,40]}]});
X('kb_press','Kettlebell overhead press','Push',['kettlebell'],[1,2,2],3,'6-8 per arm',
 'Hold the kettlebell at your shoulder with the bell resting on your forearm. Press it straight up overhead, keeping your wrist straight, then lower it back to your shoulder. Switch arms.',
 'Squeeze the handle and your glutes before each rep. Start with a light bell and keep your ribs down.',
 {w:['R'],v2:'front',p:[{AR:[20,8,150,-30],AL:HANG},{AR:OVH,AL:HANG}]});
X('seat_oh_tri','Seated overhead triceps extension','Push',['dumbbell','bench'],[1,1,2],2,'10',
 'Sit tall on the bench holding one dumbbell overhead with both hands. Bend your elbows to lower it behind your head, then straighten your arms. Keep your elbows pointing forward.',
 'Sitting steadies your back. Use a light weight and move slowly.',
 {w:['mid'],eq:[benchBox(-24,16,17)],v2:'front',p:[{...SIT,A:[180,10,180,0]},{...SIT,A:[180,10,-20,4]}]});
X('sa_oh_tri','Single-arm overhead triceps extension','Push',['dumbbell'],[1,1,2],2,'10 per arm',
 'Hold one dumbbell overhead with your elbow next to your ear. Bend only at the elbow to lower the weight behind your head, then straighten. Use your free hand to steady the working elbow. Switch arms.',
 'Keep the weight light and your elbow pointing up, not out.',
 {w:['R'],v2:'front',p:[{AR:[180,10,180,0],AL:HANG},{AR:[180,10,-20,4],AL:HANG}]});
