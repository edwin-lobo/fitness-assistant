type MealSlot = 'breakfast' | 'lunch' | 'dinner';
type GroceryCategory = 'Produce' | 'Protein' | 'Dairy' | 'Pantry' | 'Frozen' | 'Bakery';
type PreferenceLevel = 'low' | 'medium' | 'high';

type MemberProfile = {
  id: string;
  name: string;
  preference: string;
  avoid: string;
  convenienceNeed: PreferenceLevel;
  repeatTolerance: PreferenceLevel;
};

type HouseholdProfile = {
  id: string;
  name: string;
  members: MemberProfile[];
};

type Ingredient = {
  item: string;
  quantity: number;
  unit: string;
  category: GroceryCategory;
  pantry?: boolean;
};

type MealTemplate = {
  id: string;
  name: string;
  slot: MealSlot;
  effort: '10 min' | '20 min' | '30 min';
  processedLevel: 'low' | 'medium';
  repeatFriendly: boolean;
  why: string;
  swapTip: string;
  ingredients: Ingredient[];
};

type DayPlan = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

type GrocerySection = {
  category: GroceryCategory;
  items: Ingredient[];
};

type WeekTemplate = {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  plan: DayPlan[];
};

const groceryCategories: GroceryCategory[] = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Frozen', 'Bakery'];

const defaultHousehold: HouseholdProfile = {
  id: 'household-1',
  name: 'Home',
  members: [
    {
      id: 'member-1',
      name: 'Member A',
      preference: 'High-protein, simple prep',
      avoid: 'Decision-heavy meals',
      convenienceNeed: 'medium',
      repeatTolerance: 'high',
    },
    {
      id: 'member-2',
      name: 'Member B',
      preference: 'Comfort meals, predictable leftovers',
      avoid: 'Too many new recipes at once',
      convenienceNeed: 'high',
      repeatTolerance: 'high',
    },
  ],
};

