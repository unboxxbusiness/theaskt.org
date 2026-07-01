// ponytail: shared timezone-independent date parser to prevent SSR hydration mismatches
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  
  // Extract date part (YYYY-MM-DD)
  const datePart = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const parts = datePart.split("-");
  if (parts.length !== 3) return dateStr;
  
  const year = parts[0];
  const monthNum = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const monthName = months[monthNum - 1] || "";
  
  return `${monthName} ${day}, ${year}`;
}
