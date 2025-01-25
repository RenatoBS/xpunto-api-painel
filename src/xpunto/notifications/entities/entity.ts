import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  messageId: string;
  @Column()
  category: string;
  @Column()
  title: string;
  @Column()
  body: string;
  @Column()
  relation: string;
  @Column()
  image: string;
  @Column()
  sent: boolean;
  @Column()
  createdAt: Date;
}
