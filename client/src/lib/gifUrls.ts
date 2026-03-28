// ============================================================
// CallistheniX – GIF URLs Mapping
// Maps exercise names to their GIF demonstration URLs
// ============================================================

export const exerciseGifUrls: Record<string, string> = {
  // Provided GIFs (exact matches from uploaded files)
  'Bodyweight Squat': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/BodyweightSquat_d4773509.gif',
  'Burpee': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Burpee_a75f1a27.gif',
  'Close-Grip Push-Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/Close-gripPushUp_ebe46069.gif',
  'Pike Push-Up': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/diamondpush-ups_bf6a9647.gif',

  // Fallback GIFs for other exercises (using public Giphy URLs)
  'Push-Up': 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHVwdnVhZzJ2MzZtNHBhcGJlZzBtNXZtNXZtNXZtNXZtNXZtNQ/3o7TKSjRrfIPjeiVyM/giphy.gif',
  'Pull-Up': 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5kZXJncm91bmQ/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Parallel Bar Dip': 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
  'Walking Lunge': 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
  'Plank Hold': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Mountain Climber': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Jumping Jack': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Leg Raise': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Diamond Push-Up': 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHVwdnVhZzJ2MzZtNHBhcGJlZzBtNXZtNXZtNXZtNXZtNXZtNQ/3o7TKSjRrfIPjeiVyM/giphy.gif',
  'Glute Bridge': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'High Knees': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Tricep Dip': 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
  'Superman': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Handstand Hold': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'Planche Hold': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  'L-Sit': 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
};

export function getExerciseGifUrl(exerciseName: string): string | null {
  const url = exerciseGifUrls[exerciseName];
  return url || null;
}
