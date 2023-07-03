import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tipo_spesa")
export default class TipoSpesa {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  descrizione!: string;
}
