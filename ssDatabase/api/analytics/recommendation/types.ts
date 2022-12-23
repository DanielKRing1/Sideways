import {GraphType} from 'ssDatabase/api/core/types';
import {GraphPropType, HiLoRankingByOutput} from 'ssDatabase/api/types';

// Methods
export type PageRankArgs = {
  activeSliceName: string;
  graphType: GraphType;
  rawOutputs: string[];
  listLength: number;
  outputType: GraphPropType;
  iterations?: number;
  dampingFactor?: number;
};
export type GetRecommendationsArgs = {
  inputNodeIds: string[];
} & PageRankArgs;
// Driver type
export type RecoDriverType = {
  getRecommendations: (
    args: GetRecommendationsArgs,
  ) => HiLoRankingByOutput | never;
  pageRank: (args: PageRankArgs) => HiLoRankingByOutput | never;
};
