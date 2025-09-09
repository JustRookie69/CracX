import { FaCog, FaFlask, FaCalculator, FaDna, FaMicroscope } from 'react-icons/fa';

// --- Topic list with icons for UI ---
export const topicInfo = [
    { name: 'Physics', icon: <FaCog /> },
    { name: 'Chemistry', icon: <FaFlask /> },
    { name: 'Maths (Advanced)', icon: <FaCalculator /> },
    { name: 'Biology', icon: <FaDna /> },
    { name: 'Organic Chem.', icon: <FaMicroscope /> },
];

// --- QOTD data ---
export const questionOfTheDay = {
    id: 3495,
    title: 'Minimum Operations to Make Array Elements Zero',
    acceptance: '60.4%',
    difficulty: 'Hard',
};

// --- Main hierarchical topics + concepts for the homepage ---
export const topicsWithConcepts = [
    {
        name: 'Physics',
        concepts: [
            { id: 101, title: 'Projectile Motion', difficulty: 'Medium', acceptance: '60%', status: 'unsolved' },
            { id: 102, title: "Newton's Laws of Motion", difficulty: 'Easy', acceptance: '75%', status: 'solved' },
            { id: 103, title: 'Work, Energy, and Power', difficulty: 'Medium', acceptance: '55%', status: 'attempted' },
        ]
    },
    {
        name: 'Chemistry',
        concepts: [
            { id: 201, title: 'Stoichiometry Basics', difficulty: 'Easy', acceptance: '70%', status: 'solved' },
            { id: 202, title: 'Chemical Equilibrium', difficulty: 'Hard', acceptance: '35%', status: 'unsolved' },
            { id: 203, title: 'Atomic Structure', difficulty: 'Medium', acceptance: '65%', status: 'unsolved' },
        ]
    },
    {
        name: 'Maths (Advanced)',
        concepts: [
            { id: 301, title: 'Integration by Parts', difficulty: 'Medium', acceptance: '58%', status: 'unsolved' },
            { id: 302, title: 'Complex Numbers', difficulty: 'Hard', acceptance: '40%', status: 'unsolved' },
            { id: 303, title: "Probability & Bayes' Theorem", difficulty: 'Hard', acceptance: '45%', status: 'attempted' },
        ]
    },
    {
        name: 'Biology',
        concepts: [
            { id: 401, title: 'Cell Mitosis & Meiosis', difficulty: 'Medium', acceptance: '68%', status: 'solved' },
            { id: 402, title: 'Human Genetics', difficulty: 'Hard', acceptance: '52%', status: 'unsolved' },
            { id: 403, title: 'Photosynthesis', difficulty: 'Medium', acceptance: '61%', status: 'unsolved' },
        ]
    },
    {
        name: 'Organic Chem.',
        concepts: [
            { id: 501, title: 'Aldehydes, Ketones, and Carboxylic Acids', difficulty: 'Hard', acceptance: '48%', status: 'unsolved' },
            { id: 502, title: 'Isomerism', difficulty: 'Medium', acceptance: '62%', status: 'attempted' },
            { id: 503, title: 'Hydrocarbons', difficulty: 'Easy', acceptance: '78%', status: 'solved' },
        ]
    }
];

