# Nutrition MVP Backlog

This backlog tracks the household-first nutrition MVP for Fitness Assistant.

Primary target:
- Shared household
- Less processed food
- Low-decision, planning-accessible defaults
- Manual grocery-app handoff first

## Priority order

1. [#1](https://github.com/edwin-lobo/fitness-assistant/issues/1) `[P0]` Define nutrition MVP scope and one-week success metrics - implemented in `docs/nutrition-mvp-spec.md`
2. [#2](https://github.com/edwin-lobo/fitness-assistant/issues/2) `[P0]` Design household and member profile model for nutrition planning - implemented in `docs/nutrition-data-model.md` and `src/data/nutrition.ts`
3. [#3](https://github.com/edwin-lobo/fitness-assistant/issues/3) `[P0]` Build a low-choice weekly meal planning system - implemented in `src/components/NutritionPlanner.tsx`
4. [#4](https://github.com/edwin-lobo/fitness-assistant/issues/4) `[P0]` Generate a grocery checklist from the weekly meal plan - implemented in `src/data/nutrition.ts`
5. [#5](https://github.com/edwin-lobo/fitness-assistant/issues/5) `[P1]` Add share outputs for meal plan and grocery list
6. [#6](https://github.com/edwin-lobo/fitness-assistant/issues/6) `[P1]` Make the nutrition planning flow low-friction and planning-accessible
7. [#7](https://github.com/edwin-lobo/fitness-assistant/issues/7) `[P1]` Add processed-food reduction guidance and practical swap logic
8. [#8](https://github.com/edwin-lobo/fitness-assistant/issues/8) `[P1]` Support weekly habit formation with reusable meal templates
9. [#9](https://github.com/edwin-lobo/fitness-assistant/issues/9) `[P2]` Add richer weekly planner interactions after the repeatable flow works
10. [#10](https://github.com/edwin-lobo/fitness-assistant/issues/10) `[P2]` Design future multi-household and member graph model
11. [#11](https://github.com/edwin-lobo/fitness-assistant/issues/11) `[P3]` Research grocery-app integration feasibility
12. [#12](https://github.com/edwin-lobo/fitness-assistant/issues/12) `[P3]` Generalize nutrition onboarding for broader household demographics

## MVP delivery sequence

The first implementation pass should complete:
- `#1` MVP definition
- `#2` household/member profile model
- `#3` weekly meal planning system
- `#4` grocery checklist generation

The second pass should complete:
- `#5` share outputs
- `#6` low-friction planning
- `#7` processed-food reduction guidance
- `#8` reusable meal templates

The remaining issues are intentionally post-MVP:
- `#9` richer planner interactions
- `#10` future multi-household graph design
- `#11` grocery-app integration research
- `#12` broader demographic onboarding
