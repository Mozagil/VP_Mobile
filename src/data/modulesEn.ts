// English content for modules.ts, keyed by module id.
// `category`, `level` and `type` stay canonical in modules.ts and are translated
// for display via moduleCategoryLabel / levelLabel.

export type ModuleEn = {
  title: string;
  desc: string;
  duration?: string;
  exercises: string[];
  tips: string[];
};

export const MODULE_EN: Record<number, ModuleEn> = {
  // ── Development modules ────────────────────────────────────────────────────
  1: {
    title: 'Vertical Jump Development',
    desc: 'Raise your spiking and blocking performance by building explosive power and vertical jump height.',
    duration: '6 weeks',
    exercises: ['Depth jump 3x8', 'Box jump 4x6', 'Single leg squat 3x10', 'Tuck jump 3x12', 'Weighted squat 4x8'],
    tips: ['Train 3 days a week', 'Do not skip rest days', 'Watch your form'],
  },
  2: {
    title: 'Speed and First Step',
    desc: 'Develop reaction speed and first-step quickness on court.',
    duration: '4 weeks',
    exercises: ['Sprint start drill 5x10m', 'Lateral shuffle 4x15s', 'T-drill 3 reps', 'Agility ladder 5x'],
    tips: ['Give maximum effort on every rep', 'A thorough warm-up is essential', 'Mind your foot position'],
  },
  3: {
    title: 'Serving Technique Development',
    desc: 'Increase serving consistency by perfecting float and jump serve mechanics.',
    duration: '3 weeks',
    exercises: ['Wall serve 3x20', 'Target zone serve 4x10', 'Jump float serve 3x15'],
    tips: ['Keep the toss height constant', 'Complete the arm follow-through', 'Pick your target in advance'],
  },
  4: {
    title: 'Core Stability',
    desc: 'A core strengthening program. It forms the foundation of every volleyball movement.',
    duration: '4 weeks',
    exercises: ['Plank 3x45s', 'Side plank 3x30s', 'Russian twist 3x20', 'Dead bug 3x12', 'Hollow hold 3x30s'],
    tips: ['Always mind your lower-back position', 'Breath control is crucial', 'Increase the duration gradually'],
  },
  5: {
    title: 'Reaction and Reflexes',
    desc: 'Improve the quality of your defense and reception by reading the ball and reacting faster on court.',
    duration: '3 weeks',
    exercises: ['Colored ball catch 4x10', 'Partner random toss 3x20', 'Multi-ball defense 3x10'],
    tips: ['Keep your eyes on the ball', 'Stay in the ready position at all times', 'Mental preparation matters as much as training'],
  },
  6: {
    title: 'Rally Endurance',
    desc: 'A conditioning program to prevent performance drop-off in long rallies.',
    duration: '5 weeks',
    exercises: ['Interval sprint 8x30s', 'Shuttle run 5x', 'Burpee + sprint 4x8', 'Match simulation 3x5min'],
    tips: ['Track your heart rate', 'Drink enough water', 'Load progressively'],
  },
  7: {
    title: 'Forearm Pass Mechanics',
    desc: 'Perfect the correct arm angle, platform formation and controlled passing technique.',
    duration: '3 weeks',
    exercises: ['Wall pass 5x30', 'Partner pass 4x20', 'Target passing 3x15', 'Passing on the move 3x15'],
    tips: ['Keep the arms locked and straight', 'Control the platform angle', 'Generate power from the legs'],
  },
  8: {
    title: 'Serving Rhythm and Consistency',
    desc: 'Build a personal serving routine to increase your consistency from the line.',
    duration: '2 weeks',
    exercises: ['10-serve sets 3x10', 'Counted-rhythm serve 4x10', 'Serving under pressure 3x10'],
    tips: ['Find your own rhythm', 'Keep the toss height constant', 'Sync your breathing with the serve'],
  },
  9: {
    title: 'Overhead Pass Precision',
    desc: 'Develop the ability to set precisely and under control with the fingertips.',
    duration: '4 weeks',
    exercises: ['Self set 5x30', 'Partner long set 4x20', 'Setting on the move 3x15', 'Quick set 3x10'],
    tips: ['Form a triangle with your hands', 'Generate power from the wrists', 'Meet the ball at forehead height'],
  },
  10: {
    title: 'Block Timing',
    desc: 'Raise your blocking success rate by reading the opposing hitter and mastering jump timing.',
    duration: '3 weeks',
    exercises: ['Shadow block 4x10', 'Partner attack + block 3x10', 'Double block coordination 3x8'],
    tips: ['Watch the hitter’s shoulder', 'Penetrate your hands over the net', 'Avoid jumping too early'],
  },
  11: {
    title: 'Attacking Arm Mechanics',
    desc: 'Build spiking power through a correct arm pull, contact point and follow-through.',
    duration: '3 weeks',
    exercises: ['Wall spike 5x15', 'Standing spike 4x10', 'Approach + spike 3x10'],
    tips: ['Keep the elbow high', 'Contact the ball at the highest point', 'Work on the wrist snap'],
  },
  12: {
    title: '5-1 Formation System',
    desc: 'Learn the system and rotation structure played with one setter and five attackers.',
    duration: '4 weeks',
    exercises: ['6-rotation walkthrough', 'Serve receive 4 reps', 'Transition drill 3x10'],
    tips: ['Memorize the rotations', 'The setter’s penetration must be fast', 'Communication is everything'],
  },
  13: {
    title: 'Side-out Discipline',
    desc: 'Increase your scoring rate when the opponent is serving.',
    duration: '3 weeks',
    exercises: ['Serve receive + attack 4x10', 'First ball kill 3x10', 'Controlled serve receive 4x15'],
    tips: ['First-ball quality decides everything', 'Minimize errors on the first contact', 'Keep it simple'],
  },

  // ── Techniques ─────────────────────────────────────────────────────────────
  101: {
    title: 'Forearm Pass (Bump)',
    desc: 'The technique of keeping the arms straight and controlling the ball with the inner surface of the forearms. It is volleyball’s most fundamental defensive and passing skill.',
    exercises: ['Wall passing drill', 'Partner passing exchange', 'Serve receive drill', 'Passing after movement'],
    tips: ['Keep your arms straight', 'Bend your knees slightly', 'Meet the ball in front of your body'],
  },
  102: {
    title: 'Overhead Pass (Set)',
    desc: 'The fundamental passing technique played with the fingertips above the head, usually to set up an attack.',
    exercises: ['Self set', 'Wall set', 'Partner set', 'Setting on the move'],
    tips: ['Form a triangle with your hands', 'Generate power from the wrists', 'Meet the ball at forehead height'],
  },
  103: {
    title: 'Defensive Stance',
    desc: 'The fundamental ready position that is the starting point for every defensive movement in volleyball.',
    exercises: ['Base position drill', 'Lateral shuffle', 'Reaction drill'],
    tips: ['Bend the knees, shift your weight forward', 'Feet shoulder-width apart', 'Keep your eyes on the ball'],
  },
  104: {
    title: 'Spike',
    desc: 'The fundamental attacking technique of hitting the ball forcefully over the net into the opponent’s court.',
    exercises: ['Approach steps', 'Arm swing drill', 'Approach + spike', 'Target spiking'],
    tips: ['Four-step approach: left-right-left (for right-handers)', 'Keep the elbow high', 'Snap the wrist'],
  },
  105: {
    title: 'Float Serve',
    desc: 'A serve struck with no spin so that the ball wobbles in the air and troubles the passers.',
    exercises: ['Wall serve', 'Short-distance serve', 'Target zone serve'],
    tips: ['Keep the toss height constant', 'Do not snap the wrist', 'Hit through the ball flat'],
  },
  106: {
    title: 'Block',
    desc: 'A defensive move at the net in which players reach above the tape to stop the opponent’s attack.',
    exercises: ['Shadow block', 'Standing jump block', 'Partner attack + block'],
    tips: ['Watch the hitter’s shoulder', 'Penetrate your hands over the net', 'Avoid jumping early'],
  },
  107: {
    title: 'Pancake',
    desc: 'Saving the ball off the back of the hand at floor level; an advanced defensive skill that wins seemingly impossible balls.',
    exercises: ['Pancake position drill', 'Dive + pancake', 'Random toss + pancake'],
    tips: ['Keep the hand flat and parallel to the floor', 'Keep the dive angle low', 'Anticipate where the ball will land'],
  },
};
