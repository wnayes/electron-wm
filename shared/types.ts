export interface IGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IBounds {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface IScreen {
  index: number;

  root: number;

  x: number;
  y: number;
  width: number;
  height: number;
  workArea: IGeometry;

  tags: string[];
  currentTags: string[];
}
