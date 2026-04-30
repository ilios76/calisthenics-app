// ============================================================
// CallistheniX – GIF URLs Mapping
// Maps exercise NAMES (display names) to their GIF demonstration URLs
// ============================================================

export const exerciseGifUrls: Record<string, string> = {
  // User-uploaded GIFs - mapped to actual exercise display names
  'Bodyweight Squat': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Squat_6cb22367.gif',
  'Burpee': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Burpee_c61f974c.gif',
  'Push-Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Close-gripPushUp_64bfe8ab.gif',
  'Diamond Push-Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/diamondpush-ups_7c4df12a.gif',
  'Pike Push-Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/PikePush-Up_23af9782.gif',
  'Glute Bridge': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/GluteBridge_07b455b1.gif',
  'Hanging Leg Raise': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/HangingLegRaise_f3898315.gif',
  'High Knees': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/HighKnees_ddb86bbd.gif',
  'Jumping Jack': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/JumpingJack_a4eea890.gif',
  'Mountain Climber': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/MountainClimber_3bed8f93.gif',
  'Parallel Bar Dip': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/TricepDip_4d24b041.gif',
  'Plank Hold': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Plank_fcb90549.gif',

  // User-uploaded GIFs - NEW
  'Pull-Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Pull-Up_a5f4017c.gif',
  'Walking Lunge': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/WalkingLunge_c7608109.gif',
  'Superman Hold': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/SupermanHold_b85ef799.gif',
  'Tricep Dip (Chair)': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/TricepDip_4d24b041.gif',

  // Fallback GIFs for other exercises (using public Giphy URLs)
  'Leg Raise': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Close-Grip Push-Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Close-gripPushUp_64bfe8ab.gif',
};

export function getExerciseGifUrl(exerciseName: string): string | null {
  const url = exerciseGifUrls[exerciseName];
  return url || null;
}
