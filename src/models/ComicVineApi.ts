// src/models/ComicVineAPI.ts

export interface ComicVineResponse<T> {
    error: string;
    limit: number;
    offset: number;
    number_of_page_results: number;
    number_of_total_results: number;
    status_code: number;
    results: T[];
}

export interface ComicVineCharacter {
    id: number;
    name: string;
    deck: string | null; // 'deck' is a brief plain-text summary of the character
    description: string | null; // 'description' is usually a large block of HTML
    image: ComicVineImage | null;
    site_detail_url: string;
}

export interface ComicVineImage {
    icon_url: string;
    medium_url: string;
    screen_url: string;
    super_url: string;
    thumb_url: string;
    tiny_url: string;
}