const mealTemplates: MealTemplate[] = [
  {
    id: 'oats',
    name: 'Protein overnight oats',
    slot: 'breakfast',
    effort: '10 min',
    processedLevel: 'low',
    repeatFriendly: true,
    why: 'Assemble once, repeat for low-friction mornings.',
    swapTip: 'Keep oats, yogurt, and frozen berries stocked so breakfast does not depend on packaged bars.',
    ingredients: [
      { item: 'Rolled oats', quantity: 2, unit: 'cups', category: 'Pantry' },
      { item: 'Greek yogurt', quantity: 4, unit: 'cups', category: 'Dairy' },
      { item: 'Blueberries', quantity: 2, unit: 'cups', category: 'Produce' },
      { item: 'Chia seeds', quantity: 0.5, unit: 'cup', category: 'Pantry' },
    ],
  },
  {
    id: 'eggs-toast',
    name: 'Eggs with greens and toast',
    slot: 'breakfast',
    effort: '20 min',
    processedLevel: 'low',
    repeatFriendly: true,
    why: 'Reliable savory breakfast with few ingredients.',
    swapTip: 'Use pre-washed greens if prep energy is low; the meal still stays minimally processed.',
    ingredients: [
      { item: 'Eggs', quantity: 12, unit: 'count', category: 'Dairy' },
      { item: 'Spinach', quantity: 1, unit: 'bag', category: 'Produce' },
      { item: 'Whole-grain bread', quantity: 1, unit: 'loaf', category: 'Bakery' },
      { item: 'Avocados', quantity: 2, unit: 'count', category: 'Produce' },
    ],
  },
  {
    id: 'grain-bowls',
    name: 'Chicken grain bowls',
    slot: 'lunch',
    effort: '30 min',
    processedLevel: 'low',
    repeatFriendly: true,
    why: 'Batch-friendly lunch with easy portioning.',
    swapTip: 'Batch the grain and protein once, then use jarred hummus instead of ultra-processed sauces.',
    ingredients: [
      { item: 'Chicken breast', quantity: 2, unit: 'lb', category: 'Protein' },
      { item: 'Brown rice', quantity: 2, unit: 'cups', category: 'Pantry' },
      { item: 'Cucumbers', quantity: 2, unit: 'count', category: 'Produce' },
      { item: 'Cherry tomatoes', quantity: 2, unit: 'pints', category: 'Produce' },
      { item: 'Hummus', quantity: 1, unit: 'tub', category: 'Dairy' },
    ],
  },
  {
    id: 'lentil-soup',
    name: 'Lentil soup and salad',
    slot: 'lunch',
    effort: '30 min',
    processedLevel: 'low',
    repeatFriendly: true,
    why: 'Low-cost leftovers that improve after a day.',
    swapTip: 'Choose low-sodium broth and dry lentils to keep the convenience without leaning on frozen meals.',
    ingredients: [
      { item: 'Dry lentils', quantity: 2, unit: 'cups', category: 'Pantry' },
      { item: 'Carrots', quantity: 1, unit: 'bag', category: 'Produce' },
      { item: 'Celery', quantity: 1, unit: 'bunch', category: 'Produce' },
      { item: 'Low-sodium broth', quantity: 2, unit: 'cartons', category: 'Pantry' },
      { item: 'Salad greens', quantity: 2, unit: 'bags', category: 'Produce' },
    ],
  },
  {
    id: 'sheet-pan',
    name: 'Sheet-pan chicken fajitas',
    slot: 'dinner',
    effort: '30 min',
    processedLevel: 'low',
    repeatFriendly: true,
    why: 'One pan, familiar flavors, and leftovers for lunch.',
    swapTip: 'Use corn tortillas, salsa, and roasted vegetables to replace a takeout-style kit.',
    ingredients: [
      { item: 'Chicken thighs', quantity: 2, unit: 'lb', category: 'Protein' },
      { item: 'Bell peppers', quantity: 5, unit: 'count', category: 'Produce' },
      { item: 'Yellow onions', quantity: 3, unit: 'count', category: 'Produce' },
      { item: 'Corn tortillas', quantity: 1, unit: 'pack', category: 'Bakery' },
      { item: 'Salsa', quantity: 1, unit: 'jar', category: 'Pantry' },
    ],
  },
  {
    id: 'salmon-potatoes',
    name: 'Salmon, potatoes, green beans',
    slot: 'dinner',
    effort: '30 min',
    processedLevel: 'low',
    repeatFriendly: false,
    why: 'Simple plate method dinner with minimal prep.',
    swapTip: 'Buy frozen green beans or pre-washed potatoes when time is tight; avoid breaded frozen entrees.',
    ingredients: [
      { item: 'Salmon fillets', quantity: 4, unit: 'count', category: 'Protein' },
      { item: 'Baby potatoes', quantity: 2, unit: 'lb', category: 'Produce' },
      { item: 'Green beans', quantity: 1.5, unit: 'lb', category: 'Produce' },
      { item: 'Lemons', quantity: 2, unit: 'count', category: 'Produce' },
    ],
  },
  {
    id: 'turkey-chili',
    name: 'Turkey bean chili',
    slot: 'dinner',
    effort: '30 min',
    processedLevel: 'medium',
    repeatFriendly: true,
    why: 'Uses canned staples intentionally for a lower-effort dinner.',
    swapTip: 'Rinse canned beans, choose plain crushed tomatoes, and add extra vegetables before buying boxed chili kits.',
    ingredients: [
      { item: 'Ground turkey', quantity: 2, unit: 'lb', category: 'Protein' },
      { item: 'Canned beans', quantity: 4, unit: 'cans', category: 'Pantry' },
      { item: 'Crushed tomatoes', quantity: 2, unit: 'cans', category: 'Pantry' },
      { item: 'Frozen corn', quantity: 1, unit: 'bag', category: 'Frozen' },
      { item: 'Shredded cheddar', quantity: 1, unit: 'bag', category: 'Dairy' },
    ],
  },
];

const defaultWeeklyPlan: DayPlan[] = [
  { day: 'Mon', breakfast: 'oats', lunch: 'grain-bowls', dinner: 'sheet-pan' },
  { day: 'Tue', breakfast: 'oats', lunch: 'grain-bowls', dinner: 'turkey-chili' },
  { day: 'Wed', breakfast: 'eggs-toast', lunch: 'lentil-soup', dinner: 'salmon-potatoes' },
  { day: 'Thu', breakfast: 'oats', lunch: 'lentil-soup', dinner: 'sheet-pan' },
  { day: 'Fri', breakfast: 'eggs-toast', lunch: 'grain-bowls', dinner: 'turkey-chili' },
  { day: 'Sat', breakfast: 'oats', lunch: 'lentil-soup', dinner: 'salmon-potatoes' },
  { day: 'Sun', breakfast: 'eggs-toast', lunch: 'grain-bowls', dinner: 'sheet-pan' },
];

