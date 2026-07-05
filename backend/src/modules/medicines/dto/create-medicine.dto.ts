export class CreateMedicineDto {
  facilityId?: string;
  name: string;
  category?: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  threshold: number;
}
