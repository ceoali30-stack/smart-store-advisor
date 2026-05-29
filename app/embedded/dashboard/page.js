export default async function EmbeddedDashboardPage({
  searchParams,
}) {
  const params = await searchParams;

  return (
    <pre>
      {JSON.stringify(params, null, 2)}
    </pre>
  );
}
