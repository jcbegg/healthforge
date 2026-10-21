/* ===== HealthForge: stretch and mobility library =====
   ST(id, name, area, equipment, seconds, cue, figure) */
const AREAS=['Neck and shoulders','Chest and arms','Back and spine','Hips','Legs'];
function ST(id,name,area,eq,sec,cue,fig){ STRETCHES[id]={id,name,area,eq,sec,cue,fig:id}; defFig(id,fig); }
const MAT=[matBox];
const BENCH_STD=(z0,z1,h=17)=>benchBox(z0,z1,h);
const QUAD={P:[0,20,0],lean:90,HL:[-9,1,24],HR:[9,1,24],FL:[-7,2,-17],FR:[7,2,-17],kp:[0.1,-1,0.6],ep:[0.1,-0.5,-0.5],toe:-1};
const SUP_F={...LIE,A:[0,60,0,40],F:FEET_UP,kp:KNEE_UP};

/* ---- NECK AND SHOULDERS ---- */
ST('neck','Neck side tilt','Neck and shoulders',['bodyweight'],40,
 'Sit tall. Let one ear drop toward your shoulder, with your hand resting lightly on your thigh. Keep the opposite shoulder low. Switch sides halfway.',
 {eq:chairBoxes,v2:'front',p:[{...SIT,A:[8,6,8,4]},{...SIT,ht:42,hy:-1.5,A:[8,6,8,4]}]});
ST('chin','Chin tuck','Neck and shoulders',['bodyweight'],30,
 'Sit tall and look straight ahead. Glide your chin straight back, as if making a double chin, without tilting your head. Hold, release, repeat.',
 {eq:chairBoxes,v2:'top',p:[{...SIT,A:[8,6,8,4],hz:3},{...SIT,A:[8,6,8,4],hz:-2.5}]});
ST('uptrap','Upper trap stretch','Neck and shoulders',['bodyweight'],40,
 'Sit tall. Tilt your ear toward one shoulder and rest that hand lightly on your head, letting its weight deepen the stretch. Keep the other shoulder down. Switch sides halfway.',
 {eq:chairBoxes,v2:'front',p:[{...SIT,A:[8,6,8,4]},{...SIT,ht:42,hy:-1.5,shyL:-2,AR:[170,25,215,-50],AL:[8,12,8,6]}]});
ST('crossbody','Cross-body shoulder stretch','Neck and shoulders',['bodyweight'],40,
 'Bring one arm straight across your chest and hold it near the elbow with your other arm. Keep your shoulders down and relaxed. Switch arms halfway.',
 {v2:'front',p:[{A:[3,8,3,6]},{AR:[90,-70,90,-70],AL:[60,10,130,-70]}]});
ST('angel','Wall angel','Neck and shoulders',['bodyweight'],45,
 'Stand with your back near a wall, elbows bent like goalposts. Slide your arms up and down the wall like a slow snow angel, only as far as you can keep your arms touching it comfortably.',
 {eq:[wallBox(-9)],v2:'front',p:[{A:[0,85,180,0]},{A:[180,25,180,25]}]});
ST('tricepstr','Overhead triceps stretch','Neck and shoulders',['bodyweight'],40,
 'Raise one arm and bend the elbow so your hand drops behind your head. Use your other hand to gently press that elbow back and in. Switch arms halfway.',
 {v2:'front',p:[{A:[3,8,3,6]},{AR:[180,15,-30,-35],AL:[170,-50,160,-60]}]});

/* ---- CHEST AND ARMS ---- */
ST('chest','Doorway chest opener','Chest and arms',['bodyweight'],40,
 'Stand in a doorway with your forearms on the frame, elbows bent at 90 degrees. Step one foot through and lean gently until you feel the front of your shoulders and chest open.',
 {eq:[bx(20,24,0,90,-3,3),bx(-24,-20,0,90,-3,3)],v2:'front',p:[{P:[0,36,-2],lean:0,A:[0,85,180,0],H:[57,0,21]},{P:[0,36,8],lean:6,TL:[-14,0,-18,0],TR:[16,0,0,0],H:[57,0,21]}]});
ST('suptwist','Supine knee drop twist','Back and spine',['bodyweight'],45,
 'Lie on your back with arms out to the sides and knees bent. Let both knees fall slowly to one side while your shoulders stay on the floor. Switch sides halfway.',
 {eq:MAT,v2:'top',p:[{...LIE,fit:false,A:[0,88,0,88],F:FEET_UP,kp:KNEE_UP},{...LIE,fit:false,A:[0,88,0,88],TR:[175,-75,60,0],TL:[175,75,60,0]}]});

