import {hashToColor} from 'ssUtils/color';
import {AvailableIcons} from '../constants';
import {GJ_CategoryDecoration, GJ_CategorySet} from './types';

export const CATEGORY_ROW_DELIM: string = '_';

export const DEFAULT_CATEGORY_SET_NAME: string = '';
export const DEFAULT_CATEGORY_SET_ID: string = '';
export const DEFAULT_CATEGORY_NAME: string = '';
export const DEFAULT_CATEGORY_ID: string = '';
export const DEFAULT_CATEGORY_ICON: AvailableIcons = AvailableIcons.circle;
export const DEFAULT_OUTPUT_ICON: AvailableIcons = AvailableIcons.circle;
export const CONFIRM_SELECTION_ICON: AvailableIcons = AvailableIcons.question;
export const NO_ACTIVE_SLICE_NAME: string = 'NO_ACTIVE_SLICE';

/**
 * Generate a default CategoryDecoration +
 * Hash cId to a color
 *
 * @param cId
 * @returns
 */
export function genDefaultCategoryDecoration(
  cId: string,
): GJ_CategoryDecoration {
  return {
    icon: DEFAULT_CATEGORY_ICON,
    color: hashToColor(cId),
  };
}

// DEFAULT CATEGORY SETS
export type DefinedCategorySet = {
  name: string;
  cs: GJ_CategorySet;
};

// ACTIVITY JOURNAL
// Maslow Inspired
const DAILY_JOURNAL_CATEGORIES = {
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
export const DAILY_JOURNAL_CATEGORY_SET = {
  name: 'Daily Journal',
  // Use cName, bcus no cId yet
  // cId will be generated when adding category set
  cs: Object.keys(DAILY_JOURNAL_CATEGORIES).reduce<GJ_CategorySet>(
    (acc, cName: string) => {
      acc[cName] = genDefaultCategoryDecoration(cName);

      return acc;
    },
    {},
  ),
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
