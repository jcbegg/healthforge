/* ===== HealthForge: strength exercise library =====
   X(id, name, category, equipment, [knee,back,shoulder load 1-3], sets, reps, cue, safety, figure) */
const EXERCISES={}, STRETCHES={};
const EQ_LABEL={bodyweight:'Bodyweight',dumbbell:'Dumbbells',kettlebell:'Kettlebell',medball:'Medicine ball',bench:'Bench'};
const CATS=['Legs','Glutes and hinge','Push','Pull','Core','Carry'];
function X(id,name,cat,eq,j,sets,reps,cue,safe,fig){ EXERCISES[id]={id,name,cat,eq,j,sets,reps,cue,safe,fig:id}; defFig(id,fig); }
const bx=(x0,x1,y0,y1,z0,z1)=>[x0,x1,y0,y1,z0,z1];
const benchBox=(z0,z1,h=17)=>bx(-8,8,0,h,z0,z1);
const matBox=bx(-16,16,0,0.8,-48,48);
const chairBoxes=[bx(-12,12,16,18,-11,11),bx(-12,12,18,46,-13,-11),bx(-12,12,0,16,-13,-11),bx(-12,12,0,16,9,11)];
const wallBox=z=>bx(-60,60,0,90,z,z+3);
const LIE={P:[0,3.5,0],N:[0,3.2,-24]};           // supine on floor
const LIE_B={P:[0,19.5,0],N:[0,19.5,-24]};       // supine on bench (top at y=17)
const GOBLET=[15,10,135,-45];
const FEET_UP=[0,22,9], KNEE_UP=[0.1,1,0.25];
const SIT={P:[0,19.5,0],F:[0,17,9]};

/* ---- LEGS ---- */
X('squat','Goblet box squat','Legs',['kettlebell','dumbbell','bench'],[2,1,1],3,'8-10',
 'Hold one weight at your chest. Sit your hips back and down until you lightly touch the bench, then stand up. Keep your knees tracking over your toes.',
 'The bench limits how deep your knees bend and gives you a target.',
 {w:['mid'],eq:[benchBox(-42,-8)],v2:'front',p:[{P:[0,35.4,0],lean:5,F:[0,0,9],A:GOBLET},{P:[0,19.5,-13],lean:40,hp:-25,F:[0,0,9],A:GOBLET}]});
X('sumo_sq','Wide-stance goblet squat','Legs',['kettlebell','dumbbell'],[2,1,1],3,'10',
 'Feet wider than your shoulders, toes turned slightly out. Hold one weight at your chest and sink straight down between your feet, knees pushing out over your toes.',
 'A wider stance often feels kinder on the hips and lower back.',
 {w:['mid'],v2:'front',p:[{P:[0,32.5,0],lean:8,F:[0,0,19],kp:[0.5,0,0.6],A:GOBLET},{P:[0,19,0],lean:14,F:[0,0,19],kp:[0.8,0,0.5],A:GOBLET}]});
X('calf_raise','Standing calf raise','Legs',['dumbbell','bodyweight'],[1,1,1],3,'15',
 'Stand tall with a dumbbell in each hand (or hold a wall for balance). Rise up onto the balls of your feet, pause, lower slowly.',
 'Very low joint stress. Good for circulation and ankle strength.',
 {w:['L','R'],v2:'front',p:[{P:[0,35.4,0],F:[0,0,9],A:[3,8,3,6]},{P:[0,42,0],F:[7,0,9],A:[3,8,3,6]}]});
X('revlunge','Reverse lunge (short range)','Legs',['dumbbell','bodyweight'],[3,1,1],2,'6 per side',
 'Step one foot back about two feet, lower straight down until your back knee hovers near the floor, then push through your front heel to stand. Keep your torso upright.',
 'Harder on knees than a squat. Skip it if your knees complain, or hold a wall for balance.',
 {w:['L','R'],v2:'front',p:[{P:[0,35.2,0],lean:6,F:[0,0,9],A:[3,8,3,6]},{P:[0,22,-14],lean:8,FR:[9,0,0],FL:[-9,6,-34],kpL:[-0.1,-0.9,-0.3],A:[3,8,3,6]}]});
