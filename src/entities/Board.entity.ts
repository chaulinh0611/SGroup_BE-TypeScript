import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Workspace } from './Workspace.entity';
import { List } from './List.entity';

@Entity('boards')
export class Board extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  coverUrl: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.boards)
  workspace: Workspace;

  @OneToMany(() => List, (list) => list.board)
  lists: List[];
}