const batchCookWeeklyPlan: DayPlan[] = [
  { day: 'Mon', breakfast: 'oats', lunch: 'grain-bowls', dinner: 'sheet-pan' },
  { day: 'Tue', breakfast: 'oats', lunch: 'grain-bowls', dinner: 'sheet-pan' },
  { day: 'Wed', breakfast: 'oats', lunch: 'lentil-soup', dinner: 'turkey-chili' },
  { day: 'Thu', breakfast: 'eggs-toast', lunch: 'lentil-soup', dinner: 'turkey-chili' },
  { day: 'Fri', breakfast: 'eggs-toast', lunch: 'grain-bowls', dinner: 'sheet-pan' },
  { day: 'Sat', breakfast: 'oats', lunch: 'lentil-soup', dinner: 'salmon-potatoes' },
  { day: 'Sun', breakfast: 'eggs-toast', lunch: 'lentil-soup', dinner: 'salmon-potatoes' },
];

const lowDecisionWeeklyPlan: DayPlan[] = [
  { day: 'Mon', breakfast: 'oats', lunch: 'grain-bowls', dinner: 'sheet-pan' },
  { day: 'Tue', breakfast: 'oats', lunch: 'grain-bowls', dinner: 'sheet-pan' },
  { day: 'Wed', breakfast: 'oats', lunch: 'grain-bowls', dinner: 'turkey-chili' },
  { day: 'Thu', breakfast: 'oats', lunch: 'grain-bowls', dinner: 'turkey-chili' },
  { day: 'Fri', breakfast: 'oats', lunch: 'lentil-soup', dinner: 'sheet-pan' },
  { day: 'Sat', breakfast: 'eggs-toast', lunch: 'lentil-soup', dinner: 'salmon-potatoes' },
  { day: 'Sun', breakfast: 'eggs-toast', lunch: 'lentil-soup', dinner: 'sheet-pan' },
];

const weekTemplates: WeekTemplate[] = [
  {
    id: 'balanced-repeat',
    name: 'Balanced repeat week',
    description: 'The default plan: familiar meals, a few repeats, and one medium-processed safety valve.',
    bestFor: 'Starting from scratch',
    plan: defaultWeeklyPlan,
  },
  {
    id: 'batch-cook',
    name: 'Batch-cook week',
    description: 'Repeats lunches and dinners in pairs so prep can happen once and carry multiple days.',
    bestFor: 'Lower weekday effort',
    plan: batchCookWeeklyPlan,
  },
  {
    id: 'low-decision',
    name: 'Low-decision week',
    description: 'Repeats breakfast and lunch heavily, leaving fewer choices for busy evenings.',
    bestFor: 'Hard planning weeks',
    plan: lowDecisionWeeklyPlan,
  },
];

const getMealTemplate = (id: string) => mealTemplates.find((meal) => meal.id === id) ?? mealTemplates[0];

const getMealTemplatesForSlot = (slot: MealSlot) => mealTemplates.filter((meal) => meal.slot === slot);

const getPlannedMeals = (plan: DayPlan[]) =>
  plan.flatMap((day) => [getMealTemplate(day.breakfast), getMealTemplate(day.lunch), getMealTemplate(day.dinner)]);

const buildGroceryChecklist = (plan: DayPlan[]): GrocerySection[] => {
  const itemMap = new Map<string, Ingredient>();

  getPlannedMeals(plan).forEach((meal) => {
    meal.ingredients.forEach((ingredient) => {
      const key = `${ingredient.category}:${ingredient.item}:${ingredient.unit}`;
      const existing = itemMap.get(key);

      itemMap.set(key, {
        ...ingredient,
        quantity: (existing?.quantity ?? 0) + ingredient.quantity,
        pantry: existing?.pantry || ingredient.pantry,
      });
    });
  });

  return groceryCategories.map((category) => ({
    category,
    items: Array.from(itemMap.values())
      .filter((item) => item.category === category)
      .sort((a, b) => a.item.localeCompare(b.item)),
  }));
};

const getLowerProcessedMealPercent = (plan: DayPlan[]) => {
  const plannedMeals = getPlannedMeals(plan);
  const lowerProcessedCount = plannedMeals.filter((meal) => meal.processedLevel === 'low').length;

  return Math.round((lowerProcessedCount / plannedMeals.length) * 100);
};

const formatQuantity = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1));