X('stepup','Low bench step-up','Legs',['bench','dumbbell'],[3,1,1],2,'8 per side',
 'Place your whole foot on the bench. Drive through that heel to stand up tall, bring the other knee up, then step down slowly with control.',
 'Use the bench at its lowest height. Slow, controlled steps down protect your knees.',
 {w:['L','R'],eq:[benchBox(14,44,17)],v2:'front',p:[{P:[0,34,6],lean:14,FR:[9,0,0],FL:[-9,17.8,22],A:[3,8,3,6]},{P:[0,51.5,22],lean:2,FL:[-9,17.8,22],TR:[85,3,0,0],A:[3,8,3,6]}]});
X('kb_swing','Kettlebell dead-stop swing','Legs',['kettlebell'],[1,2,1],3,'10',
 'Hinge at the hips with the kettlebell between your feet. Snap your hips forward to swing it to chest height, then guide it back down. The arms only steer; the hips do the work.',
 'Learn the hip hinge first. Stop if your lower back takes over. Keep the weight modest.',
 {w:['mid'],v2:'front',p:[{P:[0,31,-14],lean:65,hp:-40,F:[0,0,12],A:[-12,6,-28,4]},{P:[0,35.2,0],lean:-3,F:[0,0,12],A:[85,6,85,4]}]});

/* ---- GLUTES AND HINGE ---- */
X('bridge','Weighted glute bridge','Glutes and hinge',['bodyweight','dumbbell'],[1,1,1],3,'12',
 'Lie on your back with your knees bent and feet flat. Drive your hips up until your body forms a line from shoulders to knees, squeeze your glutes for a second, then lower slowly. Rest a dumbbell on your hips when this feels easy.',
 'Builds the hips and back support with almost no knee or shoulder stress.',
 {w:['hip'],eq:[matBox],v2:'top',p:[{...LIE,A:[88,12,88,8],F:FEET_UP,kp:KNEE_UP},{P:[0,16,0],N:[0,3.2,-20.6],hp:35,A:[88,12,88,8],F:FEET_UP,kp:KNEE_UP}]});
X('single_bridge','Single-leg glute bridge','Glutes and hinge',['bodyweight'],[1,1,1],3,'8 per side',
 'Bridge up with one foot planted and the other leg extended straight out in line with your body. Keep your hips level, squeeze the working glute, then lower.',
 'Level hips matter more than height. Skip if you feel it in your hamstring cramping.',
 {eq:[matBox],v2:'top',p:[{...LIE,A:[88,12,88,8],FR:[9,0,22],kpR:KNEE_UP,TL:[125,0,125,0]},{P:[0,16,0],N:[0,3.2,-20.6],hp:35,A:[88,12,88,8],FR:[9,0,22],kpR:KNEE_UP,TL:[125,0,125,0]}]});
X('hipthrust','Bench hip thrust','Glutes and hinge',['bench','dumbbell'],[1,1,1],3,'10',
 'Upper back resting on the bench, feet flat on the floor, a dumbbell on your hips. Drive your hips up until your torso is level with the floor, squeeze, and lower with control.',
 'Great glute builder. Chin slightly tucked so your neck stays neutral.',
 {w:['hip'],eq:[benchBox(-50,-20,17),matBox],v2:'top',p:[{P:[0,8,0],N:[0,19.6,-21],hp:-15,A:[88,14,88,8],F:[0,24,9],kp:[0.1,0.4,1]},{P:[0,21,0],N:[0,19.5,-24],hp:-5,A:[88,14,88,8],F:[0,24,9],kp:[0.1,0.4,1]}]});
X('hinge','Kettlebell hip hinge','Glutes and hinge',['kettlebell','dumbbell'],[1,2,1],3,'10',
 'Hold the weight in front of your thighs. Push your hips straight back with a soft knee bend and a flat back, letting the weight slide down your legs to mid-shin. Stand by squeezing your glutes.',
 'Stop at mid-shin. If your back rounds, reduce the range or the weight.',
 {w:['mid'],v2:'front',p:[{P:[0,35.4,0],lean:3,F:[0,0,9],A:[8,6,4,-28]},{P:[0,32.5,-11],lean:68,hp:-42,F:[0,0,9],A:[5,6,3,-28]}]});
