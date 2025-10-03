import { Unit } from './types';

const UNITS_CHEMISTRY: Unit[] = [
  {
    id: 'unit1',
    title: 'Unit 1: Foundations of Chemistry',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    darkColor: 'dark:text-blue-400',
    darkBgColor: 'dark:bg-blue-900/50',
    lessons: [
      {
        id: 'l1-1',
        title: 'SI Units',
        dependencies: [],
        slides: [
          {
            type: 'text',
            title: 'Welcome to the World of Measurement!',
            content: "In chemistry, precise measurements are everything! To make sure scientists all over the world are on the same page, we use a standard system called the **International System of Units**, or *SI units*. It's like a universal language for measurement."
          },
          {
            type: 'text',
            title: 'Key Metric Units',
            content: "While there are seven official SI base units, in chemistry we frequently use a core set of metric units. The most common are the **meter (m)** for length, **gram (g)** for mass, **second (s)** for time, and **liter (L)** for volume. We'll also use **kelvin (K)** for temperature and the **mole (mol)** for the amount of substance. These units form the foundation for all our calculations!"
          },
        ],
      },
      {
        id: 'l1-2',
        title: 'Significant Figures',
        dependencies: ['l1-1'],
        slides: [
            {
                type: 'text',
                title: 'What Are Significant Figures?',
                content: "Significant figures (or *sig figs*) are the digits in a number that are reliable and necessary to indicate the quantity of something. They represent the **precision** of a measurement."
            },
            {
                type: 'text',
                title: 'The Rules',
                content: "1. Non-zero digits are *always* significant.\n2. Zeros between non-zero digits are significant (e.g., in `101`, all 3 digits are significant).\n3. Leading zeros are *never* significant (e.g., `0.05` has only one sig fig).\n4. Trailing zeros are significant *only if* the number contains a decimal point (e.g., `1.20` has three sig figs, but `120` only has two)."
            }
        ]
      },
      {
        id: 'l1-3',
        title: 'Dimensional Analysis',
        dependencies: ['l1-2'],
        slides: [
          {
            type: 'text',
            title: 'The Factor-Label Method',
            content: "Dimensional analysis, also known as the **factor-label method**, is a powerful problem-solving technique for converting units. It involves multiplying a given value by *conversion factors* to cancel out unwanted units and leave you with the desired unit."
          },
          {
            type: 'table',
            title: 'Example: Kilometers to Meters',
            content: `
              Start | Conversion Factor | Result
              2.5 km | 1000 m / 1 km | = 2500 m
            `
          },
          {
            type: 'text',
            content: "Notice how the `km` unit in the starting value cancels out with the `km` unit in the denominator of the conversion factor, leaving only `m` in the final answer. It's a foolproof way to make sure your conversions are set up correctly!"
          }
        ],
      },
       {
        id: 'l1-4',
        title: 'Density',
        dependencies: ['l1-3'],
        slides: [
            {
                type: 'text',
                title: 'What is Density?',
                content: "Density is an *intensive property* of matter, meaning it doesn't depend on the amount of substance you have. It's defined as the ratio of an object's **mass** to its **volume**."
            },
            {
                type: 'text',
                title: 'The Formula',
                content: "The formula for density is: \n `Density (ρ) = Mass (m) / Volume (V)` \n\n Common units for density are grams per cubic centimeter (`g/cm³`) for solids, and grams per milliliter (`g/mL`) for liquids."
            }
        ]
      }
    ],
  },
  {
    id: 'unit2',
    title: 'Unit 2: Matter & Energy',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    darkColor: 'dark:text-teal-400',
    darkBgColor: 'dark:bg-teal-900/50',
    lessons: [
       {
        id: 'l2-1',
        title: 'States of Matter',
        dependencies: ['l1-4'],
        slides: [
            {
                type: 'text',
                title: 'Solid, Liquid, Gas',
                content: "Matter typically exists in one of three states: **solid**, **liquid**, or **gas**. The state of a substance depends on its temperature and pressure, which affect how its particles are arranged and how they move."
            },
            {
                type: 'image',
                title: 'Particle Arrangement',
                content: "A clear, simple diagram showing three labeled boxes side-by-side: 'Solid', 'Liquid', and 'Gas'. In the 'Solid' box, draw particles as small circles arranged in a tight, orderly, crystalline lattice. In the 'Liquid' box, show the same particles close together but randomly arranged and able to move past one another. In the 'Gas' box, show the particles far apart, moving randomly and rapidly in all directions."
            }
        ]
       },
       {
        id: 'l2-2',
        title: 'Classification of Matter',
        dependencies: ['l2-1'],
        slides: [
            {
                type: 'text',
                title: 'Pure Substances vs. Mixtures',
                content: "All matter can be classified into two main categories: **pure substances** and **mixtures**.\n\n*Pure substances* have a uniform and definite composition (e.g., water, sugar). *Mixtures* are physical blends of two or more substances (e.g., salt water, air)."
            },
            {
                type: 'image',
                title: 'Matter Flowchart',
                content: 'A clean, easy-to-read flowchart. Start with a box at the top labeled "Matter". It should branch down to two boxes: "Pure Substances" and "Mixtures". The "Pure Substances" box then branches to "Elements" and "Compounds". The "Mixtures" box branches to "Homogeneous" and "Heterogeneous". Use simple lines and clear, sans-serif text.'
            }
        ]
       },
       {
        id: 'l2-3',
        title: 'Physical & Chemical Changes',
        dependencies: ['l2-2'],
        slides: [
            {
                type: 'text',
                title: 'Physical Changes',
                content: "A **physical change** is a change in a substance that does *not* involve a change in the identity of the substance. Examples include changes of state (melting, boiling), size, or shape."
            },
            {
                type: 'text',
                title: 'Chemical Changes',
                content: "A **chemical change** (or chemical reaction) is a change where one or more substances are converted into different substances. Signs of a chemical change include color change, formation of a gas or precipitate, or release of heat or light."
            }
        ]
       }
    ],
  },
    {
    id: 'unit3',
    title: 'Unit 3: Atomic Structure',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    darkColor: 'dark:text-green-400',
    darkBgColor: 'dark:bg-green-900/50',
    lessons: [
        {
            id: 'l3-1',
            title: 'Early Atomic Models',
            dependencies: ['l2-3'],
            slides: [
                {
                    type: 'text',
                    title: "Dalton's Atomic Theory",
                    content: "In the early 1800s, John Dalton proposed that all matter was composed of tiny, indivisible particles called **atoms**. His theory was a cornerstone of modern chemistry."
                },
                {
                    type: 'text',
                    title: "Thomson and Rutherford",
                    content: "J.J. Thomson discovered the **electron** and proposed the *plum pudding model*. Later, Ernest Rutherford's gold foil experiment showed the atom is mostly empty space with a tiny, dense, positively-charged **nucleus**."
                },
                 {
                    type: 'image',
                    title: "Rutherford's Gold Foil Experiment",
                    content: 'A minimalist diagram illustrating Rutherford\'s gold foil experiment. Show a source emitting alpha particles towards a very thin sheet of gold foil. Most particles should be shown passing straight through. A few should be slightly deflected, and one or two should be shown bouncing back at a large angle. Label the "Alpha Particle Source", "Gold Foil", and "Deflected Particles".'
                }
            ]
        },
        {
            id: 'l3-2',
            title: 'The Modern Atom',
            dependencies: ['l3-1'],
            slides: [
                {
                    type: 'text',
                    title: 'Protons, Neutrons, Electrons',
                    content: "The modern atom consists of three subatomic particles:\n- **Protons**: Positively charged, in the nucleus.\n- **Neutrons**: No charge, in the nucleus.\n- **Electrons**: Negatively charged, orbiting the nucleus in electron shells."
                },
                {
                    type: 'text',
                    title: 'Atomic Number & Mass Number',
                    content: "The **atomic number (Z)** is the number of protons and defines the element.\nThe **mass number (A)** is the sum of protons and neutrons in the nucleus."
                }
            ]
        },
        {
            id: 'l3-3',
            title: 'Isotopes',
            dependencies: ['l3-2'],
            slides: [
                {
                    type: 'text',
                    title: 'What are Isotopes?',
                    content: "**Isotopes** are atoms of the same element that have the same number of protons but a *different* number of neutrons. This means they have different mass numbers."
                },
                {
                    type: 'text',
                    title: 'Example: Carbon',
                    content: "For example, Carbon-12 (`¹²C`) has 6 protons and 6 neutrons, while Carbon-14 (`¹⁴C`) has 6 protons and 8 neutrons. Both are still carbon, but `¹⁴C` is heavier and radioactive."
                }
            ]
        }
    ],
  },
  {
    id: 'unit4',
    title: 'Unit 4: The Periodic Table',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    darkColor: 'dark:text-red-400',
    darkBgColor: 'dark:bg-red-900/50',
    lessons: [
        {
            id: 'l4-1',
            title: 'Organizing the Elements',
            dependencies: ['l3-3'],
            slides: [
                {
                    type: 'text',
                    title: 'Mendeleev\'s Table',
                    content: "Dmitri Mendeleev arranged the elements by increasing **atomic mass** and noticed that properties repeated periodically. He left gaps for undiscovered elements, correctly predicting their properties."
                },
                {
                    type: 'text',
                    title: 'The Modern Table',
                    content: "The modern periodic table is arranged by increasing **atomic number** (number of protons). This resolved the issues in Mendeleev's table. The periodic law states that the properties of elements are periodic functions of their atomic numbers."
                }
            ]
        },
        {
            id: 'l4-2',
            title: 'Periodic Trends',
            dependencies: ['l4-1'],
            slides: [
                {
                    type: 'text',
                    title: 'What are Trends?',
                    content: "Periodic trends are specific patterns in the properties of chemical elements that are revealed in the periodic table. Major trends include **atomic radius**, **ionization energy**, and **electronegativity**."
                },
                {
                    type: 'image',
                    title: 'Diagram of Periodic Trends',
                    content: 'A clean, minimalist diagram of the periodic table, showing only the outline. Use large, clear arrows to illustrate periodic trends. One arrow should point from top-right to bottom-left, labeled "Atomic Radius Increases". Another arrow should point from bottom-left to top-right, labeled "Ionization Energy & Electronegativity Increase". Use a simple, sans-serif font for labels.'
                }
            ]
        }
    ],
  },
  {
    id: 'unit5',
    title: 'Unit 5: Chemical Bonding',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    darkColor: 'dark:text-yellow-400',
    darkBgColor: 'dark:bg-yellow-900/50',
    lessons: [
        {
            id: 'l5-1',
            title: 'Ionic Bonding',
            dependencies: ['l4-2'],
            slides: [
                {
                    type: 'text',
                    title: 'Transfer of Electrons',
                    content: "**Ionic bonding** typically occurs between a *metal* and a *nonmetal*. It involves the **transfer** of one or more electrons from the metal to the nonmetal, creating charged ions."
                },
                {
                    type: 'text',
                    title: 'Cations and Anions',
                    content: "The metal atom loses electrons to become a positively charged **cation**. The nonmetal atom gains electrons to become a negatively charged **anion**. The electrostatic attraction between these opposite charges forms the bond."
                }
            ]
        },
        {
            id: 'l5-2',
            title: 'Covalent Bonding',
            dependencies: ['l5-1'],
            slides: [
                 {
                    type: 'text',
                    title: 'Sharing Electrons',
                    content: "**Covalent bonding** occurs between *nonmetals*. It involves the **sharing** of valence electrons between atoms to achieve a stable electron configuration, typically a full octet."
                },
                {
                    type: 'image',
                    title: 'Covalent Bond in Water',
                    content: 'A simple, clear Lewis structure diagram for a water molecule (H2O). Show the letter "O" for oxygen in the center. Show two "H" letters for hydrogen, one on each side. Draw a single line connecting each H to the O, representing a shared pair of electrons. On the oxygen atom, draw two pairs of dots (four dots total) to represent its two lone pairs of electrons.'
                }
            ]
        }
    ],
  },
  {
    id: 'unit6',
    title: 'Unit 6: Nomenclature & Reactions',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    darkColor: 'dark:text-orange-400',
    darkBgColor: 'dark:bg-orange-900/50',
    lessons: [
        {
            id: 'l6-1',
            title: 'Naming Ionic Compounds',
            dependencies: ['l5-2'],
            slides: [
                {
                    type: 'text',
                    title: 'Simple Rules',
                    content: "For binary ionic compounds, name the **cation** (metal) first, followed by the **anion** (nonmetal). The anion's ending is changed to *-ide*. For example, `NaCl` is Sodium Chloride."
                },
                {
                    type: 'text',
                    title: 'Transition Metals',
                    content: "If the cation is a transition metal that can form multiple charges (like iron), use a **Roman numeral** in parentheses to indicate the charge. For example, `FeCl2` is Iron (II) Chloride."
                }
            ]
        },
        {
            id: 'l6-2',
            title: 'Balancing Equations',
            dependencies: ['l6-1'],
            slides: [
                 {
                    type: 'text',
                    title: 'Law of Conservation of Mass',
                    content: "A chemical equation must be **balanced** to obey the Law of Conservation of Mass, which states that matter cannot be created or destroyed. This means you must have the same number of atoms of each element on both sides of the equation. We do this by adding **coefficients** in front of formulas."
                },
                {
                    type: 'interactive',
                    title: 'Balance the formation of water',
                    content: { type: 'balance-equation', equation: 'H2 + O2 -> H2O', balanced: [2, 1, 2] }
                },
                {
                    type: 'interactive',
                    title: 'Balance the formation of ammonia',
                    content: { type: 'balance-equation', equation: 'N2 + H2 -> NH3', balanced: [1, 3, 2] }
                },
                {
                    type: 'interactive',
                    title: 'Balance the combustion of methane',
                    content: { type: 'balance-equation', equation: 'CH4 + O2 -> CO2 + H2O', balanced: [1, 2, 1, 2] }
                }
            ]
        }
    ],
  },
  {
    id: 'unit7',
    title: 'Unit 7: Stoichiometry',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    darkColor: 'dark:text-cyan-400',
    darkBgColor: 'dark:bg-cyan-900/50',
    lessons: [
        {
            id: 'l7-1',
            title: 'The Mole',
            dependencies: ['l6-2'],
            slides: [
                {
                    type: 'text',
                    title: "A Chemist's Dozen",
                    content: "The **mole** is the SI unit for the amount of a substance. It's just a counting number, like a 'dozen' but much larger. One mole of anything contains **6.022 x 10²³** particles. This giant number is called *Avogadros Number*."
                },
                {
                    type: 'image',
                    title: 'Visualizing the Mole',
                    content: "A simple, two-part illustration. On the left, show a laboratory beaker filled with water, clearly labeled '18.02 g H2O'. On the right, show a depiction of many tiny water molecules, with a label that says '6.022 x 10²³ molecules'. An arrow should connect the two parts, with the caption: 'One mole of a substance contains Avogadro's number of particles.'"
                }
            ]
        },
        {
            id: 'l7-2',
            title: 'Molar Mass',
            dependencies: ['l7-1'],
            slides: [
                {
                    type: 'text',
                    title: 'Mass of One Mole',
                    content: "The **molar mass** of a substance is the mass in grams of one mole of that substance. The units are *grams per mole* (`g/mol`). You can find the molar mass of an element on the periodic table (it's the atomic mass!)."
                },
                {
                    type: 'text',
                    title: 'For Compounds',
                    content: "To find the molar mass of a compound, you add up the molar masses of all the atoms in its formula. For water (`H2O`), it would be `(2 * 1.01 g/mol) + (1 * 16.00 g/mol) = 18.02 g/mol`."
                }
            ]
        }
    ],
  },
  {
    id: 'unit8',
    title: 'Unit 8: Gases',
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
    darkColor: 'dark:text-sky-400',
    darkBgColor: 'dark:bg-sky-900/50',
    lessons: [
        {
            id: 'l8-1',
            title: 'The Gas Laws',
            dependencies: ['l7-2'],
            slides: [
                {
                    type: 'text',
                    title: "Boyle's Law",
                    content: "**Boyle's Law** states that for a fixed amount of gas at constant temperature, the *pressure* and *volume* are inversely proportional. As pressure increases, volume decreases. `P1V1 = P2V2`."
                },
                {
                    type: 'text',
                    title: "Charles's Law",
                    content: "**Charles's Law** states that for a fixed amount of gas at constant pressure, the *volume* and *temperature* (in Kelvin) are directly proportional. As temperature increases, volume increases. `V1/T1 = V2/T2`."
                }
            ]
        },
        {
            id: 'l8-2',
            title: 'Ideal Gas Law',
            dependencies: ['l8-1'],
            slides: [
                {
                    type: 'text',
                    title: 'Combining the Laws',
                    content: "The **Ideal Gas Law** combines the relationships between pressure (P), volume (V), temperature (T), and the amount of gas (n, in moles) into a single equation."
                },
                {
                    type: 'text',
                    title: 'The Equation',
                    content: "The equation is **`PV = nRT`**, where `R` is the ideal gas constant. This is one of the most important equations for describing the behavior of gases under ideal conditions."
                }
            ]
        }
    ],
  },
  {
    id: 'unit9',
    title: 'Unit 9: Solutions',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    darkColor: 'dark:text-indigo-400',
    darkBgColor: 'dark:bg-indigo-900/50',
    lessons: [
        {
            id: 'l9-1',
            title: 'Molarity',
            dependencies: ['l8-2'],
            slides: [
                {
                    type: 'text',
                    title: 'Concentration of Solutions',
                    content: "**Molarity (M)** is the most common unit of concentration in chemistry. It is defined as the number of **moles of solute** divided by the **liters of solution**."
                },
                {
                    type: 'text',
                    title: 'The Formula',
                    content: 'The formula is: \n `Molarity (M) = Moles of solute / Liters of solution` \n A solution labeled `3 M HCl` contains 3 moles of `HCl` for every 1 liter of solution.'
                }
            ]
        }
    ],
  },
    {
    id: 'unit10',
    title: 'Unit 10: Acids & Bases',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    darkColor: 'dark:text-pink-400',
    darkBgColor: 'dark:bg-pink-900/50',
    lessons: [
        {
            id: 'l10-1',
            title: 'Intro to Acids & Bases',
            dependencies: ['l9-1'],
            slides: [
                {
                    type: 'text',
                    title: 'Arrhenius Theory',
                    content: "The Arrhenius theory defines an **acid** as a substance that produces hydrogen ions (`H⁺`) in aqueous solution, and a **base** as a substance that produces hydroxide ions (`OH⁻`) in aqueous solution."
                },
                {
                    type: 'text',
                    title: 'Properties',
                    content: "Acids typically taste sour, react with metals to produce hydrogen gas, and turn blue litmus paper red. Bases taste bitter, feel slippery, and turn red litmus paper blue."
                }
            ]
        },
        {
            id: 'l10-2',
            title: 'The pH Scale',
            dependencies: ['l10-1'],
            slides: [
                {
                    type: 'text',
                    title: 'A Measure of Acidity',
                    content: "The **pH scale** is a logarithmic scale used to specify the acidity or basicity of an aqueous solution. It ranges from 0 to 14."
                },
                {
                    type: 'image',
                    title: 'The pH Scale Diagram',
                    content: 'A colorful horizontal bar representing the pH scale. The left side (pH 0-6) should be colored in shades of red and orange, labeled "Acidic". The middle (pH 7) should be green and labeled "Neutral". The right side (pH 8-14) should be shades of blue and purple, labeled "Basic/Alkaline". Add simple icons and labels for common examples: "Stomach Acid" at pH 2, "Water" at pH 7, and "Bleach" at pH 13.'
                }
            ]
        }
    ],
  }
];

