export class CreateDto {
  id: string;
  title: string;
  tags: string;
  description: string;
  type: string;
  subType: string;
  images: string;
  config: string;
  user_id: string;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