X('gm','Hip hinge drill (arms crossed)','Glutes and hinge',['bodyweight'],[1,2,1],3,'10',
 'Cross your arms over your chest. Slide your hips straight back, tipping your torso forward with a flat back, until you feel your hamstrings. Squeeze your glutes to stand.',
 'A great way to learn the hinge pattern with zero load.',
 {v2:'front',p:[{P:[0,35.4,0],F:[0,0,9],A:[20,5,150,-70]},{P:[0,32.5,-11],lean:62,hp:-38,F:[0,0,9],A:[20,5,150,-70]}]});

/* ---- PUSH ---- */
X('floorpress','Bench dumbbell press','Push',['dumbbell','bench'],[1,1,2],3,'10',
 'Lie on the bench, feet flat on the floor. Start with the dumbbells at chest level and elbows about 45 degrees from your body. Press up until your arms are straight, then lower with control.',
 'Stop lowering when your upper arms are level with the bench to protect your shoulders.',
 {w:['L','R'],eq:[benchBox(-50,14,17)],v2:'front',p:[{...LIE_B,A:[0,45,180,0],F:[0,24,9],kp:[0.1,0.8,0.6]},{...LIE_B,A:[180,6,180,0],F:[0,24,9],kp:[0.1,0.8,0.6]}]});
X('fl_press','Floor dumbbell press','Push',['dumbbell','bodyweight'],[1,1,1],3,'10',
 'Lie on the floor, knees bent. Lower the dumbbells until your upper arms rest on the floor, then press straight up over your chest.',
 'The floor stops your elbows from going too deep, which is gentle on shoulders.',
 {w:['L','R'],eq:[matBox],v2:'front',p:[{...LIE,A:[60,70,180,0],F:FEET_UP,kp:KNEE_UP},{...LIE,A:[180,6,180,0],F:FEET_UP,kp:KNEE_UP}]});
X('pushup','Incline push-up','Push',['bench','bodyweight'],[1,1,2],3,'8-12',
 'Hands on the bench slightly wider than your shoulders, body in a straight line from head to heels. Lower your chest toward the bench with elbows about 45 degrees from your body, then press away.',
 'The incline reduces load on your shoulders and wrists. Lower the incline as you get stronger.',
 {eq:[benchBox(40,70,17)],v2:'front',p:[{P:[0,23.7,25.5],N:[0,39.6,43.2],F:[0,0,5],H:[17.8,46,9]},{P:[0,16.6,30.7],N:[0,28,51.9],F:[0,0,5],H:[17.8,46,9],ep:[0.6,-0.2,-0.8]}]});
X('pushup_floor','Floor push-up','Push',['bodyweight'],[1,1,2],3,'6-10',
 'Hands under your shoulders, body in one straight line. Lower your chest to about a fist from the floor, then press back up.',
 'Drop to an incline on the bench if form breaks down.',
 {eq:[matBox],v2:'front',p:[{P:[0,14.3,32.3],N:[0,23,54.5],F:[0,0,5],H:[0.5,54.5,9]},{P:[0,4.6,34.7],N:[0,8,58.5],F:[0,0,5],H:[0.5,54.5,9],ep:[0.6,-0.2,-0.8]}]});
X('pushup_wall','Wall push-up','Push',['bodyweight'],[1,1,1],3,'12',
 'Stand an arm and a half from a wall, hands on it at chest height. Bend your elbows to bring your chest toward the wall, then push back.',
 'The gentlest push-up. Good for warming up or low-energy days.',
 {eq:[wallBox(38)],v2:'front',p:[{P:[0,34.2,7.3],lean:12,F:[0,0,6],H:[58,38,10]},{P:[0,30.3,17.5],lean:30,F:[0,0,6],H:[58,38,10],ep:[0.6,-0.3,-0.5]}]});
