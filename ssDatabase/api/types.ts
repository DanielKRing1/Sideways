import {RankedNode} from '@asianpersonn/realm-graph';
import {Dict} from '../../global';

// NON-TIMESERIES DATASTRUCTURE TYPE DEFINITIONS
export type RankedNodesMap = Dict<Dict<number>>;

export type HiLoRanking = {
  highestRanked: RankedNode[];
  lowestRanked: RankedNode[];
};
export type HiLoRankingByOutput = Dict<HiLoRanking>;

export const SINGLE_KEY = 'SINGLE';
export const SINGLE_TALLY_KEY = 'SINGLE_TALLY';
export const COLLECTIVE_KEY = 'COLLECTIVE';
export const COLLECTIVE_TALLY_KEY = 'COLLECTIVE_TALLY';
export type GraphPropType =
  | typeof SINGLE_KEY
  | typeof SINGLE_TALLY_KEY
  | typeof COLLECTIVE_KEY
  | typeof COLLECTIVE_TALLY_KEY;
export const GRAPH_PROP_KEYS = {
  [SINGLE_KEY]: SINGLE_KEY,
  [SINGLE_TALLY_KEY]: SINGLE_KEY,
  [COLLECTIVE_KEY]: COLLECTIVE_TALLY_KEY,
  [COLLECTIVE_TALLY_KEY]: COLLECTIVE_TALLY_KEY,
} as const;
