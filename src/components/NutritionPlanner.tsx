import React, { useMemo, useState } from 'react';
import {
  buildGroceryChecklist,
  buildShareOutput,
  defaultHousehold,
  defaultWeeklyPlan,
  formatQuantity,
  getLowerProcessedMealPercent,
  getMealTemplatesForSlot,
  mealTemplates,
  type DayPlan,
  type MealSlot,
  type MemberProfile,
  type PreferenceLevel,
} from '../data/nutrition';

const preferenceLevels: PreferenceLevel[] = ['low', 'medium', 'high'];
const mealSlots: MealSlot[] = ['breakfast', 'lunch', 'dinner'];

const NutritionPlanner: React.FC = () => {
  const [members, setMembers] = useState<MemberProfile[]>(defaultHousehold.members);
  const [plan, setPlan] = useState<DayPlan[]>(defaultWeeklyPlan);
  const [shareStatus, setShareStatus] = useState('Ready to share');

  const groceryChecklist = useMemo(() => buildGroceryChecklist(plan), [plan]);
  const shareText = useMemo(() => buildShareOutput(plan, groceryChecklist), [groceryChecklist, plan]);
  const lowerProcessedPercent = useMemo(() => getLowerProcessedMealPercent(plan), [plan]);

  const updateMember = <K extends keyof MemberProfile>(id: string, field: K, value: MemberProfile[K]) => {
    setMembers((current) => current.map((member) => (member.id === id ? { ...member, [field]: value } : member)));
  };

  const updateMeal = (day: string, slot: MealSlot, mealId: string) => {
    setPlan((current) => current.map((item) => (item.day === day ? { ...item, [slot]: mealId } : item)));
  };

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus('Copied plan and grocery list');
    } catch {
      setShareStatus('Copy blocked by browser; use the text box below');
    }
  };

  const repeatSimpleWeek = () => {
    setPlan(defaultWeeklyPlan);
    setShareStatus('Simple repeatable week restored');
  };

  return (
    <section id="nutrition" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 max-w-3xl space-y-4">
        <div className="pill w-fit">Nutrition planning</div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Plan a low-friction week of food</h2>
        <p className="text-lg text-slate-600">
          Build one repeatable household meal plan, turn it into a grocery checklist, and share it with your grocery app.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="space-y-6">
          <article className="card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Household profile</h3>
                <p className="mt-1 text-sm text-slate-600">Two members now, designed to grow later.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {lowerProcessedPercent}% low processed
              </span>
            </div>

            <div className="mt-5 space-y-5">
              {members.map((member) => (
                <div key={member.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <label className="text-sm font-semibold text-slate-700">
                    Member name
                    <input
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
                      value={member.name}
                      onChange={(event) => updateMember(member.id, 'name', event.target.value)}
                    />
                  </label>
                  <div className="mt-3 grid gap-3">
                    <label className="text-sm text-slate-700">
                      Preference
                      <input
                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
                        value={member.preference}
                        onChange={(event) => updateMember(member.id, 'preference', event.target.value)}
                      />
                    </label>
                    <label className="text-sm text-slate-700">
                      Avoid
                      <input
                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
                        value={member.avoid}
                        onChange={(event) => updateMember(member.id, 'avoid', event.target.value)}
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-sm text-slate-700">
                        Convenience need
                        <select
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
                          value={member.convenienceNeed}
                          onChange={(event) =>
                            updateMember(member.id, 'convenienceNeed', event.target.value as PreferenceLevel)
                          }
                        >
                          {preferenceLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-sm text-slate-700">
                        Repeat tolerance
                        <select
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
                          value={member.repeatTolerance}
                          onChange={(event) =>
                            updateMember(member.id, 'repeatTolerance', event.target.value as PreferenceLevel)
                          }
                        >
                          {preferenceLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="card p-6">
            <h3 className="text-lg font-semibold text-slate-900">Share output</h3>
            <p className="mt-1 text-sm text-slate-600">{shareStatus}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyShareText}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Copy grocery handoff
              </button>
              <a
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary-200 hover:text-primary-700"
                href={`mailto:?subject=${encodeURIComponent('Weekly meal plan')}&body=${encodeURIComponent(shareText)}`}
              >
                Email
              </a>
              <a
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary-200 hover:text-primary-700"
                href={`sms:?&body=${encodeURIComponent(shareText)}`}
              >
                Text
              </a>
            </div>
            <textarea
              className="mt-4 h-48 w-full rounded-md border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700"
              readOnly
              value={shareText}
            />
          </article>
        </div>

        <div className="space-y-6">
          <article className="card p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Weekly meal plan</h3>
                <p className="mt-1 text-sm text-slate-600">Defaults repeat meals to lower planning effort.</p>
              </div>
              <button
                type="button"
                onClick={repeatSimpleWeek}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary-200 hover:text-primary-700"
              >
                Reset to simple week
              </button>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="pb-3 pr-3">Day</th>
                    <th className="pb-3 pr-3">Breakfast</th>
                    <th className="pb-3 pr-3">Lunch</th>
                    <th className="pb-3">Dinner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plan.map((day) => (
                    <tr key={day.day}>
                      <td className="py-3 pr-3 font-semibold text-slate-900">{day.day}</td>
                      {mealSlots.map((slot) => (
                        <td key={slot} className="py-3 pr-3">
                          <select
                            className="w-full rounded-md border border-slate-200 px-2 py-2 text-sm"
                            value={day[slot]}
                            onChange={(event) => updateMeal(day.day, slot, event.target.value)}
                          >
                            {getMealTemplatesForSlot(slot).map((meal) => (
                              <option key={meal.id} value={meal.id}>
                                {meal.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <article className="card p-6">
              <h3 className="text-lg font-semibold text-slate-900">Meal templates</h3>
              <div className="mt-4 space-y-3">
                {mealTemplates.map((meal) => (
                  <div key={meal.id} className="rounded-lg border border-slate-100 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{meal.name}</h4>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{meal.why}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        {meal.effort}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="card p-6">
              <h3 className="text-lg font-semibold text-slate-900">Grocery checklist</h3>
              <div className="mt-4 space-y-5">
                {groceryChecklist.map(({ category, items }) => (
                  <div key={category}>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-primary-700">{category}</h4>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      {items.map((item) => (
                        <li key={`${category}-${item.item}-${item.unit}`} className="flex items-start justify-between gap-3">
                          <span>{item.item}</span>
                          <span className="font-semibold text-slate-900">
                            {formatQuantity(item.quantity)} {item.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NutritionPlanner;
