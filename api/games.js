module.exports = async (req, res) => {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      code: 'MissingConfiguration',
      message:
        'RAWG API key is not set. Add RAWG_API_KEY in your Vercel project settings.',
    });
  }

  const page = req.query.page || '1';
  const pageSize = req.query.page_size || '100';
  const search = req.query.search;

  const url = new URL('https://api.rawg.io/api/games');
  url.searchParams.set('key', apiKey);
  url.searchParams.set('page', String(page));
  url.searchParams.set('page_size', String(pageSize));

  if (search) {
    url.searchParams.set('search', String(search));
    url.searchParams.set('search_precise', 'true');
  } else {
    url.searchParams.set('ordering', '-released');
  }

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      code: 'ProxyError',
      message: error.message,
    });
  }
};
