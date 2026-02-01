import { useQuery } from '@tanstack/vue-query';

interface ProperRules {
    id: number,
    nameEn: string,
    nameKh: string,
    icon:   string,
    key:   string,
}

export const usePropertyRules = () => {
    const api = useApi()

    return useQuery<ProperRules[]>({
        queryKey: ['property-rules'],
        queryFn: async () => {
            const res = await api.get('/property-rules');
            return res.data;
        },
        staleTime: 10 * 60 * 1000, // 10 min (frontend cache)
    });
};
