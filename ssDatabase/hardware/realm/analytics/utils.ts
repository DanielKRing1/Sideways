import {
  genSingleAverageName,
  genCollectiveAverageName,
  CGNode,
  CGEdge,
  RankedNode,
  ID_KEY,
  genSingleTallyName,
  genCollectiveTallyName,
} from '@asianpersonn/realm-graph';
import DictUtils from '@asianpersonn/dict-utils';

import {
  COLLECTIVE_KEY,
  COLLECTIVE_TALLY_KEY,
  HiLoRankingByOutput,
  OutputKeyType,
  OUTPUT_KEYS,
  RankedNodesMap,
  SINGLE_KEY,
  SINGLE_TALLY_KEY,
} from '../../../api/types';
import {Dict} from '../../../../global';

// RankedNodeMap UTILS

// SORTING --------------------------------

export const rankedNodesMapToRankedNodes = (
  rankedNodesMap: RankedNodesMap,
): RankedNode[] =>
  Object.keys(rankedNodesMap).map((nodeId: string) => ({
    ...rankedNodesMap[nodeId],
    id: nodeId,
  }));

/**
 * Sort RankedNodes list on a targetOuput in ascending order
 *
 * @param rankedNodes
 * @param targetOutput
 * @param outputType
 * @returns
 */
export const sortRankedNodesByOutput = (
  rankedNodes: RankedNode[],
  targetOutput: string,
  outputType?: OutputKeyType,
): RankedNode[] => {
  const targetOutputKey: string = getOutputKey(targetOutput, outputType);

  return rankedNodes.sort(
    (a: RankedNode, b: RankedNode) => a[targetOutputKey] - b[targetOutputKey],
  );
};

/**
 * Convert RankedNodesMap to RankedNodes list
 * Then
 * sort RankedNodes list on a targetOuput in ascending order
 *
 * @param rankedNodes
 * @param targetOutput
 * @param outputType
 * @returns
 */
export const sortRankedNodesMapByOutput = (
  rankedNodesMap: RankedNodesMap,
  targetOutput: string,
  outputType?: OutputKeyType,
): RankedNode[] => {
  const rankedNodes: RankedNode[] = rankedNodesMapToRankedNodes(rankedNodesMap);

  return sortRankedNodesByOutput(rankedNodes, targetOutput, outputType);
};

// HILORANKING --------------------------------

/**
 * Sort all ranked nodes for all possible outputs
 * for highest ranking and lowest ranking
 *
 * Highest Ranking: Highest -> lower
 * Lowest Ranking: Lowest -> higher
 *
 * @param rankedNodes
 * @param allOutputs
 * @param listLength
 * @param outputType
 * @returns
 */
export const sortRankedNodesByAllOutputs = (
  rankedNodes: RankedNode[],
  allOutputs: string[],
  listLength: number = 5,
  outputType?: OutputKeyType,
): HiLoRankingByOutput =>
  allOutputs.reduce<HiLoRankingByOutput>(
    (acc: HiLoRankingByOutput, output: string) => {
      const sortedNodes: RankedNode[] = sortRankedNodesByOutput(
        rankedNodes,
        output,
        outputType,
      );
      acc[output] = {
        highestRanked: sortedNodes.slice(-listLength).reverse(),
        lowestRanked: sortedNodes.slice(0, listLength),
      };

      return acc;
    },
    {},
  );

/**
 * Convert RankedNodesMap to RankedNodes list
 * Then
 * Sort all ranked nodes for all possible outputs
 * for highest ranking and lowest ranking
 *
 * Highest Ranking: Highest -> lower
 * Lowest Ranking: Lowest -> higher
 *
 * @param rankedNodes
 * @param allOutputs
 * @param listLength
 * @param outputType
 * @returns
 */
export const sortRankedNodesMapByAllOutputs = (
  rankedNodeMap: RankedNodesMap,
  allOutputs: string[],
  listLength: number = 5,
  outputType?: OutputKeyType,
): HiLoRankingByOutput => {
  const rankedNodes: RankedNode[] = rankedNodesMapToRankedNodes(rankedNodeMap);

  return sortRankedNodesByAllOutputs(
    rankedNodes,
    allOutputs,
    listLength,
    outputType,
  );
};

// RankedNode DICT UTILS --------------------------------

/**
 * Filter a CGNode or CGEdge to just its 'id' and 'single' or 'collective' properties
 *
 * @param cgentity
 * @param outputs
 * @param outputType
 * @returns
 */
export const filterCGEntityAttrs = (
  cgentity: CGNode | CGEdge,
  outputs: string[],
  outputType?: OutputKeyType,
): RankedNode => {
  // 1. Get attr keys to keep
  const keysToKeep: string[] = getOutputKeys(outputs, outputType);
  // 2. Add id key
  keysToKeep.push(ID_KEY);

  // 3. Copy attrs
  const rankedEntity: RankedNode = DictUtils.copyDictKeep(
    cgentity,
    keysToKeep,
  ) as RankedNode;

  return rankedEntity;
};

// CGEDGE UTILS --------------------------------

/**
 * Get the edge id that is not the origin node id
 *
 * @param cgedge
 * @param originNodeId
 * @returns
 */
export const getDestinationNodeId = (
  cgedge: CGEdge,
  originNodeId: string,
): string =>
  cgedge.nodeId1 !== originNodeId ? cgedge.nodeId1 : cgedge.nodeId2;

// NAMING UTILS --------------------------------

export const getOutputKey = (rawOutput: string, outputType?: OutputKeyType) => {
  switch (outputType) {
    case OUTPUT_KEYS[SINGLE_KEY]:
      return genSingleAverageName(rawOutput);

    case OUTPUT_KEYS[SINGLE_TALLY_KEY]:
      return genSingleTallyName(rawOutput);

    case OUTPUT_KEYS[COLLECTIVE_KEY]:
      return genCollectiveAverageName(rawOutput);

    case OUTPUT_KEYS[COLLECTIVE_TALLY_KEY]:
      return genCollectiveTallyName();

    default:
      return genSingleAverageName(rawOutput);
  }
};

/**
 * Convert a set of output names to SINGLE or COLLECTIVE output keys
 *
 * @param outputs
 * @param outputType
 * @returns
 */
export const getOutputKeys = (
  outputs: string[],
  outputType?: OutputKeyType,
): string[] =>
  outputs.reduce((keysToKeep: string[], output: string) => {
    // 1. Gen key name to keep
    const outputKey: string = getOutputKey(output, outputType);

    // 2. Record key names to keep
    keysToKeep.push(outputKey);

    return keysToKeep;
  }, []);
