import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Recovery {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  code: string;
  @Column()
  mail: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @Column()
  used: boolean;
}
