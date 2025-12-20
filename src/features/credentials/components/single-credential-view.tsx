"use client";

import { useSuspenseCredential } from "../hooks/use-credentials";
import CredentialForm from "./CredentialForm";

const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credetial } = useSuspenseCredential(credentialId);
  return <CredentialForm initialData={credetial} />;
};

export default CredentialView;
