/* ===== HealthForge: stretch library, expansion pack =====
   Same format as 02c: ST(id, name, area, equipment, seconds, cue, figure) */

/* ---- NECK AND SHOULDERS ---- */
ST('levator','Levator scapulae stretch','Neck and shoulders',['bodyweight'],40,
 'Sit tall. Turn your nose toward one armpit, then gently tip your chin down. Rest that hand lightly on the back of your head and let its weight deepen the stretch along the back-side of your neck. Switch sides halfway.',
 {eq:chairBoxes,v2:'front',p:[{...SIT,A:[8,6,8,4]},{...SIT,ht:35,hp:28,hy:-1,shyL:-2,AR:[170,25,215,-50],AL:[8,12,8,6]}]});
ST('neckflex','Neck forward tilt','Neck and shoulders',['bodyweight'],30,
 'Sit tall with your shoulders relaxed. Let your chin drop slowly toward your chest and feel the stretch along the back of your neck. Breathe, then lift back up.',
 {eq:chairBoxes,v2:'top',p:[{...SIT,A:[8,6,8,4]},{...SIT,hp:55,hy:-2,hz:3,A:[8,6,8,4]}]});
ST('shrugdrop','Shoulder shrug and drop','Neck and shoulders',['bodyweight'],30,
 'Lift both shoulders up toward your ears as you inhale, hold for a second, then let them drop completely as you exhale with a sigh. Repeat slowly.',
 {v2:'front',p:[{A:[3,8,3,6],shy:0},{A:[3,8,3,6],shy:4}]});
ST('wristflex','Wrist flexor stretch','Chest and arms',['bodyweight'],40,
 'Reach one arm straight out in front with the palm facing away. Use your other hand to gently pull the fingers back toward you. Keep the elbow straight. Switch arms halfway. Good after long mouse and keyboard days.',
 {v2:'top',p:[{AR:[88,6,88,4],AL:[3,8,3,6]},{AR:[88,6,88,4],HL:[11,59.6,22.5],epL:[-0.3,-0.8,0.3]}]});
ST('behindback','Behind-the-back chest stretch','Chest and arms',['bodyweight'],40,
 'Stand tall and reach both arms behind you, clasping your hands or holding a towel. Lift your chest and gently draw your shoulder blades together. Breathe slowly.',
 {v2:'front',p:[{A:[3,8,3,6]},{lean:-5,A:[-35,8,-50,5]}]});
ST('openarm','Open-arm chest stretch','Chest and arms',['bodyweight'],35,
 'Start with your arms hugging in front of you. Open them wide and slightly behind you as if opening a big door, lifting your chest. Return and repeat slowly.',
 {v2:'front',p:[{A:[90,-60,60,-60]},{A:[-15,88,-15,88]}]});
ST('seatchest','Seated chest opener','Chest and arms',['bodyweight'],40,
 'Sit tall near the front of the chair. Reach both arms behind you and clasp your hands or hold the chair back. Lift your chest and draw your shoulder blades together.',
 {eq:chairBoxes,v2:'front',p:[{...SIT,A:[8,6,8,4]},{...SIT,lean:-8,hp:-6,A:[-40,10,-45,6]}]});

/* ---- BACK AND SPINE ---- */
ST('catcow','Cat-cow','Back and spine',['bodyweight'],45,
 'On hands and knees (pad your knees with a folded mat). Inhale and let your belly sink as you look forward, then exhale and round your back toward the ceiling, tucking your chin. Move slowly between the two.',
 {eq:MAT,v2:'top',tf:1,toe:-1,p:[{...QUAD,lean:82,hp:-30},{...QUAD,lean:94,hp:30}]});
ST('seatcatcow','Seated cat-cow','Back and spine',['bodyweight'],45,
 'Sit tall with your hands on your knees. Inhale, lift your chest and look slightly up. Exhale, round your back and tuck your chin. Move slowly between the two.',
 {eq:chairBoxes,v2:'front',p:[{...SIT,lean:-6,hp:-25,H:[21,15,9],ep:[1,-0.2,-0.2]},{...SIT,lean:14,hp:30,H:[21,15,9],ep:[1,-0.2,-0.2]}]});
ST('seatside','Seated side bend','Back and spine',['bodyweight'],40,
 'Sit tall with one arm reaching overhead. Lean gently sideways over the opposite hip until you feel a stretch along your side. Keep both hips on the chair. Switch sides halfway.',
 {eq:chairBoxes,v2:'front',p:[{...SIT,A:[8,6,8,4]},{...SIT,sway:14,ht:6,AL:OVH,AR:[8,6,8,4]}]});
