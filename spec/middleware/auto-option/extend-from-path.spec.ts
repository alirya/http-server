import Router from '../../../dist/router/standard';
import Method from '../../../dist/middleware/method';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import PathPattern from '../../../dist/middleware/path';
import AutoOptions from '../../../dist/middleware/auto-options';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('extend from path', () => {

    let response : AxiosResponse<{name : string, address : string}>;
    let methods : string[] = ['POST', 'GET', 'PATCH', 'DELETE', 'PUT'];

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router.add(AutoOptions());
        const path = router.add(PathPattern('/path/child'));

        for (const method of methods) {

            path.add(Method(method)).add(ctx=>ctx);
        }

    });

    it('send request', function (done) {

        Axios.request({
            method : 'OPTIONS',
            url : `http://localhost:${server.config.port}/path/child`
        }).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(response.headers.allow).toEqual(methods.join(', '));
        expect(response.status).toEqual(204);
        expect(response.statusText).toEqual('No Content');
    });

});
