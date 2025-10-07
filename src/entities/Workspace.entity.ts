import { Entity, Column, ManyToMany, OneToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity.entity";
import {User} from "./User.entity"
import {Board} from "./Board.entity"

@Entity('workspaces')
export class Workspace extends BaseEntity{
    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({default: true})
    isActive: boolean;

    @Column({default: false})
    isDelete: boolean;

    @ManyToOne(() => User, (user) => user.workspaces)
    owner: User;

    @OneToMany(() => Board, (board) => board.workspace)
    boards: Board[];
}