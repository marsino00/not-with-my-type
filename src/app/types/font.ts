export interface FontFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export type SupportedFontFormat = ".otf" | ".ttf";

export interface DragAndDropState {
  isDragging: boolean;
  file: FontFile | null;
}
