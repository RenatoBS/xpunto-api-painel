import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blacklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  category: string;
  @Column()
  word: string;
  @Column()
  activated: boolean;
}
