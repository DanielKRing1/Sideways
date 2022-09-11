type ExistingSlice = { sliceName: string, lastLogged: Date | undefined };

type DriverType = {
    isLoaded: boolean;
    load: () => Promise<void>;
    getSliceNames: () => string[];
    getSlicePropertyNames: (sliceName: string) => string[];
    getSliceProperties: (sliceName: string) => Dict<any>;
    getLastLoggedSlices: () => Promise<ExistingSlice[]>;

    createStack: (stackName: string) => Promise<void>;
    getStack: (stackName: string) => Promise<SidewaysSnapshotRow[]>;
    pushOntoStack: (stackName: string, ...snapshots: Dict<any>[]) => void;
    searchStack: (stackName: string, date: Date) => Promise<number>;

    createGraph: (graphName: string, propertyNames: string[]) => Promise<void>;
    rateGraph: (graphName: string, outputProperty: string, inputProperties: string[], rating: number, weights: number[]) => Promise<boolean>;
    undoRateGraph: (graphName: string, outputProperty: string, inputProperties: string[], rating: number, weights: number[]) => Promise<boolean>;
    pageRank: (graphName: string, iterations?: number, dampingFactor?: number) => Promise<false | Dict<Dict<number>>>;
    getRecommendations: (graphName: string, desiredOutput: string, inputNodeIds: string[], targetInputNodeWeight: number, edgeInflationMagnitude: number, iterations?: number, dampingFactor?: number) => Promise<false | RankedNode[]>;
}

type SidewaysSnapshotRow = {
    inputs: string[];
    outputs: string[];
    rating: int;

    timestamp: Date;
};