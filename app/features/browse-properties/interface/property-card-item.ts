import type {
  PropertyCardLocation,
  PropertyCardType,
} from "~/types/property-card";

interface PropertyImage {
  imageKey: string;
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
  district: PropertyCardLocation;
  propertyType: PropertyCardType;
  deposit: number;
  sizeSqm: number;
  availableFrom: Date;
  distanceKm: number | null;
}

export interface Meta {
  page: number,
  limit: number,
  total: number,
  totalPages: number,
}
