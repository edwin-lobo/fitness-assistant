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

const buildShareOutput = (plan: DayPlan[], groceryChecklist: GrocerySection[]) => {
  const meals = plan
    .map((day) => {
      const breakfast = getMealTemplate(day.breakfast).name;
      const lunch = getMealTemplate(day.lunch).name;
      const dinner = getMealTemplate(day.dinner).name;

      return `${day.day}: Breakfast - ${breakfast}; Lunch - ${lunch}; Dinner - ${dinner}`;
    })
    .join('\n');

  const groceries = groceryChecklist
    .map(({ category, items }) => {
      if (items.length === 0) {
        return '';
      }

      const lines = items.map((item) => `- ${item.item}: ${formatQuantity(item.quantity)} ${item.unit}`);
      return `${category}\n${lines.join('\n')}`;
    })
    .filter(Boolean)
    .join('\n\n');

  return `Fitness Assistant weekly nutrition plan\n\nMeal plan\n${meals}\n\nGrocery checklist\n${groceries}`;
};

export {
  buildGroceryChecklist,
  buildShareOutput,
  defaultHousehold,
  defaultWeeklyPlan,
  formatQuantity,
  getLowerProcessedMealPercent,
  getMealTemplate,
  getMealTemplatesForSlot,
  mealTemplates,
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
};
