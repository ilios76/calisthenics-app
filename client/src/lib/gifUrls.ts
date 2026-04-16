// ============================================================
// CallistheniX – GIF URLs Mapping
// Maps exercise NAMES (display names) to their GIF demonstration URLs
// ============================================================

export const exerciseGifUrls: Record<string, string> = {
  // User-uploaded GIFs - mapped to actual exercise display names
  'Bodyweight Squat': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/BodyweightSquat_9f8003ee.gif',
  'Burpee': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Burpee_c61f974c.gif',
  'Push-Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Close-gripPushUp_64bfe8ab.gif',
  'Diamond Push-Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/diamondpush-ups_7c4df12a.gif',
  'Pike Push-Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/PikePush-Up_23af9782.gif',
  'Glute Bridge': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/GluteBridge_b5f044d2.gif',
  'Hanging Leg Raise': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/HangingLegRaise_f3898315.gif',
  'High Knees': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/HighKnees_ddb86bbd.gif',
  'Jumping Jack': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/JumpingJack_a4eea890.gif',
  'Mountain Climber': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/MountainClimber_1bce422e.gif',
  'Parallel Bar Dip': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/ParallelBarDip_21ddbb24.gif',
  'Plank Hold': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Plank_fcb90549.gif',

  // Fallback GIFs for other exercises (using public Giphy URLs)
  'Pull-Up': 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5kZXJncm91bmQ/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Walking Lunge': 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
  'Leg Raise': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Superman Hold': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Close-Grip Push-Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Close-gripPushUp_64bfe8ab.gif',
};

export function getExerciseGifUrl(exerciseName: string): string | null {
  const url = exerciseGifUrls[exerciseName];
  return url || null;
}
