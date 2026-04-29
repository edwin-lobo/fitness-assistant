# Nutrition MVP Spec

## Goal

Help a shared household decide what to eat this week, generate a grocery checklist, and share the result into an existing grocery workflow.

## Target users

- Shared households that want lower-friction meal planning.
- People who prefer fewer planning decisions, repeatable defaults, and fast recovery from missed planning.
- Households trying to reduce highly processed food without making the plan unrealistic.

## In scope

- Household-first planning with editable member profiles.
- Low-choice weekly meal planning.
- Repeatable meal templates.
- Grocery checklist generated from the selected weekly plan.
- Manual grocery-app handoff through copy, email, or text output.
- Practical less-processed-food guidance through template choices and swap-friendly language.

## Out of scope for MVP

- Direct grocery-app integration.
- User accounts or cross-household member graphs.
- Medical nutrition advice.
- Full recipe discovery.
- Calorie tracking or detailed intake logging.
- Personalized diagnosis, treatment, or disease-specific nutrition plans.

## Week-one success metrics

- A full seven-day plan can be generated or accepted in under 10 minutes.
- The grocery checklist needs little or no cleanup before being added to an external grocery app.
- At least 70% of planned meals are lower-processed templates.
- The household can reuse the plan structure the following week with only small edits.

## Core concepts

- `Household`: the planning unit for the week.
- `MemberProfile`: preferences, hard avoids, convenience needs, and repeat tolerance for a person in the household.
- `MealTemplate`: a repeatable meal pattern with ingredients and effort level.
- `WeeklyMealPlan`: selected templates across days and meal slots.
- `GroceryChecklist`: consolidated shopping output derived from the weekly plan.
- `ShareOutput`: text formats suitable for copy, email, text, and future web sharing.
