# Nutrition Data Model

Implementation: `src/data/nutrition.ts`

This model implements the first four nutrition backlog issues:

- `#1` nutrition MVP scope
- `#2` household and member profile model
- `#3` low-choice weekly meal planning
- `#4` grocery checklist generation

## HouseholdProfile

`HouseholdProfile` is the planning unit. The MVP ships with one default household and editable member records.

Fields:

- `id`: stable household identifier.
- `name`: display name for the household.
- `members`: list of `MemberProfile` records.

## MemberProfile

`MemberProfile` captures the minimum useful planning inputs without requiring accounts.

Fields:

- `id`: stable member identifier.
- `name`: display name.
- `preference`: free-text food preference.
- `avoid`: free-text hard avoid or planning friction.
- `convenienceNeed`: `low`, `medium`, or `high`.
- `repeatTolerance`: `low`, `medium`, or `high`.

## MealTemplate

`MealTemplate` is a repeatable meal pattern rather than a full recipe.

Fields:

- `id`: stable template identifier.
- `name`: meal display name.
- `slot`: `breakfast`, `lunch`, or `dinner`.
- `effort`: rough prep effort.
- `processedLevel`: `low` or `medium`.
- `repeatFriendly`: whether the meal is suitable for repeated use in the same week.
- `why`: short planning rationale.
- `ingredients`: grocery inputs for checklist generation.

## DayPlan

`DayPlan` stores the selected meal template IDs for one day.

Fields:

- `day`: short day label.
- `breakfast`: selected breakfast template ID.
- `lunch`: selected lunch template ID.
- `dinner`: selected dinner template ID.

## GroceryChecklist

The app builds a grocery checklist from the weekly plan by:

- resolving each selected meal template,
- grouping ingredients by grocery category,
- consolidating duplicate item/unit/category combinations,
- sorting items alphabetically inside each category,
- formatting the result for display and share output.

## Helper functions

- `getMealTemplate(id)`: resolves a selected meal template, falling back to the first template if an ID is missing.
- `getMealTemplatesForSlot(slot)`: returns only templates valid for a meal slot.
- `buildGroceryChecklist(plan)`: derives grouped grocery sections from a weekly plan.
- `getLowerProcessedMealPercent(plan)`: calculates the lower-processed meal percentage displayed in the UI.
- `buildShareOutput(plan, groceryChecklist)`: formats the meal plan and grocery checklist for copy/email/text handoff.
- `formatQuantity(value)`: renders integer and decimal grocery quantities consistently.

## Current constraints

- Data is currently static and client-side only.
- Profile edits are local UI state and are not persisted.
- Grocery quantities are simple aggregate totals, not serving-adjusted by household size yet.
- Direct grocery-app integrations are intentionally out of scope for the MVP.
