import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

async function importTypeScriptModule(path) {
  const source = await readFile(path, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  });

  return import(`data:text/javascript;charset=utf-8,${encodeURIComponent(outputText)}`);
}

const nutrition = await importTypeScriptModule('src/data/nutrition.ts');

test('buildGroceryChecklist consolidates matching ingredients by category item and unit', () => {
  const checklist = nutrition.buildGroceryChecklist(nutrition.defaultWeeklyPlan);
  const produce = checklist.find((section) => section.category === 'Produce');
  const bellPeppers = produce.items.find((item) => item.item === 'Bell peppers');

  assert.equal(bellPeppers.quantity, 15);
  assert.equal(bellPeppers.unit, 'count');
});

test('buildLowerProcessedPlan replaces medium processed dinners and raises low processed percent', () => {
  const originalPercent = nutrition.getLowerProcessedMealPercent(nutrition.defaultWeeklyPlan);
  const lowerProcessedPlan = nutrition.buildLowerProcessedPlan(nutrition.defaultWeeklyPlan);
  const lowerProcessedPercent = nutrition.getLowerProcessedMealPercent(lowerProcessedPlan);

  assert.equal(originalPercent, 90);
  assert.equal(lowerProcessedPercent, 100);
  assert.equal(lowerProcessedPlan.some((day) => day.dinner === 'turkey-chili'), false);
});

test('buildTemplatePlan returns a clone so callers cannot mutate seed templates', () => {
  const firstPlan = nutrition.buildTemplatePlan('low-decision');
  firstPlan[0].breakfast = 'eggs-toast';

  const secondPlan = nutrition.buildTemplatePlan('low-decision');

  assert.equal(secondPlan[0].breakfast, 'oats');
});

test('buildShareOutput includes meal plan and grocery checklist sections', () => {
  const checklist = nutrition.buildGroceryChecklist(nutrition.defaultWeeklyPlan);
  const output = nutrition.buildShareOutput(nutrition.defaultWeeklyPlan, checklist);

  assert.match(output, /^Fitness Assistant weekly nutrition plan/);
  assert.match(output, /Meal plan\nMon: Breakfast - Protein overnight oats/);
  assert.match(output, /Grocery checklist\nProduce/);
});