ST('fold','Standing forward fold','Back and spine',['bodyweight'],40,
 'Stand with your feet hip-width apart and your knees softly bent. Hinge forward from the hips and let your head and arms hang heavy. Sway gently and breathe. Roll up slowly.',
 {v2:'front',p:[{P:[0,35.4,0],F:[0,0,9],A:[3,8,3,6]},{P:[0,28,-10],lean:100,hp:50,F:[0,0,9],kp:[0.15,0,0.6],A:[0,6,0,4]}]});
ST('chairfold','Seated forward fold (chair)','Back and spine',['bodyweight'],40,
 'Sit near the front of the chair with your feet flat. Fold forward from the hips and let your arms hang down toward the floor. Relax your neck and breathe. Roll up slowly.',
 {eq:chairBoxes,v2:'front',p:[{...SIT,A:[8,6,8,4]},{P:[0,19.5,0],lean:65,hp:25,F:[0,17,9],A:[0,8,0,4]}]});
ST('benchlat','Bench lat stretch','Back and spine',['bench'],40,
 'Stand facing the bench with your feet hip-width apart. Rest your hands on the bench, hinge at the hips and let your chest sink toward the floor. Feel the stretch along your sides and under your arms.',
 {eq:[benchBox(20,50,17)],v2:'front',p:[{P:[0,35,-2],lean:12,F:[0,0,6],H:[18.5,32,9]},{P:[0,30,-15],lean:80,hp:-40,F:[0,0,6],H:[18.5,28,9]}]});
ST('lyingfull','Lying full-body reach','Back and spine',['bodyweight'],40,
 'Lie flat on your back with your legs long. Reach your arms overhead and lengthen through your fingertips and heels at the same time. Hold, breathe, then release.',
 {eq:MAT,v2:'top',p:[{...LIE,A:[88,12,88,8],T:[90,2,90,2],fit:true},{...LIE,A:[-100,3,-100,3],T:[90,2,90,2],fit:true}]});

/* ---- HIPS ---- */
ST('hfk','Half-kneeling hip flexor stretch','Hips',['bodyweight'],50,
 'Kneel on a folded mat with one foot forward. Tuck your tailbone under and shift your hips gently forward until you feel the front of the back hip open. Raise the arm on the kneeling side overhead. Switch sides halfway.',
 {eq:MAT,v2:'front',p:[{P:[0,18.5,0],FR:[9,0,17],FL:[-9,2,-18],kpL:[-0.1,-1,0.3],A:[0,35,30,-55]},{P:[0,18.5,4],lean:-4,FR:[9,0,17],FL:[-9,2,-18],kpL:[-0.1,-1,0.3],AL:[175,10,175,5],AR:[0,35,30,-55]}]});
ST('deepsq','Deep squat hold','Hips',['bodyweight'],45,
 'Stand with your feet wider than your shoulders and toes turned out. Sink into a deep squat with your hands together at your chest, and gently press your knees out with your elbows. Hold onto a bench or doorframe for balance if needed.',
 {v2:'front',p:[{P:[0,32.5,0],lean:8,F:[0,0,19],kp:[0.5,0,0.6],A:GOBLET},{P:[0,19,0],lean:14,F:[0,0,19],kp:[0.8,0,0.5],A:GOBLET}]});
ST('kneehug','Double knee hug','Hips',['bodyweight'],45,
 'Lie on your back and hug both knees toward your chest. Rock gently side to side if it feels good. Keep your head relaxed on the floor.',
 {eq:MAT,v2:'top',p:[{...LIE,A:[88,12,88,8],TL:[180,4,90,0],TR:[180,4,90,0],fit:false},{...LIE,TL:[205,3,120,0],TR:[205,3,120,0],HR:[7.2,23.4,0.6],HL:[-7.2,23.4,0.6],ep:[0.8,0.2,0],fit:false}]});

/* ---- LEGS ---- */
ST('seatham','Seated hamstring stretch (chair)','Legs',['bodyweight'],45,
 'Sit near the front of the chair. Straighten one leg with the heel on the floor and toes up. Hinge forward from the hips with a long back until you feel the back of your thigh. Switch legs halfway.',
 {eq:chairBoxes,v2:'front',p:[{...SIT,A:[8,6,8,4]},{P:[0,19.5,0],lean:30,hp:-15,FR:[9,3,30],FL:[-9,0,17],A:[75,6,70,4]}]});
ST('bentcalf','Bent-knee calf stretch','Legs',['bodyweight'],40,
 'Face a wall with your hands on it. Step one foot back and bend both knees slightly, keeping the back heel down. This targets the lower calf and Achilles. Switch legs halfway.',
 {eq:[wallBox(31)],v2:'front',p:[{P:[0,33,-2],lean:5,FR:[6,0,10],FL:[-6,0,-14],H:[50,30,9]},{P:[0,29,2],lean:18,FR:[6,0,10],FL:[-6,0,-14],H:[50,30,9]}]});
