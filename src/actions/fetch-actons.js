const API_BASE_URL = "https://brandstestowy.smallhost.pl/api/random";

export async function fetchData(pageNumber = 1, pageSize = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
