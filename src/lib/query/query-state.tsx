import React from "react";

export interface QueryLike<TData> {
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  error: any;
  data?: TData;
  refetch?: () => void;
}

interface QueryStateProps<TData> {
  query: QueryLike<TData>;
  loading?: React.ReactNode;
  error?: (params: { error: any; refetch?: () => void }) => React.ReactNode;
  children: (data: TData) => React.ReactNode;
  fetchingIndicator?: React.ReactNode;
  empty: React.ReactNode;
}

export function QueryState<TData>({
  query,
  loading,
  error,
  children,
  fetchingIndicator,
  empty,
}: QueryStateProps<TData>) {
  const { isLoading, isError, isFetching, error: err, refetch, data } = query;

  if (isLoading) {
    return (
      <>
        {loading ?? (
          <div className="flex items-center justify-center absolute inset-0 left-0 -z-50 text-muted-foreground">
            Carregando...
          </div>
        )}
      </>
    );
  }

  if (isError) {
    return (
      <>
        {error ? (
          error({ error: err, refetch })
        ) : (
          <div>
            <p>Ocorreu um erro.</p>
            {refetch && <button onClick={refetch}>Tentar novamente</button>}
          </div>
        )}
      </>
    );
  }

  if (empty) {
    if (data == null) {
      return <>{empty}</>;
    }

    if (Array.isArray(data) && data.length === 0) {
      return <>{empty}</>;
    }

    if (
      typeof data === "object" &&
      "data" in (data as any) &&
      Array.isArray((data as any).data) &&
      (data as any).data.length === 0
    ) {
      return <>{empty}</>;
    }
  }

  return (
    <>
      {children(data as TData)}

      {isFetching && fetchingIndicator}
    </>
  );
}
