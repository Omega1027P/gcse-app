<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GCSE App

Student-facing GCSE revision app. MVP: AQA GCSE Mathematics (8300).

- `content/` — syllabus and question bank (human-reviewed before publish)
- `supabase/migrations/` — database schema
- `scripts/check-content-gaps.ts` — daily content QA (used by Cursor Automation)
