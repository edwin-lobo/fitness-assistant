# Nutrition Workflow

This document describes the current nutrition planner flow for product review and manual testing.

## User path

1. Review the household profile and edit member names, preferences, avoids, convenience needs, or repeat tolerance.
2. Start from the prefilled weekly plan or apply a reusable week template.
3. Adjust breakfast, lunch, or dinner selections for individual days as needed.
4. Use low-friction actions when planning bandwidth is low:
   - repeat the default breakfast, lunch, or dinner across the week,
   - apply lower-processed dinner swaps.
5. Review the grocery checklist generated from the selected meals.
6. Choose a share format:
   - full plan,
   - groceries only,
   - reusable meal template.
7. Copy the selected output, email it, text it, or paste the grocery-only output into an external grocery list app.

## Reusable Week Templates

- Balanced repeat week: general default for starting from scratch.
- Batch-cook week: repeats lunches and dinners in pairs to reduce weekday prep.
- Low-decision week: repeats breakfast and lunch heavily for high-friction planning weeks.

## Processed-Food Guidance

The planner treats lower-processed eating as a practical direction, not a perfection rule.

- Meal templates include a `processedLevel` and a practical `swapTip`.
- The planner shows the percentage of lower-processed meals in the current week.
- If medium-processed meals are planned, the guidance section explains how to make the fallback less processed.
- The lower-processed dinner action replaces medium-processed dinners with a lower-processed default.

## Manual Grocery-App Handoff

Direct grocery-app integration is intentionally out of scope for the MVP. The current handoff is copy-first:

- Full plan: includes the weekly meal plan plus categorized groceries.
- Groceries only: plain line-by-line output designed for pasting into an external grocery app.
- Categorized groceries: grouped checklist for review or sharing.

## Review Checklist

- Applying each week template updates the weekly plan and grocery checklist.
- Changing one meal updates the grocery checklist and share output.
- Grocery-only output excludes the meal plan and remains easy to paste elsewhere.
- Lower-processed swaps update the lower-processed percentage and guidance.
- Copy actions show either success text or a browser-blocked fallback.
