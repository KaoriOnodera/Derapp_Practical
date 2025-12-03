export default async function fetchCustomers() {
  const apiEndpoint =
    process.env.NEXT_PUBLIC_API_ENDPOINT || "http://127.0.0.1:8000";
  const res = await fetch(apiEndpoint + "/allcustomers", {
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch customers");
  }
  return res.json();
}
