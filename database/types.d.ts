type ExistingSlice = { sliceName: string, lastLogged: Date | undefined };

type DriverType = {
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
    deleteGraph: (graphName: string) => Promise<void> | never;
    rateGraph: (graphName: string, outputProperty: string, inputProperties: string[], rating: number, weights?: number[]) => Promise<boolean> | never;
    undoRateGraph: (graphName: string, outputProperty: string, inputProperties: string[], rating: number, weights?: number[]) => Promise<boolean> | never;
    pageRank: (graphName: string, iterations?: number, dampingFactor?: number) => Promise<false | Dict<Dict<number>>> | never;
    getRecommendations: (graphName: string, desiredOutput: string, inputNodeIds: string[], targetInputNodeWeight: number, edgeInflationMagnitude: number, iterations?: number, dampingFactor?: number) => Promise<RankedNode[]> | never;
}

type SidewaysSnapshotRow = {
    inputs: string[];
    outputs: string[];
    rating: int;

    timestamp: Date;
};