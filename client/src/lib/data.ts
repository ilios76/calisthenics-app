// ============================================================
// CallistheniX – Exercise & Program Data Library v2.0
// 35 exercises | 12 programs | 3 deep diet plans
// Bilingual EN/EL throughout
// ============================================================

export type Goal = 'lose_weight' | 'gain_muscle' | 'stay_slim';
export type Sex = 'male' | 'female';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'core' | 'legs' | 'full_body' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  nameEl: string;
  muscleGroups: MuscleGroup[];
  difficulty: Difficulty;
  gifUrl: string;
  youtubeVideoId?: string;
  durationSeconds?: number;
  reps?: number;
  sets: number;
  restSeconds: number;
  instructions: string[];
  instructionsEl: string[];
  tips: string[];
  tipsEl: string[];
  calories: number;
  progressionFrom?: string;
  progressionTo?: string;
}

export interface WeeklyPhase {
  weeks: string;
  focus: string;
  focusEl: string;
  intensity: 'light' | 'moderate' | 'high' | 'deload';
}

export interface WorkoutDay {
  dayNumber: number;
  name: string;
  nameEl: string;
  focus: string;
  focusEl: string;
  exercises: string[];
}

export interface WorkoutProgram {
  id: string;
  name: string;
  nameEl: string;
  description: string;
  descriptionEl: string;
  goal: Goal;
  sex: Sex[];
  minAge: number;
  maxAge: number;
  minWeight: number;
  maxWeight: number;
  difficulty: Difficulty;
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionDurationMin: number;
  days: WorkoutDay[];
  tags: string[];
  tagsEl: string[];
  weeklyStructure?: WeeklyPhase[];
}

export interface Meal {
  name: string;
  nameEl: string;
  time: string;
  description: string;
  descriptionEl: string;
  examples: string[];
  examplesEl: string[];
  calories?: number;
}

export interface DayMeal {
  day: string;
  dayEl: string;
  meals: Meal[];
}

export interface FoodCategory {
  category: string;
  categoryEl: string;
  icon: string;
  items: string[];
  itemsEl: string[];
  avoid: string[];
  avoidEl: string[];
}

export interface DietPlan {
  id: string;
  name: string;
  nameEl: string;
  goal: Goal;
  sex: Sex[];
  description: string;
  descriptionEl: string;
  dailyCalories: (weight: number, goal: Goal) => number;
  macros: { protein: number; carbs: number; fat: number };
  meals: Meal[];
  weeklyPlan: DayMeal[];
  tips: string[];
  tipsEl: string[];
  foods: FoodCategory[];
}

const CDN = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL';
const GIPHY = 'https://media.giphy.com/media';

