import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipo_spesa')
export default class TipoSpesa {

  @PrimaryGeneratedColumn()
  private id!: number;

  @Column({ nullable: false })
  private descrizione!: string;

  public get $id(): number {
    return this.id;
  }

  public set $id(value: number) {
    this.id = value;
  }

  public get $descrizione(): string {
    return this.descrizione;
  }

  public set $descrizione(value: string) {
    this.descrizione = value;
  }

  public static newTipoSpesa(obj: { id?: number, descrizione?: string }) {
    const newDirector = new TipoSpesa();
    if (obj.id) newDirector.id = obj.id;
    if (obj.descrizione) newDirector.descrizione = obj.descrizione;
    return newDirector;
  }

}
