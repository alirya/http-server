import Router from './router.js';
import Server from '../server/server.js';

export default function BindAfter<Type extends Router>(server : Server, router: Type) : Type {

    server.koa.use(async (context, next) => {

        return next().then(()=>router.call(context as any));

    });

    return router;
}