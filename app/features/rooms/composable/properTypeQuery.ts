import { useQuery } from '@tanstack/vue-query';

interface PropertyType {
    id: number,
    nameEn: string,
    nameKh: string,
}

export const usePropertyTypeQuery = () => {
    const api = useApi()

    return useQuery<PropertyType[]>({
        queryKey: ['property-type'],
        queryFn: async () => {
            const res = await api.get('/property-type');
            return res.data;
        },
        staleTime: 10 * 60 * 1000, // 10 min (frontend cache)
    });
};