// --- Detailed concept drill-down data with subtopics + questions (NOW FULLY POPULATED) ---
export const questionDetailsData = {
    // --- Physics ---
    '101': {
        title: 'Projectile Motion', difficulty: 'Medium', importance: 5,
        subTopics: [
            { name: 'Equations of trajectory', questions: [{ id: 10101, title: 'Derive the equation of a projectile path.', difficulty: 'Med.', acceptance: '55%', status: 'unsolved' }] },
            { name: 'Range & maximum height', questions: [{ id: 10102, title: 'Find max height for initial velocity 20 m/s.', difficulty: 'Easy', acceptance: '70%', status: 'solved' }] },
            { name: 'Time of flight', questions: [{ id: 10103, title: 'Calculate time of flight for projectile at 30°.', difficulty: 'Easy', acceptance: '72%', status: 'unsolved' }] },
        ]
    },
    '102': {
        title: "Newton's Laws of Motion", difficulty: 'Easy', importance: 5,
        subTopics: [
            { name: 'Law of inertia', questions: [{ id: 10201, title: 'Explain inertia with real-life examples.', difficulty: 'Easy', acceptance: '90%', status: 'solved' }] },
            { name: 'F = ma applications', questions: [{ id: 10202, title: 'A 10 kg body accelerates at 3 m/s². Find force.', difficulty: 'Easy', acceptance: '85%', status: 'solved' }] },
            { name: 'Action-reaction pairs', questions: [{ id: 10203, title: 'Why does a gun recoil after firing?', difficulty: 'Med.', acceptance: '65%', status: 'unsolved' }] },
        ]
    },
    '103': {
        title: 'Work, Energy, and Power', difficulty: 'Medium', importance: 4,
        subTopics: [
            { name: 'Work-energy theorem', questions: [{ id: 10301, title: 'Prove the work-energy theorem.', difficulty: 'Med.', acceptance: '50%', status: 'unsolved' }] },
            { name: 'Conservation of energy', questions: [{ id: 10302, title: 'Explain roller coaster motion using energy conservation.', difficulty: 'Med.', acceptance: '60%', status: 'attempted' }] },
            { name: 'Power calculation', questions: [{ id: 10303, title: 'A machine does 200 J work in 4 s. Find power.', difficulty: 'Easy', acceptance: '88%', status: 'solved' }] },
        ]
    },
    // --- Chemistry ---
    '201': {
        title: 'Stoichiometry Basics', difficulty: 'Easy', importance: 4,
        subTopics: [
            { name: 'Mole concept', questions: [{ id: 20101, title: 'How many moles in 18 g water?', difficulty: 'Easy', acceptance: '95%', status: 'solved' }] },
            { name: 'Limiting reagent', questions: [{ id: 20102, title: 'Find limiting reagent when H₂ reacts with O₂.', difficulty: 'Med.', acceptance: '68%', status: 'unsolved' }] },
        ]
    },
    '202': {
        title: 'Chemical Equilibrium', difficulty: 'Hard', importance: 5,
        subTopics: [
            { name: 'Le Chatelier’s principle', questions: [{ id: 20201, title: 'Explain effect of temperature on Haber process.', difficulty: 'Med.', acceptance: '55%', status: 'unsolved' }] },
            { name: 'Equilibrium constant (Kc, Kp)', questions: [{ id: 20202, title: 'Derive relation between Kp and Kc.', difficulty: 'Hard', acceptance: '40%', status: 'unsolved' }] },
            { name: 'Reaction quotient', questions: [{ id: 20203, title: 'Predict direction of reaction given Q and K.', difficulty: 'Med.', acceptance: '60%', status: 'attempted' }] },
        ]
    },
    '203': {
        title: 'Atomic Structure', difficulty: 'Medium', importance: 5,
        subTopics: [
            { name: 'Bohr’s model', questions: [{ id: 20301, title: 'Explain hydrogen spectrum with Bohr’s model.', difficulty: 'Med.', acceptance: '62%', status: 'unsolved' }] },
            { name: 'Quantum numbers', questions: [{ id: 20302, title: 'List and explain the 4 quantum numbers.', difficulty: 'Easy', acceptance: '80%', status: 'solved' }] },
        ]
    },
    // --- Maths ---
    '301': {
        title: 'Integration by Parts', difficulty: 'Medium', importance: 4,
        subTopics: [
            { name: 'Formula & LIATE rule', questions: [{ id: 30101, title: 'Solve ∫x·e^x dx.', difficulty: 'Med.', acceptance: '70%', status: 'solved' }] },
            { name: 'Definite integration', questions: [{ id: 30102, title: 'Evaluate ∫ from 0 to 1 of x*ln(x) dx.', difficulty: 'Hard', acceptance: '45%', status: 'unsolved' }] },
        ]
    },
    '302': {
        title: 'Complex Numbers', difficulty: 'Hard', importance: 5,
        subTopics: [
            { name: 'Argand diagram', questions: [{ id: 30201, title: 'Plot 2+3i on Argand plane.', difficulty: 'Easy', acceptance: '90%', status: 'solved' }] },
            { name: 'De Moivre’s theorem', questions: [{ id: 30202, title: 'Find (cos θ + i sin θ)^5.', difficulty: 'Med.', acceptance: '60%', status: 'unsolved' }] },
        ]
    },
    '303': {
        title: "Probability & Bayes' Theorem", difficulty: 'Hard', importance: 5,
        subTopics: [
            { name: 'Conditional probability', questions: [{ id: 30301, title: 'Find P(A|B) for coin tosses.', difficulty: 'Med.', acceptance: '65%', status: 'attempted' }] },
            { name: "Bayes' theorem applications", questions: [{ id: 30302, title: 'Use Bayes’ theorem in medical test problem.', difficulty: 'Hard', acceptance: '42%', status: 'unsolved' }] },
        ]
    },
    // --- Biology ---
    '401': {
        title: 'Cell Mitosis & Meiosis', difficulty: 'Medium', importance: 4,
        subTopics: [
            { name: 'Mitosis stages', questions: [{ id: 40101, title: 'List and describe the 4 stages of mitosis.', difficulty: 'Easy', acceptance: '85%', status: 'solved' }] },
            { name: 'Meiosis I & II', questions: [{ id: 40102, title: 'How is meiosis different from mitosis?', difficulty: 'Med.', acceptance: '70%', status: 'unsolved' }] },
        ]
    },
    '402': {
        title: 'Human Genetics', difficulty: 'Hard', importance: 5,
        subTopics: [
            { name: 'Mendelian inheritance', questions: [{ id: 40201, title: 'Explain a dihybrid cross with an example.', difficulty: 'Med.', acceptance: '60%', status: 'unsolved' }] },
            { name: 'Pedigree analysis', questions: [{ id: 40202, title: 'Identify inheritance from a pedigree chart.', difficulty: 'Hard', acceptance: '50%', status: 'attempted' }] },
        ]
    },
    '403': {
        title: 'Photosynthesis', difficulty: 'Medium', importance: 5,
        subTopics: [
            { name: 'Light-dependent reaction', questions: [{ id: 40301, title: 'Describe the role of photosystem II.', difficulty: 'Med.', acceptance: '65%', status: 'unsolved' }] },
            { name: 'Calvin cycle', questions: [{ id: 40302, title: 'Explain the 3 main steps of the Calvin cycle.', difficulty: 'Hard', acceptance: '55%', status: 'unsolved' }] },
        ]
    },
    // --- Organic Chemistry ---
    '501': {
        title: 'Aldehydes, Ketones, and Carboxylic Acids', difficulty: 'Hard', importance: 5,
        subTopics: [
            { name: 'Nomenclature', questions: [{ id: 50101, title: 'Give IUPAC name of CH3CHO.', difficulty: 'Easy', acceptance: '80%', status: 'solved' }] },
            { name: 'Preparation methods', questions: [{ id: 50102, title: 'How to prepare aldehydes from alcohols?', difficulty: 'Med.', acceptance: '60%', status: 'unsolved' }] },
        ]
    },
    '502': {
        title: 'Isomerism', difficulty: 'Medium', importance: 4,
        subTopics: [
            { name: 'Structural isomerism', questions: [{ id: 50201, title: 'Draw all structural isomers of C4H10.', difficulty: 'Med.', acceptance: '70%', status: 'attempted' }] },
            { name: 'Optical isomerism', questions: [{ id: 50202, title: 'What is a chiral center? Give an example.', difficulty: 'Hard', acceptance: '55%', status: 'unsolved' }] },
        ]
    },
    '503': {
        title: 'Hydrocarbons', difficulty: 'Easy', importance: 4,
        subTopics: [
            { name: 'Alkenes', questions: [{ id: 50301, title: 'Explain the addition reaction of ethene with HBr.', difficulty: 'Easy', acceptance: '85%', status: 'solved' }] },
            { name: 'Aromatic hydrocarbons', questions: [{ id: 50302, title: 'Why is benzene an aromatic compound?', difficulty: 'Med.', acceptance: '68%', status: 'unsolved' }] },
        ]
    }
};

// --- Flat list for "All Topics" view on the homepage ---
export const allConceptsList = topicsWithConcepts.flatMap(topic => topic.concepts);