/* ---- BACK AND SPINE ---- */
ST('twist','Seated thoracic twist','Back and spine',['bodyweight'],40,
 'Sit tall with your arms crossed over your chest. Rotate your upper body to one side, keeping your hips square to the chair. Switch sides halfway.',
 {eq:chairBoxes,v2:'top',p:[{...SIT,A:[20,5,150,-70]},{...SIT,yaw:45,A:[20,5,150,-70]}]});
ST('thoracic','Seated upper-back extension','Back and spine',['bodyweight'],40,
 'Sit tall with your hands behind your head and elbows wide. Gently lean back over the top of the chair, lifting your chest toward the ceiling. Keep your neck supported by your hands.',
 {eq:chairBoxes,v2:'front',p:[{...SIT,H:[51,-5,3.5],ep:[1,0,-0.2]},{...SIT,lean:-20,hp:-8,H:[48,-14,3.5],ep:[1,0,-0.2]}]});
ST('backext','Standing back extension','Back and spine',['bodyweight'],30,
 'Stand with your hands on your hips. Gently lean back a few inches, pressing your hips slightly forward. Return to tall and repeat slowly.',
 {v2:'front',p:[{A:[0,35,30,-55]},{lean:-14,hp:14,P:[0,36,3],A:[0,35,30,-55]}]});
ST('child',"Child's pose",'Back and spine',['bodyweight'],45,
 'Kneel on a folded mat. Sit your hips back toward your heels and reach your arms long in front of you, letting your chest sink toward the floor. Skip this if kneeling bothers your knees.',
 {eq:MAT,v2:'top',tf:1,toe:-1,p:[{...QUAD},{P:[0,9,-16],N:[0,12,7],FL:[-7,2,-18],FR:[7,2,-18],kp:[0.1,0.3,1],H:[1.5,31,9],ep:[0.1,-0.5,-0.5],toe:-1}]});
ST('lat','Wall lat stretch','Back and spine',['bodyweight'],40,
 'Face a wall with your hands on it at about shoulder height. Walk your feet back, hinge at the hips and let your chest sink toward the floor. Feel the long stretch along your sides and under your arms.',
 {eq:[wallBox(31)],v2:'front',p:[{P:[0,35,-2],lean:12,F:[0,0,6],H:[55,28,9]},{P:[0,30,-17],lean:80,hp:-40,F:[0,0,6],H:[50,28,9]}]});
ST('sphinx','Sphinx back extension','Back and spine',['bodyweight'],30,
 'Lie on your stomach. Prop yourself up on your forearms with your elbows under your shoulders and gently lift your chest. Relax your lower back and breathe. Stop if you feel pinching.',
 {eq:MAT,v2:'top',tf:1,nofoot:true,p:[{P:[0,4,0],N:[0,4.4,24],H:[1.5,32,5],ep:[0,1,-0.3],T:[-90,3,-90,3],fit:false},{P:[0,4,0],N:[0,14.8,21.5],hp:-10,H:[1.5,32,5],ep:[0,-1,0],T:[-90,3,-90,3],fit:false}]});
ST('reach','Overhead reach and side bend','Back and spine',['bodyweight'],40,
 'Reach both arms up and grow tall, then lean gently to one side and the other. Slow and smooth, keeping your hips still.',
 {v2:'front',p:[{A:[180,12,180,0]},{sway:14,ht:6,A:[180,12,180,0]}]});

/* ---- HIPS ---- */
ST('figure4','Figure-four hip stretch (lying)','Hips',['bodyweight'],60,
 'Lie on your back with your knees bent. Cross one ankle over the opposite knee, then draw the lower leg toward your chest. Switch sides halfway.',
 {eq:MAT,v2:'top',p:[{...LIE,fit:false,A:[88,12,88,8],FL:[-9,0,22],FR:[9,0,22],kp:KNEE_UP},{...LIE,fit:false,A:[88,12,88,8],TL:[190,0,120,0],FR:[-4,21,-3],kpR:[1,0.3,0.2]}]});
ST('seatfig4','Seated figure-four','Hips',['bodyweight'],50,
 'Sit tall in a chair. Cross one ankle over the opposite knee. Keep your back long and hinge forward slightly from the hips until you feel the stretch in your hip. Switch sides halfway.',
 {eq:chairBoxes,v2:'front',p:[{...SIT,A:[8,6,8,4],kp:[0.15,0,1]},{P:[0,19.5,0],lean:22,FL:[-9,0,17],FR:[-4,21,15],kpR:[1,0.3,0.3],A:[8,6,8,4],hp:-12}]});