// ============================================================
// EXERCISES — 35 total, beginner-first with progressions
// ============================================================
export const exercises: Record<string, Exercise> = {

  // ── PUSH ───────────────────────────────────────────────────

  wall_push_up: {
    id: 'wall_push_up', name: 'Wall Push-Up', nameEl: 'Κάμψη στον Τοίχο',
    muscleGroups: ['chest','shoulders','arms'], difficulty: 'beginner',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: 'z-5ZRTOjqYU',
    reps: 15, sets: 3, restSeconds: 45, progressionTo: 'incline_push_up',
    instructions: [
      'Stand arm\'s length from a wall, palms flat at shoulder height.',
      'Lean forward and bend elbows to bring chest toward the wall.',
      'Push back to start with controlled force.',
      'Keep body in a straight line throughout.',
    ],
    instructionsEl: [
      'Σταθείτε σε απόσταση βραχίονα, παλάμες στον τοίχο στο ύψος ώμων.',
      'Γείρετε εμπρός λυγίζοντας αγκώνες μέχρι το στήθος να αγγίξει τον τοίχο.',
      'Ωθηθείτε πίσω ελεγχόμενα.',
      'Σώμα σε ευθεία γραμμή καθ\'όλη τη διάρκεια.',
    ],
    tips: ['Perfect for absolute beginners.', 'Farther feet = harder.', 'Master 3×15 before progressing.'],
    tipsEl: ['Ιδανική για απόλυτους αρχάριους.', 'Μακρύτερα πόδια = πιο δύσκολο.', 'Κατακτήστε 3×15 πριν προχωρήσετε.'],
    calories: 4,
  },

  incline_push_up: {
    id: 'incline_push_up', name: 'Incline Push-Up', nameEl: 'Κεκλιμένη Κάμψη',
    muscleGroups: ['chest','shoulders','arms'], difficulty: 'beginner',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: 'cfns5GQxKXI',
    reps: 12, sets: 3, restSeconds: 60,
    progressionFrom: 'wall_push_up', progressionTo: 'push_up',
    instructions: [
      'Place hands on a bench or chair, wider than shoulder-width.',
      'Walk feet back until body forms a diagonal line.',
      'Lower chest to the surface, elbows at 45°.',
      'Push back explosively to full arm extension.',
    ],
    instructionsEl: [
      'Χέρια σε πάγκο ή καρέκλα, πλαιτύτερα από ώμους.',
      'Πόδια πίσω μέχρι το σώμα να σχηματίσει διαγώνιο.',
      'Κατεβάστε στήθος, αγκώνες 45°.',
      'Ωθηθείτε εκρηκτικά.',
    ],
    tips: ['Lower surface = harder.', 'Core tight.', 'Aim 3×12 before progressing.'],
    tipsEl: ['Χαμηλότερη επιφάνεια = πιο δύσκολο.', 'Κορμός σφιχτός.', 'Στόχος 3×12.'],
    calories: 6,
  },

  push_up: {
    id: 'push_up', name: 'Push-Up', nameEl: 'Κάμψη',
    muscleGroups: ['chest','shoulders','arms'], difficulty: 'beginner',
    gifUrl: `${CDN}/Close-gripPushUp_64bfe8ab.gif`, youtubeVideoId: 'IODxDxX7oi4',
    reps: 12, sets: 3, restSeconds: 60,
    progressionFrom: 'incline_push_up', progressionTo: 'diamond_push_up',
    instructions: [
      'High plank with hands shoulder-width apart.',
      'Lower chest to floor, elbows at 45° from body.',
      'Push back up explosively to full extension.',
      'Core tight, body perfectly straight throughout.',
    ],
    instructionsEl: [
      'Υψηλή σανίδα, χέρια στο πλάτος ώμων.',
      'Κατεβάστε στήθος, αγκώνες 45° από σώμα.',
      'Ωθηθείτε εκρηκτικά σε πλήρη έκταση.',
      'Κορμός σφιχτός, σώμα απολύτως ευθεία.',
    ],
    tips: ['Don\'t let hips sag.', 'Breathe in down, out up.', 'Look slightly forward.'],
    tipsEl: ['Μην αφήνετε γοφούς να πέσουν.', 'Εισπνοή κάτω, εκπνοή πάνω.', 'Βλέμμα ελαφρώς εμπρός.'],
    calories: 8,
  },

  diamond_push_up: {
    id: 'diamond_push_up', name: 'Diamond Push-Up', nameEl: 'Κάμψη Διαμαντιού',
    muscleGroups: ['chest','arms'], difficulty: 'intermediate',
    gifUrl: `${CDN}/diamondpush-ups_7c4df12a.gif`, youtubeVideoId: 'h4FpvMVDfWI',
    reps: 10, sets: 3, restSeconds: 75, progressionFrom: 'push_up',
    instructions: [
      'Hands close under chest, forming a diamond shape.',
      'Lower chest toward hands, elbows close to body.',
      'Push to full arm extension.',
      'Core tight, body straight.',
    ],
    instructionsEl: [
      'Χέρια κοντά στο στήθος, σχηματίζοντας ρόμβο.',
      'Κατεβάστε στήθος με αγκώνες κοντά στο σώμα.',
      'Ωθηθείτε σε πλήρη έκταση.',
      'Κορμός σφιχτός, σώμα ευθεία.',
    ],
    tips: ['Heavily targets triceps.', 'Don\'t flare elbows.', 'Modify on knees if needed.'],
    tipsEl: ['Δουλεύει κυρίως τρικέφαλα.', 'Μην ανοίγετε αγκώνες.', 'Τροποποιήστε στα γόνατα.'],
    calories: 9,
  },

  pike_push_up: {
    id: 'pike_push_up', name: 'Pike Push-Up', nameEl: 'Κάμψη Pike',
    muscleGroups: ['shoulders','arms'], difficulty: 'intermediate',
    gifUrl: `${CDN}/PikePush-Up_23af9782.gif`, youtubeVideoId: 'Vh5tQMRUP84',
    reps: 10, sets: 3, restSeconds: 75, progressionTo: 'handstand_push_up_wall',
    instructions: [
      'Start in downward dog, hips high.',
      'Bend elbows to lower head toward floor.',
      'Push back up to start.',
      'Hips elevated, core engaged throughout.',
    ],
    instructionsEl: [
      'Θέση downward dog με ψηλά γοφούς.',
      'Λυγίστε αγκώνες κατεβάζοντας κεφάλι προς έδαφος.',
      'Ωθηθείτε πίσω.',
      'Γοφοί ψηλά, κορμός ενεργός.',
    ],
    tips: ['Higher hips = more shoulder focus.', 'Key step toward handstand push-ups.'],
    tipsEl: ['Ψηλότεροι γοφοί = περισσότερο στους ώμους.', 'Κλειδί για handstand push-ups.'],
    calories: 8,
  },

  handstand_push_up_wall: {
    id: 'handstand_push_up_wall', name: 'Wall Handstand Push-Up', nameEl: 'Κάμψη σε Χειροστασία',
    muscleGroups: ['shoulders','arms'], difficulty: 'advanced',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: '0wFKRdMnUaQ',
    reps: 5, sets: 3, restSeconds: 120, progressionFrom: 'pike_push_up',
    instructions: [
      'Kick up into a handstand, feet on wall.',
      'Lower head toward floor in a controlled manner.',
      'Push explosively back to full arm extension.',
      'Core and glutes tight throughout.',
    ],
    instructionsEl: [
      'Ανεβείτε σε χειροστασία, πόδια στον τοίχο.',
      'Κατεβάστε κεφάλι ελεγχόμενα προς το έδαφος.',
      'Ωθηθείτε εκρηκτικά.',
      'Κορμός και γλουτοί σφιχτά.',
    ],
    tips: ['Use a mat to protect your head.', 'Full ROM — not partial reps.'],
    tipsEl: ['Χρησιμοποιήστε mat για προστασία κεφαλιού.', 'Πλήρες εύρος κίνησης.'],
    calories: 12,
  },

  tricep_dip: {
    id: 'tricep_dip', name: 'Tricep Dip (Chair)', nameEl: 'Κάμψη Τρικεφάλων (Καρέκλα)',
    muscleGroups: ['arms','chest'], difficulty: 'beginner',
    gifUrl: `${CDN}/TricepDip_4d24b041.gif`, youtubeVideoId: 'tJcgSJBcyY0',
    reps: 15, sets: 3, restSeconds: 60, progressionTo: 'dip',
    instructions: [
      'Hands on chair behind you, fingers forward.',
      'Extend legs in front.',
      'Lower body bending elbows to ~90°.',
      'Push back to start.',
    ],
    instructionsEl: [
      'Χέρια σε καρέκλα πίσω, δάχτυλα εμπρός.',
      'Πόδια εκτεταμένα εμπρός.',
      'Κατεβάστε λυγίζοντας αγκώνες ~90°.',
      'Ωθηθείτε πίσω.',
    ],
    tips: ['Back close to chair.', 'Bend knees to make easier.'],
    tipsEl: ['Πλάτη κοντά στην καρέκλα.', 'Λυγίστε γόνατα για ευκολότερο.'],
    calories: 7,
  },

  dip: {
    id: 'dip', name: 'Parallel Bar Dip', nameEl: 'Κάμψη σε Παράλληλες',
    muscleGroups: ['chest','shoulders','arms'], difficulty: 'intermediate',
    gifUrl: `${CDN}/TricepDip_4d24b041.gif`, youtubeVideoId: 'zaUqXuqiYrQ',
    reps: 10, sets: 3, restSeconds: 75, progressionFrom: 'tricep_dip',
    instructions: [
      'Grip parallel bars, body supported on straight arms.',
      'Lean forward for chest, stay upright for triceps.',
      'Lower until upper arms are parallel to floor.',
      'Push back up powerfully.',
    ],
    instructionsEl: [
      'Λαβή σε παράλληλες, σώμα σε ευθειαμένα χέρια.',
      'Γείρετε εμπρός για στήθος, κατακόρυφα για τρικέφαλα.',
      'Κατεβείτε μέχρι βραχίονες παράλληλοι με έδαφος.',
      'Ωθηθείτε δυναμικά.',
    ],
    tips: ['Control the descent.', 'Elbows close = triceps, flared = chest.'],
    tipsEl: ['Ελέγξτε κατέβασμα.', 'Αγκώνες κοντά = τρικέφαλα, ανοιχτοί = στήθος.'],
    calories: 9,
  },

  // ── PULL ───────────────────────────────────────────────────

  dead_hang: {
    id: 'dead_hang', name: 'Dead Hang', nameEl: 'Παθητικό Κρέμασμα',
    muscleGroups: ['back','arms'], difficulty: 'beginner',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: '-opfMnFtYkE',
    durationSeconds: 30, sets: 3, restSeconds: 60, progressionTo: 'scapular_pull',
    instructions: [
      'Hang from a bar, overhand grip, arms fully extended.',
      'Let body hang freely — no muscle engagement yet.',
      'Breathe steadily throughout.',
      'Build to 60 seconds before progressing.',
    ],
    instructionsEl: [
      'Κρεμαστείτε από μπάρα, πρηνισμένη λαβή, χέρια πλήρως εκτεταμένα.',
      'Αφήστε σώμα να κρέμεται ελεύθερα.',
      'Αναπνεύστε σταθερά.',
      'Χτίστε μέχρι 60 δευτερόλεπτα.',
    ],
    tips: ['Essential first step before pulling.', 'Builds grip and shoulder health dramatically.'],
    tipsEl: ['Βασικό πρώτο βήμα πριν τις έλξεις.', 'Χτίζει δύναμη λαβής και υγεία ώμων.'],
    calories: 3,
  },

  scapular_pull: {
    id: 'scapular_pull', name: 'Scapular Pull', nameEl: 'Ωμοπλατική Έλξη',
    muscleGroups: ['back','shoulders'], difficulty: 'beginner',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: 'OKpFcB8G7hk',
    reps: 10, sets: 3, restSeconds: 60,
    progressionFrom: 'dead_hang', progressionTo: 'negative_pull_up',
    instructions: [
      'Start in dead hang.',
      'Without bending elbows, depress and retract shoulder blades.',
      'You\'ll rise ~2-3cm — that\'s the movement.',
      'Lower slowly back to dead hang.',
    ],
    instructionsEl: [
      'Ξεκινήστε από παθητικό κρέμασμα.',
      'Χωρίς να λυγίσετε αγκώνες, τραβήξτε ωμοπλάτες κάτω και πίσω.',
      'Θα ανεβείτε ~2-3cm — αυτή είναι η κίνηση.',
      'Κατεβείτε αργά.',
    ],
    tips: ['Activates the lats needed for pull-ups.', 'Think: "shoulder blades in back pockets".'],
    tipsEl: ['Ενεργοποιεί πλατείς για pull-ups.', 'Σκεφτείτε: "ωμοπλάτες στις πίσω τσέπες".'],
    calories: 4,
  },

  negative_pull_up: {
    id: 'negative_pull_up', name: 'Negative Pull-Up', nameEl: 'Αρνητική Έλξη',
    muscleGroups: ['back','arms'], difficulty: 'beginner',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: '1vFKyxiVA0E',
    reps: 5, sets: 3, restSeconds: 90,
    progressionFrom: 'scapular_pull', progressionTo: 'pull_up',
    instructions: [
      'Jump or step up so chin is above the bar.',
      'Lower yourself as slowly as possible — aim for 5-8 seconds.',
      'At the bottom, drop off and reset.',
      'Complete control throughout the descent.',
    ],
    instructionsEl: [
      'Πηδήξτε ώστε πηγούνι πάνω από μπάρα.',
      'Κατεβείτε όσο πιο αργά — στόχος 5-8 δευτερόλεπτα.',
      'Στο κάτω, αφεθείτε και επαναλάβετε.',
      'Πλήρης έλεγχος καθ\'όλη την κατάβαση.',
    ],
    tips: ['Fastest method to build pull-up strength.', 'Slower descent = better adaptation.'],
    tipsEl: ['Η πιο γρήγορη μέθοδος για δύναμη pull-up.', 'Πιο αργό κατέβασμα = καλύτερη προσαρμογή.'],
    calories: 6,
  },

  pull_up: {
    id: 'pull_up', name: 'Pull-Up', nameEl: 'Έλξη σε Μπάρα',
    muscleGroups: ['back','arms'], difficulty: 'intermediate',
    gifUrl: `${CDN}/Pull-Up_a5f4017c.gif`, youtubeVideoId: 'eGo4IYlbE5g',
    reps: 6, sets: 3, restSeconds: 90, progressionFrom: 'negative_pull_up',
    instructions: [
      'Hang from bar, hands slightly wider than shoulder-width, palms away.',
      'Engage core, pull shoulder blades down and back.',
      'Pull up until chin clears the bar.',
      'Lower slowly — 2-3 seconds on the way down.',
    ],
    instructionsEl: [
      'Λαβή λίγο πλαιτύτερη από ώμους, πρηνισμένη.',
      'Ενεργοποιήστε κορμό, ωμοπλάτες κάτω-πίσω.',
      'Ανεβείτε μέχρι πηγούνι πάνω από μπάρα.',
      'Κατεβείτε αργά — 2-3 δευτερόλεπτα.',
    ],
    tips: ['No kipping — strict form only.', 'Squeeze lats at the top.', 'Use band if needed.'],
    tipsEl: ['Όχι ταλάντευση — αυστηρή φόρμα.', 'Συμπιέστε πλατείς στην κορυφή.', 'Χρησιμοποιήστε λαστιχάκι αν χρειαστεί.'],
    calories: 10,
  },

  chin_up: {
    id: 'chin_up', name: 'Chin-Up', nameEl: 'Έλξη Υπτίου (Chin-Up)',
    muscleGroups: ['back','arms'], difficulty: 'intermediate',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: 'QLyFBCM9GW8',
    reps: 6, sets: 3, restSeconds: 90,
    instructions: [
      'Hang from bar, palms facing you, shoulder-width.',
      'Pull up until chin clears the bar.',
      'Squeeze biceps at the top.',
      'Lower slowly with full control.',
    ],
    instructionsEl: [
      'Λαβή υπτία, χέρια στο πλάτος ώμων.',
      'Ανεβείτε μέχρι πηγούνι πάνω από μπάρα.',
      'Συμπιέστε δικέφαλα στην κορυφή.',
      'Κατεβείτε αργά.',
    ],
    tips: ['Easier than pull-ups — great for beginners building toward them.'],
    tipsEl: ['Πιο εύκολο από pull-ups — εξαιρετικό για χτίσιμο.'],
    calories: 9,
  },

  // ── CORE ───────────────────────────────────────────────────

  plank: {
    id: 'plank', name: 'Plank Hold', nameEl: 'Σανίδα',
    muscleGroups: ['core'], difficulty: 'beginner',
    gifUrl: `${CDN}/Plank_fcb90549.gif`, youtubeVideoId: 'pSHjTRCQxIw',
    durationSeconds: 30, sets: 3, restSeconds: 45, progressionTo: 'hollow_body_hold',
    instructions: [
      'Forearm plank, elbows under shoulders.',
      'Body straight from head to heels.',
      'Brace core as if expecting a punch.',
      'Hold, breathing steadily.',
    ],
    instructionsEl: [
      'Σανίδα αντιβραχίου, αγκώνες κάτω από ώμους.',
      'Σώμα ευθεία από κεφαλή έως πτέρνα.',
      'Σφίξτε κορμό.',
      'Κρατήστε, αναπνέοντας σταθερά.',
    ],
    tips: ['Don\'t hold breath.', 'Squeeze glutes to prevent hip sag.'],
    tipsEl: ['Μην κρατάτε αναπνοή.', 'Σφίξτε γλουτούς για να μην πέσουν γοφοί.'],
    calories: 5,
  },

  hollow_body_hold: {
    id: 'hollow_body_hold', name: 'Hollow Body Hold', nameEl: 'Κοίλη Θέση',
    muscleGroups: ['core'], difficulty: 'beginner',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: 'LlDNef_Ztsc',
    durationSeconds: 20, sets: 3, restSeconds: 60, progressionFrom: 'plank',
    instructions: [
      'Lie on back, press lower back into floor.',
      'Arms overhead, legs raised to ~30°.',
      'Chin slightly tucked, shoulders off floor.',
      'Hold — lower back stays pressed down.',
    ],
    instructionsEl: [
      'Ξαπλώστε ανάσκελα, πιέστε μέση στο έδαφος.',
      'Χέρια πάνω, πόδια ~30° από έδαφος.',
      'Πηγούνι ελαφρώς κάτω, ώμοι σηκωμένοι.',
      'Κρατήστε — μέση πάντα στο έδαφος.',
    ],
    tips: ['Lower legs = harder — start high.', 'Foundation for L-sit and dragon flag.'],
    tipsEl: ['Χαμηλότερα πόδια = πιο δύσκολο.', 'Βάση για L-sit και dragon flag.'],
    calories: 5,
  },

  mountain_climber: {
    id: 'mountain_climber', name: 'Mountain Climber', nameEl: 'Ορειβάτης',
    muscleGroups: ['core','cardio'], difficulty: 'beginner',
    gifUrl: `${CDN}/MountainClimber_3bed8f93.gif`, youtubeVideoId: 'nmwgirgXLYM',
    durationSeconds: 30, sets: 3, restSeconds: 45,
    instructions: [
      'Start in high plank.',
      'Drive one knee toward chest, quickly switch legs.',
      'Hips level, core tight.',
      'Fast, controlled pace.',
    ],
    instructionsEl: [
      'Ξεκινήστε σε υψηλή σανίδα.',
      'Φέρτε γόνατο προς στήθος, αλλάξτε γρήγορα.',
      'Γοφοί επίπεδοι, κορμός σφιχτός.',
      'Γρήγορος, ελεγχόμενος ρυθμός.',
    ],
    tips: ['Shoulders stay over wrists.', 'Don\'t let hips rise.'],
    tipsEl: ['Ώμοι πάνω από καρπούς.', 'Μην ανεβαίνουν οι γοφοί.'],
    calories: 12,
  },

  leg_raise: {
    id: 'leg_raise', name: 'Hanging Leg Raise', nameEl: 'Ανύψωση Ποδιών (Κρεμαστή)',
    muscleGroups: ['core'], difficulty: 'intermediate',
    gifUrl: `${CDN}/HangingLegRaise_f3898315.gif`, youtubeVideoId: 'r4MRlMy1NRo',
    reps: 10, sets: 3, restSeconds: 60,
    instructions: [
      'Hang from bar, straight arms.',
      'Raise legs to 90° (or higher).',
      'Lower slowly — 2-3 seconds.',
      'No swinging — core only.',
    ],
    instructionsEl: [
      'Κρεμαστείτε από μπάρα, ευθειαμένα χέρια.',
      'Ανεβάστε πόδια στις 90°.',
      'Κατεβάστε αργά — 2-3 δευτερόλεπτα.',
      'Χωρίς ταλάντευση.',
    ],
    tips: ['Start with knee raises if too hard.', 'Tuck pelvis at the top.'],
    tipsEl: ['Ξεκινήστε με γόνατα αν είναι δύσκολο.', 'Γείρετε λεκάνη στην κορυφή.'],
    calories: 7,
  },

  bicycle_crunch: {
    id: 'bicycle_crunch', name: 'Bicycle Crunch', nameEl: 'Κοιλιακοί Ποδηλάτου',
    muscleGroups: ['core'], difficulty: 'beginner',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: '9FGilxCbdz8',
    reps: 20, sets: 3, restSeconds: 45,
    instructions: [
      'On back, hands behind head.',
      'Lift shoulders, bring one knee toward chest.',
      'Rotate opposite elbow toward raised knee.',
      'Alternate sides in cycling motion.',
    ],
    instructionsEl: [
      'Ανάσκελα, χέρια πίσω από κεφάλι.',
      'Σηκώστε ώμους, φέρτε γόνατο προς στήθος.',
      'Γυρίστε αντίθετο αγκώνα προς γόνατο.',
      'Εναλλάξτε πλευρές.',
    ],
    tips: ['Don\'t pull on neck.', 'Focus on rotation, not just crunch.'],
    tipsEl: ['Μην τραβάτε αυχένα.', 'Εστιάστε στη στροφή.'],
    calories: 6,
  },

  superman: {
    id: 'superman', name: 'Superman Hold', nameEl: 'Θέση Superman',
    muscleGroups: ['back','core'], difficulty: 'beginner',
    gifUrl: `${CDN}/SupermanHold_b85ef799.gif`, youtubeVideoId: 'Btb0qkJxnKw',
    durationSeconds: 20, sets: 3, restSeconds: 45,
    instructions: [
      'Lie face down, arms extended overhead.',
      'Lift arms, chest, and legs simultaneously.',
      'Hold, squeezing back and glutes.',
      'Lower slowly.',
    ],
    instructionsEl: [
      'Μπρούμυτα, χέρια εκτεταμένα.',
      'Σηκώστε χέρια, στήθος και πόδια ταυτόχρονα.',
      'Κρατήστε, συμπιέζοντας πλάτη και γλουτούς.',
      'Κατεβείτε αργά.',
    ],
    tips: ['Keep neck neutral.', 'Breathe steadily.'],
    tipsEl: ['Αυχένας ουδέτερος.', 'Αναπνεύστε σταθερά.'],
    calories: 4,
  },

  // ── LEGS ───────────────────────────────────────────────────

  squat: {
    id: 'squat', name: 'Bodyweight Squat', nameEl: 'Κάθισμα με Βάρος Σώματος',
    muscleGroups: ['legs'], difficulty: 'beginner',
    gifUrl: `${CDN}/Squat_6cb22367.gif`, youtubeVideoId: 'aclHkVjW_2Y',
    reps: 20, sets: 3, restSeconds: 60, progressionTo: 'bulgarian_split_squat',
    instructions: [
      'Feet shoulder-width, toes slightly out.',
      'Brace core, push hips back and down.',
      'Lower until thighs parallel to floor.',
      'Drive through heels to stand.',
    ],
    instructionsEl: [
      'Πόδια στο πλάτος ώμων, δάχτυλα ελαφρώς έξω.',
      'Σφίξτε κορμό, γοφούς πίσω και κάτω.',
      'Κατεβείτε μέχρι μηροί παράλληλοι.',
      'Ωθηθείτε μέσω πτερνών.',
    ],
    tips: ['Chest up, back straight.', 'Knees track over toes.', 'Go as deep as mobility allows.'],
    tipsEl: ['Στήθος ψηλά, πλάτη ευθεία.', 'Γόνατα πάνω από δάχτυλα.', 'Τόσο βαθιά όσο επιτρέπει η κινητικότητα.'],
    calories: 7,
  },

  bulgarian_split_squat: {
    id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', nameEl: 'Βουλγαρικό Κάθισμα',
    muscleGroups: ['legs'], difficulty: 'intermediate',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: '2C-uNgKwPLE',
    reps: 10, sets: 3, restSeconds: 75,
    progressionFrom: 'squat', progressionTo: 'pistol_squat',
    instructions: [
      'Stand in front of bench, ~60cm away.',
      'Rear foot on elevated surface.',
      'Lower back knee toward floor.',
      'Push through front heel to stand.',
    ],
    instructionsEl: [
      'Σταθείτε μπροστά από πάγκο ~60cm.',
      'Πίσω πόδι στην ανυψωμένη επιφάνεια.',
      'Κατεβάστε πίσω γόνατο προς έδαφος.',
      'Ωθηθείτε μέσω μπροστινής φτέρνας.',
    ],
    tips: ['Front shin stays vertical.', 'Great single-leg builder.'],
    tipsEl: ['Μπροστινή κνήμη κατακόρυφη.', 'Εξαιρετικό για δύναμη μονού ποδιού.'],
    calories: 9,
  },

  pistol_squat: {
    id: 'pistol_squat', name: 'Pistol Squat', nameEl: 'Μονοπόδι Κάθισμα (Πιστόλι)',
    muscleGroups: ['legs','core'], difficulty: 'advanced',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: 'vq5-vdgJc0I',
    reps: 5, sets: 3, restSeconds: 90, progressionFrom: 'bulgarian_split_squat',
    instructions: [
      'Stand on one foot, other leg extended forward.',
      'Lower slowly on single leg, maintaining balance.',
      'Go as deep as possible — ideally hip below knee.',
      'Drive through heel to full extension.',
    ],
    instructionsEl: [
      'Σταθείτε στο ένα πόδι, άλλο εκτεταμένο εμπρός.',
      'Κατεβείτε αργά, διατηρώντας ισορροπία.',
      'Όσο πιο βαθιά — ιδανικά γοφός κάτω από γόνατο.',
      'Ωθηθείτε μέσω φτέρνας.',
    ],
    tips: ['Use door frame for balance as you learn.', 'The ultimate lower body skill.'],
    tipsEl: ['Χρησιμοποιήστε πόρτα για ισορροπία στην αρχή.', 'Το απόλυτο calisthenics skill.'],
    calories: 11,
  },

  lunge: {
    id: 'lunge', name: 'Walking Lunge', nameEl: 'Εναλλασσόμενο Βήμα',
    muscleGroups: ['legs'], difficulty: 'beginner',
    gifUrl: `${CDN}/WalkingLunge_c7608109.gif`, youtubeVideoId: 'QOVaHwm-Q6U',
    reps: 12, sets: 3, restSeconds: 60,
    instructions: [
      'Stand tall, feet together.',
      'Step forward, lower back knee toward floor.',
      'Front thigh parallel to floor.',
      'Push off and step with other leg.',
    ],
    instructionsEl: [
      'Όρθιοι, πόδια μαζί.',
      'Βήμα εμπρός, κατεβάστε πίσω γόνατο.',
      'Μπροστινός μηρός παράλληλος.',
      'Ωθηθείτε και κάντε βήμα με άλλο πόδι.',
    ],
    tips: ['Torso upright.', 'Front knee doesn\'t pass toes.'],
    tipsEl: ['Κορμός όρθιος.', 'Μπροστινό γόνατο δεν ξεπερνά δάχτυλα.'],
    calories: 6,
  },

  glute_bridge: {
    id: 'glute_bridge', name: 'Glute Bridge', nameEl: 'Γέφυρα Γλουτών',
    muscleGroups: ['legs','core'], difficulty: 'beginner',
    gifUrl: `${CDN}/GluteBridge_07b455b1.gif`, youtubeVideoId: 'wPM8ic32ufQ',
    reps: 20, sets: 3, restSeconds: 45,
    instructions: [
      'On back, knees bent, feet flat.',
      'Drive through heels, lift hips to ceiling.',
      'Squeeze glutes at top, hold 1 second.',
      'Lower slowly.',
    ],
    instructionsEl: [
      'Ανάσκελα, γόνατα λυγισμένα, πόδια επίπεδα.',
      'Ωθηθείτε μέσω πτερνών, ανεβάστε γοφούς.',
      'Συμπιέστε γλουτούς στην κορυφή, κρατήστε 1 δευτερόλεπτο.',
      'Κατεβείτε αργά.',
    ],
    tips: ['Don\'t hyperextend lower back.', 'Progress to single-leg bridges.'],
    tipsEl: ['Μην υπερεκτείνετε μέση.', 'Προχωρήστε σε μονοπόδια γέφυρα.'],
    calories: 5,
  },

  calf_raise: {
    id: 'calf_raise', name: 'Single-Leg Calf Raise', nameEl: 'Άνοδος Δακτύλων (Μονοπόδια)',
    muscleGroups: ['legs'], difficulty: 'beginner',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: 'gwLzBJYoWlI',
    reps: 15, sets: 3, restSeconds: 45,
    instructions: [
      'Stand on one foot on edge of step, heel hanging.',
      'Lower heel for full stretch.',
      'Rise on toes as high as possible.',
      'Lower slowly.',
    ],
    instructionsEl: [
      'Σταθείτε στο ένα πόδι στην άκρη σκαλοπατιού, φτέρνα στον αέρα.',
      'Κατεβάστε φτέρνα για πλήρες άνοιγμα.',
      'Ανεβείτε στα δάχτυλα.',
      'Κατεβείτε αργά.',
    ],
    tips: ['Full ROM — not partial bouncing.', 'Hold top 1 second.'],
    tipsEl: ['Πλήρες εύρος — όχι αναπηδήματα.', 'Κρατήστε κορυφή 1 δευτερόλεπτο.'],
    calories: 4,
  },

  // ── CARDIO ─────────────────────────────────────────────────

  jumping_jack: {
    id: 'jumping_jack', name: 'Jumping Jack', nameEl: 'Άλματα με Άνοιγμα',
    muscleGroups: ['full_body','cardio'], difficulty: 'beginner',
    gifUrl: `${CDN}/JumpingJack_a4eea890.gif`, youtubeVideoId: 'c4DqC9sKvTI',
    durationSeconds: 45, sets: 3, restSeconds: 30,
    instructions: [
      'Stand, feet together, arms at sides.',
      'Jump spreading legs and raising arms overhead.',
      'Jump back to start.',
      'Steady, controlled pace.',
    ],
    instructionsEl: [
      'Σταθείτε, πόδια μαζί, χέρια στα πλάγια.',
      'Πηδήξτε ανοίγοντας πόδια και σηκώνοντας χέρια.',
      'Πηδήξτε πίσω.',
      'Ρυθμικός, ελεγχόμενος ρυθμός.',
    ],
    tips: ['Land softly, bent knees.', 'Great warm-up.'],
    tipsEl: ['Απαλή προσγείωση, λυγισμένα γόνατα.', 'Εξαιρετικό για προθέρμανση.'],
    calories: 10,
  },

  high_knees: {
    id: 'high_knees', name: 'High Knees', nameEl: 'Ψηλά Γόνατα',
    muscleGroups: ['legs','cardio'], difficulty: 'beginner',
    gifUrl: `${CDN}/HighKnees_ddb86bbd.gif`, youtubeVideoId: 'txHRA36z19I',
    durationSeconds: 30, sets: 3, restSeconds: 30,
    instructions: [
      'Feet hip-width apart.',
      'Run in place, driving knees as high as possible.',
      'Pump arms in rhythm.',
      'Fast, controlled pace.',
    ],
    instructionsEl: [
      'Πόδια στο πλάτος γοφών.',
      'Τρέξτε στη θέση σας, γόνατα όσο πιο ψηλά.',
      'Κουνήστε χέρια ρυθμικά.',
      'Γρήγορος, ελεγχόμενος ρυθμός.',
    ],
    tips: ['Land on balls of feet.', 'Core engaged.'],
    tipsEl: ['Προσγείωση στα δάχτυλα.', 'Κορμός ενεργός.'],
    calories: 13,
  },

  burpee: {
    id: 'burpee', name: 'Burpee', nameEl: 'Burpee',
    muscleGroups: ['full_body','cardio'], difficulty: 'intermediate',
    gifUrl: `${CDN}/Burpee_c61f974c.gif`, youtubeVideoId: 'JZQA_G8KgFo',
    reps: 10, sets: 3, restSeconds: 90,
    instructions: [
      'From standing, squat and place hands on floor.',
      'Jump feet back to push-up position.',
      'Perform one push-up (optional for beginners).',
      'Jump feet to hands, then jump up arms overhead.',
    ],
    instructionsEl: [
      'Από όρθια θέση, καθίστε και τοποθετήστε χέρια.',
      'Εκτινάξτε πόδια πίσω σε θέση κάμψης.',
      'Κάντε μια κάμψη (προαιρετικό).',
      'Φέρτε πόδια στα χέρια και πηδήξτε ψηλά.',
    ],
    tips: ['Step instead of jump to modify.', 'Land softly.'],
    tipsEl: ['Βήμα αντί άλμα για τροποποίηση.', 'Απαλή προσγείωση.'],
    calories: 15,
  },

  jump_squat: {
    id: 'jump_squat', name: 'Jump Squat', nameEl: 'Εκρηκτικό Κάθισμα',
    muscleGroups: ['legs','cardio'], difficulty: 'intermediate',
    gifUrl: `${GIPHY}/3oKIPrc2ngFZ6BTyww/giphy.gif`, youtubeVideoId: 'CVaEhXotL7M',
    reps: 12, sets: 3, restSeconds: 60,
    instructions: [
      'Perform a regular squat.',
      'At the bottom, explode upward as high as possible.',
      'Land softly with bent knees.',
      'Immediately lower into next rep.',
    ],
    instructionsEl: [
      'Κάντε ένα κανονικό κάθισμα.',
      'Στο κάτω, εκτιναχθείτε όσο πιο ψηλά.',
      'Προσγειωθείτε απαλά με λυγισμένα γόνατα.',
      'Αμέσως κατεβείτε στο επόμενο.',
    ],
    tips: ['Land heel-to-toe to protect knees.', 'Use arms for momentum.'],
    tipsEl: ['Προσγείωση από φτέρνα σε δάχτυλα.', 'Χρησιμοποιήστε χέρια για ορμή.'],
    calories: 14,
  },
};

