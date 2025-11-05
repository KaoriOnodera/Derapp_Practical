export default async function fetchCustomer(customer_id) {
  const apiEndpoint =
    process.env.NEXT_PUBLIC_API_ENDPOINT || "http://127.0.0.1:8000";
  const res = await fetch(
    apiEndpoint + `/customers?customer_id=${customer_id}`,
    {
      cache: "no-cache",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch customer");
  }
  return res.json();
}
