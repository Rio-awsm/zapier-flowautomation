import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const IdividualCredentialPage = async ({ params }: PageProps) => {
  await requireAuth();
  const { credentialId } = await params;
  return <div>Credential id: {credentialId}</div>;
};

export default IdividualCredentialPage;
