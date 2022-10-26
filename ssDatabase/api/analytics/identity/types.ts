// IDENTITY STATS DRIVER

import {RankedNode} from '@asianpersonn/realm-graph';
import {HiLoRanking, HiLoRankingByOutput} from 'ssDatabase/api/types';

// Methods
export type GetNodeStatsArgs = {
  graphName: string;
  nodeId: string;
  rawOutputs: string[];
};
export type GetNodeStatsByOutputArgs = {
  listLength: number;
} & GetNodeStatsArgs;
// Driver type
export type IdentityDriverType = {
  getNodeStats: (args: GetNodeStatsArgs) => RankedNode | undefined;
  getCollectivelyTandemNodes: (
    args: GetNodeStatsByOutputArgs,
  ) => Promise<HiLoRanking>;
  getSinglyTandemNodes: (
    args: GetNodeStatsByOutputArgs,
  ) => Promise<HiLoRankingByOutput>;
  getHighlyRatedTandemNodes: (
    args: GetNodeStatsByOutputArgs,
  ) => Promise<HiLoRankingByOutput>;
};
