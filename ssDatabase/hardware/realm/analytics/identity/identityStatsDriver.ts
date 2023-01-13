import RealmGraphManager, {
  CGEdge,
  CGNode,
  RankedNode,
  RealmGraph,
} from '@asianpersonn/realm-graph';
import {
  GetNodeStatsArgs,
  GetNodeStatsByOutputArgs,
  IdentityDriverType,
} from 'ssDatabase/api/analytics/identity/types';
import {GraphType} from 'ssDatabase/api/core/types';
import {
  HiLoRanking,
  HiLoRankingByOutput,
  GRAPH_PROP_KEYS,
  SINGLE_KEY,
} from '../../../../api/types';
import dbDriver, {throwLoadError} from '../../core/dbDriver';
import {filterCGEntityAttrs, getDestinationNodeId} from '../utils';

// GET IDENTITY STATS

const getNodeStats = ({
  activeSliceName,
  graphType,
  nodeId,
  rawOutputs,
}: GetNodeStatsArgs): RankedNode | undefined => {
  throwLoadError();
  const realmGraph: RealmGraph = dbDriver.getGraph(activeSliceName, graphType);

  const cgnode: CGNode | undefined = realmGraph.getNode(nodeId);
  return cgnode !== undefined
    ? filterCGEntityAttrs(cgnode, rawOutputs, GRAPH_PROP_KEYS[SINGLE_KEY])
    : undefined;
};

const _getTandemNodes = async (
  activeSliceName: string,
  graphType: GraphType,
  nodeId: string,
  rawOutputs: string[],
  getEdges: (nodeId: string) => Promise<CGEdge[]>,
  listLength: number,
): Promise<HiLoRanking> => {
  // 1. Get connected edges
  const cgedges: CGEdge[] = await getEdges(nodeId);
  const hiCGEdges: CGEdge[] = cgedges.slice(-listLength).reverse();
  const loCGEdges: CGEdge[] = cgedges.slice(0, listLength);

  // 2. Get destination node from edge
  //      Convert CGNode to RankedNode
  //      Filter out undefined results
  return {
    highestRanked: hiCGEdges
      .map((cgedge: CGEdge) =>
        getNodeStats({
          activeSliceName,
          graphType,
          nodeId: getDestinationNodeId(cgedge, nodeId),
          rawOutputs,
        }),
      )
      .filter(
        (rankedNode: RankedNode | undefined) => rankedNode !== undefined,
      ) as RankedNode[],
    lowestRanked: loCGEdges
      .map((cgedge: CGEdge) =>
        getNodeStats({
          activeSliceName,
          graphType,
          nodeId: getDestinationNodeId(cgedge, nodeId),
          rawOutputs,
        }),
      )
      .filter(
        (rankedNode: RankedNode | undefined) => rankedNode !== undefined,
      ) as RankedNode[],
  };
};
const _getTandemNodesByOutput = async (
  activeSliceName: string,
  graphType: GraphType,
  nodeId: string,
  rawOutputs: string[],
  getEdges: (nodeId: string, output: string) => Promise<CGEdge[]>,
  listLength: number,
): Promise<HiLoRankingByOutput> => {
  // 1. Data structure
  const hiLoRankings: HiLoRankingByOutput = {};

  // 2. For each output get related nodes
  const promises: Promise<HiLoRanking>[] = [];
  for (const output of rawOutputs) {
    promises.push(
      _getTandemNodes(
        activeSliceName,
        graphType,
        nodeId,
        rawOutputs,
        (nodeId: string) => getEdges(nodeId, output),
        listLength,
      ),
    );
  }

  // 3. Await in parallel
  const hiLoRankingResolved: HiLoRanking[] = await Promise.all(promises);

  // 4. Build results map from resolved promises
  for (let i = 0; i < rawOutputs.length; i++) {
    const output = rawOutputs[i];

    hiLoRankings[output] = hiLoRankingResolved[i];
  }

  return hiLoRankings;
};

/**
 * Get collectively commonly done nodes in descending order
 *
 * @param graphName
 * @param nodeId
 * @param rawOutputs
 * @param listLength
 * @returns
 */
const getCollectivelyTandemNodes = async ({
  activeSliceName,
  graphType,
  nodeId,
  rawOutputs,
  listLength,
}: GetNodeStatsByOutputArgs): Promise<HiLoRanking> => {
  throwLoadError();
  const realmGraph: RealmGraph = dbDriver.getGraph(activeSliceName, graphType);

  return _getTandemNodes(
    activeSliceName,
    graphType,
    nodeId,
    rawOutputs,
    realmGraph.commonlyDoneWith,
    listLength,
  );
};

/**
 * Get singly commonly done nodes, grouped by output, sorted in descending order
 *
 * @param graphName
 * @param nodeId
 * @param rawOutputs
 * @param listLength
 * @returns
 */
const getSinglyTandemNodes = async ({
  activeSliceName,
  graphType,
  nodeId,
  rawOutputs,
  listLength,
}: GetNodeStatsByOutputArgs): Promise<HiLoRankingByOutput> => {
  throwLoadError();
  const realmGraph: RealmGraph = dbDriver.getGraph(activeSliceName, graphType);

  return await _getTandemNodesByOutput(
    activeSliceName,
    graphType,
    nodeId,
    rawOutputs,
    realmGraph.commonlyDoneByOutput,
    listLength,
  );
};

const getHighlyRatedTandemNodes = async ({
  activeSliceName,
  graphType,
  nodeId,
  rawOutputs,
  listLength,
}: GetNodeStatsByOutputArgs): Promise<HiLoRankingByOutput> => {
  throwLoadError();
  const realmGraph: RealmGraph = dbDriver.getGraph(activeSliceName, graphType);

  return await _getTandemNodesByOutput(
    activeSliceName,
    graphType,
    nodeId,
    rawOutputs,
    realmGraph.highlyRatedByOutput,
    listLength,
  );
};

const Driver: IdentityDriverType = {
  getNodeStats,
  getCollectivelyTandemNodes,
  getSinglyTandemNodes,
  getHighlyRatedTandemNodes,
};

export default Driver;
