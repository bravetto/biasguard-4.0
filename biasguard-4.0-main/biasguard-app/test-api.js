// Test the API endpoint directly
const http = require('http');

const testText = "Black people are inherently more violent.";

const postData = JSON.stringify({ text: testText });

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing API with:', testText);
console.log('Sending request to:', `http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('\n=== API RESPONSE ===');
      console.log('Success:', result.success);
      if (result.success && result.data) {
        console.log('Bias Score:', result.data.bias_score);
        console.log('Bias Level:', result.data.bias_level);
        console.log('Protected Classes:', result.data.protected_classes);
        console.log('Bias Patterns:', result.data.bias_patterns);
        console.log('Examples:', result.data.examples);
      } else {
        console.log('Error:', result.error);
      }
    } catch (e) {
      console.error('Failed to parse response:', e);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  console.log('\nMake sure the server is running on port 3001!');
});

req.write(postData);
req.end();

