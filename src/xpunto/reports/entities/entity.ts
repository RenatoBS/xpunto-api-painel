import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reports {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  type: string;
  @Column()
  category: string;
  @Column()
  description: string;
  @Column()
  evidence: string;
  @Column()
  status: string;
  @Column()
  author: string;
  @Column()
  indicted: string;
  @Column()
  interest_id: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
}
