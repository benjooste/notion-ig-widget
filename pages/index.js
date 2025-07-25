// Updated Instagram Grid Widget – Supports new `ntn_` tokens (Notion API 2024+)
// Uses fetch with Notion API v1 (no official SDK)

import Head from 'next/head';

export async function getServerSideProps(context) {
  const databaseId = context.query.db;
  const notionToken = process.env.NOTION_TOKEN;

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const data = await response.json();

    const items = data.results.map((item) => {
      const props = item.properties;
      const image = props['Image']?.files?.[0]?.file?.url || null;
      const caption = props['Caption']?.rich_text?.[0]?.plain_text || '';
      return { image, caption };
    });

    return { props: { items } };
  } catch (error) {
    console.error(error);
    return { props: { items: [], error: 'Failed to fetch data. Check DB ID or Token.' } };
  }
}

export default function Home({ items, error }) {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <Head>
        <title>Instagram Grid Preview</title>
      </Head>
      <h2 style={{ fontWeight: 500 }}>Instagram Grid Preview</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '10px',
          marginTop: '20px'
        }}
      >
        {items.map((item, idx) => (
          <div key={idx}>
            {item.image && (
              <img
                src={item.image}
                alt={item.caption}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
            {item.caption && (
              <p style={{ fontSize: '12px', marginTop: '4px' }}>{item.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}