X('db_fly','Dumbbell chest fly','Push',['dumbbell','bench'],[1,1,2],2,'12',
 'Lie on the bench with the dumbbells over your chest, elbows slightly bent. Open your arms in a wide arc until you feel a stretch across your chest, then bring the weights back together.',
 'Use light weights. Keep a soft bend in your elbows the whole time.',
 {w:['L','R'],eq:[benchBox(-50,14,17)],v2:'front',p:[{...LIE_B,A:[180,6,180,6],F:[0,24,9],kp:[0.1,0.8,0.6]},{...LIE_B,A:[0,82,180,72],F:[0,24,9],kp:[0.1,0.8,0.6]}]});
X('ohp_seat','Seated dumbbell overhead press','Push',['dumbbell','bench'],[1,1,2],3,'10',
 'Sit tall on the bench with the dumbbells at shoulder height, palms forward. Press straight overhead without arching your back, then lower to your shoulders.',
 'Keep your ribs down and core braced. Use lighter weight if your neck or shoulders get tight.',
 {w:['L','R'],eq:[benchBox(-24,16,17)],v2:'front',p:[{...SIT,A:[0,40,180,-10]},{...SIT,A:[180,12,180,0]}]});
X('lat_raise','Lateral raise','Push',['dumbbell'],[1,1,2],2,'12',
 'Stand tall with a light dumbbell in each hand. Raise your arms out to the sides, leading with your elbows, up to shoulder height. Lower slowly.',
 'Use very light weights. Stop at shoulder height.',
 {w:['L','R'],v2:'front',p:[{A:[3,8,3,6]},{A:[10,88,10,88]}]});
X('tri_ext','Lying triceps extension','Push',['dumbbell','bench'],[1,1,2],2,'10',
 'Lie on the bench with the dumbbells above your shoulders. Bend only at the elbows to lower the weights toward your head, then straighten your arms back up. Keep your upper arms still.',
 'Keep the weights light and move slowly to protect your elbows.',
 {w:['L','R'],eq:[benchBox(-50,14,17)],v2:'front',p:[{...LIE_B,A:[180,6,-60,4],F:[0,24,9],kp:[0.1,0.8,0.6]},{...LIE_B,A:[180,6,180,4],F:[0,24,9],kp:[0.1,0.8,0.6]}]});
X('kickback','Triceps kickback','Push',['dumbbell','bench'],[1,2,1],2,'10 per arm',
 'Hinge forward with one hand supported on the bench. Tuck your working elbow to your side, then straighten your arm back behind you. Squeeze your triceps and return.',
 'The bench supports your back. Keep your neck in line with your spine.',
 {w:['R'],eq:[benchBox(8,38,19)],v2:'front',p:[{P:[0,29.5,-14],lean:72,hp:-45,F:[0,0,9],HL:[-9,20.4,20],epL:[0.3,-0.6,-0.5],AR:[-62,6,0,4]},{P:[0,29.5,-14],lean:72,hp:-45,F:[0,0,9],HL:[-9,20.4,20],epL:[0.3,-0.6,-0.5],AR:[-62,6,-62,4]}]});

/* ---- PULL ---- */
X('row','Supported one-arm row','Pull',['dumbbell','bench'],[1,1,1],3,'10 per side',
 'Place one hand on the bench, back flat, and let the other arm hang with a dumbbell. Pull the weight toward your hip, driving your elbow back, pause, and lower. Switch sides after the set.',
 'Bench support takes the load off your lower back.',
 {w:['R'],eq:[benchBox(8,38,17)],v2:'front',p:[{P:[0,29.5,-14],lean:75,hp:-48,F:[0,0,9],HL:[-9,17.8,20],epL:[0.3,-0.6,-0.5],AR:[0,6,0,4]},{P:[0,29.5,-14],lean:75,hp:-48,F:[0,0,9],HL:[-9,17.8,20],epL:[0.3,-0.6,-0.5],AR:[-95,6,5,4]}]});
