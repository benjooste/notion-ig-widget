import { Client } from '@notionhq/client';
import Head from 'next/head';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function getServerSideProps(context) {
  const databaseId = context.query.db;

  try {
    const response = await notion.databases.query({ database_id: databaseId });

    const items = response.results.map((item) => {
      const image = item.properties['Image']?.files?.[0]?.file?.url || null;
      const caption = item.properties['Caption']?.rich_text?.[0]?.plain_text || '';
      return { image, caption };
    });

    return { props: { items } };
  } catch (error) {
    return { props: { error: 'Failed to fetch data. Check DB ID or Token.', items: [] } };
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
