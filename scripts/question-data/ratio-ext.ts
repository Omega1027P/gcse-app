import { QSpec } from "./types";

export const RATIO_EXT: QSpec[] = [
  {
    objectiveId: "r-rp-01",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText: "Simplify the ratio 42 : 56.",
    finalAnswer: "3:4",
    solutionSteps: "The HCF of 42 and 56 is 14, so 42:56 = 3:4.",
    hints: [
      "Find the highest common factor of 42 and 56.",
      "Divide both parts by 14.",
      "M1 for a valid common-factor method, A1 for 3:4."
    ]
  },
  {
    objectiveId: "r-rp-01",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "word_problem",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "Share GBP180 in the ratio 2 : 7.",
    finalAnswer: "GBP40 and GBP140",
    solutionSteps: "Total parts = 2 + 7 = 9. One part = 180/9 = 20. Shares are 2x20=40 and 7x20=140.",
    hints: [
      "Add the ratio parts first.",
      "Divide GBP180 by the total number of parts.",
      "M1 for total parts, M1 for value of one part, A1 for GBP40 and GBP140."
    ]
  },
  {
    objectiveId: "r-rp-01",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "word_problem",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "Red and blue counters are in the ratio 5 : 3. There are 64 counters in total. How many are red?",
    finalAnswer: "40",
    solutionSteps: "Total parts = 5+3=8. One part = 64/8=8. Red counters = 5x8 = 40.",
    hints: [
      "Find the total number of ratio parts.",
      "Work out the value of one part from the total.",
      "M1 for 8 parts, M1 for one part = 8, A1 for 40 red counters."
    ]
  },
  {
    objectiveId: "r-rp-01",
    tier: "Foundation",
    difficulty: "Hard",
    questionType: "word_problem",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "In a recipe, flour : sugar = 4 : 1. If 600 g of flour is used, how much sugar is needed?",
    finalAnswer: "150 g",
    solutionSteps: "If 4 parts = 600 g, then 1 part = 600/4 = 150 g. Sugar is 1 part, so 150 g.",
    hints: [
      "Match 4 parts to 600 g.",
      "Find one part by dividing by 4.",
      "M1 for one-part value, A1 for 150 g."
    ]
  },
  {
    objectiveId: "r-rp-01",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "word_problem",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "A map scale is 1 : 25000. Two towns are 8 cm apart on the map. Find the real distance in km.",
    finalAnswer: "2 km",
    solutionSteps: "Real distance = 8 x 25000 cm = 200000 cm. Since 100000 cm = 1 km, distance = 2 km.",
    hints: [
      "Use map distance x scale factor.",
      "Convert centimetres to kilometres at the end.",
      "M1 for 200000 cm, M1 for conversion, A1 for 2 km."
    ]
  },
  {
    objectiveId: "r-rp-02",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText: "y is directly proportional to x. When x = 3, y = 18. Find the constant of proportionality k.",
    finalAnswer: "6",
    solutionSteps: "For direct proportion y = kx. So 18 = 3k, giving k = 6.",
    hints: [
      "Write the model y = kx.",
      "Substitute x=3 and y=18.",
      "M1 for equation with k, A1 for k=6."
    ]
  },
  {
    objectiveId: "r-rp-02",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "word_problem",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "Cost C is directly proportional to distance d. If C = GBP15.50 when d = 5 km, find C when d = 8 km.",
    finalAnswer: "GBP24.80",
    solutionSteps: "C = kd. So k = 15.50/5 = 3.10. For d=8, C = 3.10 x 8 = 24.80.",
    hints: [
      "Find k using the first pair of values.",
      "Then substitute d = 8.",
      "M1 for k, M1 for substitution, A1 for GBP24.80."
    ]
  },
  {
    objectiveId: "r-rp-02",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "word_problem",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "p is inversely proportional to t. When t = 4, p = 120. Find t when p = 80.",
    finalAnswer: "6",
    solutionSteps: "For inverse proportion p = k/t. Then k = pt = 120 x 4 = 480. If p=80, then 80 = 480/t so t=6.",
    hints: [
      "Use p = k/t for inverse proportion.",
      "Find k from the first values using k = pt.",
      "M1 for k=480, M1 for equation in t, A1 for t=6."
    ]
  },
  {
    objectiveId: "r-rp-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "multi_step",
    marks: 4,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "y is directly proportional to x^2. When x = 3, y = 45. Find y when x = 5.",
    finalAnswer: "125",
    solutionSteps: "y = kx^2. 45 = 9k so k=5. Then y = 5 x 5^2 = 5 x 25 = 125.",
    hints: [
      "Use the model y = kx^2.",
      "Find k from x=3 and y=45.",
      "M1 for correct model, M1 for k=5, A1 for y=125."
    ]
  },
  {
    objectiveId: "r-rp-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "multi_step",
    marks: 4,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "Force F is inversely proportional to mass m. When m = 4.5 kg, F = 18 N. Find F when m = 6 kg.",
    finalAnswer: "13.5 N",
    solutionSteps: "F = k/m. Then k = Fm = 18 x 4.5 = 81. For m=6, F = 81/6 = 13.5 N.",
    hints: [
      "Write F = k/m.",
      "Use the first values to find k.",
      "M1 for k=81, M1 for substitution, A1 for 13.5 N."
    ]
  },
  {
    objectiveId: "r-rp-03",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "calculation",
    marks: 2,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "A car travels 150 km in 2.5 hours. Find its average speed in km/h.",
    finalAnswer: "60",
    solutionSteps: "Speed = distance/time = 150/2.5 = 60 km/h.",
    hints: [
      "Use speed = distance divided by time.",
      "Compute 150/2.5.",
      "M1 for formula use, A1 for 60 km/h."
    ]
  },
  {
    objectiveId: "r-rp-03",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "calculation",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "A solid has mass 780 g and volume 65 cm^3. Find its density in g/cm^3.",
    finalAnswer: "12",
    solutionSteps: "Density = mass/volume = 780/65 = 12 g/cm^3.",
    hints: [
      "Use density = mass divided by volume.",
      "Substitute 780 and 65.",
      "M1 for formula, M1 for correct substitution, A1 for 12 g/cm^3."
    ]
  },
  {
    objectiveId: "r-rp-03",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "calculation",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "A force of 360 N acts on an area of 0.12 m^2. Find the pressure in N/m^2.",
    finalAnswer: "3000",
    solutionSteps: "Pressure = force/area = 360/0.12 = 3000 N/m^2.",
    hints: [
      "Use pressure = force divided by area.",
      "Divide by 0.12 carefully.",
      "M1 for formula, M1 for substitution, A1 for 3000 N/m^2."
    ]
  },
  {
    objectiveId: "r-rp-03",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "word_problem",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "3 kg of apples cost GBP7.20. Work out the cost per kg.",
    finalAnswer: "GBP2.40 per kg",
    solutionSteps: "Unit cost = 7.20/3 = 2.40, so GBP2.40 per kg.",
    hints: [
      "Unit rate means amount for 1 kg.",
      "Divide total cost by total kilograms.",
      "M1 for division, A1 for GBP2.40 per kg."
    ]
  },
  {
    objectiveId: "r-rp-03",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "conversion",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "Convert 72 km/h to m/s.",
    finalAnswer: "20",
    solutionSteps: "72 km/h = 72 x (1000/3600) m/s = 72/3.6 = 20 m/s.",
    hints: [
      "Use 1 m/s = 3.6 km/h.",
      "So divide 72 by 3.6.",
      "M1 for method using 3.6 (or 1000/3600), A1 for 20 m/s."
    ]
  },
  {
    objectiveId: "r-roc-01",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "graph",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "A straight-line graph passes through (2,5) and (8,23). Find the rate of change.",
    finalAnswer: "3",
    solutionSteps: "Rate of change is gradient: (23-5)/(8-2) = 18/6 = 3.",
    hints: [
      "Use gradient = change in y over change in x.",
      "Subtract y-values and x-values in the same order.",
      "M1 for gradient fraction, M1 for simplification, A1 for 3."
    ]
  },
  {
    objectiveId: "r-roc-01",
    tier: "Foundation",
    difficulty: "Medium",
    questionType: "word_problem",
    marks: 2,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "A temperature rises from 12 deg C to 30 deg C in 6 hours. Find the average rate of change in deg C per hour.",
    finalAnswer: "3",
    solutionSteps: "Change in temperature = 30-12=18. Rate = 18/6 = 3 deg C per hour.",
    hints: [
      "Find total change first.",
      "Divide by the time interval.",
      "M1 for 18/6, A1 for 3 deg C per hour."
    ]
  },
  {
    objectiveId: "r-roc-01",
    tier: "Foundation",
    difficulty: "Easy",
    questionType: "reasoning",
    marks: 2,
    examStyle: true,
    calculatorAllowed: false,
    questionText: "On a distance-time graph, what does a horizontal line segment mean?",
    finalAnswer: "stationary",
    solutionSteps: "A horizontal segment has gradient 0, so distance is not changing and the object is stationary.",
    hints: [
      "A horizontal line means no change in the y-value.",
      "Distance is constant while time increases.",
      "B1 for stationary / not moving."
    ]
  },
  {
    objectiveId: "r-roc-01",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "reasoning",
    marks: 3,
    examStyle: true,
    calculatorAllowed: false,
    questionText: "The table gives x: 1, 3, 7 and y: 4, 10, 22. Show the rate of change is constant and state its value.",
    finalAnswer: "3",
    solutionSteps: "From x=1 to 3, delta y/delta x = (10-4)/(3-1)=6/2=3. From x=3 to 7, (22-10)/(7-3)=12/4=3. Constant rate is 3.",
    hints: [
      "Compute gradient between consecutive points.",
      "Compare both gradient values.",
      "M1 for one correct gradient, M1 for second gradient, A1 for constant rate 3."
    ]
  },
  {
    objectiveId: "r-roc-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "estimation",
    marks: 4,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "Estimate the gradient of y = x^2 at x = 2 using points (1.8, 3.24) and (2.2, 4.84).",
    finalAnswer: "4",
    solutionSteps: "Estimated gradient = (4.84-3.24)/(2.2-1.8) = 1.60/0.40 = 4.",
    hints: [
      "Use the two points near x=2 in a gradient formula.",
      "Subtract y-values and x-values carefully.",
      "M1 for correct difference quotient, M1 for decimal arithmetic, A1 for 4."
    ]
  },
  {
    objectiveId: "r-roc-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "multi_step",
    marks: 4,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "A velocity-time graph is a straight line from 4 m/s at t=0 to 10 m/s at t=6 s. Estimate the distance travelled in 6 s.",
    finalAnswer: "42",
    solutionSteps: "Distance is area under graph. This is a trapezium: ((4+10)/2) x 6 = 7 x 6 = 42 m.",
    hints: [
      "Distance from a velocity-time graph is area under the graph.",
      "For a straight-line increase, use trapezium area.",
      "M1 for area model, M1 for substitution, A1 for 42 m."
    ]
  },
  {
    objectiveId: "r-roc-02",
    tier: "Higher",
    difficulty: "Hard",
    questionType: "graph",
    marks: 3,
    examStyle: true,
    calculatorAllowed: true,
    questionText: "A curve passes through (4,18) and (6,36). Estimate the average rate of change between these x-values.",
    finalAnswer: "9",
    solutionSteps: "Average rate of change = (36-18)/(6-4) = 18/2 = 9.",
    hints: [
      "Use average rate of change formula between two points.",
      "Work out the change in y and change in x.",
      "M1 for setting up the quotient, A1 for 9."
    ]
  }
];
