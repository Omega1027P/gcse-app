import { QSpec } from "./types";

export const PROBABILITY_STATISTICS_EXT: QSpec[] = [
  // p-se-01 (5)
  {
    objectiveId: "p-se-01",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A fair six-sided dice is rolled once. Find the probability of rolling a prime number.",
    finalAnswer: "1/2",
    solutionSteps:
      "Prime outcomes are 2, 3 and 5. So P(prime) = 3/6 = 1/2.",
    hints: [
      "List prime numbers from 1 to 6.",
      "Count favorable outcomes over total outcomes.",
      "M1: identifies 3 favorable outcomes. A1: 1/2.",
    ],
  },
  {
    objectiveId: "p-se-01",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A bag has 7 green, 5 yellow and 3 red counters. One counter is chosen at random. Find P(not yellow).",
    finalAnswer: "2/3",
    solutionSteps:
      "Total counters = 15. Not yellow means green or red: 7 + 3 = 10. So P(not yellow) = 10/15 = 2/3.",
    hints: [
      "Work out the total number of counters first.",
      "Not yellow means green plus red outcomes.",
      "M1: 10/15. A1: 2/3.",
    ],
  },
  {
    objectiveId: "p-se-01",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A fair spinner has equal sections numbered 1 to 8. Find the probability of landing on a multiple of 3.",
    finalAnswer: "1/4",
    solutionSteps:
      "Multiples of 3 are 3 and 6, so 2 favorable outcomes out of 8. P = 2/8 = 1/4.",
    hints: [
      "Write the multiples of 3 between 1 and 8.",
      "Use probability = favorable/total.",
      "M1: 2/8. A1: 1/4.",
    ],
  },
  {
    objectiveId: "p-se-01",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "reasoning",
    marks: 3,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "Two different cards are chosen from cards numbered 1 to 5 and arranged to make a two-digit number (first card is tens). Find the probability the number is greater than 30.",
    finalAnswer: "3/5",
    solutionSteps:
      "Total outcomes = 5 x 4 = 20. For number > 30, tens digit can be 3, 4 or 5. Each gives 4 possible ones digits, so favorable = 12. Probability = 12/20 = 3/5.",
    hints: [
      "Count all possible two-digit numbers without replacement.",
      "Focus on valid tens digits that make numbers above 30.",
      "M1: total 20 outcomes. M1: favorable 12 outcomes. A1: 3/5.",
    ],
  },
  {
    objectiveId: "p-se-01",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "calculation",
    marks: 1,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A fair dice is rolled. Find the probability of not getting 1 or 2.",
    finalAnswer: "2/3",
    solutionSteps:
      "Outcomes not 1 or 2 are 3, 4, 5, 6 so 4 out of 6. P = 4/6 = 2/3.",
    hints: [
      "List the outcomes that are allowed.",
      "Write favorable outcomes over 6.",
      "B1: 2/3.",
    ],
  },

  // p-se-02 (5)
  {
    objectiveId: "p-se-02",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText: "If P(A) = 0.28, find P(not A).",
    finalAnswer: "0.72",
    solutionSteps: "Use complement: P(not A) = 1 - 0.28 = 0.72.",
    hints: [
      "Probabilities of an event and its complement add to 1.",
      "Calculate 1 - 0.28.",
      "M1: subtracts from 1. A1: 0.72.",
    ],
  },
  {
    objectiveId: "p-se-02",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "Events A and B are mutually exclusive. P(A) = 0.35 and P(B) = 0.25. Find P(A or B).",
    finalAnswer: "0.60",
    solutionSteps:
      "For mutually exclusive events, P(A or B) = P(A) + P(B) = 0.35 + 0.25 = 0.60.",
    hints: [
      "Mutually exclusive means no overlap.",
      "Add the two probabilities.",
      "M1: 0.35 + 0.25. A1: 0.60.",
    ],
  },
  {
    objectiveId: "p-se-02",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "reasoning",
    marks: 3,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "Events A and B are mutually exclusive. P(A or B) = 0.9 and P(A) = 0.55. Find P(B).",
    finalAnswer: "0.35",
    solutionSteps:
      "Mutually exclusive gives P(A or B) = P(A) + P(B). So 0.9 = 0.55 + P(B), hence P(B) = 0.35.",
    hints: [
      "Start from P(A or B) = P(A) + P(B).",
      "Rearrange to make P(B) the subject.",
      "M1: correct equation. M1: rearranges. A1: 0.35.",
    ],
  },
  {
    objectiveId: "p-se-02",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "On a spinner, P(red) = 0.4 and P(blue) = 0.35. Red, blue and green are the only outcomes. Find P(green).",
    finalAnswer: "0.25",
    solutionSteps:
      "Total probability is 1. So P(green) = 1 - 0.4 - 0.35 = 0.25.",
    hints: [
      "All outcomes together must total 1.",
      "Subtract red and blue from 1.",
      "M1: subtracts correctly. A1: 0.25.",
    ],
  },
  {
    objectiveId: "p-se-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "multi_step",
    marks: 3,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "In a year group, P(French) = 0.6, P(Spanish) = 0.45 and P(French and Spanish) = 0.2. Find P(French or Spanish).",
    finalAnswer: "0.85",
    solutionSteps:
      "Use addition rule: P(F or S) = P(F) + P(S) - P(F and S) = 0.6 + 0.45 - 0.2 = 0.85.",
    hints: [
      "Use P(A or B) = P(A) + P(B) - P(A and B).",
      "Substitute the three given values carefully.",
      "M1: uses addition rule. M1: substitution. A1: 0.85.",
    ],
  },

  // p-ce-01 (5)
  {
    objectiveId: "p-ce-01",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "multi_step",
    marks: 3,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "Two fair coins are flipped. Find the probability of getting exactly one head.",
    finalAnswer: "1/2",
    solutionSteps:
      "Sample space: HH, HT, TH, TT. Exactly one head in HT and TH, so probability = 2/4 = 1/2.",
    hints: [
      "Write all outcomes for two coin flips.",
      "Count outcomes with one head only.",
      "M1: complete sample space. A1: 1/2.",
    ],
  },
  {
    objectiveId: "p-ce-01",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "multi_step",
    marks: 4,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A bag contains 3 black and 2 white counters. Two counters are drawn without replacement. Find the probability of getting one black and one white.",
    finalAnswer: "3/5",
    solutionSteps:
      "P(B then W) = (3/5)(2/4) = 3/10. P(W then B) = (2/5)(3/4) = 3/10. Total = 3/10 + 3/10 = 3/5.",
    hints: [
      "Consider both orders: BW and WB.",
      "Use multiplication for each branch, then add.",
      "M1: one correct branch probability. M1: adds both branches. A1: 3/5.",
    ],
  },
  {
    objectiveId: "p-ce-01",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "calculation",
    marks: 3,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "Two fair six-sided dice are rolled. Find the probability that the total is 9.",
    finalAnswer: "1/9",
    solutionSteps:
      "Outcomes making 9 are (3,6), (4,5), (5,4), (6,3): 4 outcomes out of 36. Probability = 4/36 = 1/9.",
    hints: [
      "List all ordered pairs with sum 9.",
      "There are 36 equally likely outcomes for two dice.",
      "M1: identifies 4 favorable outcomes. A1: 1/9.",
    ],
  },
  {
    objectiveId: "p-ce-01",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "multi_step",
    marks: 3,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A fair spinner has sections 1, 2 and 3. A fair coin is tossed. Find the probability of getting a number greater than 1 and a tail.",
    finalAnswer: "1/3",
    solutionSteps:
      "P(number > 1) = 2/3 and P(tail) = 1/2. Independent events, so multiply: (2/3)(1/2) = 1/3.",
    hints: [
      "Find each separate probability first.",
      "Use multiplication for 'and' with independent events.",
      "M1: 2/3 and 1/2. A1: 1/3.",
    ],
  },
  {
    objectiveId: "p-ce-01",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "reasoning",
    marks: 4,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A card numbered 1 to 10 is chosen, replaced, then another is chosen. Find the probability that the second number is greater than the first.",
    finalAnswer: "9/20",
    solutionSteps:
      "There are 10 x 10 = 100 ordered pairs. Equal pairs are 10. The remaining 90 are unequal and split equally between second > first and second < first. So favorable = 45, probability = 45/100 = 9/20.",
    hints: [
      "Count ordered pairs from 1 to 10 with replacement.",
      "Use symmetry between greater-than and less-than cases.",
      "M1: total 100 and equal 10. M1: favorable 45. A1: 9/20.",
    ],
  },

  // p-ce-02 (4)
  {
    objectiveId: "p-ce-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "multi_step",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText:
      "Events A and B are independent with P(A) = 0.5 and P(B) = 0.3. Find the probability of neither A nor B.",
    finalAnswer: "0.35",
    solutionSteps:
      "P(not A) = 0.5 and P(not B) = 0.7. Independence gives P(neither) = 0.5 x 0.7 = 0.35.",
    hints: [
      "Find the complement probabilities first.",
      "For independent events, multiply complements.",
      "M1: finds 0.5 and 0.7. A1: 0.35.",
    ],
  },
  {
    objectiveId: "p-ce-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "calculation",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText:
      "Given P(A) = 0.4 and P(A and B) = 0.18, find P(B given A).",
    finalAnswer: "0.45",
    solutionSteps:
      "Use conditional probability: P(B|A) = P(A and B) / P(A) = 0.18 / 0.4 = 0.45.",
    hints: [
      "Recall the formula for conditional probability.",
      "Divide intersection by P(A).",
      "M1: correct formula. A1: 0.45.",
    ],
  },
  {
    objectiveId: "p-ce-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "multi_step",
    marks: 4,
    examStyle: true,
    calculatorAllowed: true,
    questionText:
      "A box has 60 bulbs, 9 of which are faulty. Two bulbs are chosen without replacement. Find the probability both are faulty.",
    finalAnswer: "6/295",
    solutionSteps:
      "P(both faulty) = (9/60)(8/59) = 72/3540 = 6/295.",
    hints: [
      "Without replacement changes the second denominator.",
      "Multiply 9/60 by 8/59.",
      "M1: correct product. M1: simplifies fraction. A1: 6/295.",
    ],
  },
  {
    objectiveId: "p-ce-02",
    tier: "Higher",
    difficulty: "Medium",
    questionType: "reasoning",
    marks: 3,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "In a group of 30 students, 12 cycle to school and 5 of these also have a bus pass. Find P(has bus pass given cycles).",
    finalAnswer: "5/12",
    solutionSteps:
      "Conditional probability among cyclists only: P(bus pass | cycles) = 5/12.",
    hints: [
      "Restrict to the cycling group as the new total.",
      "Use conditional probability as a fraction of that group.",
      "M1: denominator 12 identified. A1: 5/12.",
    ],
  },

  // s-sd-01 (4)
  {
    objectiveId: "s-sd-01",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "calculation",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText:
      "In a pie chart for 180 students, the sector for Science is 72 degrees. How many students chose Science?",
    finalAnswer: "36",
    solutionSteps:
      "Science fraction = 72/360 = 1/5. Number of students = (1/5) x 180 = 36.",
    hints: [
      "Convert the angle into a fraction of the full circle.",
      "Multiply that fraction by 180.",
      "M1: 72/360. M1: multiply by 180. A1: 36.",
    ],
  },
  {
    objectiveId: "s-sd-01",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "interpretation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A frequency table shows absences: 0 -> 7 students, 1 -> 11 students, 2 -> 9 students, 3 -> 5 students. What is the modal number of absences?",
    finalAnswer: "1",
    solutionSteps:
      "The highest frequency is 11, which corresponds to 1 absence.",
    hints: [
      "Mode means most frequent value.",
      "Identify the largest frequency in the table.",
      "B1: 1.",
    ],
  },
  {
    objectiveId: "s-sd-01",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "calculation",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText:
      "In a histogram, the class interval 10 < x <= 20 has frequency 18. Find the frequency density for this class.",
    finalAnswer: "1.8",
    solutionSteps:
      "Class width = 20 - 10 = 10. Frequency density = frequency / class width = 18/10 = 1.8.",
    hints: [
      "Use frequency density = frequency divided by class width.",
      "Work out the class width first.",
      "M1: width 10. A1: 1.8.",
    ],
  },
  {
    objectiveId: "s-sd-01",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "interpretation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A grouped frequency table has classes 0 < t <= 10 (4), 10 < t <= 20 (10), 20 < t <= 30 (6). Which class is the modal class?",
    finalAnswer: "10 < t <= 20",
    solutionSteps: "The highest frequency is 10, so modal class is 10 < t <= 20.",
    hints: [
      "Modal class is the class with greatest frequency.",
      "Compare the three frequencies directly.",
      "B1: 10 < t <= 20.",
    ],
  },

  // s-sd-02 (4)
  {
    objectiveId: "s-sd-02",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "interpretation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A scatter graph shows points rising from left to right. State the type of correlation.",
    finalAnswer: "positive",
    solutionSteps:
      "An upward trend from left to right indicates positive correlation.",
    hints: [
      "Look at the overall direction of the points.",
      "Rising trend means one variable increases as the other increases.",
      "B1: positive correlation.",
    ],
  },
  {
    objectiveId: "s-sd-02",
    tier: "Higher",
    difficulty: "Medium",
    questionType: "graph",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText:
      "A line of best fit is y = 1.5x + 4. Estimate y when x = 12.",
    finalAnswer: "22",
    solutionSteps: "Substitute x = 12: y = 1.5(12) + 4 = 18 + 4 = 22.",
    hints: [
      "Use the equation of the line of best fit.",
      "Multiply 1.5 by 12 before adding 4.",
      "M1: substitution. A1: 22.",
    ],
  },
  {
    objectiveId: "s-sd-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "graph",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText:
      "A line of best fit is y = 1.5x + 4. Estimate x when y = 17.",
    finalAnswer: "8.7",
    solutionSteps:
      "Set 17 = 1.5x + 4. Then 13 = 1.5x, so x = 13/1.5 = 8.666..., about 8.7.",
    hints: [
      "Substitute y = 17 and solve the equation.",
      "Rearrange by subtracting 4 first.",
      "M1: forms linear equation. M1: rearranges/divides. A1: 8.7 (approx).",
    ],
  },
  {
    objectiveId: "s-sd-02",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "reasoning",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A scatter graph has a clear positive trend but one point far from the rest. What is this unusual point called?",
    finalAnswer: "outlier",
    solutionSteps:
      "A point far away from the main cluster or trend is called an outlier.",
    hints: [
      "Think about the term for an anomalous data point.",
      "It does not follow the main pattern.",
      "B1: outlier.",
    ],
  },

  // s-da-01 (4)
  {
    objectiveId: "s-da-01",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "Find the mean of 6, 8, 9, 12, 15.",
    finalAnswer: "10",
    solutionSteps: "Sum is 6 + 8 + 9 + 12 + 15 = 50. Mean = 50/5 = 10.",
    hints: [
      "Add all values first.",
      "Divide by the number of values (5).",
      "M1: total 50. A1: 10.",
    ],
  },
  {
    objectiveId: "s-da-01",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "Find the median of 3, 5, 8, 12, 14, 18.",
    finalAnswer: "10",
    solutionSteps:
      "There are 6 values, so median is average of 3rd and 4th values: (8 + 12)/2 = 10.",
    hints: [
      "The list is already ordered.",
      "With an even number of values, average the middle two.",
      "M1: identifies middle pair 8 and 12. A1: 10.",
    ],
  },
  {
    objectiveId: "s-da-01",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "Find the range of 4.2, 7.1, 5.6, 9.0, 6.4.",
    finalAnswer: "4.8",
    solutionSteps: "Range = largest - smallest = 9.0 - 4.2 = 4.8.",
    hints: [
      "Find the maximum and minimum values.",
      "Subtract minimum from maximum.",
      "M1: identifies 9.0 and 4.2. A1: 4.8.",
    ],
  },
  {
    objectiveId: "s-da-01",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "multi_step",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText:
      "A frequency table has values 1, 2, 3 with frequencies 2, 5, 3 respectively. Find the mean.",
    finalAnswer: "2.1",
    solutionSteps:
      "Total frequency = 2 + 5 + 3 = 10. Sum fx = 1x2 + 2x5 + 3x3 = 2 + 10 + 9 = 21. Mean = 21/10 = 2.1.",
    hints: [
      "Use mean = sum(fx) / sum(f).",
      "Calculate both total frequency and sum(fx).",
      "M1: correct sum(fx). M1: divides by total frequency. A1: 2.1.",
    ],
  },

  // s-da-02 (4)
  {
    objectiveId: "s-da-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "multi_step",
    marks: 4,
    examStyle: true,
    calculatorAllowed: true,
    questionText:
      "Estimate the mean for grouped data: 0 < x <= 10 (4), 10 < x <= 20 (6), 20 < x <= 30 (10).",
    finalAnswer: "18",
    solutionSteps:
      "Midpoints are 5, 15, 25. Sum fx = 5x4 + 15x6 + 25x10 = 20 + 90 + 250 = 360. Total frequency = 20. Estimated mean = 360/20 = 18.",
    hints: [
      "Find class midpoints first.",
      "Use estimated mean = sum(fx) / sum(f).",
      "M1: correct midpoints. M1: correct sum(fx). A1: 18.",
    ],
  },
  {
    objectiveId: "s-da-02",
    tier: "Higher",
    difficulty: "Medium",
    questionType: "interpretation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "A box plot has lower quartile 18 and upper quartile 31. Find the interquartile range.",
    finalAnswer: "13",
    solutionSteps: "Interquartile range = upper quartile - lower quartile = 31 - 18 = 13.",
    hints: [
      "IQR measures the middle 50 percent spread.",
      "Subtract lower quartile from upper quartile.",
      "B1: 13.",
    ],
  },
  {
    objectiveId: "s-da-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "reasoning",
    marks: 3,
    examStyle: true,
    calculatorAllowed: false,
    questionText:
      "Class A has mean 65 and range 18. Class B has mean 70 and range 30. Which class has the more consistent results?",
    finalAnswer: "Class A",
    solutionSteps:
      "More consistent means less spread. Class A has smaller range (18) than Class B (30), so Class A is more consistent.",
    hints: [
      "Consistency is about spread, not center.",
      "Compare the ranges of the two classes.",
      "B1: Class A (smaller range).",
    ],
  },
  {
    objectiveId: "s-da-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "multi_step",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText:
      "Team A has 12 players with mean score 14. Team B has 8 players with mean score 11. Find the combined mean score.",
    finalAnswer: "12.8",
    solutionSteps:
      "Total score A = 12 x 14 = 168. Total score B = 8 x 11 = 88. Combined total = 256 over 20 players. Combined mean = 256/20 = 12.8.",
    hints: [
      "Convert each mean back to total score first.",
      "Add totals, then divide by total number of players.",
      "M1: totals 168 and 88. M1: combined total and frequency. A1: 12.8.",
    ],
  },
];
