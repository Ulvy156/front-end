interface PropertyImage {
  imageKey: string;
}

interface Province {
  nameEn: string;
  nameKh: string;
}

interface District {
  nameEn: string;
  nameKh: string;
  province: Province;
}

interface PropertyType {
  nameEn: string;
  nameKh: string;
  icon: string;
}

export interface PropertyCardItem {
  id: string;
  title: string;
  monthly_price: number;
  totalViews: number;
  bathroom: number;
  bedroom: number;
  isAvailable: boolean;
  images: PropertyImage[];
  district: District;
  propertyType: PropertyType;
  deposit: number;
  sizeSqm: number;
  availableFrom: Date;
}

export interface Meta {
  page: number,
  limit: number,
  total: number,
  totalPages: number,
}