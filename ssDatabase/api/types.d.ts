import { CGNode, CGEdge, RankedNode } from "@asianpersonn/realm-graph";
import { OutputKeyType } from '../hardware/realm/dbDriver';
import { Dict } from '../../global';
import { ENTITY_TYPE } from "ssDatabase/hardware/realm/userJson/utils";

type ExistingSlice = { sliceName: string, lastLogged: Date | undefined };

type DbDriverType = {
    isLoaded: boolean;
    load: () => Promise<void>;
    closeAll: () => Promise<void>;

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

// RECO STATS DRIVER
// Methods
type PageRankArgs = {
    graphName: string;
    rawOutputs: string[];
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

// TIME STATS DRIVER
// Methods
export type GetTimeseriesArgs = {
    sliceName: string;
    outputs: string[];
};

export type GetNodeOverlapArgs = {
    nodeIds: string[];
} & Omit<GetTimeseriesArgs, 'outputs'>;

// Driver type
type TimeseriesDriverType = {
    getDailyOutputLG: ({ sliceName, outputs }: GetTimeseriesArgs) => Promise<LineGraph>;
    getMonthlyOutputHistogram: ({ sliceName, outputs }: GetTimeseriesArgs) => Promise<HistogramByMonth[]>;
    getNodeOverlapVenn: ({ sliceName, nodeIds }: GetNodeOverlapArgs) => Promise<VennByMonth[]>;
    getDailyOutputHM: ({ sliceName }: GetTimeseriesArgs) => Promise<HeatMapByMonth[]>;
};

// NON-TIMESERIES DATASTRUCTURE TYPE DEFINITIONS
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

// TIMESERIES DATASTRUCTURE TYPE DEFINITIONS


// REALM DB TYPES
type SidewaysSnapshotRow = {
    inputs: string[];
    outputs: string[];
    rating: int;

    timestamp: Date;
};

// USER JSON DRIVER

/*
[Row keys] Dict {
    [Decoration Rows, Entity ids] Dict {
        [Data/any]
        color: string;
        icon: string;
    }
}
*/
// Can & other json maps to this type
export type UserJsonMap = DecorationJsonMap & {};

// DECORATION DRIVER

// Enums
// (Row Key)
export enum DECORATION_ROW_KEY {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
};
export type DecorationJsonMap = {
    [DECORATION_ROW_KEY.INPUT]: DecorationJson;
    [DECORATION_ROW_KEY.OUTPUT]: DecorationJson;
};
export type DecorationJson = Dict<DecorationJsonValue>;
export type DecorationJsonValue = {
    color: string;
    icon: string;
};
export type DecorationInfo = {
    decorationRowId: DECORATION_ROW_KEY;
    entityId: string;
    color?: string;
    icon?: string;
};
export type DecorationDriver = {
    isLoaded: boolean;
    load: () => Promise<void>,
    closeAll: () => Promise<void>,

    saveDecorations: (newDecorations: DecorationInfo[]) => void | never;
    rmDecorations: (decorationsToRm: DecorationInfo[]) => void | never;
    getAllDecorations: () => UserJsonMap | never;
};

export type StringMap = Dict<string>;
