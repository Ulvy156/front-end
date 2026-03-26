import { useQuery } from '@tanstack/vue-query';

interface Amenities {
    id: number,
    nameEn: string,
    nameKh: string,
    icon:   string,
    code:   string,
}

export const usePropertyAmenities = () => {
    const api = useApi()

    return useQuery<Amenities[]>({
        queryKey: ['property-amenities'],
        queryFn: async () => {
            const res = await api.get('/property-amenity');
            return res.data;
        },
        staleTime: 10 * 60 * 1000, // 10 min (frontend cache)
    });
};
