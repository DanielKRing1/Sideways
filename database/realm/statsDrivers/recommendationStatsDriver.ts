import RealmGraphManager, { CGEdge, CGNode, RankedNode, RealmGraph } from "@asianpersonn/realm-graph";
import { GetNodeStatsArgs, GetNodeStatsByOutputArgs, GetRecommendationsArgs, HiLoRanking, HiLoRankingByOutput, OutputKeyType, OUTPUT_KEYS, PageRankArgs, RankedNodesMap, RecoDriverType, SINGLE_KEY } from "../../types";
import { throwLoadError } from "../realmDriver";
import { filterCGEntityAttrs, getDestinationNodeId, sortRankedNodesMapByAllOutputs, sortRankedNodesMapByOutput } from "../utils";

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
 const getRecommendations = ({ graphName, inputNodeIds, outputType, iterations=20, dampingFactor=1 }: GetRecommendationsArgs): HiLoRankingByOutput | never => {    
    throwLoadError();
    const realmGraph: RealmGraph = RealmGraphManager.getGraph(graphName);

    const rankedNodes: RankedNodesMap = realmGraph.rankMostInfluentialToCentralSet(inputNodeIds, iterations, dampingFactor);
    return sortRankedNodesMapByAllOutputs(rankedNodes, outputType);
};

/**
 * Raw PageRank on all Nodes
 * 
 * @param graphName 
 * @param iterations 
 * @param dampingFactor 
 * @returns 
 */
 const pageRank = ({ graphName, possibleOutputs, listLength, outputType, iterations, dampingFactor }: PageRankArgs): HiLoRankingByOutput | never => {
    throwLoadError();
    const realmGraph: RealmGraph = RealmGraphManager.getGraph(graphName);

    const rankingsMap: RankedNodesMap = realmGraph.pageRank(iterations, dampingFactor);
    return sortRankedNodesMapByAllOutputs(rankingsMap, possibleOutputs, listLength, outputType);
};

const Driver: RecoDriverType = {
    getRecommendations,
    pageRank
};

export default Driver;