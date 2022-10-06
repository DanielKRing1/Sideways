import RealmGraphManager, { CGEdge, CGNode, RankedNode, RealmGraph } from "@asianpersonn/realm-graph";
import { GetNodeStatsArgs, GetNodeStatsByOutputArgs, GetRecommendationsArgs, HiLoRanking, HiLoRankingByOutput, IdentityDriverType, OutputKeyType, OUTPUT_KEYS, PageRankArgs, RankedNodesMap, RecoDriverType, SINGLE_KEY } from "../../../api/types";
import { throwLoadError } from "../realmDriver";
import { filterCGEntityAttrs, getDestinationNodeId, sortRankedNodesMapByAllOutputs, sortRankedNodesMapByOutput } from "../utils";

// GET IDENTITY STATS

const getNodeStats = ({ graphName, nodeId, rawOutputs }: GetNodeStatsArgs): RankedNode | undefined => {
    throwLoadError();
    const realmGraph: RealmGraph = RealmGraphManager.getGraph(graphName);
    
    const cgnode: CGNode | undefined = realmGraph.getNode(nodeId);
    return cgnode !== undefined ? filterCGEntityAttrs(cgnode, rawOutputs, OUTPUT_KEYS[SINGLE_KEY]) : undefined;
}

const _getTandemNodes = async (
    graphName: string,
    nodeId: string,
    rawOutputs: string[],
    getEdges: (nodeId: string) => Promise<CGEdge[]>,
    listLength: number
): Promise<HiLoRanking> => {
    
    // 1. Get connected edges
    const cgedges: CGEdge[] = await getEdges(nodeId);
    const hiCGEdges: CGEdge[] = cgedges.slice(-listLength).reverse();
    const loCGEdges: CGEdge[] = cgedges.slice(0, listLength);

    // 2. Get destination node from edge
    //      Convert CGNode to RankedNode
    //      Filter out undefined results
    return {
        highestRanked: hiCGEdges.map((cgedge: CGEdge) => getNodeStats({ graphName, nodeId: getDestinationNodeId(cgedge, nodeId), rawOutputs })).filter((rankedNode: RankedNode | undefined) => rankedNode !== undefined) as RankedNode[],
        lowestRanked: loCGEdges.map((cgedge: CGEdge) => getNodeStats({ graphName, nodeId: getDestinationNodeId(cgedge, nodeId), rawOutputs })).filter((rankedNode: RankedNode | undefined) => rankedNode !== undefined) as RankedNode[],
    };
}
const _getTandemNodesByOutput = async (
    graphName: string,
    nodeId: string,
    rawOutputs: string[],
    getEdges: (nodeId: string, output: string) => Promise<CGEdge[]>,
    listLength: number
): Promise<HiLoRankingByOutput> => {

    // 1. Data structure
    const hiLoRankings: HiLoRankingByOutput = {};
    
    // 2. For each output
    for(const output of rawOutputs) {
        hiLoRankings[output] = await _getTandemNodes(graphName, nodeId, rawOutputs, (nodeId: string) => getEdges(nodeId, output), listLength);
    }

    return hiLoRankings;
}


/**
 * Get collectively commonly done nodes in descending order
 * 
 * @param graphName 
 * @param nodeId 
 * @param rawOutputs 
 * @param listLength 
 * @returns 
 */
const getCollectivelyTandemNodes = async ({ graphName, nodeId, rawOutputs, listLength }: GetNodeStatsByOutputArgs): Promise<HiLoRanking> => {
    throwLoadError();
    const realmGraph: RealmGraph = RealmGraphManager.getGraph(graphName);

    return _getTandemNodes(graphName, nodeId, rawOutputs, realmGraph.commonlyDoneWith, listLength);
}

/**
 * Get singly commonly done nodes, grouped by output, sorted in descending order
 * 
 * @param graphName 
 * @param nodeId 
 * @param rawOutputs 
 * @param listLength 
 * @returns 
 */
const getSinglyTandemNodes = async ({ graphName, nodeId, rawOutputs, listLength }: GetNodeStatsByOutputArgs): Promise<HiLoRankingByOutput> => {
    throwLoadError();
    const realmGraph: RealmGraph = RealmGraphManager.getGraph(graphName);

    return await _getTandemNodesByOutput(graphName, nodeId, rawOutputs, realmGraph.commonlyDoneByOutput, listLength);
}

const getHighlyRatedTandemNodes = async ({ graphName, nodeId, rawOutputs, listLength }: GetNodeStatsByOutputArgs): Promise<HiLoRankingByOutput> => {
    throwLoadError();
    const realmGraph: RealmGraph = RealmGraphManager.getGraph(graphName);

    return await _getTandemNodesByOutput(graphName, nodeId, rawOutputs, realmGraph.highlyRatedByOutput, listLength);
}

const Driver: IdentityDriverType = {
    getNodeStats,
    getCollectivelyTandemNodes,
    getSinglyTandemNodes,
    getHighlyRatedTandemNodes,
};

export default Driver;