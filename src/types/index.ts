import { Upload } from "@prisma/client";
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

export type GetUploadsResponse = ApiResponse<{
    uploads: (Upload & {
        files: {
            publicURL: string;
            id: string;
        }[];
    })[];
    total: number;
}>
