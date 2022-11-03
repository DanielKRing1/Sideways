/**
 * This Realm Driver loads all other RealmJson collections (Global and Category)
 * and combines their values into a single 'UserJsonMap'
 */

import {CategoryJsonMap} from './category/types';
import {GlobalCategoryJsonMap} from './globalDriver/types';

/*
    [Collection key] sliceName: UserJsonMap;
*/

export type UserJsonMap = GlobalCategoryJsonMap & CategoryJsonMap;

// DRIVER
export type UserJsonDriver = {
  isLoaded: boolean;
  load: (activeSlice: string) => Promise<void>;
  closeAll: () => Promise<void>;

  getAllUserJson: (activeSlice: string) => UserJsonMap | never;
};
