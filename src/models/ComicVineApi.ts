// src/models/ComicVineApi.ts

export interface ComicVineResponse<T> {
    error: string;
    limit: number;
    offset: number;
    number_of_page_results: number;
    number_of_total_results: number;
    status_code: number;
    results: T[];
}

export interface ComicVineSingleResponse<T> {
    error: string;
    results: T;
}

export interface ComicVinePublisher {
    id: number;
    name: string;
}

export interface ComicVineImage {
    icon_url: string;
    medium_url: string;
    screen_url: string;
    super_url: string;
    thumb_url: string;
    tiny_url: string;
}

export interface ComicVineMedia {
    id: number;
    name: string;
    site_detail_url: string;
    issue_number?: string;
}

export interface ComicVineCharacter {
    id: number;
    name: string;
    real_name: string | null;
    aliases: string | null;
    gender: number | null;
    deck: string | null;
    description: string | null;
    image: ComicVineImage | null;
    site_detail_url: string;
    publisher: ComicVinePublisher | null;

    movies?: ComicVineMedia[];
    tv_credits?: ComicVineMedia[];
    issue_credits?: ComicVineMedia[];
}