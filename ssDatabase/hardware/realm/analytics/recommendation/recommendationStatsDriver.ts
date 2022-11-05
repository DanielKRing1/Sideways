import RealmGraphManager, {RealmGraph} from '@asianpersonn/realm-graph';
import {
  GetRecommendationsArgs,
  PageRankArgs,
  RecoDriverType,
} from 'ssDatabase/api/analytics/recommendation/types';
import {HiLoRankingByOutput, RankedNodesMap} from '../../../../api/types';
import {throwLoadError} from '../../core/dbDriver';
import {sortRankedNodesMapByAllOutputs} from '../utils';

// GET GRAPH RECOMMENDATIONS

/**
 * Recommmend Nodes based on an set of input Nodes
 *
 * @param graphName
 * @param inputNodeIds
 * @param iterations
 * @param dampingFactor
 * @returns
 */
const getRecommendations = ({
  graphName,
  inputNodeIds,
  rawOutputs,
  listLength,
  outputType,
  iterations = 20,
  dampingFactor = 1,
}: GetRecommendationsArgs): HiLoRankingByOutput | never => {
  throwLoadError();
  const realmGraph: RealmGraph = RealmGraphManager.getGraph(graphName);

  const rankedNodes: RankedNodesMap =
    realmGraph.rankMostInfluentialToCentralSet(
      inputNodeIds,
      iterations,
      dampingFactor,
    );
  return sortRankedNodesMapByAllOutputs(
    rankedNodes,
    rawOutputs,
    listLength,
    outputType,
  );
};

/**
 * Raw PageRank on all Nodes
 *
 * @returns
 */
const pageRank = ({
  graphName,
  rawOutputs,
  listLength,
  outputType,
  iterations,
  dampingFactor,
}: PageRankArgs): HiLoRankingByOutput | never => {
  throwLoadError();
  const realmGraph: RealmGraph = RealmGraphManager.getGraph(graphName);

  const rankingsMap: RankedNodesMap = realmGraph.pageRank(
    iterations,
    dampingFactor,
  );
  return sortRankedNodesMapByAllOutputs(
    rankingsMap,
    rawOutputs,
    listLength,
    outputType,
  );
};

const Driver: RecoDriverType = {
  getRecommendations,
  pageRank,
};

export default Driver;