const subjectColors = [
    { color: 'text-red-600', bgColor: 'bg-red-100', darkColor: 'dark:text-red-400', darkBgColor: 'dark:bg-red-900/50' },
    { color: 'text-orange-600', bgColor: 'bg-orange-100', darkColor: 'dark:text-orange-400', darkBgColor: 'dark:bg-orange-900/50' },
    { color: 'text-amber-600', bgColor: 'bg-amber-100', darkColor: 'dark:text-amber-400', darkBgColor: 'dark:bg-amber-900/50' },
    { color: 'text-yellow-600', bgColor: 'bg-yellow-100', darkColor: 'dark:text-yellow-400', darkBgColor: 'dark:bg-yellow-900/50' },
    { color: 'text-lime-600', bgColor: 'bg-lime-100', darkColor: 'dark:text-lime-400', darkBgColor: 'dark:bg-lime-900/50' },
    { color: 'text-green-600', bgColor: 'bg-green-100', darkColor: 'dark:text-green-400', darkBgColor: 'dark:bg-green-900/50' },
    { color: 'text-emerald-600', bgColor: 'bg-emerald-100', darkColor: 'dark:text-emerald-400', darkBgColor: 'dark:bg-emerald-900/50' },
    { color: 'text-teal-600', bgColor: 'bg-teal-100', darkColor: 'dark:text-teal-400', darkBgColor: 'dark:bg-teal-900/50' },
    { color: 'text-cyan-600', bgColor: 'bg-cyan-100', darkColor: 'dark:text-cyan-400', darkBgColor: 'dark:bg-cyan-900/50' },
    { color: 'text-sky-600', bgColor: 'bg-sky-100', darkColor: 'dark:text-sky-400', darkBgColor: 'dark:bg-sky-900/50' },
    { color: 'text-blue-600', bgColor: 'bg-blue-100', darkColor: 'dark:text-blue-400', darkBgColor: 'dark:bg-blue-900/50' },
    { color: 'text-indigo-600', bgColor: 'bg-indigo-100', darkColor: 'dark:text-indigo-400', darkBgColor: 'dark:bg-indigo-900/50' },
    { color: 'text-violet-600', bgColor: 'bg-violet-100', darkColor: 'dark:text-violet-400', darkBgColor: 'dark:bg-violet-900/50' },
    { color: 'text-purple-600', bgColor: 'bg-purple-100', darkColor: 'dark:text-purple-400', darkBgColor: 'dark:bg-purple-900/50' },
];

