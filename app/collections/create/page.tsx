import CollForm from "@/app/ui/coll-form";
import { getProducers } from "@/app/lib/data/producers";
import { createCollectionAction } from "@/app/lib/actions/collection-actions";

export default async function GenerateCollectionPage() {
  const producers = await getProducers();

  return <CollForm producers={producers} actionFunc={createCollectionAction} />;
}
