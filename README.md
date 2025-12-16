Throughput & Latency Test 
for POST endpoint (customizable)

This repository contains Node.js scripts to test the latency and throughput of an external API that generates 3D models from images (base64-encoded). It provides both regular Node.js testing and Autocannon-based load testing.

Features
Single request latency measurement
Measures the time it takes for one API request to complete.
Useful for understanding baseline response times.
Concurrent requests (throughput) testing
Simulates multiple requests in parallel.
Measures requests per second (RPS), success/failure rate, and total time.
Autocannon-based load testing
Production-grade benchmarking.
Supports high concurrency and duration.
Provides detailed metrics: average latency, percentiles, throughput, and errors.