X('bentrow','Two-arm bent-over row','Pull',['dumbbell'],[1,2,1],3,'10',
 'Hinge forward with a flat back and a dumbbell in each hand. Pull both elbows up and back toward your hips, squeeze your shoulder blades, lower slowly.',
 'Keep your back flat and your knees soft. Reduce the weight if your lower back tires.',
 {w:['L','R'],v2:'front',p:[{P:[0,30,-13],lean:68,hp:-42,F:[0,0,9],A:[0,8,0,6]},{P:[0,30,-13],lean:68,hp:-42,F:[0,0,9],A:[-90,30,5,10]}]});
X('reardelt','Bent-over reverse fly','Pull',['dumbbell'],[1,2,1],2,'12',
 'Hinge forward with a flat back and light dumbbells hanging below you. Raise both arms out to the sides, leading with your elbows, until they reach shoulder height. Lower slowly.',
 'Very light weights. This works the muscles that fight desk posture.',
 {w:['L','R'],v2:'front',p:[{P:[0,30,-13],lean:70,hp:-45,F:[0,0,9],A:[5,6,3,-10]},{P:[0,30,-13],lean:70,hp:-45,F:[0,0,9],A:[0,85,0,80]}]});
X('shrug','Dumbbell shrug','Pull',['dumbbell'],[1,1,1],3,'12',
 'Stand tall with a dumbbell in each hand at your sides. Lift your shoulders straight up toward your ears, pause, then lower them slowly. No rolling.',
 'Simple and gentle. A good break for tense upper traps.',
 {w:['L','R'],v2:'front',p:[{A:[3,8,3,6],shy:0},{A:[3,8,3,6],shy:4}]});
X('curl','Standing biceps curl','Pull',['dumbbell'],[1,1,1],2,'12',
 'Stand tall with your elbows pinned to your sides. Curl both dumbbells up toward your shoulders, then lower slowly. Do not swing your body.',
 'Keep your wrists straight and shoulders relaxed.',
 {w:['L','R'],v2:'front',p:[{A:[3,8,3,6]},{A:[5,6,160,0]}]});
X('pullover','Dumbbell pullover','Pull',['dumbbell','bench'],[1,1,2],2,'10',
 'Lie on the bench holding one dumbbell over your chest with both hands. With a soft bend in your elbows, lower it in an arc back behind your head, then bring it back over your chest.',
 'Go only as far as is comfortable for your shoulders. Light weight.',
 {w:['mid'],eq:[benchBox(-56,14,17)],v2:'front',p:[{...LIE_B,A:[180,0,180,0],F:[0,24,9],kp:[0.1,0.8,0.6]},{...LIE_B,A:[-105,0,-115,0],F:[0,24,9],kp:[0.1,0.8,0.6]}]});

/* ---- CORE ---- */
X('deadbug','Dead bug','Core',['bodyweight'],[1,1,1],3,'6 per side',
 'Lie on your back, arms pointing up and knees bent over your hips. Slowly lower one arm overhead and the opposite leg out long while your lower back stays on the floor. Return and switch.',
 'Core work with a neutral spine. Only go as far as your back stays flat.',
 {eq:[matBox],v2:'top',p:[{A:[180,6,180,0],T:[180,4,90,0],...LIE,P:[0,3.5,0],fit:false},{...LIE,AR:[-90,5,-90,2],AL:[180,6,180,0],TR:[180,4,90,0],TL:[96,3,96,3],fit:false}]});
X('birddog','Bird dog','Core',['bodyweight'],[2,1,1],3,'6 per side',
 'On hands and knees (pad your knees with a folded mat), hands under shoulders and hips level. Reach one arm forward and the opposite leg back until they are in line with your spine. Hold a beat, return, switch.',
 'If kneeling bothers your knees, swap this for dead bug.',
 {eq:[matBox],v2:'top',tf:1,toe:-1,p:[{P:[0,20,0],lean:90,HL:[-9,1,24],HR:[9,1,24],FL:[-7,2,-17],FR:[7,2,-17],kp:[0.1,-1,0.6],ep:[0.1,-0.5,-0.5]},{P:[0,20,0],lean:90,HR:[9,1,24],AL:[90,3,90,2],FL:[-7,2,-17],TR:[-91,3,-91,3],kpL:[-0.1,-1,0.6],ep:[0.1,-0.5,-0.5],toe:-1}]});
