const crypto = require('crypto');

module.exports = async (req, res) => {
  const publicKey = process.env.MARVEL_PUBLIC_KEY;
  const privateKey = process.env.MARVEL_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return res.status(500).json({
      code: 'MissingConfiguration',
      message:
        'Marvel API keys are not set. Add MARVEL_PUBLIC_KEY and MARVEL_PRIVATE_KEY in your Vercel project settings.',
    });
  }

  const ts = Date.now();
  const hash = crypto
    .createHash('md5')
    .update(`${ts}${privateKey}${publicKey}`)
    .digest('hex');

  const limit = req.query.limit || '100';
  const offset = req.query.offset || '0';

  const url = new URL('https://gateway.marvel.com/v1/public/comics');
  url.searchParams.set('ts', String(ts));
  url.searchParams.set('apikey', publicKey);
  url.searchParams.set('hash', hash);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

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
