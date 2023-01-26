// IDENTITY STATS DRIVER

import {RankedNode} from '@asianpersonn/realm-graph';
import {GraphType} from 'ssDatabase/api/core/types';
import {HiLoRanking, HiLoRankingByOutput, NODE_ID} from 'ssDatabase/api/types';

// Methods
export type GetNodeStatsArgs = {
  activeSliceName: string;
  graphType: GraphType;
  nodeId: NODE_ID;
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
