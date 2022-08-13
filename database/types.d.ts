type ExistingSlice = { sliceName: string, lastLogged: Date };

type DriverType = {
    isLoaded: boolean;
    load: () => Promise<void>;
    getSliceNames: () => string[];
    getSliceProperties: (sliceName: string) => string[];
    getLastLoggedSlices: () => ExistingSlice[];

    createStack: (stackName: string) => Promise<void>;
    getStack: (stackName: string) => any[];
    pushOntoStack: (stackName: string, ...snapshots: Dict<any>[]) => void;
    searchStack: (stackName: string, date: Date) => number;

    createGraph: (graphName: string, propertyNames: string[]) => Promise<void>;
    getGraph: (graphName: string) => RealmGraph | undefined;
    rateGraph: (graphName: string, outputProperty: string, inputProperties: string[], rating: number, weights: number[]) => Promise<boolean>;
    undoRateGraph: (graphName: string, outputProperty: string, inputProperties: string[], rating: number, weights: number[]) => Promise<boolean>;
    pageRank: (graphName: string, iterations?: number, dampingFactor?: number) => Promise<false | Dict<Dict<number>>>;
    getRecommendations: (graphName: string, desiredOutput: string, inputNodeIds: string[], targetInputNodeWeight: number, edgeInflationMagnitude: number, iterations?: number, dampingFactor?: number) => Promise<false | RankedNode[]>;
}

type StackSnapshotRow = {
    inputs: string[];
    outputs: string[];
    rating: int;

    timestamp: Date;
};