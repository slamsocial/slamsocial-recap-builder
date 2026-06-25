import RecapApp from "../../recap-app";

export default async function ClientPreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <RecapApp initialMode="client" initialSlug={slug} />;
}
