import { performance } from "node:perf_hooks";

// const URL = "https://external-api.com/generate";
const payloadBody = require("./payload.json");
const payload = JSON.parse(fs.readFileSync("./payload.json", "utf8"));
const URL = payloadBody.API;

//Latency
async function testLatency() {
  const start = performance.now();

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_base64: payload.image,
      remove_background: true,
    }),
  });

  console.log("response  222:>> ", response);

  await response.json();

  const end = performance.now();
  console.log(`Latency: ${(end - start).toFixed(2)} ms`);
}

// testLatency();

//Throughput
async function throughputTest(concurrency = 10) {
  const start = performance.now();

  const requests = Array.from({ length: concurrency }, () =>
    fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: "BASE64" }),
    })
  );

  await Promise.all(requests);

  const end = performance.now();
  console.log(
    `Throughput test (${concurrency} req): ${(end - start).toFixed(2)} ms`
  );
}

// throughputTest(20);

//average p99, p95 latency
async function runTests(iterations = 10) {
  const times = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fetch(URL, options);
    times.push(performance.now() - start);
  }

  times.sort((a, b) => a - b);

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const p95 = times[Math.floor(times.length * 0.95)];
  const p99 = times[Math.floor(times.length * 0.99)];

  console.log({ avg, p95, p99 });
}

runTests();
