import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import decorationDriver from 'ssDatabase/api/userJson/decoration';
import {AvailableIcons} from 'ssDatabase/api/userJson/decoration/constants';
import {getDecorationMapValue} from 'ssDatabase/hardware/realm/userJson/utils';

import {} from 'ssDatabase/api/types';
import {ThunkConfig} from '../../types';
import {
  DecorationJsonMap,
  DECORATION_ROW_TYPE,
  DecorationJson,
  DecorationInfo,
} from 'ssDatabase/api/userJson/decoration/types';

// INITIAL STATE

export interface DecorationState {
  // DECORATIONS
  fullDecorationMap: DecorationJsonMap;

  // RERENDER
  decorationsSignature: {};
}

const initialState: DecorationState = {
  // DEACORATIONS
  fullDecorationMap: {
    [DECORATION_ROW_TYPE.INPUT]: {},
    [DECORATION_ROW_TYPE.OUTPUT]: {},
  },

  // RERENDER
  decorationsSignature: {},
};

// THUNKS

// SET ALL
type StartSetAllDecorationsArgs = undefined;
export const startSetAllDecorations = createAsyncThunk<
  boolean,
  StartSetAllDecorationsArgs,
  ThunkConfig
>(
  'decorationSlice/startSetAllDecorations',
  async (undef: StartSetAllDecorationsArgs, thunkAPI) => {
    const fullDecorationMap: DecorationJsonMap =
      await decorationDriver.getAllDecorations();

    thunkAPI.dispatch(setDecorations(fullDecorationMap));
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  },
);

// UPDATE
type StartUpdateDecorationRow = {
  dRowType: DECORATION_ROW_TYPE;
  newJson: DecorationJson;
};
export const startUpdateDecorationRow = createAsyncThunk<
  boolean,
  StartUpdateDecorationRow,
  ThunkConfig
>(
  'decorationSlice/startUpdateDecorationRow',
  async ({dRowType, newJson}: StartUpdateDecorationRow, thunkAPI) => {
    await decorationDriver.setDecorationRow(dRowType, newJson);

    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

/**
 * Updates Decoration.row.entityId
 * Creates new entityId if not exists
 */
type StartUpdateDecorationValue = {
  dRowType: DECORATION_ROW_TYPE;
  entityId: string;
  newValue: string;
};
export const startUpdateDecorationText = createAsyncThunk<
  boolean,
  StartUpdateDecorationValue,
  ThunkConfig
>(
  'decorationSlice/startUpdateDecorationText',
  async (
    {
      dRowType,
      entityId: oldText,
      newValue: newText,
    }: StartUpdateDecorationValue,
    thunkAPI,
  ) => {
    const {fullDecorationMap} =
      thunkAPI.getState().userJsonSlice.decorationSlice;

    // 1. Add new edited name
    const newJson: DecorationJson = {
      ...fullDecorationMap[dRowType],
      [newText]: getDecorationMapValue(dRowType, oldText, fullDecorationMap),
    };
    // 2. Remove old name
    delete fullDecorationMap[dRowType][oldText];

    // 3. Update db
    await decorationDriver.setDecorationRow(dRowType, newJson);

    // 4. Update Redux
    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

export const startUpdateDecorationColor = createAsyncThunk<
  boolean,
  StartUpdateDecorationValue,
  ThunkConfig
>(
  'decorationSlice/startUpdateDecorationColor',
  async (
    {dRowType, entityId, newValue: newColor}: StartUpdateDecorationValue,
    thunkAPI,
  ) => {
    const {fullDecorationMap} =
      thunkAPI.getState().userJsonSlice.decorationSlice;

    // 1. Add new color
    const newJson: DecorationJson = {
      ...fullDecorationMap[dRowType],
      [entityId]: {
        ...getDecorationMapValue(dRowType, entityId, fullDecorationMap),
        COLOR: newColor,
      },
    };

    // 2. Update db
    await decorationDriver.setDecorationRow(dRowType, newJson);

    // 3. Update Redux
    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

export const startUpdateDecorationIcon = createAsyncThunk<
  boolean,
  StartUpdateDecorationValue,
  ThunkConfig
>(
  'decorationSlice/startUpdateDecorationIcon',
  async (
    {dRowType, entityId, newValue: newIcon}: StartUpdateDecorationValue,
    thunkAPI,
  ) => {
    const {fullDecorationMap} =
      thunkAPI.getState().userJsonSlice.decorationSlice;

    // 1. Add new icon
    const newJson: DecorationJson = {
      ...fullDecorationMap[dRowType],
      [entityId]: {
        ...getDecorationMapValue(dRowType, entityId, fullDecorationMap),
        ICON: newIcon as AvailableIcons,
      },
    };

    // 3. Update db
    await decorationDriver.setDecorationRow(dRowType, newJson);

    // 4. Update Redux
    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

// ADD
type StartAddDecorationsArgs = DecorationInfo[];
export const startAddDecorations = createAsyncThunk<
  boolean,
  StartAddDecorationsArgs,
  ThunkConfig
>(
  'decorationSlice/startAddDecorations',
  async (newDecorations: StartAddDecorationsArgs, thunkAPI) => {
    await decorationDriver.saveDecorations(newDecorations);

    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

// RM
type StartRmDecorationsArgs = Omit<DecorationInfo, 'decoration'>[];
export const startRmDecorations = createAsyncThunk<
  boolean,
  StartRmDecorationsArgs,
  ThunkConfig
>(
  'decorationSlice/startRmDecorations',
  async (decorationsToRm: StartRmDecorationsArgs, thunkAPI) => {
    await decorationDriver.rmDecorations(decorationsToRm);

    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

// ACTION TYPES

// Decoration
type SetDecorationsAction = PayloadAction<DecorationJsonMap>;
// Rerender
type ForceDecorationRerenderAction = PayloadAction<undefined>;

// SLICE

export const decorationSlice = createSlice({
  name: 'decorationSlice',
  initialState,
  reducers: {
    // COLORS
    setDecorations: (state: DecorationState, action: SetDecorationsAction) => {
      state.fullDecorationMap = action.payload;
    },

    // RERENDER
    forceSignatureRerender: (
      state: DecorationState,
      action: ForceDecorationRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.decorationsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const {setDecorations, forceSignatureRerender} = decorationSlice.actions;

export default decorationSlice.reducer;
