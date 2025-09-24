const express = require('express');
const neo4j = require('neo4j-driver');
const os = require('os');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const uri = process.env.NEO4J_URI || 'bolt://neo4j:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const pass = process.env.NEO4J_PASSWORD || 'neo4jpassword';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, pass));

app.get('/', (req, res) => {
  res.json({ message: 'hello from api', host: os.hostname() });
});

app.get('/health', async (req, res) => {
  try {
    const session = driver.session();
    await session.run('RETURN 1 as ok');
    await session.close();
    res.status(200).json({ status: 'ok', host: os.hostname() });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.get('/entities', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run('MATCH (e:Entity) RETURN e LIMIT 100');
    const rows = result.records.map(r => r.get('e').properties);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

app.post('/entities', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const session = driver.session();
  try {
    const result = await session.run('CREATE (e:Entity {name:$name}) RETURN e', { name });
    const node = result.records[0].get('e').properties;
    res.status(201).json(node);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

process.on('SIGINT', async () => {
  await driver.close();
  process.exit(0);
});

app.listen(port, () => console.log(`API listening on ${port}`));
