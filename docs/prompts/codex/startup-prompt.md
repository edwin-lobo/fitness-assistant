# Session Handoff

Current plan snapshot:
- Keep the app frontend-first and polish the live nutrition workflow.
- Finish the remaining nutrition MVP backlog items before widening scope.
- Use the GitHub Pages deployment path as the default release target.

Read next:
- `docs/session-handoff.md`
- `docs/nutrition-mvp-spec.md`
- `docs/nutrition-data-model.md`
- `docs/backlog/nutrition-mvp-backlog.md`

# Goal
I want to design a modular, configurable prompt system for my workout-tracking and fitness-automation app.
The system should support **multiple output formats** (e.g., Excel CSV rows, Google Sheets formulas, JSON API payloads), and I want my prompts to be reusable across different LLMs and providers.

# Current App Shape
- Runtime: Python
- I will orchestrate prompts inside Python, using a clean directory hierarchy (prompts/, schemas/, configs/, etc.)
- I will integrate with multiple LLM providers over time:
  - OpenAI for the next month
  - Later: Anthropic, Azure OpenAI, Gemini
- Workloads include:
  - Workout plan generation
  - Load progression / progressive overload calculation
  - CSV/Excel outputs for Sheets
  - JSON API outputs for my future application
  - Possibly web UI rendering later
- I also want to implement PromptFlow and later compare it to Dotprompt for managing prompts, variants, and evaluations.

# Desired Output Formats
I want the model to conditionally switch outputs depending on a parameter:

## Format A: "excel_sheet"
- Must follow CSV format.
- First row is the header.
- Rows must match a schema.
- Formulas (Google Sheets syntax) must be placed only in relevant columns.
- No narrative text.

## Format B: "web_api"
- Must return JSON matching a JSON Schema.
- Keys must follow snake_case.
- No extra text or Markdown.

## Format C: "markdown_doc"
- Full markdown file (formatted for a repo, app docs, or README.md).
- Can include headings, tables, bullet lists, and diagrams.

## Format D: “analysis_only”
- Only reasoning / explanation (no data structures).
- Useful for debugging.

I want a single **base prompt** that allows switching among these formats using an input variable, e.g.:

`output_format: "excel_sheet"`

# Constraints
- Prompts must be versionable, modular, readable.
- Prompts should live as `.prompt.md` or `.md` files under `app/prompts/`.
- JSON Schemas should live in `app/schemas/`.
- Configurable variables should come from config YAML/JSON files (e.g., week counts, set ranges, RPE targets).
- Output must not mix formats.
- Must work across providers (OpenAI, Anthropic, Azure).

# Ask
1. Design a directory structure for:
   - prompts/
   - schemas/
   - configs/
   - optional promptflow/ folder
2. Generate the following files:
   - `prompts/workout/base.prompt.md`
   - `prompts/workout/excel_sheet.prompt.md`
   - `prompts/workout/web_api.prompt.md`
   - `schemas/workout_plan.schema.json`
   - `schemas/workout_set.schema.json`
3. Show me a minimal PromptFlow pipeline for orchestrating:
   - python code → load config → render base prompt → call LLM → validate output.
4. Explain how this setup compares to Google Dotprompt (advantages, disadvantages).
5. Show me how to add parameters like:
   - `output_format`
   - `units`
   - `block_number`
   - `week_range`

# Optional (if useful)
Use the current workout program we built (8-week, 2-block structure) as the reference workout logic.
