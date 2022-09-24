import { genSingleAverageName, genCollectiveAverageName, CGNode, CGEdge, RankedNode, ID_KEY } from "@asianpersonn/realm-graph";
import DictUtils from '@asianpersonn/dict-utils';

import { HiLoRankings, OutputKeyType, OUTPUT_KEYS, RankedNodesMap } from "../types";
import { Dict } from "../../global";

// RankedNodeMap UTILS

/**
 * Sort all ranked nodes on a given targetOutput in descending order
 * 
 * @param rankedNodes 
 * @param targetOutput 
 * @param outputType 
 * @returns 
 */
 export const sortRankedNodesMapByOutput = (rankedNodes: RankedNodesMap, targetOutput: string, outputType: OutputKeyType=OUTPUT_KEYS.SINGLE): RankedNode[] => {
    const targetOutputKey: string = outputType === OUTPUT_KEYS.SINGLE ? genSingleAverageName(targetOutput) : genCollectiveAverageName(targetOutput);

    return Object.keys(rankedNodes).map((key: string) => ({ ...rankedNodes[key], id: key })).sort((a: RankedNode, b: RankedNode) =>  b[targetOutputKey]-a[targetOutputKey]);
};

/**
 * Sort all ranked nodes for all possible outputs
 * for highest ranking and lowest ranking
 * 
 * Highest Ranking: Highest -> lower
 * Lowest Ranking: Lowest -> higher
 * 
 * @param rankedNodes 
 * @param possibleOutputs 
 * @param listLength 
 * @param outputType 
 * @returns 
 */
export const sortRankedNodesMapByAllOutputs = (rankedNodes: RankedNodesMap, possibleOutputs: string[], listLength: number=5, outputType: OutputKeyType=OUTPUT_KEYS.SINGLE): HiLoRankings => (
    possibleOutputs.reduce<HiLoRankings>(
        (acc: HiLoRankings, output: string) => {
            const sortedNodes: RankedNode[] = sortRankedNodesMapByOutput(rankedNodes, output, outputType);
            acc.highestRankedLists[output] = sortedNodes.slice(0, listLength);
            acc.lowestRankedLists[output] = sortedNodes.slice(sortedNodes.length-listLength).reverse();

            return acc;
        },
    { highestRankedLists: {}, lowestRankedLists: {} })
);

// RankedNode UTILS

/**
 * Convert a set of output names to SINGLE or COLLECTIVE output keys
 * 
 * @param outputs 
 * @param outputType 
 * @returns 
 */
 export const getOutputKeys = (outputs: string[], outputType: OutputKeyType=OUTPUT_KEYS.SINGLE): string[] => (
    outputs.reduce((keysToKeep: string[], output: string) => {
        // 1. Gen key name to keep
        const outputKey: string = outputType === OUTPUT_KEYS.SINGLE ? genSingleAverageName(output) : genCollectiveAverageName(output);

        // 2. Record key names to keep
        keysToKeep.push(outputKey);

        return keysToKeep;
    }, [])
);

/**
 * Filter a CGNode or CGEdge to just its 'id' and 'single' or 'collective' properties
 * 
 * @param cgentity 
 * @param outputs 
 * @param outputType 
 * @returns 
 */
export const getCGEntityAttrs = (cgentity: CGNode | CGEdge, outputs: string[], outputType: OutputKeyType=OUTPUT_KEYS.SINGLE): RankedNode => {
    // 1. Get attr keys to keep
    const keysToKeep: string[] = getOutputKeys(outputs, outputType);
    // 2. Add id key
    keysToKeep.push(ID_KEY);

    // 3. Copy attrs
    const rankedEntity: RankedNode = DictUtils.copyDictKeep(cgentity, keysToKeep) as RankedNode;

    return rankedEntity;
}