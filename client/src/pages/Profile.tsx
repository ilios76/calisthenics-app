// ============================================================
// CallistheniX – Profile Page
// View and edit user profile, stats, reset
// ============================================================
import { useState } from 'react';
import { useUser, type UserProfile } from '@/contexts/UserContext';
import { calculateBMI, getBMICategory, getGoalLabel, type Goal, type Sex } from '@/lib/data';
import { Edit2, Save, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { profile, setProfile, completedSessions } = useUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserProfile | null>(null);

  if (!profile) return null;

  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiCat = getBMICategory(bmi);

  const startEdit = () => {
    setForm({ ...profile });
    setEditing(true);
  };

  const saveEdit = () => {
    if (!form) return;
    setProfile(form);
    setEditing(false);
    toast.success('Profile updated!');
  };

  const cancelEdit = () => {
    setForm(null);
    setEditing(false);
  };

  const resetProfile = () => {
    localStorage.removeItem('callisthenix_user');
    window.location.reload();
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.10 0.005 285)' }}>
      <div className="container py-10 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="cx-label mb-2 block">Your Account</span>
            <h1 className="cx-section-title text-5xl" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              PROFILE
            </h1>
          </div>
          {!editing ? (
            <button className="cx-btn-ghost flex items-center gap-2" onClick={startEdit}>
              <Edit2 size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="cx-btn-ghost flex items-center gap-2" onClick={cancelEdit}>
                <X size={14} /> Cancel
              </button>
              <button className="cx-btn-primary flex items-center gap-2" onClick={saveEdit}>
                <Save size={14} /> Save
              </button>
            </div>
          )}
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-5 mb-8 p-5 cx-card">
          <div
            className="w-16 h-16 rounded flex items-center justify-center text-2xl font-black flex-shrink-0"
            style={{ background: 'oklch(0.68 0.18 142)', color: 'oklch(0.10 0.005 285)', fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '1.8rem', letterSpacing: '0.02em', textTransform: 'uppercase', color: 'oklch(0.96 0.008 80)' }}>
              {profile.name}
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'oklch(0.60 0.008 80)' }}>
              {getGoalLabel(profile.goal)} · {profile.fitnessLevel} · {profile.sex}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Sessions Done', value: completedSessions.toString() },
            { label: 'BMI', value: bmi.toFixed(1) },
            { label: 'BMI Status', value: bmiCat },
          ].map(s => (
            <div key={s.label} className="cx-card p-4 text-center">
              <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2rem', color: 'oklch(0.68 0.18 142)', lineHeight: 1 }}>{s.value}</p>
              <p className="cx-label" style={{ fontSize: '0.6rem', marginTop: '4px' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Profile fields */}
        <div className="cx-card p-6 mb-6">
          <h3 className="cx-label mb-5" style={{ fontSize: '0.7rem' }}>Personal Information</h3>
          <div className="space-y-4">
            {!editing ? (
              <>
                {[
                  { label: 'Name', value: profile.name },
                  { label: 'Sex', value: profile.sex },
                  { label: 'Age', value: `${profile.age} years` },
                  { label: 'Weight', value: `${profile.weight} kg` },
                  { label: 'Height', value: `${profile.height} cm` },
                  { label: 'Goal', value: getGoalLabel(profile.goal) },
                  { label: 'Fitness Level', value: profile.fitnessLevel },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid oklch(1 0 0 / 6%)' }}>
                    <span className="cx-label" style={{ fontSize: '0.65rem' }}>{f.label}</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'oklch(0.85 0.008 80)' }}>{f.value}</span>
                  </div>
                ))}
              </>
            ) : form && (
              <div className="space-y-4">
                <div>
                  <label className="cx-label mb-1.5 block" style={{ fontSize: '0.65rem' }}>Name</label>
                  <input className="cx-input" value={form.name} onChange={e => setForm(f => f ? { ...f, name: e.target.value } : f)} />
                </div>
                <div>
                  <label className="cx-label mb-1.5 block" style={{ fontSize: '0.65rem' }}>Sex</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['male', 'female'] as Sex[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setForm(f => f ? { ...f, sex: s } : f)}
                        className="py-2 rounded"
                        style={{
                          fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                          background: form.sex === s ? 'oklch(0.68 0.18 142)' : 'oklch(0.17 0.006 285)',
                          color: form.sex === s ? 'oklch(0.10 0.005 285)' : 'oklch(0.70 0.008 80)',
                          border: '1px solid ' + (form.sex === s ? 'oklch(0.68 0.18 142)' : 'oklch(1 0 0 / 10%)'),
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'age', label: 'Age', type: 'number' },
                    { key: 'weight', label: 'Weight (kg)', type: 'number' },
                    { key: 'height', label: 'Height (cm)', type: 'number' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="cx-label mb-1.5 block" style={{ fontSize: '0.65rem' }}>{f.label}</label>
                      <input
                        className="cx-input"
                        type={f.type}
                        value={(form as any)[f.key]}
                        onChange={e => setForm(prev => prev ? { ...prev, [f.key]: f.type === 'number' ? parseFloat(e.target.value) : e.target.value } : prev)}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="cx-label mb-1.5 block" style={{ fontSize: '0.65rem' }}>Goal</label>
                  <div className="space-y-2">
                    {(['lose_weight', 'gain_muscle', 'stay_slim'] as Goal[]).map(g => (
                      <button
                        key={g}
                        onClick={() => setForm(f => f ? { ...f, goal: g } : f)}
                        className="w-full py-2 px-3 rounded text-left"
                        style={{
                          fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem',
                          background: form.goal === g ? 'oklch(0.65 0.22 40 / 12%)' : 'oklch(0.17 0.006 285)',
                          color: form.goal === g ? 'oklch(0.68 0.18 142)' : 'oklch(0.70 0.008 80)',
                          border: '1px solid ' + (form.goal === g ? 'oklch(0.68 0.18 142)' : 'oklch(1 0 0 / 10%)'),
                        }}
                      >
                        {getGoalLabel(g)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="cx-label mb-1.5 block" style={{ fontSize: '0.65rem' }}>Fitness Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['beginner', 'intermediate', 'advanced'] as const).map(l => (
                      <button
                        key={l}
                        onClick={() => setForm(f => f ? { ...f, fitnessLevel: l } : f)}
                        className="py-2 rounded"
                        style={{
                          fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                          background: form.fitnessLevel === l ? 'oklch(0.68 0.18 142)' : 'oklch(0.17 0.006 285)',
                          color: form.fitnessLevel === l ? 'oklch(0.10 0.005 285)' : 'oklch(0.70 0.008 80)',
                          border: '1px solid ' + (form.fitnessLevel === l ? 'oklch(0.68 0.18 142)' : 'oklch(1 0 0 / 10%)'),
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className="p-5 rounded" style={{ background: 'oklch(0.577 0.245 27.325 / 8%)', border: '1px solid oklch(0.577 0.245 27.325 / 25%)' }}>
          <p className="cx-label mb-1" style={{ fontSize: '0.65rem', color: 'oklch(0.577 0.245 27.325)' }}>Danger Zone</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'oklch(0.65 0.008 80)', marginBottom: '12px' }}>
            Reset your profile and start the onboarding process from scratch.
          </p>
          <button
            onClick={resetProfile}
            className="flex items-center gap-2 px-4 py-2 rounded"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'transparent', color: 'oklch(0.577 0.245 27.325)',
              border: '1px solid oklch(0.577 0.245 27.325 / 50%)',
            }}
          >
            <RotateCcw size={14} /> Reset Profile
          </button>
        </div>
      </div>
    </div>
  );
}
