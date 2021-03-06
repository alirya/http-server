import Koa, {DefaultContext, DefaultState} from 'koa';
import {Server as HttpServer} from 'http';
import {ListenOptions} from 'net';

export default interface Server<StateT = DefaultState, CustomT = DefaultContext> {

    readonly koa  : Koa<StateT, CustomT>;
    readonly server : HttpServer|undefined;
    readonly config : ListenOptions;
    open ():void;
    close():void;
}
