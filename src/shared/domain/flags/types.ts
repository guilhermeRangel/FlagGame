export type FlagAssetSource = number | { readonly uri: string };

export type FlagVisual =
  | {
      readonly type: 'emoji';
      readonly value: string;
    }
  | {
      readonly type: 'asset';
      readonly source: FlagAssetSource;
    };

export type Flag = {
  readonly id: string;
  readonly countryName: string;
  readonly visual: FlagVisual;
};
