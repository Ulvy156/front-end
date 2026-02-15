import type { PhoneNumberType } from "~/types/phoneNumber";

export type ParkingType = 'MOTO' | 'CAR' | 'BICYCLE' | 'TUK_TUK';

export interface PropertyDetail {
  id: string;
  userId: string;
  districtId: number;
  address: string;
  locationUrl: string;
  lat: number | null;
  lng: number | null;
  nearby_location: string | null;

  title: string;
  description: string;
  monthly_price: number;
  deposit: number;
  bedroom: number;
  bathroom: number;

  isAvailable: boolean;
  availableFrom: string;
  isFeatured: boolean;
  featuredAt: string | null;
  totalViews: number;

  propertyType: PropertyType;
  sizeSqm: number;
  furnished: boolean;
  isPublished: boolean;
  minimumStayLength: number;
  floor: number;
  totalFloors: number;

  createdAt: string;
  updatedAt: string;

  user: User;
  images: Image[];
  district: District;

  amenities: Amenity[];
  rules: Rule[];
  parkings?: Parking[]
}
export interface User {
  imgUrl: string | null;
  role: 'ADMIN' | 'USER';
  phones: Phone[];
  name: string;
  email: string;
}

export interface Parking {
  id: string;
  type: ParkingType;
  slots: number;
  isFree: boolean;
  price: number | null;
  note: string | null;
}

export interface PropertyName {
  nameEn: string;
  nameKh: string;
}

export interface Phone {
  phoneNumber: string;
  type: PhoneNumberType
}

export interface Image {
  imageKey: string;
}

export interface Amenity extends PropertyName {
  icon: string;
}

export interface Rule extends PropertyName {
  icon: string;
  is_allow: boolean
}

export interface District extends PropertyName {
  province: Province;
}

export interface Province extends PropertyName{}

export interface PropertyType extends PropertyName {
  icon: string
}
