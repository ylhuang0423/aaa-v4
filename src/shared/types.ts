export interface Photo {
  name: string;
  url: string;
}

export interface Album {
  name: string;
  photos: Photo[];
}

export interface Shelf {
  name: string;
  albums: Album[];
}

export type PhotoLibrary = Shelf[];

export type Viewed = Record<string, string[]>;

export interface HistoryEntry {
  shelf: string;
  album: string;
  timestamp: number;
}