const UNITS_ANATOMY: Unit[] = [
    {
        id: 'a-unit1', title: 'Unit 1: Introduction to A&P', ...subjectColors[0],
        lessons: [
            { id: 'a-l1-1', title: 'Intro to Anatomy', dependencies: [], slides: [{ type: 'text', title: 'What is Anatomy?', content: 'Anatomy is the study of the structure of body parts and their relationships to one another.' }] },
            { id: 'a-l1-2', title: 'Anatomical Terminology', dependencies: ['a-l1-1'], slides: [{ type: 'text', title: 'The Language of Anatomy', content: 'We use specific directional and regional terms to describe body parts and positions. For example, *superior* means toward the head, and *inferior* means toward the feet.' }] },
            { id: 'a-l1-3', title: 'Homeostasis', dependencies: ['a-l1-2'], slides: [{ type: 'text', title: 'Maintaining Balance', content: "Homeostasis is the body's ability to maintain a stable internal environment despite changing external conditions. It's a dynamic state of equilibrium." }] },
        ]
    },
    {
        id: 'a-unit2', title: 'Unit 2: Chemical Level', ...subjectColors[1],
        lessons: [
            { id: 'a-l2-1', title: 'Basic Chemistry', dependencies: ['a-l1-3'], slides: [{ type: 'text', title: 'Atoms and Molecules', content: 'All matter, including our bodies, is made of atoms. Atoms bond together to form molecules.' }] },
            { id: 'a-l2-2', title: 'Important Biomolecules', dependencies: ['a-l2-1'], slides: [{ type: 'text', title: 'The Molecules of Life', content: 'The four major classes of biomolecules are carbohydrates, lipids, proteins, and nucleic acids. Each has a unique function in the body.' }] },
        ]
    },
    {
        id: 'a-unit3', title: 'Unit 3: Cellular Level', ...subjectColors[2],
        lessons: [
            { id: 'a-l3-1', title: 'The Cell', dependencies: ['a-l2-2'], slides: [{ type: 'text', title: 'The Basic Unit of Life', content: 'The cell is the smallest structural and functional unit of an organism. We will explore its main parts: the plasma membrane, cytoplasm, and nucleus.' }] },
            { id: 'a-l3-2', title: 'Membrane Transport', dependencies: ['a-l3-1'], slides: [{ type: 'text', title: 'Getting In and Out', content: 'The plasma membrane is selectively permeable. Substances cross it through passive processes like diffusion and active processes that require energy.' }] },
        ]
    },
    {
        id: 'a-unit4', title: 'Unit 4: Tissues', ...subjectColors[3],
        lessons: [
            { id: 'a-l4-1', title: 'Epithelial Tissue', dependencies: ['a-l3-2'], slides: [{ type: 'text', title: 'Covering and Lining', content: 'Epithelial tissue covers body surfaces, lines cavities, and forms glands.' }] },
            { id: 'a-l4-2', title: 'Connective Tissue', dependencies: ['a-l4-1'], slides: [{ type: 'text', title: 'Support and Connect', content: 'Connective tissue is the most abundant type. It supports, protects, and binds other tissues together. Examples include bone, cartilage, and blood.' }] },
            { id: 'a-l4-3', title: 'Muscle Tissue', dependencies: ['a-l4-2'], slides: [{ type: 'text', title: 'Movement', content: 'Muscle tissue is responsible for body movement. There are three types: skeletal, cardiac, and smooth.' }] },
            { id: 'a-l4-4', title: 'Nervous Tissue', dependencies: ['a-l4-3'], slides: [{ type: 'text', title: 'Communication', content: 'Nervous tissue forms the brain, spinal cord, and nerves, and is responsible for communication and control.' }] },
        ]
    },
    {
        id: 'a-unit5', title: 'Unit 5: Integumentary System', ...subjectColors[4],
        lessons: [
            { id: 'a-l5-1', title: 'Layers of the Skin', dependencies: ['a-l4-4'], slides: [{ type: 'text', title: 'Epidermis and Dermis', content: 'The skin has two main layers: the outer epidermis, which is a protective shield, and the inner dermis, which contains nerve endings, glands, and hair follicles.' }] },
            { id: 'a-l5-2', title: 'Functions of the Skin', dependencies: ['a-l5-1'], slides: [{ type: 'text', title: 'More Than Just a Covering', content: 'The skin provides protection, regulates body temperature, synthesizes vitamin D, and houses sensory receptors.' }] },
        ]
    },
    {
        id: 'a-unit6', title: 'Unit 6: Skeletal System', ...subjectColors[5],
        lessons: [
            { id: 'a-l6-1', title: 'Bone Structure', dependencies: ['a-l5-2'], slides: [{ type: 'text', title: 'Anatomy of a Bone', content: 'Bones are complex organs. We will look at the difference between compact and spongy bone.' }] },
            { id: 'a-l6-2', title: 'The Axial Skeleton', dependencies: ['a-l6-1'], slides: [{ type: 'text', title: 'The Body\'s Axis', content: 'The axial skeleton forms the long axis of the body and includes the skull, vertebral column, and rib cage.' }] },
            { id: 'a-l6-3', title: 'The Appendicular Skeleton', dependencies: ['a-l6-2'], slides: [{ type: 'text', title: 'The Limbs', content: 'The appendicular skeleton consists of the bones of the upper and lower limbs and the girdles that attach them to the axial skeleton.' }] },
            { id: 'a-l6-4', title: 'Joints', dependencies: ['a-l6-3'], slides: [{ type: 'text', title: 'Where Bones Meet', content: 'Joints, or articulations, are the sites where two or more bones meet, allowing for mobility.' }] },
        ]
    },
    {
        id: 'a-unit7', title: 'Unit 7: Muscular System', ...subjectColors[6],
        lessons: [
            { id: 'a-l7-1', title: 'Muscle Anatomy', dependencies: ['a-l6-4'], slides: [{ type: 'text', title: 'Skeletal Muscles', content: 'We will look at the macroscopic and microscopic anatomy of a skeletal muscle.' }] },
            { id: 'a-l7-2', title: 'The Sliding Filament Theory', dependencies: ['a-l7-1'], slides: [{ type: 'text', title: 'How Muscles Contract', content: 'Contraction occurs when thin filaments (actin) slide past thick filaments (myosin), causing the sarcomere to shorten.' }] },
            { id: 'a-l7-3', title: 'Major Muscle Groups', dependencies: ['a-l7-2'], slides: [{ type: 'text', title: 'Prime Movers', content: 'Learn to identify the major muscle groups of the body and their primary actions.' }] },
        ]
    },
    {
        id: 'a-unit8', title: 'Unit 8: Nervous System', ...subjectColors[7],
        lessons: [
            { id: 'a-l8-1', title: 'Neurons & Action Potentials', dependencies: ['a-l7-3'], slides: [{ type: 'text', title: 'Nerve Cells', content: 'Neurons are the structural units of the nervous system. They transmit electrical signals called action potentials.' }] },
            { id: 'a-l8-2', title: 'The Central Nervous System', dependencies: ['a-l8-1'], slides: [{ type: 'text', title: 'Brain and Spinal Cord', content: 'The CNS is the integration and command center of the nervous system.' }] },
            { id: 'a-l8-3', title: 'The Peripheral Nervous System', dependencies: ['a-l8-2'], slides: [{ type: 'text', title: 'Nerves Outside the CNS', content: 'The PNS consists of the nerves that extend from the brain and spinal cord, linking all parts of the body to the CNS.' }] },
        ]
    },
    {
        id: 'a-unit9', title: 'Unit 9: Digestive System', ...subjectColors[8],
        lessons: [
            { id: 'a-l9-1', title: 'Organs of Digestion', dependencies: ['a-l8-3'], slides: [{ type: 'text', title: 'The Alimentary Canal', content: 'Follow the path of food through the mouth, esophagus, stomach, and small and large intestines.' }] },
            { id: 'a-l9-2', title: 'Chemical Digestion', dependencies: ['a-l9-1'], slides: [{ type: 'text', title: 'Breaking Down Food', content: 'Enzymes secreted by various organs break down complex food molecules into their chemical building blocks.' }] },
            { id: 'a-l9-3', title: 'Nutrition', dependencies: ['a-l9-2'], slides: [{ type: 'text', title: 'Nutrients for Life', content: 'A nutrient is a substance used by the body for growth, maintenance, and repair.' }] },
        ]
    },
    {
        id: 'a-unit10', title: 'Unit 10: Respiratory System', ...subjectColors[9],
        lessons: [
            { id: 'a-l10-1', title: 'Anatomy of Respiration', dependencies: ['a-l9-3'], slides: [{ type: 'text', title: 'The Lungs and Airways', content: 'The main organs of the respiratory system are the lungs. Air reaches them via the nose, pharynx, larynx, trachea, and bronchi.' }] },
            { id: 'a-l10-2', title: 'Gas Exchange', dependencies: ['a-l10-1'], slides: [{ type: 'text', title: 'Oxygen and Carbon Dioxide', content: 'Gas exchange occurs in the alveoli of the lungs, where oxygen enters the blood and carbon dioxide leaves.' }] },
        ]
    },
    {
        id: 'a-unit11', title: 'Unit 11: Cardiovascular System', ...subjectColors[10],
        lessons: [
            { id: 'a-l11-1', title: 'The Heart', dependencies: ['a-l10-2'], slides: [{ type: 'text', title: 'The Body\'s Pump', content: 'The heart is a four-chambered muscular pump that propels blood through the blood vessels.' }] },
            { id: 'a-l11-2', title: 'Blood Vessels', dependencies: ['a-l11-1'], slides: [{ type: 'text', title: 'Arteries, Veins, Capillaries', content: 'Arteries carry blood away from the heart, veins carry it toward the heart, and capillaries are where exchange occurs.' }] },
            { id: 'a-l11-3', title: 'Blood Pressure', dependencies: ['a-l11-2'], slides: [{ type: 'text', title: 'Force of Blood', content: 'Blood pressure is the force that blood exerts against the inner walls of the blood vessels.' }] },
        ]
    },
    {
        id: 'a-unit12', title: 'Unit 12: Blood', ...subjectColors[11],
        lessons: [
            { id: 'a-l12-1', title: 'Composition of Blood', dependencies: ['a-l11-3'], slides: [{ type: 'text', title: 'Plasma and Formed Elements', content: 'Blood is composed of plasma (the liquid matrix) and formed elements (erythrocytes, leukocytes, and platelets).' }] },
            { id: 'a-l12-2', title: 'Blood Typing', dependencies: ['a-l12-1'], slides: [{ type: 'text', title: 'ABO and Rh Groups', content: 'Blood types are based on the presence or absence of specific antigens on the surface of red blood cells.' }] },
        ]
    },
    {
        id: 'a-unit13', title: 'Unit 13: Immune System', ...subjectColors[12],
        lessons: [
            { id: 'a-l13-1', title: 'Innate Immunity', dependencies: ['a-l12-2'], slides: [{ type: 'text', title: 'First Line of Defense', content: 'The innate system is our nonspecific defense system, including surface barriers like skin and internal defenses like inflammation.' }] },
            { id: 'a-l13-2', title: 'Adaptive Immunity', dependencies: ['a-l13-1'], slides: [{ type: 'text', title: 'Specific Defenses', content: 'The adaptive system is our specific defense system that attacks particular foreign substances and has memory.' }] },
        ]
    },
    {
        id: 'a-unit14', title: 'Unit 14: Urinary System', ...subjectColors[13],
        lessons: [
            { id: 'a-l14-1', title: 'Kidney Anatomy', dependencies: ['a-l13-2'], slides: [{ type: 'text', title: 'The Body\'s Filters', content: 'The kidneys are the major excretory organs, filtering waste from the blood.' }] },
            { id: 'a-l14-2', title: 'Urine Formation', dependencies: ['a-l14-1'], slides: [{ type: 'text', title: 'Filtration, Reabsorption, Secretion', content: 'The kidneys produce urine in three steps: glomerular filtration, tubular reabsorption, and tubular secretion.' }] },
        ]
    },
];

