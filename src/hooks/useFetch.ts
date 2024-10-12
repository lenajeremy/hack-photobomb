import React from 'react'

type UseFetchReturn<CallArgs, ReturnArgs, TError = unknown> = {
    data: ReturnArgs | undefined
    trigger: (args: CallArgs) => Promise<ReturnArgs | null>
    error: TError | undefined
    loading: boolean
}

export default function useFetch<C = object, R = object, E = object | undefined>(
    input: RequestInfo,
    init?: RequestInit,
    options?: { fetchOnRender?: boolean, fetchOnArgsChange?: boolean }
): UseFetchReturn<C, R, E> {

    const [data, setData] = React.useState<R | undefined>()
    const [error, setError] = React.useState<E | undefined>()
    const [loading, setLoading] = React.useState(false)

    const trigger = React.useCallback(async function (data: C): Promise<R | null> {
        try {
            setLoading(true)
            const res = await fetch(input, { ...init, body: data instanceof FormData ? data : JSON.stringify(data) })
            const json = await res.json()

            if (res.ok) {
                setData(json)
                return json
            } else {
                throw json
            }
        } catch (err) {
            setError(err as E)
            throw err
        } finally {
            setLoading(false)
        }
    }, [input, init])

    React.useEffect(() => {
        let isCanceled = false

        if (options?.fetchOnRender && !isCanceled) {
            trigger(init?.body as C)
        }

        return () => {
            isCanceled = true
        }
    }, [options?.fetchOnRender])

    return { data, trigger, error, loading }
}