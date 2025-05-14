export const fetchBlockHeight = async (useInternalRoute: boolean = true) => {
  try {
    const response = await fetch(
      useInternalRoute
        ? "/api/block-height"
        : "https://api.explorer.provable.com/v1/mainnet/latest/height"
    );

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
