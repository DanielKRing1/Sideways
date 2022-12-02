import {hashToColor} from 'ssUtils/color';
import {AvailableIcons} from '../constants';
import {GJ_CategoryDecoration, GJ_CategorySet} from './types';
import {Dict} from '../../../../global';

export const CATEGORY_ROW_DELIM: string = '_';

export const DEFAULT_CATEGORY_SET_NAME: string = '';
export const DEFAULT_CATEGORY_SET_ID: string = '';
export const DEFAULT_CATEGORY_NAME: string = '';
export const UNASSIGNED_CATEGORY_ID: string = '';
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
    cId,
    icon: DEFAULT_CATEGORY_ICON,
    color: hashToColor(cId),
  };
}

// DEFAULT CATEGORY SETS
export type DefinedCategorySet = {
  name: string;
  csId: string;
  cs: GJ_CategorySet;
};

// ACTIVITY JOURNAL
// Maslow Inspired
const DAILY_JOURNAL_CATEGORIES: Dict<AvailableIcons> = {
  // ESSENTIAL NEEDS
  //    Basic Health/Essential, Habitual Daily Activities:
  //    Eat, Dress, Brush Teeth + Shower, Pump Gas, Thaw Frozen Food ...
  'Basic-Need': AvailableIcons.home,
  //    Feed Child, Doctor's Appt, Extracurriculars (Soccer Practice, School Activites)
  Kids: AvailableIcons.child,
  //    Feed Pet, Vet, Walk Dog
  Pets: AvailableIcons.paw,
  //    Turn off brain: Sleep, Nap, TV, Warm Shower
  Rest: AvailableIcons.bed,

  // SECURITY NEEDS
  //    Travel, Job, Email, Scheduling
  Work: AvailableIcons.briefcase,
  //    Banking, Housing, Budgeting
  Finance: AvailableIcons.bank,
  //    Doctor
  'Physical Health': AvailableIcons.heartbeat,
  //    Therapy
  'Mental Health': AvailableIcons.leaf,

  // SOCIAL NEEDS/LOVE AND BELONGING
  //    Dates, Flirting
  Dating: AvailableIcons.heart,
  //    Family Visits, Disneyland with SO/kids
  Family: AvailableIcons.group,
  //    Hanging With Friends, Online Communities
  Social: AvailableIcons.comment,
  //    Church, Reading, Outings
  Religion: AvailableIcons.star,

  // GOALS/ESTEEM
  //    Meal Management: Eat More/Less, Meal Prep, Fasting
  Diet: AvailableIcons.cutlery,
  //    Body Change: Gym, Run, Walk, Bike, Sport
  Fitness: AvailableIcons['balance-scale'],
  //    Read, Meditation, Learning
  'Self-Improvement': AvailableIcons.book,
  //    Fun Activity for Yourself: Face Mask, Read, Leisurely Stroll, Trip
  'Self-Care': AvailableIcons.music,
  //    Sport Game, Track Meet, Contest
  Competition: AvailableIcons.trophy,

  // SELF-ACTUALIZATION
  //    Volunteering
  Volunteer: AvailableIcons.globe,
  //    Travel For Fun
  Travel: AvailableIcons.plane,
  //    Doing what makes you happy
  Fulfillment: AvailableIcons.play,
};
export const DAILY_JOURNAL_CATEGORY_SET: DefinedCategorySet = {
  name: 'Daily Journal',
  csId: 'Daily Journal',
  // Use cName, bcus no cId yet
  // cId will be generated when adding category set
  cs: Object.keys(DAILY_JOURNAL_CATEGORIES).reduce<GJ_CategorySet>(
    (acc, cName: string) => {
      acc[cName] = {
        // Use cName instead of cId for now, when this Category Set is added to the Global Json via the addCs method,
        // the cNames will be replaced with cIds
        cId: cName,
        icon: DAILY_JOURNAL_CATEGORIES[cName] as AvailableIcons,
        color: hashToColor(cName),
      };

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
