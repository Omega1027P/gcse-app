-- Seed syllabus nodes from content/syllabus/aqa-maths-8300.json structure
-- Run AFTER 001_gcse_student_schema.sql
-- Regenerate with: npm run seed:syllabus (future script)

INSERT INTO syllabus_nodes (id, parent_id, node_type, title, sort_order) VALUES
  ('aqa', NULL, 'board', 'AQA', 0),
  ('aqa-maths-8300', 'aqa', 'subject', 'GCSE Mathematics (8300)', 1)
ON CONFLICT (id) DO NOTHING;

-- Units
INSERT INTO syllabus_nodes (id, parent_id, node_type, title, sort_order) VALUES
  ('number', 'aqa-maths-8300', 'unit', 'Number', 1),
  ('algebra', 'aqa-maths-8300', 'unit', 'Algebra', 2),
  ('ratio-proportion', 'aqa-maths-8300', 'unit', 'Ratio, proportion and rates of change', 3),
  ('geometry-measures', 'aqa-maths-8300', 'unit', 'Geometry and measures', 4),
  ('probability', 'aqa-maths-8300', 'unit', 'Probability', 5),
  ('statistics', 'aqa-maths-8300', 'unit', 'Statistics', 6)
ON CONFLICT (id) DO NOTHING;

-- Topics (subset — full import via seed script recommended)
INSERT INTO syllabus_nodes (id, parent_id, node_type, title, sort_order) VALUES
  ('number-structure-calculation', 'number', 'topic', 'Structure and calculation', 1),
  ('number-fractions-decimals-percentages', 'number', 'topic', 'Fractions, decimals and percentages', 2),
  ('algebra-notation-manipulation', 'algebra', 'topic', 'Notation, vocabulary and manipulation', 1),
  ('algebra-equations-inequalities', 'algebra', 'topic', 'Solving equations and inequalities', 3),
  ('geometry-pythagoras-trigonometry', 'geometry-measures', 'topic', 'Pythagoras'' theorem and trigonometry', 3),
  ('probability-single-events', 'probability', 'topic', 'Single events', 1),
  ('statistics-data-analysis', 'statistics', 'topic', 'Data analysis', 2)
ON CONFLICT (id) DO NOTHING;

-- Sample learning objectives
INSERT INTO syllabus_nodes (id, parent_id, node_type, title, description, code, sort_order, question_types) VALUES
  ('n-sc-01', 'number-structure-calculation', 'objective', 'Order integers, decimals and fractions',
   'Order positive and negative integers, decimals and fractions', 'N1', 1, '{calculation,comparison}'),
  ('n-fdp-01', 'number-fractions-decimals-percentages', 'objective', 'Fraction operations',
   'Add, subtract, multiply and divide fractions', 'N5', 1, '{calculation,multi_step}'),
  ('a-ei-01', 'algebra-equations-inequalities', 'objective', 'Linear equations',
   'Solve linear equations in one unknown', 'A8', 1, '{calculation,multi_step}'),
  ('g-pt-01', 'geometry-pythagoras-trigonometry', 'objective', 'Pythagoras'' theorem',
   'Use Pythagoras'' theorem in 2D problems', 'G7', 1, '{calculation,word_problem}')
ON CONFLICT (id) DO NOTHING;

-- Sample published question (for dev smoke test)
INSERT INTO questions (
  id, objective_id, status, tier, difficulty, question_type, marks,
  exam_style, calculator_allowed, question_text, final_answer, solution_steps, published_at
) VALUES (
  '00000000-0000-4000-8000-000000000001',
  'n-sc-01',
  'published',
  'Foundation',
  'Easy',
  'calculation',
  2,
  true,
  true,
  'Put these numbers in order from smallest to largest: 0.4, 3/8, 0.35, 2/5',
  '0.35, 3/8, 0.4, 2/5',
  'Convert to decimals: 3/8 = 0.375, 2/5 = 0.4. Order: 0.35 < 0.375 < 0.4 = 0.4',
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO mark_scheme_steps (question_id, step_order, mark_code, description, points) VALUES
  ('00000000-0000-4000-8000-000000000001', 1, 'M1', 'Converts fractions to decimals or common form', 1),
  ('00000000-0000-4000-8000-000000000001', 2, 'A1', 'Correct order', 1)
ON CONFLICT (question_id, step_order) DO NOTHING;

INSERT INTO question_hints (question_id, level, hint_text) VALUES
  ('00000000-0000-4000-8000-000000000001', 1, 'Try converting all values to the same type — either all decimals or all fractions with the same denominator.'),
  ('00000000-0000-4000-8000-000000000001', 2, 'Convert 3/8 and 2/5 to decimals first, then compare with 0.4 and 0.35.'),
  ('00000000-0000-4000-8000-000000000001', 3, 'M1: convert fractions. A1: order from smallest — 0.35, then 0.375, then 0.4.')
ON CONFLICT (question_id, level) DO NOTHING;
