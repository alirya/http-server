import Response from '@alirya/http/response/response';
import Context from '../context/context';
import {O} from 'ts-toolbelt';
import Middleware from './middleware';
import IsFunction from '@alirya/function/boolean/function';
import FromResponse, {FromResponseReturn} from '../context/from-response';
import Callable from '@alirya/function/callable';
/**
 * use {@param response} value or return for response data
 *
 * @param response
 * Value or Value from callback to be applied to response
 *
 * @param middleware
 * @default {@see Next}
 * to be executed after
 */

export type ResponseArgumentsPromise<
    ContextType extends Context,
    Subject extends Response
> = Callable<[ContextType], Promise<Subject>>;

export type ResponseArgumentsCallback<
    ContextType extends Context,
    Subject extends Response
> = Callable<[ContextType], Subject>;

/**
 * promise factory
 */
export function ResponseParameters<
    ContextType extends Context,
    Subject extends Response,
>(
    response : ResponseArgumentsPromise<ContextType, Subject>,
    next ?: boolean
) : ResponseReturn<ContextType, Subject>;

/**
 * response factory
 */
export function ResponseParameters<
    ContextType extends Context,
    Subject extends Response,
>(
    response : ResponseArgumentsCallback<ContextType, Subject>,
    next ?: boolean
) : ResponseReturn<ContextType, Subject>;

/**
 * direct response value
 */
export function ResponseParameters<
    ContextType extends Context,
    Subject extends Response,
    >(
    response : Subject,
    next ?: boolean
) : ResponseReturn<ContextType, Subject>;

export function ResponseParameters<
    ContextType extends Context,
    Subject extends Response,
>(
    response : Subject|ResponseArgumentsPromise<ContextType, Subject>|ResponseArgumentsCallback<ContextType, Subject>,
    next : boolean = false
) : ResponseReturn<ContextType, Subject> {

    if(IsFunction(response)) {

        return function (context : ContextType) {

            return Promise.resolve(response(context)).then(function (subject) {

                context = FromResponse.Parameters(context, subject) as ContextType;

                return (next ? context : undefined) as FromResponseReturn<Subject['body'], ContextType>;

            });
        };

    } else {

        return function (context : ContextType) {

            context = FromResponse.Parameters(context, response) as ContextType;

            return (next ? context : undefined) as O.P.Update<ContextType, ['response', 'body'], Subject['body']>;
        };
    }

}


export type ResponseArgumentPromise<
    ContextType extends Context,
    Subject extends Response,
> = {
    response: ResponseArgumentsPromise<ContextType, Subject>,
    next?: boolean,
};

export type ResponseArgumentCallback<
    ContextType extends Context,
    Subject extends Response,
> = {
    response: ResponseArgumentsCallback<ContextType, Subject>,
    next?: boolean,
};

export type ResponseArgumentResponse<
    ContextType extends Context,
    Subject extends Response,
> = {
    response: Subject,
    next?: boolean,
};



/**
 * Options version of {@see ResponseParameters}
 */
/**
 * direct response value
 */
export function ResponseParameter<
    ContextType extends Context,
    Subject extends Response,
>(  {
        response,
        next
    } : ResponseArgumentResponse<ContextType, Subject>
) : ResponseReturn<ContextType, Subject>;

/**
 * promise factory
 */
export function ResponseParameter<
    ContextType extends Context,
    Subject extends Response,
>(  {
        response,
        next,
    } : ResponseArgumentPromise<ContextType, Subject>
) : ResponseReturn<ContextType, Subject>;

/**
 * response factory
 */
export function ResponseParameter<
    ContextType extends Context,
    Subject extends Response,
>(  {
        response,
        next
    } : ResponseArgumentCallback<ContextType, Subject>
) : ResponseReturn<ContextType, Subject>;

export function ResponseParameter<
    ContextType extends Context,
    Subject extends Response,
>(  {
        response,
        next = false,
    } : ResponseArgumentResponse<ContextType, Subject>| ResponseArgumentPromise<ContextType, Subject>| ResponseArgumentCallback<ContextType, Subject>
) : ResponseReturn<ContextType, Subject> {

    return ResponseParameters(response as Subject, next);
}


export type ResponseReturn<
    ContextType extends Context,
    Subject extends Response
> = Middleware<ContextType, O.P.Update<ContextType, ['response', 'body'], Subject['body']>>;


namespace Response {

    export type ArgumentsPromise<ContextType extends Context, Subject extends Response> = ResponseArgumentsPromise<ContextType, Subject>;
    export type ArgumentsCallback<ContextType extends Context, Subject extends Response> = ResponseArgumentsCallback<ContextType, Subject>;
    export const Parameters = ResponseParameters;
    export type ArgumentPromise<ContextType extends Context, Subject extends Response> = ResponseArgumentPromise<ContextType, Subject>;
    export type ArgumentCallback<ContextType extends Context, Subject extends Response> = ResponseArgumentCallback<ContextType, Subject>;
    export type ArgumentResponse<ContextType extends Context, Subject extends Response> = ResponseArgumentResponse<ContextType, Subject>;
    export const Parameter = ResponseParameter;
    export type Return<ContextType extends Context, Subject extends Response> = ResponseReturn<ContextType, Subject>;
}

export default Response;
