// ============================================================
// CallistheniX – GIF URLs Mapping
// Maps exercise names to their GIF demonstration URLs
// ============================================================

export const exerciseGifUrls: Record<string, string> = {
  // Provided GIFs
  'Air Squat': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/AirSquat_367487af.gif',
  'Bodyweight Squat': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/BodyweightSquat_d4773509.gif',
  'Burpee': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Burpee_a75f1a27.gif',
  'Close-Grip Push Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Close-gripPushUp_ebe46069.gif',
  'Diamond Push Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/diamondpush-ups_bf6a9647.gif',

  // Fallback for other exercises (to be filled as more GIFs are provided)
  'Push Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Close-gripPushUp_ebe46069.gif',
  'Pull Up': '',
  'Dip': '',
  'Handstand Hold': '',
  'Planche Hold': '',
  'L-Sit': '',
  'Jumping Jack': '',
  'Pike Push Up': '',
  'Leg Raise': '',
  'Glute Bridge': '',
  'High Knees': '',
  'Tricep Dip': '',
  'Superman': '',
};

export function getExerciseGifUrl(exerciseName: string): string | null {
  const url = exerciseGifUrls[exerciseName];
  return url || null;
}
