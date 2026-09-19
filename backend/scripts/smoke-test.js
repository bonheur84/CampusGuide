const http = require('http');

const baseUrl = 'http://localhost:3001';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${baseUrl}${path}`, {
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function main() {
  try {
    const health = await request('/');
    console.log('HEALTH', health.statusCode, health.body);

    const mentors = await request('/api/mentors');
    console.log('MENTORS', mentors.statusCode, mentors.body.substring(0, 120));

    const clubs = await request('/api/clubs');
    console.log('CLUBS', clubs.statusCode, clubs.body.substring(0, 120));

    const evenements = await request('/api/evenements');
    console.log('EVENEMENTS', evenements.statusCode, evenements.body.substring(0, 120));

    if (health.statusCode !== 200) {
      throw new Error('Health check failed');
    }

    console.log('SMOKE_TEST_OK');
  } catch (error) {
    console.error('SMOKE_TEST_FAIL', error.message);
    process.exit(1);
  }
}

main();
