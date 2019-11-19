import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Utente from './utente';

@Entity()
export default class Token {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ nullable: false })
    public token!: string;

    @ManyToOne((type) => Utente, (utente) => utente.tokens, { nullable: false })
    @JoinColumn({ name: 'utente_id' })
    public utente!: Utente;

    public static newToken(obj: { id?: number, token?: string, utente?: object }): Token {
        const token = new Token();
        if (obj.id) token.id = obj.id;
        if (obj.token) token.token = obj.token;
        if (obj.utente) token.utente = Utente.newUtente(obj.utente);
        return token;
    }
}
