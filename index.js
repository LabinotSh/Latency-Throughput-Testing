const autocannon = require("autocannon");
const fs = require("fs");

const payload = JSON.parse(fs.readFileSync("./payload.json", "utf8"));
const payloadBody = require("./payload.json");

function runTest(connections, duration) {
  console.log("payload :>> ", payload);
  return new Promise((resolve) => {
    const instance = autocannon({
      url: payloadBody.API,
      method: "POST",
      connections,
      duration,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_base64: payload.image,
        remove_background: true,
      }),
    });

    instance.on("done", (result) => resolve(result));
  });
}

function runRPSTest() {
  return new Promise((resolve) => {
    const instance = autocannon({
      url: payloadBody.API,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      // 🔥 THIS is the key part
      overallRate: 10, // try 10, then 15, then 20
      duration: 120,
      connections: 100, // allow enough concurrency
      timeout: 15000,
      body: JSON.stringify({
        image_base64: payload.image,
        remove_background: true,
      }),
    });
    instance.on("done", (result) => resolve(result));
  });
}

(async () => {
  console.log("Warming up...");
  //   await runTest(1, 10);

  console.log("Running test...");
  //   const result = await runTest(10, 120);

  const result = await runRPSTest();

  console.log("result 2222:>> ", result);
  console.log("--- METRICS ---");
  console.log("Avg latency (ms):", result.latency.average);
  console.log("p95 latency (ms):", result.latency.p95);
  console.log("p99 latency (ms):", result.latency.p99);
  console.log("Throughput (req/sec):", result.requests.average);
  console.log("Total requests:", result.requests.total);
  console.log("Completed requests:", result.requests.completed);
  console.log("Errors:", result.errors);
})();
// 🧠 HOW TO INTERPRET (AI API CONTEXT)
// Metric	What it tells you
// Avg latency	Overall performance
// p95 / p99	Tail latency (MOST IMPORTANT)
// Req/sec	Throughput
// Errors > 0	API saturation / throttling

// If:
// p95 skyrockets → GPU / queue bottleneck
// Throughput plateaus → backend maxed out
// Errors increase → rate limit or timeouts
