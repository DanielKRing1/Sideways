import {RankedNode} from '@asianpersonn/realm-graph';
import {Dict} from '../../global';

// GOOD/BAD NODE NAMING
export const GOOD_POSTFIX = '+';
export const BAD_POSTFIX = '-';
export type NODE_POSTFIX = typeof GOOD_POSTFIX | typeof BAD_POSTFIX;
export type NODE_ID = `${string}${NODE_POSTFIX}`;
export type EDGE_ID = `${NODE_ID}-${NODE_ID}`;

export type NODE_ID_COMPONENTS = {
  id: string;
  postfix: NODE_POSTFIX;
};
export const stripNodePostfix = (fullNodeId: string): NODE_ID_COMPONENTS => {
  if (
    fullNodeId[fullNodeId.length - 1] !== GOOD_POSTFIX &&
    fullNodeId[fullNodeId.length - 1] !== BAD_POSTFIX
  ) {
    console.log(
      `'stripNodePostfix()' received a 'fullNodeId' that does not end with a valid 'NODE_POSTFIX'`,
    );
    throw new Error(
      `'stripNodePostfix()' received a 'fullNodeId' that does not end with a valid 'NODE_POSTFIX'`,
    );
  }

  return {
    id: fullNodeId.slice(0, fullNodeId.length - 1),
    postfix: fullNodeId.slice(fullNodeId.length - 1) as NODE_POSTFIX,
  };
};
export const addNodePostfix = (
  baseNodeId: string,
  postfix: NODE_POSTFIX,
): NODE_ID => `${baseNodeId}${postfix}`;
export const toggleNodePostfix = (postfix: NODE_POSTFIX) =>
  postfix === GOOD_POSTFIX ? BAD_POSTFIX : GOOD_POSTFIX;

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
