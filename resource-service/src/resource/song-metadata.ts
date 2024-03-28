export type SongMetadata = {
  name: string;
  artist: string;
  album: string;
  length: number;
  year: number;
};

export type SongDto = SongMetadata & {
  resourceId: string;
};