const buildMealPlanOutput = (plan: DayPlan[]) =>
  plan
    .map((day) => {
      const breakfast = getMealTemplate(day.breakfast).name;
      const lunch = getMealTemplate(day.lunch).name;
      const dinner = getMealTemplate(day.dinner).name;

      return `${day.day}: Breakfast - ${breakfast}; Lunch - ${lunch}; Dinner - ${dinner}`;
    })
    .join('\n');

const buildGroceryOutput = (groceryChecklist: GrocerySection[]) =>
  groceryChecklist
    .map(({ category, items }) => {
      if (items.length === 0) {
        return '';
      }

      const lines = items.map((item) => `- ${item.item}: ${formatQuantity(item.quantity)} ${item.unit}`);
      return `${category}\n${lines.join('\n')}`;
    })
    .filter(Boolean)
    .join('\n\n');

const getProcessedSwapTips = (plan: DayPlan[]) =>
  Array.from(
    new Map(
      getPlannedMeals(plan)
        .filter((meal) => meal.processedLevel === 'medium')
        .map((meal) => [meal.id, { mealName: meal.name, tip: meal.swapTip }]),
    ).values(),
  );

const getPlanningSummary = (plan: DayPlan[]) => {
  const plannedMeals = getPlannedMeals(plan);
  const uniqueMeals = new Set(plannedMeals.map((meal) => meal.id)).size;
  const repeatFriendlyMeals = plannedMeals.filter((meal) => meal.repeatFriendly).length;
  const tenMinuteMeals = plannedMeals.filter((meal) => meal.effort === '10 min').length;

  return {
    uniqueMeals,
    repeatFriendlyMeals,
    tenMinuteMeals,
  };
};

const buildShareOutput = (plan: DayPlan[], groceryChecklist: GrocerySection[]) => {
  const meals = buildMealPlanOutput(plan);
  const groceries = buildGroceryOutput(groceryChecklist);

  return `Fitness Assistant weekly nutrition plan\n\nMeal plan\n${meals}\n\nGrocery checklist\n${groceries}`;
};

const cloneWeekPlan = (plan: DayPlan[]) => plan.map((day) => ({ ...day }));

const getWeekTemplate = (id: string) => weekTemplates.find((template) => template.id === id) ?? weekTemplates[0];

const buildTemplatePlan = (id: string) => cloneWeekPlan(getWeekTemplate(id).plan);

const buildRepeatMealPlan = (mealId: string, slot: MealSlot, currentPlan: DayPlan[]) =>
  currentPlan.map((day) => ({ ...day, [slot]: mealId }));

const buildLowerProcessedPlan = (currentPlan: DayPlan[]) =>
  currentPlan.map((day) => ({
    ...day,
    dinner: getMealTemplate(day.dinner).processedLevel === 'medium' ? 'sheet-pan' : day.dinner,
  }));

const getWeekTemplateMatch = (plan: DayPlan[]) => {
  const signature = JSON.stringify(plan);
  return weekTemplates.find((template) => JSON.stringify(template.plan) === signature);
};

const buildGroceryAppOutput = (groceryChecklist: GrocerySection[]) =>
  groceryChecklist
    .flatMap(({ items }) => items.map((item) => `${item.item} - ${formatQuantity(item.quantity)} ${item.unit}`))
    .join('\n');

const buildMealTemplateOutput = (plan: DayPlan[]) => {
  const meals = plan
    .map((day) => {
      const breakfast = getMealTemplate(day.breakfast).name;
      const lunch = getMealTemplate(day.lunch).name;
      const dinner = getMealTemplate(day.dinner).name;

      return `${day.day}: Breakfast - ${breakfast}; Lunch - ${lunch}; Dinner - ${dinner}`;
    })
    .join('\n');

  return `Reusable meal template\n${meals}`;
};

export {
  buildGroceryAppOutput,
  buildGroceryChecklist,
  buildGroceryOutput,
  buildLowerProcessedPlan,
  buildMealPlanOutput,
  buildMealTemplateOutput,
  buildRepeatMealPlan,
  buildShareOutput,
  buildTemplatePlan,
  defaultHousehold,
  defaultWeeklyPlan,
  formatQuantity,
  getLowerProcessedMealPercent,
  getMealTemplate,
  getMealTemplatesForSlot,
  getPlanningSummary,
  getProcessedSwapTips,
  getWeekTemplateMatch,
  mealTemplates,
  weekTemplates,
};

export type {
  DayPlan,
  GroceryCategory,
  GrocerySection,
  HouseholdProfile,
  Ingredient,
  MealSlot,
  MealTemplate,
  MemberProfile,
  PreferenceLevel,
  WeekTemplate,
};
