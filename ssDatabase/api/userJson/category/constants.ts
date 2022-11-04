import {AvailableIcons} from '../constants';

export const CATEGORY_ROW_DELIM: string = '_';

export const DEFAULT_ICON: AvailableIcons = AvailableIcons.circle;
export const CONFIRM_SELECTION_ICON: AvailableIcons = AvailableIcons.question;

// DEFAULT CATEGORIES

// ACTIVITY JOURNAL
// Maslow Inspired
export const ACTIVITY_JOURNAL_CATEGORIES = {
  // ESSENTIAL NEEDS
  //    Basic Health/Essential, Habitual Daily Activities:
  //    Eat, Dress, Brush Teeth + Shower, Pump Gas, Thaw Frozen Food ...
  'Basic-Need': 'Basic-Need',
  //    Feed Child, Doctor's Appt, Extracurriculars (Soccer Practice, School Activites)
  Kids: 'Kids',
  //    Feed Pet, Vet, Walk Dog
  Pets: 'Pets',
  //    Turn off brain: Sleep, Nap, TV, Warm Shower
  Rest: 'Rest',

  // SECURITY NEEDS
  //    Travel, Job, Email, Scheduling
  Work: 'Work',
  //    Banking, Housing, Budgeting
  Finance: 'Finance',
  //    Doctor
  'Physical Health': 'Physical Health',
  //    Therapy
  'Mental Health': 'Mental Health',

  // SOCIAL NEEDS/LOVE AND BELONGING
  //    Dates, Flirting
  Dating: 'Dating',
  //    Family Visits, Disneyland with SO/kids
  Family: 'Family',
  //    Hanging With Friends, Online Communities
  Social: 'Social',
  //    Church, Reading, Outings
  Religion: 'Religion',

  // GOALS/ESTEEM
  //    Meal Management: Eat More/Less, Meal Prep, Fasting
  Diet: 'Diet',
  //    Body Change: Gym, Run, Walk, Bike, Sport
  Fitness: 'Fitness',
  //    Read, Meditation, Learning
  'Self-Improvement': 'Self-Improvement',
  //    Fun Activity for Yourself: Face Mask, Read, Leisurely Stroll, Trip
  'Self-Care': 'Self-Care',
  //    Sport Game, Track Meet, Contest
  Competition: 'Competition',

  // SELF-ACTUALIZATION
  //    Volunteering
  Volunteer: 'Volunteer',
  //    Travel For Fun
  Travel: 'Travel',
  //    Doing what makes you happy
  Fulfillment: 'Fulfillment',
};

/**
 * ID MAPPINGS (GLOBAL)
 * CategorySetId - CategorySetName
 * CategoryId - CategoryName
 * CategorySetId: {
 *  CategoryId: {
 *    icon: string;
 *    color: string;
 *  }
 * }
 *
 * USER MAPPINGS (GLOBAL)
 * SliceName - CategorySetId
 *
 * USER MAPPINGS (CATEGORY)
 * InputName - CategoryId
 *
 */
