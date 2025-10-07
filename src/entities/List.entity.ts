import {Entity, Column, ManyToOne, OneToMany} from "typeorm";
import { BaseEntity } from "./BaseEntity.entity";
import {Board} from "./Board.entity"
import {Card} from "./Card.entity"

@Entity('lists')
export class List extends BaseEntity{
    @Column()
    title: string;

    @Column('float')
    position: number;

    @ManyToOne(() => Board, (board) => board.lists)
    board: Board;

    @OneToMany(() => Card, (card) => card.list)
    cards: Card[];
}