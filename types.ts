export interface Photo {
  id: number;
  url: string;
  width: number;
  height: number;
}

export interface TreeConfig {
  height: number;
  radius: number;
  particleCount: number;
  colorPrimary: string;
  colorSecondary: string;
}
