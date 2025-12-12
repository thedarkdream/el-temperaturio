export interface ArtistTimelineDto {
    artist: String;
    points: Array<ArtistListenDto>;
}

export interface ArtistListenDto {
    time: String,
    listens: Number
}
