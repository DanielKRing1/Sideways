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
import {TimerMan} from 'ssUtils/timer';
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

const _getTandemNodes = (
  activeSliceName: string,
  graphType: GraphType,
  nodeId: string,
  rawOutputs: string[],
  getEdges: (nodeId: string) => CGEdge[],
  listLength: number,
): HiLoRanking => {
  // 1. Get connected edges
  TimerMan.getTimer('_getTandemNodes cgEdges').restart();
  const cgedges: CGEdge[] = getEdges(nodeId);
  console.log(getEdges.name);
  TimerMan.getTimer('_getTandemNodes cgEdges').logInterval(
    '_getTandemNodes cgEdges end: ----------------------------------5: ',
  );
  const hiCGEdges: CGEdge[] = cgedges.slice(-listLength).reverse();
  const loCGEdges: CGEdge[] = cgedges.slice(0, listLength);

  // 2. Get destination node from edge
  //      Convert CGNode to RankedNode
  //      Filter out undefined results
  TimerMan.getTimer('_getRandemNodes hiloranking').restart();

  const hiloranking = {
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
  TimerMan.getTimer('_getRandemNodes hiloranking').logInterval(
    '_getRandemNodes hiloranking end: ----------------------------------4: ',
  );

  return hiloranking;
};
const _getTandemNodesByOutput = (
  activeSliceName: string,
  graphType: GraphType,
  nodeId: string,
  rawOutputs: string[],
  getEdges: (nodeId: string, output: string) => CGEdge[],
  listLength: number,
): HiLoRankingByOutput => {
  // 1. Data structure
  const hiLoRankings: HiLoRankingByOutput = {};

  // 2. For each output
  for (const output of rawOutputs) {
    hiLoRankings[output] = _getTandemNodes(
      activeSliceName,
      graphType,
      nodeId,
      rawOutputs,
      (nodeId: string) => {
        console.log(getEdges.name);
        return getEdges(nodeId, output);
      },
      listLength,
    );
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
const getCollectivelyTandemNodes = ({
  activeSliceName,
  graphType,
  nodeId,
  rawOutputs,
  listLength,
}: GetNodeStatsByOutputArgs): HiLoRanking => {
  throwLoadError();

  TimerMan.getTimer('getCollectivelyTandemNodes GET REALM GRAPH').restart();
  const realmGraph: RealmGraph = dbDriver.getGraph(activeSliceName, graphType);
  TimerMan.getTimer('getCollectivelyTandemNodes GET REALM GRAPH').logInterval(
    'getCollectivelyTandemNodes GET REALM GRAPH end: ----------------------------------4: ',
  );

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
const getSinglyTandemNodes = ({
  activeSliceName,
  graphType,
  nodeId,
  rawOutputs,
  listLength,
}: GetNodeStatsByOutputArgs): HiLoRankingByOutput => {
  throwLoadError();
  const realmGraph: RealmGraph = dbDriver.getGraph(activeSliceName, graphType);

  return _getTandemNodesByOutput(
    activeSliceName,
    graphType,
    nodeId,
    rawOutputs,
    realmGraph.commonlyDoneByOutput,
    listLength,
  );
};

const getHighlyRatedTandemNodes = ({
  activeSliceName,
  graphType,
  nodeId,
  rawOutputs,
  listLength,
}: GetNodeStatsByOutputArgs): HiLoRankingByOutput => {
  throwLoadError();
  const realmGraph: RealmGraph = dbDriver.getGraph(activeSliceName, graphType);

  return _getTandemNodesByOutput(
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
