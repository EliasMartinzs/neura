import { UseQueryResult } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type QueryStatus = "loading" | "error" | "success" | "pending";

interface UseQueryStateOptions<TData, TError = unknown> {
  query: UseQueryResult<TData, TError>;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  fetchingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  emptyCondition?: (data: TData) => boolean;
  onError?: (error: TError) => void;
}

export function useQueryState<TData, TError = unknown>({
  query,
  loadingComponent,
  errorComponent,
  emptyComponent,
  emptyCondition,
}: UseQueryStateOptions<TData, TError>) {
  const { isLoading, isError, isFetching, error, data, refetch, isPending } = query;

  const status: QueryStatus = isLoading || isPending
    ? "loading"
    : isError
    ? "error"
    : "success";

  if (status === "loading") {
    return {
      status,
      data: null,
      error: null,
      refetch,
      isFetching,
      component: loadingComponent ?? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="animate-spin size-7 text-muted-foreground" />
        </div>
      ),
    };
  }

  if (status === "error") {
    return {
      status,
      data: null,
      error,
      refetch,
      isFetching,
      component: errorComponent ?? (
        <div className="flex flex-col items-center justify-center p-8 gap-4">
          <Image
            src="/server-error-dark.svg"
            width={160}
            height={160}
            alt="server error"
            className="object-center object-cover"
          />
          <p className="text-muted-foreground">
            Ocorreu um erro inesperado.
          </p>
          {refetch && (
            <Button variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          )}
        </div>
      ),
    };
  }

  const isEmpty = emptyCondition ? emptyCondition(data as TData) : false;

  if (emptyComponent && isEmpty) {
    return {
      status,
      data: null,
      error: null,
      refetch,
      isFetching,
      component: emptyComponent,
    };
  }

  return {
    status,
    data: data as TData,
    error: null,
    refetch,
    isFetching,
    component: null,
  };
}

export function getQueryState<TData>(
  query: UseQueryResult<TData>
): {
  status: QueryStatus;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  data: TData | undefined;
  error: unknown;
  refetch: () => void;
} {
  const { isLoading, isError, isFetching, error, data, refetch, isPending } = query;

  return {
    status: isLoading || isPending
      ? "loading"
      : isError
      ? "error"
      : "success",
    isLoading: isLoading || isPending,
    isError,
    isFetching,
    data,
    error,
    refetch,
  };
}