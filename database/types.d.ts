import { CGNode, CGEdge, RankedNode } from "@asianpersonn/realm-graph";
import { OutputKeyType } from './realm/realmDriver';
import { Dict } from '../global';

type ExistingSlice = { sliceName: string, lastLogged: Date | undefined };

type DbDriverType = {
    isLoaded: boolean;
    load: () => Promise<void>;
    getSliceNames: () => string[] | never;
    getSlicePropertyNames: (sliceName: string) => string[] | never;
    getSliceProperties: (sliceName: string) => Dict<any> | never;
    getLastLoggedSlices: () => Promise<ExistingSlice[]> | never;

    createStack: (stackName: string) => Promise<void> | never;
    getStack: (stackName: string) => Promise<Realm.List<SidewaysSnapshotRow> | []> | never;
    getList: (stackName: string) => Promise<SidewaysSnapshotRow[]> | never;
    searchStack: (stackName: string, date: Date) => Promise<number> | never;
    push: (stackName: string, ...snapshots: Dict<any>[]) => void | never;
    deleteStack: (stackName: string) => Promise<void> | never;

    deleteSnapshotIndexes: (stackName: string, indexesToRm: number[]) => Promise<void> | never;
    updateSnapshot: (sliceName: string, oldSnapshot: Realm.Object & SidewaysSnapshotRow, newInputs: string[], newOutputs: string[], newRating: number) => Promise<void> | never;

    createGraph: (graphName: string, propertyNames: string[]) => Promise<void> | never;
    getNode: (graphName: string, nodeId: string) => Realm.Object & CGNode | undefined | never;
    getEdge: (graphName: string, node1Id: string, node2Id: string) => Realm.Object & CGEdge | undefined | never;
    getAllNodes: (graphName: string) => Realm.Results<Realm.Object & CGNode> | [] | never;
    getAllEdges: (graphName: string) => Realm.Results<Realm.Object & CGEdge> | [] | never;
    deleteGraph: (graphName: string) => Promise<void> | never;
    rateGraph: (graphName: string, outputProperty: string, inputProperties: string[], rating: number, weights?: number[]) => Promise<boolean> | never;
    undoRateGraph: (graphName: string, outputProperty: string, inputProperties: string[], rating: number, weights?: number[]) => Promise<boolean> | never;
};

// RECO STATS DRIVER
// Methods
type PageRankArgs = {
    graphName: string;
    possibleOutputs: string[];
    listLength: number;
    outputType: OutputKeyType;
    iterations?: number;
    dampingFactor?: number;
};
type GetRecommendationsArgs = {
    graphName: string;
    inputNodeIds: string[];
    outputType?: OutputKeyType;
    iterations?: number;
    dampingFactor?: number;
};
// Driver type
type RecoDriverType = {
    getRecommendations: (args: GetRecommendationsArgs) => HiLoRankingByOutput | never;
    pageRank: (args: PageRankArgs) => HiLoRankingByOutput | never;
};

// IDENTITY STATS DRIVER
// Methods
type GetNodeStatsArgs = {
    graphName: string;
    nodeId: string;
    rawOutputs: string[];
};
type GetNodeStatsByOutputArgs = {
    listLength: number;
} & GetNodeStatsArgs;
// Driver type
type IdentityDriverType = {
    getNodeStats: (args: GetNodeStatsArgs) => RankedNode | undefined;
    getCollectivelyTandemNodes: (args: GetNodeStatsByOutputArgs) => Promise<HiLoRanking>;
    getSinglyTandemNodes: (args: GetNodeStatsByOutputArgs) => Promise<HiLoRankingByOutput>;
    getHighlyRatedTandemNodes: (args: GetNodeStatsByOutputArgs) => Promise<HiLoRankingByOutput>;
};

// DATASTRUCTURE TYPE DEFINITIONS
type RankedNodesMap = Dict<Dict<number>>;

type HiLoRanking = {
    highestRanked: RankedNode[];
    lowestRanked: RankedNode[];
};
type HiLoRankingByOutput = Dict<HiLoRanking>;

const SINGLE_KEY = 'SINGLE';
const SINGLE_TALLY_KEY = 'SINGLE_TALLY';
const COLLECTIVE_KEY = 'COLLECTIVE';
const COLLECTIVE_TALLY_KEY = 'COLLECTIVE_TALLY';
type OutputKeyType = typeof SINGLE_KEY | typeof SINGLE_TALLY_KEY | typeof COLLECTIVE_KEY | typeof COLLECTIVE_TALLY_KEY;
export const OUTPUT_KEYS = {
    [SINGLE_KEY]: SINGLE_KEY,
    [SINGLE_TALLY_KEY]: SINGLE_KEY,
    [COLLECTIVE_KEY]: COLLECTIVE_TALLY_KEY,
    [COLLECTIVE_TALLY_KEY]: COLLECTIVE_TALLY_KEY,
} as const;

// REALM DB TYPES
type SidewaysSnapshotRow = {
    inputs: string[];
    outputs: string[];
    rating: int;

    timestamp: Date;
};
