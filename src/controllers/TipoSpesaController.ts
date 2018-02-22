import { IRouterContext } from 'koa-router';
import { Inject, Singleton } from 'typescript-ioc';

import TipoSpesaService from '../services/TipoSpesaService';

@Singleton
export default class TipoSpesaController {

    constructor(
        @Inject private tipoSpesaService: TipoSpesaService
    ) { }

    public async getAllTipoSpesas(ctx: IRouterContext) {
        ctx.body = await this.tipoSpesaService.findAll();
    }

    public async findTipoSpesaById(ctx: IRouterContext) {
        try {
            ctx.body = await this.tipoSpesaService.findById(ctx.params.id);
        } catch (e) {
            ctx.throw(404);
        }
    }

    // public async saveTipoSpesa(ctx: IRouterContext) {
    //     try {
    //         const director: TipoSpesa = TipoSpesa.newTipoSpesa(ctx.request.body);
    //         const result = await this.tipoSpesaService.save(director);
    //         ctx.body = result;
    //     } catch (e) {
    //         ctx.throw(400, e.message);
    //     }
    // }

    // public async updateTipoSpesa(ctx: IRouterContext) {
    //     try {
    //         const director: TipoSpesa = TipoSpesa.newTipoSpesa(ctx.request.body);
    //         if (String(ctx.params.id) !== String(director.$id)) {
    //             ctx.throw(400);
    //         }
    //         const result = await this.tipoSpesaService.update(director);
    //     } catch (e) {
    //         ctx.throw(400, e.message);
    //     }
    // }

    // public async deleteTipoSpesa(ctx: IRouterContext) {
    //     const directorId = ctx.params.id;
    //     await this.tipoSpesaService.delete(directorId);
    //     ctx.status = 200;
    // }
}