X('plank','Forearm plank','Core',['bodyweight'],[1,1,2],3,'20-40 sec',
 'Forearms on the floor under your shoulders, body in one straight line from head to heels. Brace your abs and squeeze your glutes. Breathe steadily and hold.',
 'Stop when your hips sag. Drop to your knees to make it easier.',
 {eq:[matBox],v2:'top',tf:1,p:[{P:[0,7.7,34],N:[0,13.2,57.5],F:[0.5,0,5],H:[1.5,68.5,6],ep:[0,-1,-0.2]},{P:[0,7.2,34],N:[0,12.9,57.5],F:[0.5,0,5],H:[1.5,68.5,6],ep:[0,-1,-0.2]}]});
X('hollow','Hollow hold','Core',['bodyweight'],[1,2,1],3,'15-30 sec',
 'Lie on your back with arms overhead. Press your lower back into the floor, then lift your shoulders and straight legs a few inches off the floor and hold.',
 'If your lower back lifts off the floor, bend your knees or lift less.',
 {eq:[matBox],v2:'top',p:[{...LIE,A:[-100,3,-100,3],T:[90,2,90,2],fit:true},{P:[0,3.5,0],N:[0,10,-22],hp:15,A:[-100,3,-100,3],T:[100,2,100,2],fit:true}]});
X('russian','Seated medicine ball twist','Core',['medball'],[1,2,1],3,'10 per side',
 'Sit on the floor with your knees bent and feet flat, leaning back slightly. Holding the ball in front of your chest, rotate your torso to tap it beside one hip, then the other.',
 'Keep your back long, not rounded. Move slowly.',
 {w:['ball'],eq:[matBox],v2:'top',p:[{P:[0,4,0],lean:-35,yaw:40,hp:35,F:[0,26,9],kp:[0.1,1,0.4],HR:[21,15,5],HL:[15,15,9],ep:[0.3,-0.8,-0.2]},{P:[0,4,0],lean:-35,yaw:-40,hp:35,F:[0,26,9],kp:[0.1,1,0.4],HR:[-15,15,9],HL:[-21,15,5],ep:[0.3,-0.8,-0.2]}]});
X('legraise','Bench leg raise','Core',['bench'],[1,2,1],3,'8',
 'Lie on the bench and hold the sides behind your head. With your legs straight, lift them toward the ceiling, then lower them slowly without letting your back arch.',
 'Bend your knees if your lower back arches. Move slowly.',
 {eq:[benchBox(-50,14,17)],v2:'front',p:[{...LIE_B,A:[-85,20,-90,10],T:[95,3,95,3],fit:false},{...LIE_B,A:[-85,20,-90,10],T:[160,3,165,3],fit:false}]});

/* ---- CARRY ---- */
const WALK0={TL:[18,0,5,0],TR:[-14,0,-18,0]}, WALK1={TL:[-14,0,-18,0],TR:[18,0,5,0]};
X('carry','Farmer carry','Carry',['kettlebell','dumbbell'],[1,1,1],3,'30-40 sec',
 'Hold a heavy weight in each hand at your sides. Stand tall with shoulders down and back, ribs stacked over hips, and walk slowly in a loop for the time shown.',
 'Grip, posture and core with no joint stress.',
 {w:['L','R'],v2:'front',p:[{...WALK0,A:[2,8,2,6]},{...WALK1,A:[2,8,2,6]}]});
X('suitcase','Suitcase carry','Carry',['kettlebell','dumbbell'],[1,1,1],3,'30 sec per side',
 'Hold one heavy weight in one hand and walk slowly, staying completely upright. Do not lean away from the weight. Switch hands.',
 'Trains your core to resist leaning. Keep your shoulders level.',
 {w:['R'],v2:'front',p:[{...WALK0,A:[2,8,2,6],sway:-2},{...WALK1,A:[2,8,2,6],sway:-2}]});
