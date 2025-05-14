export const fetchBlockHeight = async () => {
  try {
    const response = await fetch("/api/block-height");

    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching block height:", err);
  }
};
