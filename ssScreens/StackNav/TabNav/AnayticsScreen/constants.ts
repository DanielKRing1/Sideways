export const IdentityViewName = 'IdentityView';
export const RecoViewName = 'RecoView';
export const TimeseriesViewName = 'TimeseriesView';

export type AnalyticsViewName =
  | typeof IdentityViewName
  | typeof RecoViewName
  | typeof TimeseriesViewName;
