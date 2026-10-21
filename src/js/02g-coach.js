/* ===== HealthForge: pre-meditation coaching prompts =====
   One is chosen at random before each session. Tone: calm, plain, no breathing drills. */
const COACH={
 general:[
  'You do not need to feel calm to begin. Begin as you are, and let the session meet you there.',
  'For the next few minutes nothing needs to be solved. The list of things to fix will still be there afterwards.',
  'The aim is not an empty mind. The aim is to notice where your attention has gone, and to come back without a lecture.',
  'Wandering is part of the practice, not a failure of it. Each time you notice, you have just done the exercise.',
  'Let this be the one place today where you are not performing for anyone.',
  'Nothing to achieve here. Just a few minutes of being where you actually are.',
  'Treat whatever shows up, restless or dull or busy, as weather passing through, not as a verdict on you.',
  'You are allowed to take up a little space and a little time for yourself. This is a legitimate use of both.',
  'Expect your mind to be loud. A loud mind is a normal starting point, and it often quiets without being told to.',
  'Soften your jaw, your forehead and your hands. You were probably holding them without noticing.',
  'Let your attention rest on whatever is simplest to feel: the weight of your body, the contact with the chair or floor.',
  'If you catch yourself judging how this is going, treat that as one more thing to notice, and let it pass.',
  'Short sits count. Three honest minutes are worth more than twenty you dread.',
  'Decide now that you will not grade this session. Whatever happens is the right amount of data.',
  'Consistency beats intensity. You are just showing up, and that is most of the skill.',
  'Let go of the idea of doing it correctly. There is mainly noticing, and noticing again.',
  'You can leave your problems exactly where they are. They will not go anywhere in a few minutes.',
  'Be curious rather than strict. What is it actually like in here right now?',
  'Let your shoulders drop an inch. Let your eyes go soft or close, whichever feels easier.',
  'There is nothing to fix about this moment. Only something to notice.',
  'Allow the session to be plain. Not special, not peaceful on demand, just attended to.',
  'You are practising returning. Every return, however small, strengthens it.',
  'If a thought feels urgent, you can say to yourself, "later", and set it down gently.',
  'Give your attention one gentle job and let everything else be background.',
  'Sit as if there is nowhere else you need to be, even though you are about to go there.'
 ],
 posture:[
  'Find a position you could hold without effort: spine tall but not stiff, hands resting, weight settled.',
  'If sitting is uncomfortable, lie down or lean back. Comfort supports attention far better than a perfect pose.',
  'Let your feet be flat and heavy on the floor. Notice that the floor is holding you up without being asked.',
  'Check your neck and shoulders, which carry a lot of your work day. Let them hang rather than hold.',
  'Rest your hands somewhere that needs no effort, on your thighs or in your lap, palms up or down as you like.',
  'Lengthen up through the top of your head once, then let the rest of your body be loose beneath it.',
  'If your back or hips are stiff today, adjust now and again during the session. Moving mindfully is allowed.',
  'Unclench your teeth and let your tongue rest. Small releases like this change the whole body.',
  'Let your belly be soft. There is no need to hold it in while you sit.',
  'Let your eyes rest on a spot on the floor, or close them, whichever feels steadier.',
  'Settle your weight evenly, so you are not leaning into one hip. Then stop adjusting.',
  'Let your arms feel heavy. Let gravity do some of the work of holding you.'
 ],
 settle:[
  'You are arriving from something. Give yourself a moment to catch up with your own body.',
  'This is a reset between one thing and the next. Notice what you are carrying in from the last one.',
  'Right now you only need to land. Feel where your body meets the chair, floor or bed.',
  'Let the last meeting finish here. You can pick up its loose ends after the bell.',
  'Notice the pace you were moving at, and let it slow by a notch. No more than that is needed.',
  'There is no technique in this one. Just feel your body arrive where you are sitting.',
  'Your attention has been pulled in many directions today. Let it gather in one place for a few minutes.',
  'Notice your hands and your face. These show tension first. Let them soften if they will.',
  'Imagine setting an invisible bag down by your feet. You can pick it up again later.',
  'Take stock without fixing: tired, tense, fine, flat, whatever it is. Just name the weather.',
  'The task here is small: to be in the room you are in, and not in the one you just left.',
  'If your mind is still in the last conversation, that is fine. Notice it replaying, and come back to your body.',
  'You have three minutes. Spend them on yourself with no productivity attached.',
  'Let the transition be gradual. You do not need to switch from busy to calm in a single step.',
  'Check how your body is doing before you check on anyone else today.',
  'Short and ordinary is the point. Land, notice, and leave a little steadier.',
  'Let the room come into focus through sound and temperature before you start.',
  'Allow a pause between demands. This is the pause.'
 ],
 sound:[
  'Sounds are always happening. Today they are the anchor: you do not have to make anything up.',
  'Let sounds arrive without naming them. Hear the quality, near or far, steady or sudden.',
  'You do not need silence for this. Traffic, a fan or a distant voice works perfectly well.',
  'Imagine your ears as open windows. Sounds come in, and you do not have to chase any of them.',
  'When you notice thinking about a sound, come back to simply hearing it.',
  'Listen to the furthest sound you can find, then the nearest, then the space around both.',
  'Notice the gaps between sounds. They are part of what you are listening to.',
  'There is no good or bad sound here. Irritation is just another thing to hear and let go.',
  'If a sound annoys you, try listening to it as pure texture for a few moments.',
  'Let your hearing widen until it holds the whole room at once.',
  'Sounds rise, hold and fade. Watch one do that without adding a story to it.',
  'Your attention can float on sound the way a leaf floats on water. No effort needed.',
  'If you hear your own thoughts, treat them as one more sound passing through.',
  'Let the sounds of the day be allowed to exist. You do not need to correct the environment.',
  'Hear as if you were hearing for the first time, with no names, only vibration and tone.',
  'Start with the loudest sound, then see what is quietly underneath it.'
 ],
 body:[
  'This is a scan, not a repair job. You are only gathering information about your body.',
  'Expect to find tight areas. Finding them is the point, and you do not need to force them to change.',
  'Approach each area with curiosity, the way you would examine something interesting rather than broken.',
  'If a spot feels sore or stiff, try resting attention near it rather than pushing into it.',
  'Your back, hips, knees and shoulders carry the most. Give them a moment of plain attention.',
  'Sensation might be subtle. Warmth, pressure, tingling, or nothing at all are all valid findings.',
  'If your attention slides off, bring it back to the last place you remember and carry on.',
  'Move slowly. There is no clock on any single body part.',
  'Imagine letting each area be a little heavier into the surface under you.',
  'Where your body is quiet, notice that too. Not everything is a problem.',
  'Stiffness is information, not an enemy. Listen to it for a moment before anything else.',
  'Let go of any sense that you should feel more. Feel whatever is actually here.',
  'Pay attention to the places you seldom think about: the backs of your knees, your scalp, your ears.',
  'Let the scan be thorough but unhurried. There is no prize for finishing early.',
  'If you meet discomfort, let it be one sensation among many rather than the whole story.',
  'Your body has been doing a lot for you today. Start by acknowledging that.'
 ],
 offload:[
  'You are about to hand the workday over. Decide that it has earned a rest from you.',
  'Name three things from today that are still running in the background. Then set each one down.',
  'Managing people takes a lot out of you. This is where you take that load off.',
  'Whatever went unfinished will be waiting in the morning. Tonight it can wait there without you.',
  'Let go of the conversations you replayed in your head today. They are over, and you can stop rehearsing them.',
  'Picture a shelf by the door. Put today on it, and leave it there until you are back.',
  'You do not need to decide anything about work right now. All the decisions are paused until tomorrow.',
  'Notice how much of the day you are still holding in your shoulders and jaw. Let that go first.',
  'Work was one part of you. You are allowed to be a person who is not at work any more.',
  'If a worry about your team shows up, thank it, and tell it that you will deal with it in daylight.',
  'This is not avoiding work. It is making sure you are fit to do it well tomorrow.',
  'Let the evening begin on purpose. This is the threshold between the two.',
  'Notice anything you feel about today that you have not had time to feel. It does not need solving, only room.',
  'You did what you could with what you had today. That is a complete answer.',
  'Imagine unclenching around the day, one grip at a time.',
  'You have been responsible all day. For the next few minutes you are responsible for nothing.',
  'Let the people you manage go quiet in your head for a while. They are fine without your attention for now.',
  'The evening is yours. Give the first few minutes of it some quiet before you decide what to eat or do.'
 ],
 urge:[
  'An urge is a wave. It rises, peaks and falls, usually within a few minutes. Your job is to stay on the surface.',
  'You are not here to fight the craving. You are here to watch it, which is a different thing entirely.',
  'Notice where in your body the urge lives. Chest, throat, stomach, hands. Describe it without judgement.',
  'You do not have to obey this feeling and you do not have to argue with it. You can simply see it.',
  'Ask whether you are hungry, stressed, tired or just bored. Naming it takes away some of its pull.',
  'Cravings feel permanent from the inside. They are not. Wait and watch it change.',
  'Treat the urge like a visitor knocking. You can hear it without opening the door.',
  'If you still want the food at the end, that is information, not failure. The point is that it will be a choice.',
  'Notice the thoughts that come with the craving, the bargaining and the permission-giving. Just watch them pass.',
  'Stress eating is a way of soothing. You can stay with the stress for a few minutes and see what it is really about.',
  'Soften the muscles that tense around the urge. Often the tension is as loud as the craving.',
  'Whatever you decide afterwards, these minutes of staying put count.',
  'The urge is strongest at the start. Staying with it is hard for about as long as it feels hard, and then it eases.',
  'Be kind to yourself about the wanting. Wanting is human, and it is not a moral failing.',
  'Look at the craving as if it were an object on a table. What shape, what colour, how big, how strong?',
  'You are teaching your nervous system that discomfort can pass without food. That is a real skill.',
  'Notice how the feeling changes from minute to minute. It never stays exactly the same.',
  'If it gets strong, keep your attention on the physical sensation rather than the story about it.'
 ],
 open:[
  'This is a longer sit with no particular anchor. Let attention rest on whatever is most obvious.',
  'Let go of any technique and leave awareness open, like a wide field with no centre.',
  'Allow thoughts, sounds, sensations and feelings to arise and pass. You are the space they pass through.',
  'There is nothing to hold onto and nothing to push away. Simply be aware that you are aware.',
  'If you drift into a story, notice that you drifted, and return to what is here now. Repeat as often as needed.',
  'Long sits have a rhythm: restless first, then flatter, sometimes quieter. Let it go through its stages.',
  'Notice the moment when one thought becomes another. That gap is where this practice happens.',
  'Rest in the background of experience rather than reaching for the foreground.',
  'You do not have to be interesting to yourself. Plain awareness is enough.',
  'Boredom is a common visitor on longer sits. Treat it as something to observe, not something to fix.',
  'Let your attention be wide and light, noticing what is loudest, then what is quietest, without choosing.',
  'If you find yourself planning, treat planning as just another event in the field and let it go.',
  'Allow the whole experience to be as it is, including the parts you would prefer to edit.',
  'With a longer sit, expect to get distracted many times. Counting the returns is not necessary. Simply return.',
  'There is no destination here. The sit is the whole thing.',
  'Let go of the effort to be mindful. Mindfulness is what happens when the effort relaxes.'
 ],
 low:[
  'Low energy day. Today the goal is simply to sit and be here. That fully counts.',
  'You do not need to feel better by the end. Resting your attention is already a kind of rest.',
  'If you feel flat or heavy, keep this very simple. Let the chair or bed do most of the holding.',
  'Tired is allowed. Let your body be as heavy as it wants to be, and just keep a little awareness on.',
  'On low days, a short, kind session is the right session. Do exactly as much as is easy.',
  'You can drift a little today. Come back gently when you notice. Do not push against sleepiness.',
  'Lower the bar all the way. Showing up is the whole task today.',
  'Notice how tiredness actually feels in your body. It is a sensation like any other, and it will shift.',
  'Treat yourself the way you would treat a good friend who had a hard week.',
  'Nothing is required of you in the next few minutes except to be here.',
  'Even a very scattered session does something useful. You are keeping the habit alive.',
  'Let go of any plan for how the rest of the day must go, at least until the bell.'
 ],
 evening:[
  'The workday is done. Let this be the start of your evening, not another task.',
  'Evenings can be the hard part. A few quiet minutes now makes the later hours easier to choose well.',
  'Notice how you feel before you reach for anything. That information is useful later tonight.',
  'You do not have to earn a quiet evening. You can begin it right now.',
  'Check in with how hungry you really are, and how much of tonight\'s pull is tiredness or stress.',
  'The day has been long. Let your body know that the demanding part is over.',
  'Let this session be the line between work and rest, drawn on purpose.',
  'If the evening feels restless already, that is useful to know. Just notice it.',
  'Give the next few minutes to yourself before you decide anything about dinner or screens.',
  'Notice the shift in light and sound that comes with the evening, and let it settle you.',
  'The day does not need a verdict tonight. It can just be over.',
  'You have more choices in the evening when you are not running on empty. Rest first.'
 ]
};
const COACH_FOR={settle:'settle',sound:'sound',bodyscan5:'body',offload:'offload',urge:'urge',open:'open'};
const COACH_SIZE=Object.values(COACH).reduce((a,l)=>a+l.length,0);
let COACH_CUR='';
/* Choose a prompt at random. Pool = general + posture + this meditation's own set (+ low-energy / evening sets when they fit).
   Recently shown prompts are strongly down-weighted so you rarely see a repeat. */
function coachPick(mid){
  const hr=new Date().getHours(); const energy=(typeof energyOf==='function'&&S&&S.profile)?energyOf(TODAY()):0;
  const own=COACH[COACH_FOR[mid]]||[]; let pool=[...COACH.general,...COACH.posture,...own,...own];  // own prompts count double
  if(energy===1) pool=pool.concat(COACH.low,COACH.low); if(hr>=17) pool=pool.concat(COACH.evening);
  const recent=new Set((S.meta&&S.meta.recentCoach)||[]);
  let p=pool.filter(x=>!recent.has(x)); if(!p.length) p=pool;
  const cur=p.filter(x=>x!==COACH_CUR); const pick=(cur.length?cur:p)[Math.floor(Math.random()*(cur.length?cur:p).length)];
  COACH_CUR=pick; if(S.meta){ S.meta.recentCoach=[pick,...((S.meta.recentCoach||[]).filter(x=>x!==pick))].slice(0,Math.min(60,Math.floor(pool.length/2))); save(); }
  return pick;
}
