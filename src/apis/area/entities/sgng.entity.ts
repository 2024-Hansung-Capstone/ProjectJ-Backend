import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn,Column,CreateDateColumn,ManyToOne } from 'typeorm';
import {Sido} from '../../sido/entities/sido.entity'

@Entity()
@ObjectType()
export class Sgng{
    
    @PrimaryColumn('varchar', { length: 5 })
    @Field(() => String) 
    id: string;

    @ManyToOne(() => Sido)
    sido_id: Sido;

    @Column({ length: 50 })
    @Field(() => String)
    name: string;

    @CreateDateColumn({ type: 'timestamp' })
    @Field(() => Date)
    crtr_at: Date;    
}