ST('kneechest','Knee to chest','Hips',['bodyweight'],45,
 'Lie on your back. Hug one knee toward your chest while the other leg rests long on the floor. Switch sides halfway.',
 {eq:MAT,v2:'top',p:[{...LIE,A:[88,12,88,8],T:[91,3,91,3],fit:true},{...LIE,A:[88,12,88,8],TL:[91,3,91,3],TR:[200,3,130,0],HR:[6,19,4],ep:[0.3,-0.2,-0.2],fit:true}]});
ST('hipflexor','Standing hip flexor stretch','Hips',['bodyweight'],50,
 'Step one foot back into a split stance. Tuck your tailbone under, shift your hips slightly forward and reach the arm on the back-leg side overhead. No deep knee bend needed. Switch sides halfway.',
 {v2:'front',p:[{P:[0,31,0],F:[0,0,0],FR:[6,0,16],FL:[-6,0,-16],A:[3,8,3,6]},{P:[0,29,5],lean:-4,FR:[6,0,16],FL:[-6,3,-16],AL:[175,10,175,5],AR:[3,8,3,6]}]});
ST('butterfly','Butterfly groin stretch','Hips',['bodyweight'],45,
 'Sit on the floor with the soles of your feet together and knees falling out. Sit tall, then hinge forward from the hips, resting your hands on your feet or shins. Keep your back long.',
 {eq:MAT,v2:'front',p:[{P:[0,4,0],F:[1,22,3],kp:[1.2,0.2,0.1],A:[40,20,70,-20]},{P:[0,4,0],lean:38,hp:-25,F:[1,22,3],kp:[1.2,0.2,0.1],H:[2,23,3],ep:[0.3,-0.2,0.2]}]});

/* ---- LEGS ---- */
ST('hamstring','Bench hamstring stretch','Legs',['bench'],50,
 'Rest one heel on the bench with a soft knee. Hinge forward from the hips with a long back, reaching toward your shin. Switch legs halfway.',
 {eq:[benchBox(8,42,17)],v2:'front',p:[{P:[0,35.5,-1],F:[0,0,9],FR:[9,17.8,24],FL:[-9,0,0],A:[3,8,3,6]},{P:[0,35.5,-1],lean:38,hp:-20,FR:[9,17.8,24],FL:[-9,0,0],A:[40,6,30,4]}]});
ST('lyingham','Lying hamstring stretch','Legs',['bodyweight'],45,
 'Lie on your back with one foot flat. Raise the other leg and hold behind your thigh, gently straightening your knee until you feel a stretch. Switch legs halfway.',
 {eq:MAT,v2:'top',p:[{...LIE,fit:false,A:[88,12,88,8],FL:[-9,0,22],FR:[9,0,22],kp:KNEE_UP},{...LIE,fit:false,A:[88,12,88,8],FL:[-9,0,22],kpL:[-0.1,1,0.25],TR:[172,2,172,2],HR:[4,11.5,1],HL:[-4,11.5,1],ep:[0.3,-0.2,-0.2]}]});
ST('quad','Standing quad stretch','Legs',['bench'],40,
 'Hold a wall or bench for balance. Bend one knee and bring your heel toward your glute, holding your ankle with your hand. Keep your knees close together and your hips tucked. Switch legs halfway.',
 {eq:[benchBox(22,48,17)],v2:'front',p:[{AL:[70,10,80,5],AR:[3,8,3,6]},{AL:[70,10,80,5],TR:[-8,0,-150,0],HR:[6,34.8,-11],ep:[0.2,-0.4,-0.2]}]});
ST('calf','Wall calf stretch','Legs',['bodyweight'],40,
 'Face a wall with your hands on it. Step one foot back, keeping that heel on the floor and leg straight. Lean forward by bending your front knee until you feel it in your calf. Switch legs halfway.',
 {eq:[wallBox(31)],v2:'front',p:[{P:[0,33,-2],lean:5,FR:[6,0,10],FL:[-6,0,-14],H:[50,30,9]},{P:[0,31,3],lean:20,FR:[6,0,10],FL:[-6,0,-14],H:[50,30,9]}]});
ST('sitfold','Seated forward fold','Legs',['bodyweight'],45,
 'Sit on the floor with your legs straight out in front of you, knees soft. Hinge forward from the hips, reaching toward your shins or feet. Keep your back long rather than rounded.',
 {eq:MAT,v2:'top',p:[{P:[0,4,0],T:[90,2,90,2],A:[40,10,60,5]},{P:[0,4,0],lean:62,hp:-35,T:[90,2,90,2],A:[75,6,70,4]}]});
