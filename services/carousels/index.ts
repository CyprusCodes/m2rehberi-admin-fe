// CAROUSEL SERVICES

import { apiClient } from "@/lib/apiClient";
import { adminCarouselEndpoints } from "@/lib/endpoints";

export interface Carousel {
    carouselId?: number;
    title: string;
    description: string;
    imageUrl: string;
    status: 'active' | 'inactive';
    startDate: string;
    endDate: string;
    serverLinkId?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCarouselRequest {
    title: string;
    description: string;
    imageUrl: string;
    status: 'active' | 'inactive';
    startDate: string;
    endDate: string;
    serverLinkId?: number;
}

export interface UpdateCarouselRequest extends CreateCarouselRequest {}

export const getCarousels = async () => {
    const response = await apiClient.get(adminCarouselEndpoints.getAll);
    return response.data.carousels || [];
};

export const postCarousel = async (carousel: CreateCarouselRequest) => {
    const response = await apiClient.post(adminCarouselEndpoints.create, carousel);
    return response.data;
};

export const updateCarousel = async (id: string, carousel: UpdateCarouselRequest) => {
    const response = await apiClient.put(adminCarouselEndpoints.update(id), carousel);
    return response.data;
};

export const deleteCarousel = async (id: string) => {
    const response = await apiClient.delete(adminCarouselEndpoints.delete(id));
    return response.data;
};

export const getCarousel = async (id: string) => {
    const response = await apiClient.get(adminCarouselEndpoints.getAll);
    return response.data;
};

export const fetchCarouselServers = async () => {
    const response = await apiClient.get(adminCarouselEndpoints.getServers);
    return response.data.data || [];
};