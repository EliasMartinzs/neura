import React from "react";

export interface QueryLike<TData> {
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  error: unknown;
  data?: TData;
  refetch?: () => void;
}

interface QueryStateProps<TData> {
  query: QueryLike<TData>;
  loading?: React.ReactNode;
  error?: (params: { error: unknown; refetch?: () => void }) => React.ReactNode;
  fetchingIndicator?: React.ReactNode;
  children: (data: TData) => React.ReactNode;
}

export function QueryState<TData>({
  query,
  loading,
  error,
  fetchingIndicator,
  children,
}: QueryStateProps<TData>) {
  const { isLoading, isError, isFetching, error: err, refetch, data } = query;

  if (isLoading) {
    return (
      loading ?? (
        <div className="flex items-center justify-center absolute inset-0 -z-50 text-muted-foreground">
          Carregando...
        </div>
      )
    );
  }

  if (isError) {
    return error ? (
      error({ error: err, refetch })
    ) : (
      <div>
        <p>Ocorreu um erro.</p>
        {refetch && <button onClick={refetch}>Tentar novamente</button>}
      </div>
    );
  }

  return (
    <>
      {children(data as TData)}
      {isFetching && fetchingIndicator}
    </>
  );
}
