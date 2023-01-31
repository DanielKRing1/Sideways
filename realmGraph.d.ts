import {Dict} from './global';
import {NODE_ID} from 'ssDatabase/api/types';

// augment realm-graph.js
declare module '@asianpersonn/realm-graph' {
  export type RankedNode = {
    id: NODE_ID;
  } & Dict<any>;
}
