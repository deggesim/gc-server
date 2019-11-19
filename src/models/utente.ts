import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Token from './token';

@Entity()
export default class Utente {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ nullable: false })
    public email!: string;

    @Column({ nullable: false })
    public password!: string;

    @OneToMany((type) => Token, (token) => token.utente, { eager: true, cascade: true })
    public tokens!: Token[];

    public static newUtente(obj: { id?: number, email?: string, password?: string }): Utente {
        const utente = new Utente();
        if (obj.id) utente.id = obj.id;
        if (obj.email) utente.email = obj.email;
        if (obj.password) utente.password = obj.password;
        return utente;
    }

}
