import { Links, Meta, Scripts } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { FourOhFour } from '~/components/errors';


export function loader(): LoaderFunction {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new Response('Not Found', { status: 404 });
}

export default function _() {
    return (
        <html lang="en">
            <head>
                <title>My Nested Error</title>
                <Meta />
                <Links />
            </head>
            <body>
                <Scripts />
            </body>
        </html>
    )
}

export function CatchBoundary() {
    return <FourOhFour />
}