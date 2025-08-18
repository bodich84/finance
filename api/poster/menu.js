const handler = async (req, res) => {
  const token = process.env.POSTER_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'POSTER_TOKEN is not set' });
    return;
  }

  try {
    const response = await fetch(`https://joinposter.com/api/menu.getMenu?token=${token}`);
    const json = await response.json();
    const items = json.response?.menu || json.response || [];
    const products = Array.isArray(items)
      ? items.flatMap((item) => item.products || item)
      : [];
    const simplified = products.map((prod) => ({
      name: prod.product_name,
      prime_cost: prod.prime_cost ?? prod.primeCost,
    }));
    res.status(200).json(simplified);
  } catch (err) {
    console.error('Failed to fetch poster menu', err);
    res.status(500).json({ error: 'Failed to fetch poster menu' });
  }
};

module.exports = handler;
