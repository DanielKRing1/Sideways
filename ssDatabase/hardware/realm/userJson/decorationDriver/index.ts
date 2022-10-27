import RealmJsonManager, {RealmJson} from '@asianpersonn/realm-json';

import {
  DEFAULT_REALM_JSON_META_REALM_PATH,
  DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
  DEFAULT_REALM_JSON_COLLECTION_NAME,
} from '../config';

import {} from 'ssDatabase/api/types';
import {getDecorationJsonValue} from '../utils';
import {
  DECORATION_ROW_TYPE,
  DecorationJson,
  DecorationInfo,
  UserJsonMap,
  DecorationJsonMap,
  DecorationDriver,
} from 'ssDatabase/api/userJson/decoration/types';
import {DECORATION_ROW_DELIM} from 'ssDatabase/api/userJson/decoration/constants';

// VARIABLES
let isLoaded: boolean = false;

// LOAD/CLOSE ----

const load = async (): Promise<void> => {
  if (isLoaded) return;

  // TODO Refactor DecorationJson dRowType = `${activeSliceName}-${dRowTypeConstant}`

  // 1. Try to create collection for first time (will fail if already exists)
  await RealmJsonManager.createCollection({
    metaRealmPath: DEFAULT_REALM_JSON_META_REALM_PATH,
    loadableRealmPath: DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
    collectionName: DEFAULT_REALM_JSON_COLLECTION_NAME,
  });
  console.log('Should reach here, even upon fail');
  // 2. 'getJson' will create rows if they do not already exist
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    DEFAULT_REALM_JSON_COLLECTION_NAME,
  );
  jsonCollection.getJson(DECORATION_ROW_TYPE.INPUT);
  jsonCollection.getJson(DECORATION_ROW_TYPE.OUTPUT);

  // 3. Load collection
  const jsonPromise = RealmJsonManager.loadCollections(
    DEFAULT_REALM_JSON_META_REALM_PATH,
    DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
  );

  await Promise.all([jsonPromise]);

  isLoaded = true;
};

const closeAll = async (): Promise<void> => {
  await RealmJsonManager.closeAllCollections();

  isLoaded = false;
};

const throwLoadError = (): void | never => {
  if (!isLoaded)
    throw new Error('Must call "load()" before RealmJson (colors) can be used');
};

const setDecorationRow = (
  activeSliceName: string,
  dRowType: DECORATION_ROW_TYPE,
  newJson: DecorationJson,
): void | never => {
  throwLoadError();

  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    DEFAULT_REALM_JSON_COLLECTION_NAME,
  );

  const rowKey: string = genJsonRowKey(activeSliceName, dRowType);
  jsonCollection.setJson(rowKey, newJson);
};

const saveDecorations = (
  activeSliceName: string,
  newDecorations: DecorationInfo[],
): void | never => {
  throwLoadError();

  // 1. Get existing json
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    DEFAULT_REALM_JSON_COLLECTION_NAME,
  );
  const allJson: UserJsonMap = jsonCollection.getAllJson() as UserJsonMap;

  // 2. Build new json
  for (const newDec of newDecorations) {
    const {decorationRowId, entityId} = newDec;
    const decorationJsonRow: DecorationJson = allJson[decorationRowId];

    // 2.1. Create new json key/value pair, using default if needed
    decorationJsonRow[entityId] = getDecorationJsonValue(
      entityId,
      decorationJsonRow,
    );
  }

  // 3. Overwrite existing json rows with new json rows
  jsonCollection.setJson(
    genJsonRowKey(activeSliceName, DECORATION_ROW_TYPE.INPUT),
    allJson[DECORATION_ROW_TYPE.INPUT],
  );
  jsonCollection.setJson(
    genJsonRowKey(activeSliceName, DECORATION_ROW_TYPE.OUTPUT),
    allJson[DECORATION_ROW_TYPE.OUTPUT],
  );
};
const rmDecorations = (decorationsToRm: DecorationInfo[]): void | never => {
  throwLoadError();

  // 1. Organize keys to remove by rowId
  type KeysToRm = {
    [key in DECORATION_ROW_TYPE]?: string[];
  };
  const keysToRm: KeysToRm = decorationsToRm.reduce<KeysToRm>(
    (acc, {decorationRowId, entityId}: DecorationInfo) => {
      if (acc[decorationRowId] === undefined) acc[decorationRowId] = [];
      acc[decorationRowId]!.push(entityId);

      return acc;
    },
    {},
  );

  // 2. Remove keys from rows
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    DEFAULT_REALM_JSON_COLLECTION_NAME,
  );
  for (const rowId of Object.keys(keysToRm) as DECORATION_ROW_TYPE[])
    jsonCollection.deleteEntries(rowId, keysToRm[rowId]!);
};
const getAllDecorations = (): DecorationJsonMap | never => {
  throwLoadError();

  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    DEFAULT_REALM_JSON_COLLECTION_NAME,
  );
  const inputDecorationMap: DecorationJson = jsonCollection.getJson(
    DECORATION_ROW_TYPE.INPUT,
  ) as DecorationJson;
  const outputDecorationMap: DecorationJson = jsonCollection.getJson(
    DECORATION_ROW_TYPE.OUTPUT,
  ) as DecorationJson;

  const decorationJsonMap: DecorationJsonMap = {
    [DECORATION_ROW_TYPE.INPUT]: inputDecorationMap,
    [DECORATION_ROW_TYPE.OUTPUT]: outputDecorationMap,
  };

  return decorationJsonMap;
};

const Driver: DecorationDriver = {
  isLoaded,
  load,
  closeAll,

  setDecorationRow,
  saveDecorations,
  rmDecorations,
  getAllDecorations,
};

export default Driver;

const genJsonRowKey = (
  activeSliceName: string,
  dRowType: DECORATION_ROW_TYPE,
) => `${activeSliceName}${DECORATION_ROW_DELIM}${dRowType}`;
