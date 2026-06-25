# Daily content gap check

Run on weekdays at 6:00. Scans syllabus vs question bank and opens a PR if gaps exist.

## Instructions (for Cursor Automation agent)

1. Check out the `gcse-app` repository on the default branch.
2. Run `npm install` then `npm run check:content`.
3. Read the latest report in `content/reports/content-gaps-*.json`.
4. If `gapCount > 0`:
   - Create a branch `chore/content-gaps-YYYY-MM-DD`
   - Add a summary file `content/reports/latest-gaps.md` listing the top 30 gaps
   - For trivial fixes (missing `status` field, empty hints array), patch the JSON files directly
   - Open a PR titled `chore: content gaps YYYY-MM-DD` with the gap summary in the body
5. If no gaps, exit without opening a PR.
6. Never set any question `status` to `published` — only flag drafts for human review.

## Trigger

- Cron: `0 6 * * 1-5` (weekdays 6:00 AM)

## Tools

- Git PR workflow (create branch, commit, open PR)
