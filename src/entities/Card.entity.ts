import {Entity, Column, ManyToOne, OneToMany} from "typeorm"
import { BaseEntity } from "./BaseEntity.entity"
import {List} from "./List.entity"
import {Comment} from "./Comment.entity"

export type Priority = 'high' | 'medium' | 'low'

@Entity('cards')
export class Card extends BaseEntity{
    @Column()
    title: string;

    @Column({nullable: true})
    description: string;

    @Column('float')
    position: number;

    @Column({type: 'enum', enum: ['high', 'medium', 'low'], default: 'medium'})
    priority: Priority;

    @ManyToOne(() => List, (list) => list.cards)
    list: List;

    @OneToMany(() => Comment, (comment) => comment.card)
    comments: Comment[]
}