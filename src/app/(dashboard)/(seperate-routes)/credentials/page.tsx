import CredentialsList, {
  CredentialsContainer,
  CredentialsError,
  CredentialsLoading,
} from "@/features/credentials/components/credentials";
import { credentialParamsLoader } from "@/features/credentials/credentials-params-loader";
import { prefetchCredentials } from "@/features/credentials/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};

const CredentialPage = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await credentialParamsLoader(searchParams);
  prefetchCredentials(params);
  return (
    <CredentialsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialsError />}>
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialsContainer>
  );
};

export default CredentialPage;
