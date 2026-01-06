import { useQuery } from '@tanstack/vue-query';
import type { FeaturedProperty, PopularDistrict } from '../feature.listings';

interface HomeData {
    featuredListings: FeaturedProperty[];
    latestListings: FeaturedProperty[];
    popularLocations: PopularDistrict[];
}

export const useHomePageQuery = () => {
    const api = useApi()

    return useQuery<HomeData>({
        queryKey: ['home-page'],
        queryFn: async () => {
            const res = await api.get('/property/home-page');
            return res.data;
        },
        staleTime: 10 * 60 * 1000, // 10 min (frontend cache)
    });
};
