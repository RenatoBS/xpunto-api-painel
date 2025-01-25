export class CreateDto {
  id: string;
  messageId: string;
  category: string;
  title: string;
  body: string;
  relation: string;
  image: string;
  sent: boolean;
  createdAt: Date;
}
