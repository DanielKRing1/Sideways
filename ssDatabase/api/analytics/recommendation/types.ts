import {GraphPropType, HiLoRankingByOutput} from 'ssDatabase/api/types';

// Methods
export type PageRankArgs = {
  graphName: string;
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
