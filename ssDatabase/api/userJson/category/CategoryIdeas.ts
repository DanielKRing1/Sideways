export enum MaslowCategoriesSpecific {
  // PHYSIOLOGICAL NEEDS
  //    Basic Health/Essential, Habitual Daily Activities:
  //    Eat, Dress, Brush Teeth + Shower, Pump Gas, Thaw Frozen Food ...
  'Basic-Need' = 'Basic-Need',
  //    Feed Child, Doctor's Appt, Extracurriculars (Soccer Practice, School Activites)
  Kids = 'Kids',
  //    Feed Pet, Vet, Walk Dog
  Pets = 'Pets',
  //  Turn off brain: Sleep, Nap, TV, Warm Shower
  Rest = 'Rest',

  // SAFETY NEEDS
  //    Travel, Job, Email, Scheduling
  Work = 'Work',
  //    Banking, Housing, Budgeting
  Finance = 'Finance',
  //    Doctor
  'Physical Health' = 'Physical Health',
  //    Therapy
  'Mental Health' = 'Mental Health',

  // LOVE AND BELONGING
  //    Dates, Flirting
  Dating = 'Dating',
  //    Family Visits, Disneyland with SO/kids
  Family = 'Family',
  //    Hanging With Friends, Online Communities
  Social = 'Social',
  //    Church, Reading, Outings
  Religion = 'Religion',

  // ESTEEM
  //    Meal Management: Eat More/Less, Meal Prep, Fasting
  Diet = 'Diet',
  //    Body Change: Gym, Run, Walk, Bike, Sport
  Fitness = 'Fitness',
  //    Read, Meditation, Learning
  'Self-Improvement' = 'Self-Improvement',
  //    Fun Activity for Yourself: Face Mask, Read, Leisurely Stroll, Trip
  'Self-Care' = 'Self-Care',
  //    Sport Game, Track Meet, Contest
  Competition = 'Competition',

  // SELF-ACTUALIZATION
  //    Volunteering
  Volunteer = 'Volunteer',
  //    Travel For Fun
  Travel = 'Travel',
  //    Doing what makes you happy
  Fulfillment = 'Fulfillment',
}

export enum MaslowCategoriesBroad {
  //    Basic Health/Essential, Habitual Daily Activities:
  //    Eat, Dress, Brush Teeth + Shower, Pump Gas, Thaw Frozen Food
  //    Caring for children and pets
  'Essential Needs' = 'Essential Needs',

  //    Job, Banking, Budgeting, Doctor, Therapy
  'Security Needs' = 'Security Needs',

  //    Dates, Family Time, Hanging With Friends, Religion
  'Social Needs' = 'Social Needs',

  //    Recognition, Diet, Fitness, Self-Improvement, Freedom
  'Goals' = 'Goals',

  //    Doing what makes you happy, Travel For Fun, Volunteering
  'Self-Actualization' = 'Self-Actualization',
}

export enum HealthCategoriesSpecific {
  //   Basic Health
  'Basic-Need' = 'Basic-Need',
  Kids = 'Kids',
  Pets = 'Pets',

  //   Intellectual Health
  'Self-Improvement' = 'Self-Improvement',
  Finance = 'Finance',

  //   Occupational Health
  Work = 'Work',

  //   Social Health
  Dating = 'Dating',
  Family = 'Family',
  Social = 'Social',
  Religion = 'Religion',
  Competition = 'Competition',

  //   Physical Health
  'Physical Health' = 'Physical Health',
  Diet = 'Diet',
  Fitness = 'Fitness',
  Rest = 'Rest',

  //   Emotional Health
  'Mental Health' = 'Mental Health',
  'Self-Care' = 'Self-Care',

  //   Spititual Health
  Volunteer = 'Volunteer',
  Travel = 'Travel',
  Fulfillment = 'Fulfillment',
}

export enum HealthCategoriesBroad {
  Essential = 'Essential',
  Physical = 'Physical',
  Emotional = 'Emotional',
  Intellectual = 'Intellectual',
  Social = 'Social',
  Spiritual = 'Spiritual',
  Environmental = 'Environmental',
  Occupational = 'Occupational',
}