const UNITS_BIOLOGY: Unit[] = [
  {
    id: 'bio-unit1',
    title: 'Unit 1: Exploring Life',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    darkColor: 'dark:text-green-400',
    darkBgColor: 'dark:bg-green-900/50',
    lessons: [
      {
        id: 'bio-l1-1',
        title: 'Characteristics of Life',
        dependencies: [],
        slides: [
          { type: 'text', title: 'What is Life?', content: "We begin by defining life itself. All living organisms share key characteristics: **order**, **reproduction**, **growth and development**, **energy processing**, **regulation**, **response to the environment**, and **evolutionary adaptation**." },
          { type: 'text', title: 'The Hierarchy of Life', content: "Life is organized on many levels. From smallest to largest, these are:\n- **Molecules**: Groups of atoms.\n- **Organelles**: Structures within cells.\n- **Cells**: The basic unit of life.\n- **Tissues**: Groups of similar cells.\n- **Organs**: Structures with specific functions.\n- **Organisms**: Individual living things.\n- **Populations**: Groups of one species.\n- **Communities**: All living things in an area.\n- **Ecosystems**: All living and non-living things in an area.\n- **The Biosphere**: All life on Earth." }
        ],
      },
       {
        id: 'bio-l1-2',
        title: 'The Scientific Method',
        dependencies: ['bio-l1-1'],
        slides: [
          { type: 'text', title: 'A Way of Knowing', content: "The scientific method is a structured way to investigate the natural world. It involves making observations, forming hypotheses, conducting experiments, and drawing conclusions." },
          { type: 'text', title: 'Variables and Controls', content: "In an experiment, the **independent variable** is what you change, the **dependent variable** is what you measure, and the **control group** is used for comparison." }
        ],
      },
    ],
  },
  {
    id: 'bio-unit2',
    title: 'Unit 2: The Chemical Basis of Life',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    darkColor: 'dark:text-teal-400',
    darkBgColor: 'dark:bg-teal-900/50',
    lessons: [
       {
        id: 'bio-l2-1',
        title: 'Atoms and Bonding',
        dependencies: ['bio-l1-2'],
        slides: [
            { type: 'text', title: 'The Building Blocks', content: "All matter is made of atoms. We will review atomic structure and how atoms form **covalent** and **ionic bonds** to create molecules." },
        ]
       },
       {
        id: 'bio-l2-2',
        title: 'Properties of Water',
        dependencies: ['bio-l2-1'],
        slides: [
            { type: 'text', title: 'The Solvent of Life', content: "Water's unique properties, stemming from its polarity and hydrogen bonds, make life on Earth possible. These include cohesion, adhesion, and high specific heat." },
        ]
       },
       {
        id: 'bio-l2-3',
        title: 'Macromolecules',
        dependencies: ['bio-l2-2'],
        slides: [
            { type: 'text', title: 'The Molecules of Life', content: "There are four main classes of large biological molecules: **carbohydrates**, **lipids**, **proteins**, and **nucleic acids**. They are polymers built from smaller monomers." },
        ]
       },
       {
        id: 'bio-l2-4',
        title: 'Enzymes',
        dependencies: ['bio-l2-3'],
        slides: [
            { type: 'text', title: 'Biological Catalysts', content: "**Enzymes** are proteins that speed up chemical reactions by lowering the activation energy. The reactant an enzyme acts on is called the **substrate**, which binds to the enzyme's **active site**." },
        ]
       },
    ],
  },
  {
    id: 'bio-unit3',
    title: 'Unit 3: The Working Cell',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    darkColor: 'dark:text-cyan-400',
    darkBgColor: 'dark:bg-cyan-900/50',
    lessons: [
       {
        id: 'bio-l3-1',
        title: 'Cell Theory & Organelles',
        dependencies: ['bio-l2-4'],
        slides: [
            { type: 'text', title: 'The Basic Unit of Life', content: "The **Cell Theory** states that all living things are composed of cells, and all cells come from other cells. We'll tour the various **organelles** and their functions." },
            { type: 'image', title: 'Animal Cell vs. Plant Cell', content: "A clear diagram comparing a typical animal cell and a plant cell. Both should be labeled with common organelles like the nucleus, mitochondria, ribosomes, and plasma membrane. The plant cell should additionally feature a large central vacuole, a rigid cell wall outside the plasma membrane, and chloroplasts. Use distinct colors for each organelle." }
        ]
       },
       {
        id: 'bio-l3-2',
        title: 'The Plasma Membrane',
        dependencies: ['bio-l3-1'],
        slides: [
            // FIX: The original slide object was malformed, likely due to a typo,
            // resulting in errors about unknown properties and shorthand properties.
            // It has been replaced with the correct, well-formed slide object.
            { type: 'text', title: "The Cell's Gatekeeper", content: "The plasma membrane is described by the **fluid mosaic model**. It is **selectively permeable**, controlling what enters and leaves the cell." },
        ]
       },
       {
        id: 'bio-l3-3',
        title: 'Passive Transport',
        dependencies: ['bio-l3-2'],
        slides: [
            { type: 'text', title: 'Movement without Energy', content: "**Passive transport** does not require energy. **Diffusion** is the movement of molecules down their concentration gradient. **Osmosis** is the diffusion of water across a membrane." },
        ]
       },
       {
        id: 'bio-l3-4',
        title: 'Active Transport',
        dependencies: ['bio-l3-3'],
        slides: [
            { type: 'text', title: 'Movement with Energy', content: "**Active transport** requires energy (usually ATP) to move substances against their concentration gradient. **Endocytosis** and **exocytosis** move large molecules across the membrane." },
        ]
       },
    ],
  },
  {
    id: 'bio-unit4',
    title: 'Unit 4: Cellular Energy',
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
    darkColor: 'dark:text-sky-400',
    darkBgColor: 'dark:bg-sky-900/50',
    lessons: [
       {
        id: 'bio-l4-1',
        title: 'ATP: Energy Currency',
        dependencies: ['bio-l3-4'],
        slides: [
            { type: 'text', title: 'Adenosine Triphosphate', content: "**ATP** is the main energy source for cells. Energy is released when a phosphate group is removed." },
        ]
       },
       {
        id: 'bio-l4-2',
        title: 'Photosynthesis: Light Reactions',
        dependencies: ['bio-l4-1'],
        slides: [
            { type: 'text', title: 'Capturing Sunlight', content: "The light reactions occur in the thylakoid membranes of chloroplasts. They convert light energy into chemical energy in the form of **ATP** and **NADPH**." },
        ]
       },
       {
        id: 'bio-l4-3',
        title: 'Photosynthesis: Calvin Cycle',
        dependencies: ['bio-l4-2'],
        slides: [
            { type: 'text', title: 'Making Sugar', content: "The Calvin cycle uses the ATP and NADPH from the light reactions to convert carbon dioxide into sugar (G3P) in a process called **carbon fixation**." },
        ]
       },
       {
        id: 'bio-l4-4',
        title: 'Cellular Respiration: Glycolysis',
        dependencies: ['bio-l4-3'],
        slides: [
            { type: 'text', title: 'Breaking Down Glucose', content: "**Glycolysis** is the first step of cellular respiration. It occurs in the cytoplasm and breaks glucose into two molecules of pyruvate, producing a small amount of ATP." },
        ]
       },
        {
        id: 'bio-l4-5',
        title: 'Cellular Respiration: Citric Acid Cycle',
        dependencies: ['bio-l4-4'],
        slides: [
            { type: 'text', title: 'The Krebs Cycle', content: "The citric acid cycle takes place in the mitochondria and completes the breakdown of glucose, generating more ATP and electron carriers (NADH and FADH2)." },
        ]
       },
        {
        id: 'bio-l4-6',
        title: 'Cellular Respiration: Oxidative Phosphorylation',
        dependencies: ['bio-l4-5'],
        slides: [
            { type: 'text', title: 'The Big Payoff', content: "**Oxidative phosphorylation** involves the electron transport chain and chemiosmosis. It uses the electron carriers to produce the vast majority of ATP in cellular respiration." },
        ]
       },
        {
        id: 'bio-l4-7',
        title: 'Fermentation',
        dependencies: ['bio-l4-6'],
        slides: [
            { type: 'text', title: 'Life without Oxygen', content: "**Fermentation** allows cells to produce ATP without oxygen. We will look at **lactic acid fermentation** and **alcohol fermentation**." },
        ]
       },
    ],
  },
  {
    id: 'bio-unit5',
    title: 'Unit 5: Molecular Biology of the Gene',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    darkColor: 'dark:text-blue-400',
    darkBgColor: 'dark:bg-blue-900/50',
    lessons: [
       {
        id: 'bio-l5-1',
        title: 'The Structure of DNA',
        dependencies: ['bio-l4-7'],
        slides: [
            { type: 'text', title: 'The Double Helix', content: "We'll review the key experiments that led to the discovery of DNA as the genetic material. Watson and Crick's model shows DNA as a double helix with a sugar-phosphate backbone and nitrogenous bases (A, T, C, G)." },
        ]
       },
       {
        id: 'bio-l5-2',
        title: 'DNA Replication',
        dependencies: ['bio-l5-1'],
        slides: [
            { type: 'text', title: 'Copying the Code', content: "**DNA replication** is the process by which a DNA molecule is copied. It is a semiconservative process, meaning each new DNA molecule has one old strand and one new strand." },
        ]
       },
       {
        id: 'bio-l5-3',
        title: 'Transcription',
        dependencies: ['bio-l5-2'],
        slides: [
            { type: 'text', title: 'DNA to RNA', content: "**Transcription** is the synthesis of an RNA molecule from a DNA template. The resulting molecule is called messenger RNA (mRNA)." },
        ]
       },
       {
        id: 'bio-l5-4',
        title: 'Translation',
        dependencies: ['bio-l5-3'],
        slides: [
            { type: 'text', title: 'RNA to Protein', content: "**Translation** is the synthesis of a protein from an mRNA template. This process occurs on **ribosomes**." },
        ]
       },
    ],
  },
  {
    id: 'bio-unit6',
    title: 'Unit 6: Cellular Reproduction',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    darkColor: 'dark:text-indigo-400',
    darkBgColor: 'dark:bg-indigo-900/50',
    lessons: [
       {
        id: 'bio-l6-1',
        title: 'The Cell Cycle & Mitosis',
        dependencies: ['bio-l5-4'],
        slides: [
            { type: 'text', title: 'Making New Body Cells', content: "**Mitosis** is the process of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus, typical of ordinary tissue growth." },
        ]
       },
       {
        id: 'bio-l6-2',
        title: 'Meiosis',
        dependencies: ['bio-l6-1'],
        slides: [
            { type: 'text', title: 'Making Gametes', content: "**Meiosis** is a special type of cell division that reduces the chromosome number by half, creating four haploid cells, each genetically distinct from the parent cell and from each other. This process is essential for sexual reproduction." },
        ]
       },
    ],
  },
  {
    id: 'bio-unit7',
    title: 'Unit 7: Genetics',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    darkColor: 'dark:text-purple-400',
    darkBgColor: 'dark:bg-purple-900/50',
    lessons: [
       {
        id: 'bio-l7-1',
        title: 'Mendelian Genetics',
        dependencies: ['bio-l6-2'],
        slides: [
            { type: 'text', title: 'The Father of Genetics', content: "Gregor Mendel's experiments with pea plants laid the foundation for modern genetics. We will study his laws of inheritance using **monohybrid** and **dihybrid crosses** with Punnett squares." },
        ]
       },
       {
        id: 'bio-l7-2',
        title: 'Patterns of Inheritance',
        dependencies: ['bio-l7-1'],
        slides: [
            { type: 'text', title: 'Beyond Mendel', content: "Not all traits follow simple Mendelian patterns. We will explore **incomplete dominance**, **codominance**, **multiple alleles**, and **sex-linked traits**." },
        ]
       },
        {
        id: 'bio-l7-3',
        title: 'Human Genetics',
        dependencies: ['bio-l7-2'],
        slides: [
            { type: 'text', title: 'Analyzing Human Traits', content: "A **pedigree** is a chart that shows the inheritance of a trait over several generations. We can use them to analyze patterns and predict the probability of inheriting genetic disorders." },
        ]
       },
    ],
  },
  {
    id: 'bio-unit8',
    title: 'Unit 8: Evolution',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    darkColor: 'dark:text-pink-400',
    darkBgColor: 'dark:bg-pink-900/50',
    lessons: [
       {
        id: 'bio-l8-1',
        title: 'Darwin & Natural Selection',
        dependencies: ['bio-l7-3'],
        slides: [
            { type: 'text', title: 'Descent with Modification', content: "Charles Darwin proposed that life's diversity arose from ancestral species through **natural selection**. This process is the primary mechanism of evolution." },
        ]
       },
       {
        id: 'bio-l8-2',
        title: 'Evidence for Evolution',
        dependencies: ['bio-l8-1'],
        slides: [
            { type: 'text', title: 'The Case for Evolution', content: "Evidence for evolution comes from many sources, including the **fossil record**, **comparative anatomy** (homologous structures), **biogeography**, and **molecular biology**." },
        ]
       },
       {
        id: 'bio-l8-3',
        title: 'Population Genetics',
        dependencies: ['bio-l8-2'],
        slides: [
            { type: 'text', title: 'Evolution in Populations', content: "A **population** is the smallest unit that can evolve. We will use the **Hardy-Weinberg equation** to test whether a population is evolving." },
        ]
       },
       {
        id: 'bio-l8-4',
        title: 'Speciation',
        dependencies: ['bio-l8-3'],
        slides: [
            { type: 'text', title: 'The Origin of Species', content: "**Speciation** is the process by which one species splits into two or more distinct species. It can occur through **geographic isolation** (allopatric) or without it (sympatric)." },
        ]
       },
    ],
  },
  {
    id: 'bio-unit9',
    title: 'Unit 9: Ecology',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    darkColor: 'dark:text-orange-400',
    darkBgColor: 'dark:bg-orange-900/50',
    lessons: [
       {
        id: 'bio-l9-1',
        title: 'Intro to Ecosystems',
        dependencies: ['bio-l8-4'],
        slides: [
            { type: 'text', title: 'The Web of Life', content: "**Ecology** is the study of how organisms interact with each other and their environment. An ecosystem consists of all the **biotic** (living) and **abiotic** (nonliving) factors in an area." },
        ]
       },
       {
        id: 'bio-l9-2',
        title: 'Energy Flow',
        dependencies: ['bio-l9-1'],
        slides: [
            { type: 'text', title: 'Food Chains and Webs', content: "Energy flows through an ecosystem, from producers to consumers. We will study **trophic levels**, **food chains**, and **energy pyramids**." },
        ]
       },
       {
        id: 'bio-l9-3',
        title: 'Biogeochemical Cycles',
        dependencies: ['bio-l9-2'],
        slides: [
            { type: 'text', title: 'Nutrient Cycling', content: "Unlike energy, chemical nutrients are cycled within ecosystems. We will examine the **water cycle**, **carbon cycle**, and **nitrogen cycle**." },
        ]
       },
       {
        id: 'bio-l9-4',
        title: 'Population Ecology',
        dependencies: ['bio-l9-3'],
        slides: [
            { type: 'text', title: 'Population Dynamics', content: "Population ecology explores factors that affect population size and how it changes over time, including concepts like **carrying capacity** and limiting factors." },
        ]
       },
        {
        id: 'bio-l9-5',
        title: 'Human Impact',
        dependencies: ['bio-l9-4'],
        slides: [
            { type: 'text', title: 'Anthropogenic Effects', content: "Human activities have a profound impact on the biosphere. We will discuss issues like **climate change**, **deforestation**, and **pollution**." },
        ]
       },
    ],
  }
];

export const CURRICULA: { [key: string]: { name: string; units: Unit[] } } = {
    chemistry: {
        name: 'Chemistry',
        units: UNITS_CHEMISTRY
    },
    anatomy: {
        name: 'Anatomy & Physiology',
        units: UNITS_ANATOMY
    },
    biology: {
        name: 'Biology',
        units: UNITS_BIOLOGY
    }
};