// ============================================================
// WORKOUT PROGRAMS — 12 total
// ============================================================
export const programs: WorkoutProgram[] = [

  // ── ABSOLUTE BEGINNER ──────────────────────────────────────

  {
    id: 'zero_to_hero_male',
    name: 'Zero to Hero: 4-Week Starter',
    nameEl: 'Από Μηδέν: 4 Εβδομάδες Ξεκίνημα',
    description: 'Built for complete beginners. No bar needed in Week 1. Introduces fundamental calisthenics movement patterns at a pace your body can safely adapt to.',
    descriptionEl: 'Σχεδιασμένο για απόλυτους αρχάριους. Δεν χρειάζεστε μπάρα την 1η εβδομάδα. Εισάγει τα θεμελιώδη κινητικά πρότυπα σε ρυθμό που το σώμα προσαρμόζεται με ασφάλεια.',
    goal: 'gain_muscle', sex: ['male'],
    minAge: 14, maxAge: 65, minWeight: 0, maxWeight: 999,
    difficulty: 'beginner', durationWeeks: 4, sessionsPerWeek: 3, sessionDurationMin: 25,
    tags: ['Beginner','Foundation','No Equipment Week 1','Full Body'],
    tagsEl: ['Αρχάριος','Βάση','Χωρίς Εξοπλισμό Εβδ.1','Ολόκληρο Σώμα'],
    weeklyStructure: [
      { weeks: '1', focus: 'Learn movements — no failure', focusEl: 'Μαθαίνουμε κινήσεις — όχι εξάντληση', intensity: 'light' },
      { weeks: '2', focus: 'Add reps, build confidence', focusEl: 'Περισσότερες επαναλήψεις, αυτοπεποίθηση', intensity: 'moderate' },
      { weeks: '3', focus: 'Harder progressions', focusEl: 'Δυσκολότερες εξελίξεις', intensity: 'high' },
      { weeks: '4', focus: 'Deload — consolidate gains', focusEl: 'Αποκατάσταση — εδραίωση κερδών', intensity: 'deload' },
    ],
    days: [
      { dayNumber: 1, name: 'Day A', nameEl: 'Μέρα Α', focus: 'Push + Core', focusEl: 'Ώθηση + Κορμός', exercises: ['wall_push_up','incline_push_up','plank','bicycle_crunch','glute_bridge'] },
      { dayNumber: 2, name: 'Day B', nameEl: 'Μέρα Β', focus: 'Legs + Cardio', focusEl: 'Πόδια + Καρδιο', exercises: ['squat','lunge','glute_bridge','calf_raise','jumping_jack'] },
      { dayNumber: 3, name: 'Day C', nameEl: 'Μέρα Γ', focus: 'Full Body Circuit', focusEl: 'Ολοκληρωμένο Κύκλωμα', exercises: ['incline_push_up','squat','mountain_climber','superman','hollow_body_hold'] },
    ],
  },

  {
    id: 'zero_to_hero_female',
    name: "Zero to Hero: Women's Starter",
    nameEl: 'Από Μηδέν: Γυναικείο Ξεκίνημα',
    description: 'A 4-week beginner program for women, focusing on full-body strength, core stability, and glute development — all with bodyweight only.',
    descriptionEl: '4 εβδομάδες για γυναίκες, εστίαση στη δύναμη ολόκληρου σώματος, σταθερότητα κορμού και ανάπτυξη γλουτών — μόνο με βάρος σώματος.',
    goal: 'gain_muscle', sex: ['female'],
    minAge: 14, maxAge: 65, minWeight: 0, maxWeight: 999,
    difficulty: 'beginner', durationWeeks: 4, sessionsPerWeek: 3, sessionDurationMin: 25,
    tags: ['Beginner','Women','Glutes','Core'],
    tagsEl: ['Αρχάριος','Γυναίκες','Γλουτοί','Κορμός'],
    weeklyStructure: [
      { weeks: '1', focus: 'Form first — learn every movement', focusEl: 'Πρώτα η φόρμα', intensity: 'light' },
      { weeks: '2', focus: 'More volume, same movements', focusEl: 'Περισσότερος όγκος', intensity: 'moderate' },
      { weeks: '3', focus: 'Challenge sets', focusEl: 'Σετ πρόκλησης', intensity: 'high' },
      { weeks: '4', focus: 'Deload and assess progress', focusEl: 'Ξεκούραση και αξιολόγηση', intensity: 'deload' },
    ],
    days: [
      { dayNumber: 1, name: 'Day A', nameEl: 'Μέρα Α', focus: 'Glutes & Legs', focusEl: 'Γλουτοί & Πόδια', exercises: ['squat','glute_bridge','lunge','calf_raise','superman'] },
      { dayNumber: 2, name: 'Day B', nameEl: 'Μέρα Β', focus: 'Upper & Core', focusEl: 'Άνω Μέρος & Κορμός', exercises: ['wall_push_up','incline_push_up','plank','hollow_body_hold','bicycle_crunch'] },
      { dayNumber: 3, name: 'Day C', nameEl: 'Μέρα Γ', focus: 'Full Body', focusEl: 'Ολόκληρο Σώμα', exercises: ['squat','incline_push_up','glute_bridge','mountain_climber','plank'] },
    ],
  },

  // ── PULL-UP MILESTONE ──────────────────────────────────────

  {
    id: 'pull_up_program',
    name: 'First Pull-Up: 6-Week Program',
    nameEl: 'Πρώτο Pull-Up: 6 Εβδομάδες',
    description: 'The most popular beginner goal. A structured 6-week program that takes you from dead hang to your first strict pull-up using proven progressions.',
    descriptionEl: 'Ο πιο δημοφιλής αρχικός στόχος. Δομημένο 6εβδομαδιαίο πρόγραμμα από παθητικό κρέμασμα στο πρώτο σου strict pull-up.',
    goal: 'gain_muscle', sex: ['male','female'],
    minAge: 14, maxAge: 65, minWeight: 0, maxWeight: 999,
    difficulty: 'beginner', durationWeeks: 6, sessionsPerWeek: 3, sessionDurationMin: 30,
    tags: ['Pull-Up','Beginner','Back','Milestone'],
    tagsEl: ['Pull-Up','Αρχάριος','Πλάτη','Ορόσημο'],
    weeklyStructure: [
      { weeks: '1-2', focus: 'Dead hang & scapular control', focusEl: 'Κρέμασμα & έλεγχος ωμοπλατών', intensity: 'light' },
      { weeks: '3-4', focus: 'Negative pull-ups — 5 sec descent', focusEl: 'Αρνητικές — 5 δευτερόλεπτα κατέβασμα', intensity: 'moderate' },
      { weeks: '5-6', focus: 'First full reps', focusEl: 'Πρώτες ολοκληρωμένες επαναλήψεις', intensity: 'high' },
    ],
    days: [
      { dayNumber: 1, name: 'Session A', nameEl: 'Συνεδρία Α', focus: 'Pull Progressions + Push', focusEl: 'Εξελίξεις Έλξης + Ώθηση', exercises: ['dead_hang','scapular_pull','negative_pull_up','push_up','plank'] },
      { dayNumber: 2, name: 'Session B', nameEl: 'Συνεδρία Β', focus: 'Volume + Core', focusEl: 'Όγκος + Κορμός', exercises: ['dead_hang','chin_up','negative_pull_up','bicycle_crunch','superman'] },
      { dayNumber: 3, name: 'Session C', nameEl: 'Συνεδρία Γ', focus: 'Full Pull Attempt', focusEl: 'Απόπειρα Pull-Up', exercises: ['pull_up','chin_up','dead_hang','push_up','hollow_body_hold'] },
    ],
  },

  // ── FAT LOSS ───────────────────────────────────────────────

  {
    id: 'fat_burn_beginner_male',
    name: 'Ignite: 6-Week Fat Burn',
    nameEl: 'Ignite: 6 Εβδομάδες Καύση Λίπους',
    description: 'A 6-week beginner program combining bodyweight cardio and strength circuits to maximize calorie burn and kickstart your transformation.',
    descriptionEl: '6 εβδομάδες που συνδυάζουν καρδιο και κυκλώματα ισχύος για μέγιστη καύση και εκκίνηση της μεταμόρφωσης.',
    goal: 'lose_weight', sex: ['male'],
    minAge: 16, maxAge: 60, minWeight: 70, maxWeight: 999,
    difficulty: 'beginner', durationWeeks: 6, sessionsPerWeek: 4, sessionDurationMin: 35,
    tags: ['Fat Loss','Cardio','Full Body','Beginner'],
    tagsEl: ['Καύση Λίπους','Καρδιο','Ολόκληρο Σώμα','Αρχάριος'],
    weeklyStructure: [
      { weeks: '1-2', focus: 'Build the habit', focusEl: 'Χτίσε τη συνήθεια', intensity: 'moderate' },
      { weeks: '3-4', focus: 'Increase intensity', focusEl: 'Αύξησε ένταση', intensity: 'high' },
      { weeks: '5-6', focus: 'Peak effort — transformation phase', focusEl: 'Κορύφωση — φάση μεταμόρφωσης', intensity: 'high' },
    ],
    days: [
      { dayNumber: 1, name: 'Day 1', nameEl: 'Μέρα 1', focus: 'Full Body Circuit', focusEl: 'Κύκλωμα Ολόκληρου Σώματος', exercises: ['jumping_jack','push_up','squat','mountain_climber','plank'] },
      { dayNumber: 2, name: 'Day 2', nameEl: 'Μέρα 2', focus: 'Cardio Blast', focusEl: 'Καρδιο Έκρηξη', exercises: ['high_knees','burpee','jump_squat','mountain_climber','plank'] },
      { dayNumber: 3, name: 'Day 3', nameEl: 'Μέρα 3', focus: 'Upper Body + Core', focusEl: 'Άνω Μέρος + Κορμός', exercises: ['push_up','tricep_dip','pike_push_up','plank','mountain_climber'] },
      { dayNumber: 4, name: 'Day 4', nameEl: 'Μέρα 4', focus: 'Lower Body + Cardio', focusEl: 'Κάτω Μέρος + Καρδιο', exercises: ['squat','lunge','jump_squat','high_knees','glute_bridge'] },
    ],
  },

  {
    id: 'fat_burn_beginner_female',
    name: "Sculpt & Burn: Women's 6-Week",
    nameEl: 'Sculpt & Burn: Γυναικείο 6 Εβδομάδες',
    description: 'A 6-week beginner program for women focusing on toning, fat loss, and a strong foundation with bodyweight movements.',
    descriptionEl: '6 εβδομάδες για γυναίκες με έμφαση στο τόνωμα, καύση λίπους και ισχυρή βάση.',
    goal: 'lose_weight', sex: ['female'],
    minAge: 16, maxAge: 60, minWeight: 50, maxWeight: 999,
    difficulty: 'beginner', durationWeeks: 6, sessionsPerWeek: 4, sessionDurationMin: 30,
    tags: ['Fat Loss','Toning','Women','Beginner'],
    tagsEl: ['Καύση Λίπους','Τόνωση','Γυναίκες','Αρχάριος'],
    weeklyStructure: [
      { weeks: '1-2', focus: 'Master the basics', focusEl: 'Κατάκτηση βασικών', intensity: 'moderate' },
      { weeks: '3-4', focus: 'Push the pace', focusEl: 'Αύξηση ρυθμού', intensity: 'high' },
      { weeks: '5-6', focus: 'Final push', focusEl: 'Τελικό push', intensity: 'high' },
    ],
    days: [
      { dayNumber: 1, name: 'Day 1', nameEl: 'Μέρα 1', focus: 'Full Body Tone', focusEl: 'Τόνωση Ολόκληρου Σώματος', exercises: ['jumping_jack','squat','glute_bridge','plank','mountain_climber'] },
      { dayNumber: 2, name: 'Day 2', nameEl: 'Μέρα 2', focus: 'Cardio & Core', focusEl: 'Καρδιο & Κορμός', exercises: ['high_knees','mountain_climber','jumping_jack','hollow_body_hold','superman'] },
      { dayNumber: 3, name: 'Day 3', nameEl: 'Μέρα 3', focus: 'Upper Body', focusEl: 'Άνω Μέρος', exercises: ['incline_push_up','push_up','tricep_dip','plank','bicycle_crunch'] },
      { dayNumber: 4, name: 'Day 4', nameEl: 'Μέρα 4', focus: 'Glutes & Legs', focusEl: 'Γλουτοί & Πόδια', exercises: ['squat','lunge','glute_bridge','jump_squat','calf_raise'] },
    ],
  },

  // ── MUSCLE GAIN ────────────────────────────────────────────

  {
    id: 'muscle_gain_beginner_male',
    name: 'Build: 8-Week Strength Foundation',
    nameEl: 'Build: 8 Εβδομάδες Βάση Ισχύος',
    description: 'An 8-week beginner-to-intermediate program covering all fundamental calisthenics movements with progressive overload built in week by week.',
    descriptionEl: '8 εβδομάδες αρχάριου-ενδιάμεσου με όλες τις θεμελιώδεις κινήσεις και ενσωματωμένη προοδευτική υπερφόρτωση.',
    goal: 'gain_muscle', sex: ['male'],
    minAge: 16, maxAge: 50, minWeight: 0, maxWeight: 999,
    difficulty: 'beginner', durationWeeks: 8, sessionsPerWeek: 4, sessionDurationMin: 40,
    tags: ['Muscle Gain','Strength','Progressive','Full Body'],
    tagsEl: ['Μυϊκή Ανάπτυξη','Ισχύς','Προοδευτικό','Ολόκληρο Σώμα'],
    weeklyStructure: [
      { weeks: '1-2', focus: 'Learn Push/Pull split', focusEl: 'Μαθαίνω Push/Pull split', intensity: 'light' },
      { weeks: '3-4', focus: 'Add negatives and harder variations', focusEl: 'Αρνητικές και πιο δύσκολες παραλλαγές', intensity: 'moderate' },
      { weeks: '5-6', focus: 'Volume peak', focusEl: 'Κορύφωση όγκου', intensity: 'high' },
      { weeks: '7-8', focus: 'Intensity + skill work', focusEl: 'Ένταση + δεξιότητες', intensity: 'high' },
    ],
    days: [
      { dayNumber: 1, name: 'Push Day', nameEl: 'Μέρα Ώθησης', focus: 'Chest, Shoulders, Triceps', focusEl: 'Στήθος, Ώμοι, Τρικέφαλα', exercises: ['push_up','diamond_push_up','pike_push_up','tricep_dip','plank'] },
      { dayNumber: 2, name: 'Pull Day', nameEl: 'Μέρα Έλξης', focus: 'Back & Biceps', focusEl: 'Πλάτη & Δικέφαλα', exercises: ['dead_hang','scapular_pull','negative_pull_up','chin_up','superman'] },
      { dayNumber: 3, name: 'Legs & Core', nameEl: 'Πόδια & Κορμός', focus: 'Full Lower Body', focusEl: 'Πλήρες Κάτω Μέρος', exercises: ['squat','lunge','bulgarian_split_squat','glute_bridge','hollow_body_hold'] },
      { dayNumber: 4, name: 'Full Body Power', nameEl: 'Ισχύς Ολόκληρου Σώματος', focus: 'Compound movements', focusEl: 'Σύνθετες κινήσεις', exercises: ['pull_up','dip','squat','burpee','leg_raise'] },
    ],
  },

  {
    id: 'muscle_gain_intermediate_female',
    name: 'Power Form: Lean Muscle for Women',
    nameEl: 'Power Form: Άπαχη Μάζα για Γυναίκες',
    description: 'An 8-week intermediate program for women to build lean muscle, strength, and an athletic physique through progressive calisthenics.',
    descriptionEl: '8 εβδομάδες για γυναίκες για χτίσιμο άπαχης μυϊκής μάζας και αθλητικής σιλουέτας.',
    goal: 'gain_muscle', sex: ['female'],
    minAge: 16, maxAge: 50, minWeight: 0, maxWeight: 999,
    difficulty: 'intermediate', durationWeeks: 8, sessionsPerWeek: 4, sessionDurationMin: 45,
    tags: ['Lean Muscle','Women','Strength','Intermediate'],
    tagsEl: ['Άπαχη Μάζα','Γυναίκες','Ισχύς','Ενδιάμεσο'],
    weeklyStructure: [
      { weeks: '1-2', focus: 'Establish baseline', focusEl: 'Καθορισμός βάσης', intensity: 'moderate' },
      { weeks: '3-5', focus: 'Progressive overload', focusEl: 'Προοδευτική υπερφόρτωση', intensity: 'high' },
      { weeks: '6-8', focus: 'Peak and consolidate', focusEl: 'Κορύφωση και εδραίωση', intensity: 'high' },
    ],
    days: [
      { dayNumber: 1, name: 'Upper Strength', nameEl: 'Ισχύς Άνω Μέρους', focus: 'Push & Core', focusEl: 'Ώθηση & Κορμός', exercises: ['push_up','diamond_push_up','pike_push_up','tricep_dip','hollow_body_hold'] },
      { dayNumber: 2, name: 'Lower Power', nameEl: 'Δύναμη Κάτω Μέρους', focus: 'Glutes & Quads', focusEl: 'Γλουτοί & Τετρακέφαλα', exercises: ['squat','bulgarian_split_squat','lunge','glute_bridge','calf_raise'] },
      { dayNumber: 3, name: 'Pull & Core', nameEl: 'Έλξη & Κορμός', focus: 'Back & Abs', focusEl: 'Πλάτη & Κοιλιακοί', exercises: ['chin_up','pull_up','superman','leg_raise','bicycle_crunch'] },
      { dayNumber: 4, name: 'Full Body Circuit', nameEl: 'Κύκλωμα', focus: 'Conditioning', focusEl: 'Φυσική Κατάσταση', exercises: ['burpee','push_up','jump_squat','dip','plank'] },
    ],
  },

  // ── STAY SLIM ──────────────────────────────────────────────

  {
    id: 'stay_slim_all',
    name: 'Equilibrium: Stay Sharp',
    nameEl: 'Ισορροπία: Μείνε Σε Φόρμα',
    description: 'A 4-week maintenance program to keep you lean, mobile, and energized. 3 sessions per week — no excuses.',
    descriptionEl: '4εβδομαδιαίο πρόγραμμα συντήρησης για να παραμένεις λεπτός, κινητικός και γεμάτος ενέργεια. 3 συνεδρίες.',
    goal: 'stay_slim', sex: ['male','female'],
    minAge: 16, maxAge: 70, minWeight: 0, maxWeight: 999,
    difficulty: 'beginner', durationWeeks: 4, sessionsPerWeek: 3, sessionDurationMin: 25,
    tags: ['Maintenance','Mobility','Full Body','Quick'],
    tagsEl: ['Συντήρηση','Κινητικότητα','Ολόκληρο Σώμα','Γρήγορο'],
    days: [
      { dayNumber: 1, name: 'Day 1', nameEl: 'Μέρα 1', focus: 'Full Body Flow', focusEl: 'Ροή Ολόκληρου Σώματος', exercises: ['jumping_jack','push_up','squat','plank','superman'] },
      { dayNumber: 2, name: 'Day 2', nameEl: 'Μέρα 2', focus: 'Core & Mobility', focusEl: 'Κορμός & Κινητικότητα', exercises: ['hollow_body_hold','mountain_climber','glute_bridge','leg_raise','bicycle_crunch'] },
      { dayNumber: 3, name: 'Day 3', nameEl: 'Μέρα 3', focus: 'Active Cardio', focusEl: 'Ενεργό Καρδιο', exercises: ['high_knees','jump_squat','burpee','lunge','plank'] },
    ],
  },

  {
    id: 'stay_slim_advanced',
    name: 'Elite Maintenance: Skills & Strength',
    nameEl: 'Προχωρημένη Συντήρηση: Δεξιότητες & Ισχύς',
    description: 'For those already in shape who want to maintain while adding advanced calisthenics skills: handstand push-ups, pistol squats, and muscle-up progressions.',
    descriptionEl: 'Για όσους είναι ήδη σε φόρμα και θέλουν να συντηρηθούν προσθέτοντας προχωρημένες δεξιότητες: handstand push-ups, pistol squats.',
    goal: 'stay_slim', sex: ['male','female'],
    minAge: 16, maxAge: 55, minWeight: 0, maxWeight: 999,
    difficulty: 'advanced', durationWeeks: 6, sessionsPerWeek: 4, sessionDurationMin: 45,
    tags: ['Advanced','Skills','Handstand','Pistol Squat'],
    tagsEl: ['Προχωρημένο','Δεξιότητες','Χειροστασία','Πιστόλι'],
    weeklyStructure: [
      { weeks: '1-2', focus: 'Skill assessment and baseline', focusEl: 'Αξιολόγηση δεξιοτήτων', intensity: 'moderate' },
      { weeks: '3-4', focus: 'Skill volume peak', focusEl: 'Κορύφωση δεξιοτήτων', intensity: 'high' },
      { weeks: '5-6', focus: 'Consolidate and refine', focusEl: 'Εδραίωση και βελτίωση', intensity: 'high' },
    ],
    days: [
      { dayNumber: 1, name: 'Skill Day A', nameEl: 'Δεξιότητες Α', focus: 'Push Skills', focusEl: 'Δεξιότητες Ώθησης', exercises: ['handstand_push_up_wall','pike_push_up','diamond_push_up','dip','plank'] },
      { dayNumber: 2, name: 'Skill Day B', nameEl: 'Δεξιότητες Β', focus: 'Pull Skills', focusEl: 'Δεξιότητες Έλξης', exercises: ['pull_up','chin_up','leg_raise','hollow_body_hold','superman'] },
      { dayNumber: 3, name: 'Legs Skill', nameEl: 'Πόδια Δεξιότητες', focus: 'Pistol & Power', focusEl: 'Πιστόλι & Ισχύς', exercises: ['pistol_squat','bulgarian_split_squat','jump_squat','calf_raise','glute_bridge'] },
      { dayNumber: 4, name: 'Conditioning', nameEl: 'Κατάσταση', focus: 'Full Body Burn', focusEl: 'Καύση Ολόκληρου Σώματος', exercises: ['burpee','pull_up','push_up','jump_squat','mountain_climber'] },
    ],
  },

  {
    id: 'muscle_gain_intermediate_male',
    name: 'Iron Body: Strength Builder',
    nameEl: 'Iron Body: Χτίστης Ισχύος',
    description: 'An 8-week intermediate program focused on progressive calisthenics to build serious upper body strength and lean mass.',
    descriptionEl: '8 εβδομάδες ενδιάμεσου με εστίαση σε progressive calisthenics για σοβαρή δύναμη και άπαχη μάζα.',
    goal: 'gain_muscle', sex: ['male'],
    minAge: 16, maxAge: 50, minWeight: 0, maxWeight: 999,
    difficulty: 'intermediate', durationWeeks: 8, sessionsPerWeek: 5, sessionDurationMin: 50,
    tags: ['Muscle Gain','Strength','Upper Body','Intermediate'],
    tagsEl: ['Μυϊκή Ανάπτυξη','Ισχύς','Άνω Μέρος','Ενδιάμεσο'],
    weeklyStructure: [
      { weeks: '1-2', focus: 'Volume foundation', focusEl: 'Βάση όγκου', intensity: 'moderate' },
      { weeks: '3-5', focus: 'Progressive overload every session', focusEl: 'Προοδευτική υπερφόρτωση ανά συνεδρία', intensity: 'high' },
      { weeks: '6-8', focus: 'Intensity peak + skill integration', focusEl: 'Κορύφωση έντασης + δεξιότητες', intensity: 'high' },
    ],
    days: [
      { dayNumber: 1, name: 'Push Day', nameEl: 'Μέρα Ώθησης', focus: 'Chest & Shoulders', focusEl: 'Στήθος & Ώμοι', exercises: ['push_up','diamond_push_up','pike_push_up','dip','plank'] },
      { dayNumber: 2, name: 'Pull Day', nameEl: 'Μέρα Έλξης', focus: 'Back & Biceps', focusEl: 'Πλάτη & Δικέφαλα', exercises: ['pull_up','chin_up','leg_raise','superman','plank'] },
      { dayNumber: 3, name: 'Legs & Core', nameEl: 'Πόδια & Κορμός', focus: 'Lower Body', focusEl: 'Κάτω Μέρος', exercises: ['squat','lunge','bulgarian_split_squat','glute_bridge','hollow_body_hold'] },
      { dayNumber: 4, name: 'Push + Core', nameEl: 'Ώθηση + Κορμός', focus: 'Triceps & Abs', focusEl: 'Τρικέφαλα & Κοιλιακοί', exercises: ['dip','push_up','pike_push_up','mountain_climber','bicycle_crunch'] },
      { dayNumber: 5, name: 'Full Body Power', nameEl: 'Ισχύς Ολόκληρου Σώματος', focus: 'Peak Effort', focusEl: 'Μέγιστη Προσπάθεια', exercises: ['pull_up','dip','squat','burpee','leg_raise'] },
    ],
  },
];

