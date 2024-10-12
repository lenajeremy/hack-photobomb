export type CreateEventFormData = {
    name: string;
    slug: string;
    description: string;
    eventDate: string;
};

export type ApiResponse<T> = {
    data: T;
    error: string | null;
    status: number;
};
