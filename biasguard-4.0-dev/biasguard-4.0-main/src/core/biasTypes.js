// Bias Type Taxonomy
// Weights for severity calculation

module.exports = {
  types: {
    dehumanization: 10.0,
    hostility: 9.0,
    structural_discrimination: 8.0,
    exclusion: 7.0,
    prejudice: 6.0,
    prescriptive_harm: 6.0,
    stereotyping: 5.0,
    coded_language: 5.0,
    performance_bias: 4.0,
    implicit_bias: 3.0
  },
  
  // Map patterns to bias types
  patternToType: {
    'Universal Claims': ['stereotyping'],
    'Essentialism': ['stereotyping', 'prejudice'],
    'Superiority Inferiority': ['prejudice'],
    'Exclusionary Language': ['exclusion'],
    'Prescriptive Judgments': ['prescriptive_harm'],
    'Competence Assumptions': ['performance_bias'],
    'Group References': ['implicit_bias', 'coded_language'],
    'Cultural Essentialism': ['stereotyping', 'prejudice'],
    'Coded Xenophobia': ['coded_language', 'implicit_bias']
  }
};

