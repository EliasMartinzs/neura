# Neura - AGENTS.md

## Stack
- Next.js 16 (App Router), React 19, TypeScript
- Prisma 7 + PostgreSQL, better-auth, Hono (API)
- pnpm (not npm/yarn)

## Key Commands
```bash
pnpm dev        # dev server (localhost:3000)
pnpm push       # prisma db push + generate
pnpm lint       # ESLint
pnpm studio     # Prisma Studio (db GUI)
pnpm build      # production build
```

## Architecture
- **API**: Hono server at `src/app/api/[[...route]]/route.ts` (catch-all)
- **Auth**: better-auth (JWT + OAuth)
- **Schemas**: Zod validation in `src/schemas/*.schema.ts`
- **Features**: Organized in `src/features/[feature]/*`
- **Components**: shadcn/ui (Radix UI) in `src/components/ui/`
- **DB**: Prisma schema at `prisma/schema.prisma` (runs `prisma generate` on postinstall)

## Notes
- Prisma generates on every `pnpm install` (postinstall hook)
- API docs at `/api/docs` (Swagger UI)
- `src/proxy.ts` handles environment variable loading for Hono
- Uses OpenAI for AI generation, Cloudinary for image uploads

## TanStack Query Pattern (Professional)

Use `getQueryState` from `@/lib/query/use-query-state` for all query handling. Never use the old `<QueryState>` component.

### Correct Pattern:
```tsx
import { useMyQuery } from "@/features/...";
import { getQueryState } from "@/lib/query/use-query-state";

export default function MyPage() {
  const query = useMyQuery();
  const { isLoading, isError, data, refetch, isFetching } = getQueryState(query);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-7 h-7 border-2 border-muted border-t-primary rounded-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Ocorreu um erro ao carregar.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      {isFetching && (
        <div className="fixed top-4 right-4 z-50">
          <div className="animate-spin w-5 h-5 border-2 border-muted border-t-primary rounded-full" />
        </div>
      )}
      
      {/* Your content */}
    </div>
  );
}
```

### Key Points:
- Always call `getQueryState(query)` at the top of the component
- Handle loading, error, and success states explicitly
- Show a fetching indicator while background refetches occur
- Extract data from `data` property after confirming it's not loading/error
- Use consistent loading spinner: `animate-spin w-7 h-7 border-2 border-muted border-t-primary rounded-full`