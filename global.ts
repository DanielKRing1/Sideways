export type Dict<T> = Record<string, T>;
export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;
export type RequiredExceptFor<T, TNotRequired extends keyof T> = Omit<
  T,
  TNotRequired
> &
  Partial<Pick<T, TNotRequired>>;

export type HexColor = `#${string}`;
export type StringMap = Dict<string>;
