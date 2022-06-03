export interface Product {
  productName: string;
  productId: string;
  packagesNumber: number;
  packageWeight: number;
  kiloPrice: number;
  tinOrKilo: number;
}

export type BillType = 'client' | 'provider' | 'direct-selling';
