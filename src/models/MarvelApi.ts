// src/models/MarvelAPI.ts

export interface MarvelApiResponse<T> {
    code: number;
    status: string;
    copyright: string;
    attributionText: string;
    attributionHTML: string;
    etag: string;
    data: MarvelDataContainer<T>;
}

export interface MarvelDataContainer<T> {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: T[];
}

export interface MarvelCharacter {
    id: number;
    name: string;
    description: string;
    modified: string;
    thumbnail: MarvelThumbnail;
    resourceURI: string;
    comics: MarvelItemList;
    series: MarvelItemList;
    stories: MarvelItemList;
    events: MarvelItemList;
    urls: MarvelUrl[];
}

export interface MarvelThumbnail {
    path: string;
    extension: string;
}

export interface MarvelUrl {
    type: string;
    url: string;
}

export interface MarvelItemList {
    available: number;
    collectionURI: string;
    items: MarvelItemSummary[];
    returned: number;
}

export interface MarvelItemSummary {
    resourceURI: string;
    name: string;
    type?: string;
}