// ============================================================
// DIET PLANS — 3 deep plans with 7-day weekly meal plans
// ============================================================
export const dietPlans: DietPlan[] = [
  {
    id: 'diet_lose_weight',
    name: 'Lean Fuel Protocol', nameEl: 'Πρωτόκολλο Άπαχης Τροφοδοσίας',
    goal: 'lose_weight', sex: ['male','female'],
    description: 'A caloric deficit diet rich in protein to preserve muscle while burning fat.',
    descriptionEl: 'Δίαιτα θερμιδικού ελλείμματος πλούσια σε πρωτεΐνη για διατήρηση μυϊκής μάζας κατά την καύση λίπους.',
    dailyCalories: (weight) => Math.round(weight * 28 - 400),
    macros: { protein: 35, carbs: 40, fat: 25 },
    tips: [
      'Drink at least 2.5L of water daily — thirst disguises itself as hunger.',
      'Eat slowly: it takes 20 minutes to feel full.',
      'Sleep 7-9 hours — poor sleep raises hunger hormones by 25%.',
      'Avoid liquid calories: sodas and alcohol derail progress silently.',
      'Meal prep on Sundays to avoid poor midweek choices.',
      'Never skip breakfast — it sets your metabolic tone.',
      'If hungry between meals, drink water and wait 10 minutes first.',
    ],
    tipsEl: [
      'Πιείτε τουλάχιστον 2.5L νερό — η δίψα μεταμφιέζεται σε πείνα.',
      'Φάτε αργά: χρειάζονται 20 λεπτά να νιώσετε χορτάτοι.',
      'Κοιμηθείτε 7-9 ώρες — ο κακός ύπνος αυξάνει ορμόνες πείνας κατά 25%.',
      'Αποφύγετε υγρές θερμίδες: αναψυκτικά και αλκοόλ σαμποτάρουν αθόρυβα.',
      'Προετοιμάστε γεύματα Κυριακή για να αποφύγετε κακές επιλογές.',
      'Μην παραλείπετε πρωινό — καθορίζει τον μεταβολικό τόνο.',
      'Αν πεινάτε μεταξύ γευμάτων, πιείτε νερό και περιμένετε 10 λεπτά.',
    ],
    meals: [
      { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'High-protein start', descriptionEl:'Εκκίνηση με υψηλή πρωτεΐνη', calories: 380,
        examples:['3 scrambled eggs + spinach + 1 slice whole grain toast','Greek yogurt (200g) + berries + 1 tsp honey','Overnight oats + protein powder + almonds'],
        examplesEl:['3 αυγά scrambled + σπανάκι + 1 φέτα ψωμί ολικής','Ελληνικό γιαούρτι (200g) + μούρα + 1 κ.γ. μέλι','Βρώμη νύχτας + πρωτεΐνη + αμύγδαλα'] },
      { name:'Mid-Morning', nameEl:'Δεκατιανό', time:'10:00', description:'Light snack', descriptionEl:'Ελαφρύ σνακ', calories: 200,
        examples:['Apple + 15 almonds','Protein shake (25g protein)','Cottage cheese (150g)'],
        examplesEl:['Μήλο + 15 αμύγδαλα','Shake πρωτεΐνης (25g)','Cottage cheese (150g)'] },
      { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'Biggest meal of the day', descriptionEl:'Το μεγαλύτερο γεύμα', calories: 550,
        examples:['Grilled chicken (200g) + salad + brown rice (80g)','Tuna (150g) + avocado + whole grain wrap','Turkey stir-fry + quinoa'],
        examplesEl:['Ψητό κοτόπουλο (200g) + σαλάτα + καστανό ρύζι (80g)','Τόνος (150g) + αβοκάντο + ολικής wrap','Γαλοπούλα stir-fry + κινόα'] },
      { name:'Pre-Workout', nameEl:'Πριν Γυμναστική', time:'16:00', description:'Light carbs for energy', descriptionEl:'Ελαφριοί υδατάνθρακες', calories: 180,
        examples:['Banana','2 rice cakes + peanut butter','Small sweet potato'],
        examplesEl:['Μπανάνα','2 ρυζόγαλα + φυστικοβούτυρο','Μικρή γλυκοπατάτα'] },
      { name:'Dinner', nameEl:'Βραδινό', time:'19:00', description:'Protein-rich, lower carb', descriptionEl:'Πλούσιο σε πρωτεΐνη', calories: 500,
        examples:['Baked salmon (180g) + broccoli + 50g rice','Lean beef stir-fry + mixed vegetables','Grilled chicken thigh + roasted sweet potato + salad'],
        examplesEl:['Ψητός σολομός (180g) + μπρόκολο + 50g ρύζι','Άπαχο μοσχάρι stir-fry + λαχανικά','Ψητό μπούτι κοτόπουλου + γλυκοπατάτα + σαλάτα'] },
    ],
    weeklyPlan: [
      { day:'Monday', dayEl:'Δευτέρα', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'', descriptionEl:'', examples:['3 boiled eggs + 1 toast ολικής + black coffee'], examplesEl:['3 βραστά αυγά + 1 φέτα ψωμί ολικής + μαύρος καφές'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Grilled chicken (200g) + brown rice (80g) + Greek salad'], examplesEl:['Ψητό κοτόπουλο (200g) + καστανό ρύζι (80g) + χωριάτικη'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:00', description:'', descriptionEl:'', examples:['Baked salmon (180g) + steamed broccoli + olive oil'], examplesEl:['Ψητός σολομός (180g) + βραστό μπρόκολο + ελαιόλαδο'] },
      ]},
      { day:'Tuesday', dayEl:'Τρίτη', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'', descriptionEl:'', examples:['Greek yogurt (200g) + oats (40g) + banana'], examplesEl:['Ελληνικό γιαούρτι (200g) + βρώμη (40g) + μπανάνα'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Tuna (150g) + whole grain wrap + lettuce + avocado'], examplesEl:['Τόνος (150g) + ολικής wrap + μαρούλι + αβοκάντο'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:00', description:'', descriptionEl:'', examples:['Turkey mince (200g) + tomatoes + vegetables + 50g quinoa'], examplesEl:['Κιμάς γαλοπούλας (200g) + ντομάτες + λαχανικά + 50g κινόα'] },
      ]},
      { day:'Wednesday', dayEl:'Τετάρτη', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'', descriptionEl:'', examples:['Protein shake (30g) + apple + 20 almonds'], examplesEl:['Shake πρωτεΐνης (30g) + μήλο + 20 αμύγδαλα'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Chicken breast (200g) + lentil soup (200ml)'], examplesEl:['Στήθος κοτόπουλου (200g) + φακές (200ml)'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:00', description:'', descriptionEl:'', examples:['Grilled sea bass (200g) + roasted Mediterranean vegetables'], examplesEl:['Ψητό λαβράκι (200g) + ψητά μεσογειακά λαχανικά'] },
      ]},
      { day:'Thursday', dayEl:'Πέμπτη', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'', descriptionEl:'', examples:['2-egg omelette + feta + tomato + 1 slice rye bread'], examplesEl:['Ομελέτα 2 αυγών + φέτα + ντομάτα + 1 φέτα σίκαλης'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Beef stir-fry (180g) + peppers + broccoli + 80g rice'], examplesEl:['Μοσχάρι stir-fry (180g) + πιπεριές + μπρόκολο + 80g ρύζι'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:00', description:'', descriptionEl:'', examples:['Cottage cheese (200g) + cucumber + cherry tomatoes'], examplesEl:['Cottage cheese (200g) + αγγούρι + ντοματίνια'] },
      ]},
      { day:'Friday', dayEl:'Παρασκευή', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'', descriptionEl:'', examples:['Overnight oats (50g) + milk + chia seeds + blueberries'], examplesEl:['Βρώμη νύχτας (50g) + γάλα + chia + βατόμουρα'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Grilled chicken (180g) + mixed greens + olive oil dressing'], examplesEl:['Ψητό κοτόπουλο (180g) + μεικτά χόρτα + vinaigrette'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:00', description:'', descriptionEl:'', examples:['Shrimp (200g) stir-fry + zucchini + peppers'], examplesEl:['Γαρίδες (200g) stir-fry + κολοκυθάκι + πιπεριές'] },
      ]},
      { day:'Saturday', dayEl:'Σάββατο', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'8:30', description:'', descriptionEl:'', examples:['Veggie omelette: 3 eggs + spinach + mushrooms + peppers'], examplesEl:['Ομελέτα λαχανικών: 3 αυγά + σπανάκι + μανιτάρια + πιπεριές'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:30', description:'', descriptionEl:'', examples:['Baked cod (200g) + sweet potato (150g) + green beans'], examplesEl:['Ψητός μπακαλιάρος (200g) + γλυκοπατάτα (150g) + φασολάκια'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:30', description:'Flexible — stay within calorie target', descriptionEl:'Ευέλικτο — μένε εντός στόχου θερμίδων', examples:['Lean protein (180g) + large salad'], examplesEl:['Άπαχη πρωτεΐνη (180g) + μεγάλη σαλάτα'] },
      ]},
      { day:'Sunday', dayEl:'Κυριακή', meals:[
        { name:'Brunch', nameEl:'Μπράντς', time:'10:00', description:'', descriptionEl:'', examples:['3 poached eggs + avocado (½) + 2 slices whole grain toast'], examplesEl:['3 ποσέ αυγά + αβοκάντο (½) + 2 φέτες ψωμί ολικής'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:00', description:'Meal prep day — cook for the week', descriptionEl:'Ημέρα προετοιμασίας — μαγείρεψε για την εβδομάδα', examples:['Grilled chicken + rice + roasted vegetables (batch cook)'], examplesEl:['Ψητό κοτόπουλο + ρύζι + ψητά λαχανικά (batch cook)'] },
      ]},
    ],
    foods: [
      { category:'Proteins', categoryEl:'Πρωτεΐνες', icon:'🥩',
        items:['Chicken breast','Tuna','Salmon','Eggs','Greek yogurt','Cottage cheese','Turkey','Sea bass','Shrimp','Cod'],
        itemsEl:['Στήθος κοτόπουλου','Τόνος','Σολομός','Αυγά','Ελληνικό γιαούρτι','Cottage cheese','Γαλοπούλα','Λαβράκι','Γαρίδες','Μπακαλιάρος'],
        avoid:['Processed meats','Fried chicken','Sausages'],
        avoidEl:['Επεξεργασμένα κρέατα','Τηγανητό κοτόπουλο','Λουκάνικα'] },
      { category:'Carbohydrates', categoryEl:'Υδατάνθρακες', icon:'🌾',
        items:['Oats','Brown rice','Sweet potato','Quinoa','Whole grain bread','Lentils','Rye bread','Chickpeas'],
        itemsEl:['Βρώμη','Καστανό ρύζι','Γλυκοπατάτα','Κινόα','Ψωμί ολικής','Φακές','Ψωμί σίκαλης','Ρεβίθια'],
        avoid:['White bread','Sugary cereals','Pastries','Chips'],
        avoidEl:['Άσπρο ψωμί','Γλυκά δημητριακά','Αρτοσκευάσματα','Τσιπς'] },
      { category:'Fats', categoryEl:'Λίπη', icon:'🥑',
        items:['Avocado','Almonds','Walnuts','Olive oil','Chia seeds','Feta (moderate)'],
        itemsEl:['Αβοκάντο','Αμύγδαλα','Καρύδια','Ελαιόλαδο','Σπόροι chia','Φέτα (μετρίως)'],
        avoid:['Fried foods','Margarine','Mayonnaise'],
        avoidEl:['Τηγανητά','Μαργαρίνη','Μαγιονέζα'] },
      { category:'Vegetables', categoryEl:'Λαχανικά', icon:'🥦',
        items:['Broccoli','Spinach','Cucumber','Bell peppers','Zucchini','Green beans','Mushrooms','Tomatoes'],
        itemsEl:['Μπρόκολο','Σπανάκι','Αγγούρι','Πιπεριές','Κολοκυθάκι','Φασολάκια','Μανιτάρια','Ντομάτες'],
        avoid:['Corn in excess','Fried potatoes'],
        avoidEl:['Καλαμπόκι σε υπερβολή','Τηγανητές πατάτες'] },
    ],
  },

  {
    id: 'diet_gain_muscle',
    name: 'Mass Engine Protocol', nameEl: 'Πρωτόκολλο Μάζας',
    goal: 'gain_muscle', sex: ['male','female'],
    description: 'A caloric surplus diet optimized for muscle protein synthesis. High protein, strategic carb timing, and healthy fats for recovery.',
    descriptionEl: 'Δίαιτα θερμιδικού πλεονάσματος για σύνθεση μυϊκής πρωτεΐνης. Υψηλή πρωτεΐνη, στρατηγικοί υδατάνθρακες.',
    dailyCalories: (weight) => Math.round(weight * 33 + 300),
    macros: { protein: 30, carbs: 50, fat: 20 },
    tips: [
      'Eat every 3-4 hours to maintain a positive nitrogen balance.',
      'Target 1.6–2.2g of protein per kg of bodyweight daily.',
      'Time carbs around workouts for maximum performance.',
      'Creatine monohydrate (3-5g/day) is the most evidence-backed supplement.',
      'Prioritize sleep — 80% of muscle is built during recovery, not training.',
      'Track calories for 2 weeks to truly understand your intake.',
      'Don\'t fear carbs — they are the primary fuel for calisthenics.',
    ],
    tipsEl: [
      'Φάτε κάθε 3-4 ώρες για θετικό ισοζύγιο αζώτου.',
      'Στόχος 1.6–2.2g πρωτεΐνης ανά kg βάρους ημερησίως.',
      'Υδατάνθρακες γύρω από τις προπονήσεις.',
      'Κρεατίνη μονοϋδρική (3-5g/ημέρα) — το πιο τεκμηριωμένο συμπλήρωμα.',
      'Ύπνος — 80% της μυϊκής ανάπτυξης γίνεται εκτός γυμναστηρίου.',
      'Παρακολουθήστε θερμίδες 2 εβδομάδες.',
      'Μη φοβάστε τους υδατάνθρακες — είναι το κύριο καύσιμο.',
    ],
    meals: [
      { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'High-calorie muscle-building start', descriptionEl:'Εκκίνηση υψηλών θερμίδων', calories: 650,
        examples:['Oatmeal (100g) + banana + 2 scoops protein + peanut butter','4 whole eggs + 2 slices whole grain toast + OJ','Mass smoothie: 2 bananas + oats + whole milk + peanut butter + protein'],
        examplesEl:['Βρώμη (100g) + μπανάνα + 2 μέτρα πρωτεΐνης + φυστικοβούτυρο','4 αυγά + 2 φέτες ψωμί ολικής + φρέσκος χυμός','Smoothie: 2 μπανάνες + βρώμη + πλήρες γάλα + φυστικοβούτυρο + πρωτεΐνη'] },
      { name:'Mid-Morning', nameEl:'Δεκατιανό', time:'10:30', description:'Protein and carb bridge', descriptionEl:'Γέφυρα πρωτεΐνης', calories: 350,
        examples:['Cottage cheese (200g) + fruit + granola','Protein bar (30g protein) + banana','4 rice cakes + peanut butter + honey'],
        examplesEl:['Cottage cheese (200g) + φρούτα + γκρανόλα','Μπάρα πρωτεΐνης (30g) + μπανάνα','4 ρυζόγαλα + φυστικοβούτυρο + μέλι'] },
      { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'Largest meal — protein + carbs', descriptionEl:'Μεγαλύτερο γεύμα', calories: 800,
        examples:['Chicken breast (250g) + white rice (150g) + roasted vegetables','Beef mince (250g) + pasta (200g) + tomato sauce','Salmon (200g) + quinoa (150g) + green salad'],
        examplesEl:['Στήθος κοτόπουλου (250g) + άσπρο ρύζι (150g) + ψητά λαχανικά','Κιμάς (250g) + ζυμαρικά (200g) + σάλτσα ντομάτας','Σολομός (200g) + κινόα (150g) + σαλάτα'] },
      { name:'Pre-Workout', nameEl:'Πριν Γυμναστική', time:'16:30', description:'Fast-digesting carbs + protein', descriptionEl:'Γρήγοροι υδατάνθρακες', calories: 400,
        examples:['Banana + protein shake (30g)','White rice (100g) + chicken (100g)','2 dates + protein shake'],
        examplesEl:['Μπανάνα + shake πρωτεΐνης (30g)','Άσπρο ρύζι (100g) + κοτόπουλο (100g)','2 χουρμάδες + shake'] },
      { name:'Post-Workout', nameEl:'Μετά Γυμναστική', time:'18:30', description:'Immediate recovery', descriptionEl:'Άμεση ανάκαμψη', calories: 400,
        examples:['Protein shake + banana + 20g oats','Chocolate milk (400ml)','Greek yogurt (200g) + honey + granola'],
        examplesEl:['Shake πρωτεΐνης + μπανάνα + 20g βρώμη','Σοκολατούχο γάλα (400ml)','Ελληνικό γιαούρτι (200g) + μέλι + γκρανόλα'] },
      { name:'Dinner', nameEl:'Βραδινό', time:'20:00', description:'Slow-digesting protein for overnight recovery', descriptionEl:'Αργής πέψης πρωτεΐνη', calories: 700,
        examples:['Steak (200g) + roasted potatoes (200g) + salad','Salmon (200g) + brown rice (100g) + broccoli','Chicken thighs (200g) + lentils (200g) + vegetables'],
        examplesEl:['Μπριζόλα (200g) + ψητές πατάτες (200g) + σαλάτα','Σολομός (200g) + καστανό ρύζι (100g) + μπρόκολο','Μπούτια κοτόπουλου (200g) + φακές (200g) + λαχανικά'] },
    ],
    weeklyPlan: [
      { day:'Monday', dayEl:'Δευτέρα', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'', descriptionEl:'', examples:['4 eggs + 100g oats + 1 banana + whole milk'], examplesEl:['4 αυγά + 100g βρώμη + 1 μπανάνα + πλήρες γάλα'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Chicken breast (250g) + white rice (150g) + mixed vegetables'], examplesEl:['Στήθος κοτόπουλου (250g) + άσπρο ρύζι (150g) + μεικτά λαχανικά'] },
        { name:'Post-Workout', nameEl:'Μετά Γυμναστική', time:'18:30', description:'', descriptionEl:'', examples:['Protein shake + banana'], examplesEl:['Shake πρωτεΐνης + μπανάνα'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'20:00', description:'', descriptionEl:'', examples:['Beef steak (200g) + roasted potatoes (200g)'], examplesEl:['Μπριζόλα μοσχαρίσια (200g) + ψητές πατάτες (200g)'] },
      ]},
      { day:'Tuesday', dayEl:'Τρίτη', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'', descriptionEl:'', examples:['Mass smoothie: 2 bananas + oats (80g) + whole milk + peanut butter (2 tbsp)'], examplesEl:['Smoothie μάζας: 2 μπανάνες + βρώμη (80g) + πλήρες γάλα + φυστικοβούτυρο (2 κ.σ.)'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Beef mince (200g) + pasta (200g) + tomato sauce + parmesan'], examplesEl:['Κιμάς μοσχαρίσιος (200g) + ζυμαρικά (200g) + σάλτσα + παρμεζάνα'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'20:00', description:'', descriptionEl:'', examples:['Salmon (200g) + quinoa (150g) + asparagus'], examplesEl:['Σολομός (200g) + κινόα (150g) + σπαράγγια'] },
      ]},
      { day:'Wednesday', dayEl:'Τετάρτη', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'', descriptionEl:'', examples:['3-egg omelette + cheese + 2 slices toast + OJ'], examplesEl:['Ομελέτα 3 αυγών + τυρί + 2 φέτες ψωμί + χυμός'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Chicken thighs (250g) + baked potatoes (250g)'], examplesEl:['Μπούτια κοτόπουλου (250g) + ψητές πατάτες (250g)'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'20:00', description:'', descriptionEl:'', examples:['Pork tenderloin (200g) + lentils (200g) + carrots'], examplesEl:['Χοιρινό φιλέτο (200g) + φακές (200g) + καρότα'] },
      ]},
      { day:'Thursday', dayEl:'Πέμπτη', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'', descriptionEl:'', examples:['Overnight oats: 100g + whole milk + protein + honey + almonds'], examplesEl:['Βρώμη νύχτας: 100g + πλήρες γάλα + πρωτεΐνη + μέλι + αμύγδαλα'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Tuna (200g) + brown rice (150g) + avocado + cucumber'], examplesEl:['Τόνος (200g) + καστανό ρύζι (150g) + αβοκάντο + αγγούρι'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'20:00', description:'', descriptionEl:'', examples:['Turkey breast (200g) + sweet potato (200g) + broccoli'], examplesEl:['Στήθος γαλοπούλας (200g) + γλυκοπατάτα (200g) + μπρόκολο'] },
      ]},
      { day:'Friday', dayEl:'Παρασκευή', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:00', description:'', descriptionEl:'', examples:['4 whole grain pancakes + Greek yogurt + berries + 1 tbsp maple syrup'], examplesEl:['4 pancakes ολικής + ελληνικό γιαούρτι + μούρα + 1 κ.σ. σιρόπι σφενδάμου'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Chicken breast (250g) + pasta (150g) + marinara'], examplesEl:['Στήθος κοτόπουλου (250g) + ζυμαρικά (150g) + σάλτσα ντομάτας'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'20:00', description:'', descriptionEl:'', examples:['Sea bass (200g) + potato gratin (150g) + green salad'], examplesEl:['Λαβράκι (200g) + γκρατέν πατάτας (150g) + πράσινη σαλάτα'] },
      ]},
      { day:'Saturday', dayEl:'Σάββατο', meals:[
        { name:'Brunch', nameEl:'Μπράντς', time:'10:00', description:'', descriptionEl:'', examples:['Big breakfast: 4 eggs + turkey bacon (3) + avocado + toast'], examplesEl:['Μεγάλο πρωινό: 4 αυγά + μπέικον γαλοπούλας (3) + αβοκάντο + toast'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:30', description:'Earned it', descriptionEl:'Το αξίζεις', examples:['Ribeye steak (220g) + baked potato + salad'], examplesEl:['Ribeye (220g) + ψητή πατάτα + σαλάτα'] },
      ]},
      { day:'Sunday', dayEl:'Κυριακή', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'9:00', description:'', descriptionEl:'', examples:['Greek omelette: 3 eggs + feta + tomato + oregano + bread'], examplesEl:['Ελληνική ομελέτα: 3 αυγά + φέτα + ντομάτα + ρίγανη + ψωμί'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'14:00', description:'Family meal', descriptionEl:'Οικογενειακό γεύμα', examples:['Roast chicken (300g) + roast potatoes + vegetables + olive oil'], examplesEl:['Ψητό κοτόπουλο (300g) + ψητές πατάτες + λαχανικά + ελαιόλαδο'] },
        { name:'Snack', nameEl:'Σνακ', time:'17:00', description:'While meal prepping', descriptionEl:'Κατά την προετοιμασία γευμάτων', examples:['Protein shake'], examplesEl:['Shake πρωτεΐνης'] },
      ]},
    ],
    foods: [
      { category:'Proteins', categoryEl:'Πρωτεΐνες', icon:'🥩',
        items:['Chicken (thighs & breast)','Beef','Salmon','Whole eggs','Whey protein','Whole milk','Tuna','Pork tenderloin','Turkey','Sea bass'],
        itemsEl:['Κοτόπουλο (μπούτια & στήθος)','Μοσχάρι','Σολομός','Ολόκληρα αυγά','Πρωτεΐνη ορού','Πλήρες γάλα','Τόνος','Χοιρινό φιλέτο','Γαλοπούλα','Λαβράκι'],
        avoid:['Highly processed meats','Fast food burgers'],
        avoidEl:['Ιδιαίτερα επεξεργασμένα κρέατα','Μπέργκερ fast food'] },
      { category:'Carbohydrates', categoryEl:'Υδατάνθρακες', icon:'🌾',
        items:['White rice','Oats','Pasta','Whole grain bread','Potatoes','Banana','Dates','Sweet potato','Granola'],
        itemsEl:['Άσπρο ρύζι','Βρώμη','Ζυμαρικά','Ψωμί ολικής','Πατάτες','Μπανάνα','Χουρμάδες','Γλυκοπατάτα','Γκρανόλα'],
        avoid:['Sugary drinks','Candy','Alcohol'],
        avoidEl:['Γλυκά ποτά','Καραμέλες','Αλκοόλ'] },
      { category:'Fats', categoryEl:'Λίπη', icon:'🥑',
        items:['Peanut butter','Almonds','Whole milk','Olive oil','Avocado','Egg yolk','Cheese','Dark chocolate (70%+)'],
        itemsEl:['Φυστικοβούτυρο','Αμύγδαλα','Πλήρες γάλα','Ελαιόλαδο','Αβοκάντο','Κρόκος αυγού','Τυρί','Μαύρη σοκολάτα (70%+)'],
        avoid:['Trans fats','Deep-fried foods'],
        avoidEl:['Τρανς λιπαρά','Βαθιά τηγανητά'] },
      { category:'Supplements', categoryEl:'Συμπληρώματα', icon:'💊',
        items:['Whey protein','Creatine monohydrate','Vitamin D','Omega-3','Magnesium','ZMA'],
        itemsEl:['Πρωτεΐνη ορού','Κρεατίνη μονοϋδρική','Βιταμίνη D','Ωμέγα-3','Μαγνήσιο','ZMA'],
        avoid:['Unproven fat burners','Anabolic steroids'],
        avoidEl:['Αναποδείκτοι καυστήρες λίπους','Αναβολικά στεροειδή'] },
    ],
  },

  {
    id: 'diet_stay_slim',
    name: 'Balance & Vitality Protocol', nameEl: 'Πρωτόκολλο Ισορροπίας & Ζωτικότητας',
    goal: 'stay_slim', sex: ['male','female'],
    description: 'A balanced maintenance diet: energized, lean, and healthy. Variety, whole foods, and enjoying food without guilt.',
    descriptionEl: 'Ισορροπημένη συντήρηση: ενέργεια, λεπτό σώμα, υγεία. Ποικιλία, ολόκληρες τροφές, χαρά στο φαγητό.',
    dailyCalories: (weight) => Math.round(weight * 30),
    macros: { protein: 25, carbs: 45, fat: 30 },
    tips: [
      'Follow the 80/20 rule: eat clean 80% of the time, enjoy 20% freely.',
      'Stay hydrated — thirst is often mistaken for hunger.',
      'Eat a rainbow of vegetables daily for micronutrients.',
      'Limit processed foods and added sugars.',
      'Enjoy treats in moderation — restriction leads to binging.',
      'Cook at home 5+ days a week for full ingredient control.',
      'Eat mindfully — put the phone down and taste your food.',
    ],
    tipsEl: [
      'Κανόνας 80/20: καθαρό φαγητό 80%, ελεύθερα 20%.',
      'Μείνε ενυδατωμένος — η δίψα μεταμφιέζεται σε πείνα.',
      'Χρωματιστά λαχανικά κάθε μέρα για μικροθρεπτικά.',
      'Περιόρισε επεξεργασμένες τροφές και ζάχαρη.',
      'Κεράσματα με μέτρο — η ακραία αποχή οδηγεί σε υπερφαγία.',
      'Μαγείρεψε σπίτι 5+ μέρες.',
      'Τρώγε συνειδητά — κατέβασε το κινητό.',
    ],
    meals: [
      { name:'Breakfast', nameEl:'Πρωινό', time:'7:30', description:'Balanced and energizing', descriptionEl:'Ισορροπημένο και ενεργοποιητικό', calories: 420,
        examples:['Avocado toast (2 slices) + ½ avocado + poached egg','Smoothie bowl: banana + berries + Greek yogurt + granola','Overnight oats + chia seeds + fruit'],
        examplesEl:['Avocado toast (2 φέτες ολικής) + ½ αβοκάντο + ποσέ αυγό','Smoothie bowl: μπανάνα + μούρα + ελληνικό γιαούρτι + γκρανόλα','Βρώμη νύχτας + chia + φρούτα'] },
      { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'Varied and satisfying', descriptionEl:'Ποικίλο και χορταστικό', calories: 550,
        examples:['Mediterranean bowl: quinoa + grilled vegetables + feta + olives','Grilled fish (150g) + large salad + whole grain bread','Veggie wrap + hummus + grilled chicken (120g)'],
        examplesEl:['Μεσογειακό bowl: κινόα + ψητά λαχανικά + φέτα + ελιές','Ψητό ψάρι (150g) + μεγάλη σαλάτα + ψωμί ολικής','Wrap + χούμους + ψητό κοτόπουλο (120g)'] },
      { name:'Afternoon Snack', nameEl:'Απογευματινό Σνακ', time:'16:00', description:'Light and nutritious', descriptionEl:'Ελαφρύ και θρεπτικό', calories: 200,
        examples:['Mixed nuts (30g) + apple','Hummus (3 tbsp) + vegetable sticks','Dark chocolate (20g) + almonds (15g)'],
        examplesEl:['Μεικτοί ξηροί καρποί (30g) + μήλο','Χούμους (3 κ.σ.) + λαχανικά σε φέτες','Μαύρη σοκολάτα (20g) + αμύγδαλα (15g)'] },
      { name:'Dinner', nameEl:'Βραδινό', time:'19:30', description:'Light but complete', descriptionEl:'Ελαφρύ αλλά πλήρες', calories: 480,
        examples:['Grilled chicken (150g) + roasted vegetables + 60g brown rice','Tofu stir-fry (200g) with seasonal vegetables','Vegetable soup + rye bread + feta (30g)'],
        examplesEl:['Ψητό κοτόπουλο (150g) + ψητά λαχανικά + 60g καστανό ρύζι','Τόφου stir-fry (200g) με εποχιακά λαχανικά','Χορτόσουπα + ψωμί σίκαλης + φέτα (30g)'] },
    ],
    weeklyPlan: [
      { day:'Monday', dayEl:'Δευτέρα', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:30', description:'', descriptionEl:'', examples:['Avocado toast (2 slices whole grain) + 1 poached egg + cherry tomatoes'], examplesEl:['Avocado toast (2 φέτες ολικής) + 1 ποσέ αυγό + ντοματίνια'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Mediterranean quinoa bowl: quinoa + grilled peppers + feta + olives + olive oil'], examplesEl:['Μεσογειακό bowl κινόα: κινόα + ψητές πιπεριές + φέτα + ελιές + ελαιόλαδο'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:30', description:'', descriptionEl:'', examples:['Grilled sea bass (180g) + steamed vegetables + lemon'], examplesEl:['Ψητό λαβράκι (180g) + βραστά λαχανικά + λεμόνι'] },
      ]},
      { day:'Tuesday', dayEl:'Τρίτη', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:30', description:'', descriptionEl:'', examples:['Greek yogurt (200g) + granola + banana + honey (1 tsp)'], examplesEl:['Ελληνικό γιαούρτι (200g) + γκρανόλα + μπανάνα + μέλι (1 κ.γ.)'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Chicken wrap: grilled chicken (130g) + whole grain wrap + hummus + greens'], examplesEl:['Wrap: ψητό κοτόπουλο (130g) + ολικής wrap + χούμους + χόρτα'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:30', description:'', descriptionEl:'', examples:['Tofu stir-fry (180g) + 60g brown rice'], examplesEl:['Τόφου stir-fry (180g) + 60g καστανό ρύζι'] },
      ]},
      { day:'Wednesday', dayEl:'Τετάρτη', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:30', description:'', descriptionEl:'', examples:['Overnight oats: 60g + almond milk + chia + blueberries'], examplesEl:['Βρώμη νύχτας: 60g + γάλα αμυγδάλου + chia + βατόμουρα'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Lentil soup (350ml) + 1 slice rye bread + Greek salad'], examplesEl:['Φακές (350ml) + 1 φέτα ψωμί σίκαλης + χωριάτικη'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:30', description:'', descriptionEl:'', examples:['Baked chicken thigh (160g) + roasted sweet potato + spinach salad'], examplesEl:['Ψητό μπούτι κοτόπουλου (160g) + ψητή γλυκοπατάτα + σαλάτα σπανακιού'] },
      ]},
      { day:'Thursday', dayEl:'Πέμπτη', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:30', description:'', descriptionEl:'', examples:['2-egg omelette + spinach + tomato + feta + 1 slice whole grain toast'], examplesEl:['Ομελέτα 2 αυγών + σπανάκι + ντομάτα + φέτα + 1 φέτα ολικής'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Tuna salad: tuna (130g) + cucumber + tomato + olive oil + corn'], examplesEl:['Σαλάτα τόνου: τόνος (130g) + αγγούρι + ντομάτα + ελαιόλαδο + καλαμπόκι'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:30', description:'', descriptionEl:'', examples:['Grilled salmon (160g) + broccoli + 50g quinoa'], examplesEl:['Ψητός σολομός (160g) + μπρόκολο + 50g κινόα'] },
      ]},
      { day:'Friday', dayEl:'Παρασκευή', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'7:30', description:'', descriptionEl:'', examples:['Smoothie bowl: banana + frozen berries + almond milk + granola'], examplesEl:['Smoothie bowl: μπανάνα + κατεψυγμένα μούρα + γάλα αμυγδάλου + γκρανόλα'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'13:00', description:'', descriptionEl:'', examples:['Veggie bowl: roasted vegetables + chickpeas + tahini dressing'], examplesEl:['Bowl λαχανικών: ψητά λαχανικά + ρεβίθια + dressing ταχινιού'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:30', description:'TGIF — enjoy something you love', descriptionEl:'Παρασκευή — απόλαυσε κάτι που αγαπάς', examples:['2 slices whole grain pizza + large salad — no guilt'], examplesEl:['2 κομμάτια πίτσα ολικής + μεγάλη σαλάτα — χωρίς ενοχή'] },
      ]},
      { day:'Saturday', dayEl:'Σάββατο', meals:[
        { name:'Brunch', nameEl:'Μπράντς', time:'10:30', description:'', descriptionEl:'', examples:['Veggie frittata: 3 eggs + zucchini + tomatoes + feta + herbs'], examplesEl:['Φριτάτα: 3 αυγά + κολοκυθάκι + ντομάτες + φέτα + βότανα'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:30', description:'', descriptionEl:'', examples:['Grilled shrimp (200g) + Greek salad + 1 slice bread'], examplesEl:['Ψητές γαρίδες (200g) + χωριάτικη σαλάτα + 1 φέτα ψωμί'] },
      ]},
      { day:'Sunday', dayEl:'Κυριακή', meals:[
        { name:'Breakfast', nameEl:'Πρωινό', time:'9:30', description:'', descriptionEl:'', examples:['3 whole grain pancakes + berries + Greek yogurt + honey'], examplesEl:['3 pancakes ολικής + μούρα + ελληνικό γιαούρτι + μέλι'] },
        { name:'Lunch', nameEl:'Μεσημεριανό', time:'14:00', description:'Family meal — no guilt', descriptionEl:'Κυριακάτικο οικογενειακό — χωρίς ενοχές', examples:['Whatever you love — eat slowly and enjoy it'], examplesEl:['Ό,τι αγαπάς — φάτε αργά και απολαύστε το'] },
        { name:'Dinner', nameEl:'Βραδινό', time:'19:30', description:'Light reset', descriptionEl:'Ελαφρύ για reset', examples:['Vegetable soup + 1 slice bread + 2 boiled eggs'], examplesEl:['Χορτόσουπα + 1 φέτα ψωμί + 2 βραστά αυγά'] },
      ]},
    ],
    foods: [
      { category:'Proteins', categoryEl:'Πρωτεΐνες', icon:'🥩',
        items:['Chicken','Fish','Eggs','Legumes','Greek yogurt','Tofu','Feta','Cottage cheese'],
        itemsEl:['Κοτόπουλο','Ψάρι','Αυγά','Όσπρια','Ελληνικό γιαούρτι','Τόφου','Φέτα','Cottage cheese'],
        avoid:['Processed meats','Fast food'],
        avoidEl:['Επεξεργασμένα κρέατα','Fast food'] },
      { category:'Carbohydrates', categoryEl:'Υδατάνθρακες', icon:'🌾',
        items:['Whole grains','Fruits','Vegetables','Legumes','Oats','Quinoa','Sweet potato'],
        itemsEl:['Ολικής άλεσης','Φρούτα','Λαχανικά','Όσπρια','Βρώμη','Κινόα','Γλυκοπατάτα'],
        avoid:['Refined sugars','Sugary drinks','White bread in excess'],
        avoidEl:['Επεξεργασμένη ζάχαρη','Γλυκά ποτά','Άσπρο ψωμί σε υπερβολή'] },
      { category:'Fats', categoryEl:'Λίπη', icon:'🥑',
        items:['Olive oil','Avocado','Nuts','Seeds','Fatty fish','Dark chocolate (70%+)'],
        itemsEl:['Ελαιόλαδο','Αβοκάντο','Ξηροί καρποί','Σπόροι','Λιπαρά ψάρια','Μαύρη σοκολάτα (70%+)'],
        avoid:['Trans fats','Processed snacks','Fried foods'],
        avoidEl:['Τρανς λιπαρά','Επεξεργασμένα σνακ','Τηγανητά'] },
      { category:'Hydration', categoryEl:'Ενυδάτωση', icon:'💧',
        items:['Water (2L+ daily)','Green tea','Herbal teas','Coconut water','Sparkling water','Coffee (no sugar)'],
        itemsEl:['Νερό (2L+ ημερησίως)','Πράσινο τσάι','Αφεψήματα','Νερό καρύδας','Ανθρακούχο νερό','Καφές (χωρίς ζάχαρη)'],
        avoid:['Sodas','Energy drinks','Alcohol in excess'],
        avoidEl:['Αναψυκτικά','Energy drinks','Αλκοόλ σε υπερβολή'] },
    ],
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getRecommendedPrograms(sex: Sex, age: number, weight: number, goal: Goal): WorkoutProgram[] {
  return programs.filter(p =>
    p.goal === goal &&
    p.sex.includes(sex) &&
    age >= p.minAge && age <= p.maxAge &&
    weight >= p.minWeight && weight <= p.maxWeight
  );
}

export function getDietPlan(goal: Goal): DietPlan | undefined {
  return dietPlans.find(d => d.goal === goal);
}

export function getExercisesByIds(ids: string[]): Exercise[] {
  return ids.map(id => exercises[id]).filter(Boolean);
}

export function getExerciseProgression(exerciseId: string): { before: Exercise | null; after: Exercise | null } {
  const ex = exercises[exerciseId];
  if (!ex) return { before: null, after: null };
  return {
    before: ex.progressionFrom ? (exercises[ex.progressionFrom] ?? null) : null,
    after:  ex.progressionTo   ? (exercises[ex.progressionTo]   ?? null) : null,
  };
}

export function getExercisesByDifficulty(difficulty: Difficulty): Exercise[] {
  return Object.values(exercises).filter(e => e.difficulty === difficulty);
}

export function getExercisesByMuscle(muscle: MuscleGroup): Exercise[] {
  return Object.values(exercises).filter(e => e.muscleGroups.includes(muscle));
}

export function calculateBMI(weight: number, height: number): number {
  return weight / ((height / 100) ** 2);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25)   return 'Normal';
  if (bmi < 30)   return 'Overweight';
  return 'Obese';
}

export function getBMICategoryEl(bmi: number): string {
  if (bmi < 18.5) return 'Λιποβαρής';
  if (bmi < 25)   return 'Κανονικό';
  if (bmi < 30)   return 'Υπέρβαρος';
  return 'Παχύσαρκος';
}

export function getGoalLabel(goal: Goal): string {
  const labels: Record<Goal, string> = {
    lose_weight: 'Lose Weight',
    gain_muscle: 'Gain Muscle',
    stay_slim:   'Stay Slim & Tight',
  };
  return labels[goal];
}

export function getGoalLabelEl(goal: Goal): string {
  const labels: Record<Goal, string> = {
    lose_weight: 'Χάσε Βάρος',
    gain_muscle: 'Απόκτησε Μυς',
    stay_slim:   'Παράμεινε Λεπτός & Σφικτός',
  };
  return labels[goal];
}

export function getGoalDescription(goal: Goal): string {
  const descs: Record<Goal, string> = {
    lose_weight: 'Burn fat, improve cardio, and reveal your physique',
    gain_muscle: 'Build strength, add mass, and transform your body',
    stay_slim:   'Maintain your shape, stay mobile, and feel great',
  };
  return descs[goal];
}

export function getGoalDescriptionEl(goal: Goal): string {
  const descs: Record<Goal, string> = {
    lose_weight: 'Κάψε λίπος, βελτίωσε καρδιο και αποκάλυψε το σώμα σου',
    gain_muscle: 'Χτίσε δύναμη, πρόσθεσε μάζα και μεταμορφώσου',
    stay_slim:   'Διατήρησε σχήμα, κινητικότητα και καλή διάθεση',
  };
  return descs[goal];
}