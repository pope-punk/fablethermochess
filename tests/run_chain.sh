#!/bin/bash
# Sequential measurement chain; each stage logs and continues on failure.
cd /home/user/fablethermochess/tests
echo "=== CHAIN START $(date -u +%H:%M:%S) ==="
echo "--- stage 1: oracle sanity (cur vs material oracle, 8 games, 500ms) ---"
node match.js cur ref 8 500
echo "=== stage 1 done $(date -u +%H:%M:%S) ==="
echo "--- stage 2: SF-1500 rebaseline (12 games, 1000ms) ---"
node vs_stockfish.js 1500 1000 200 results/vs_sf1500_v3.json
echo "=== stage 2 done $(date -u +%H:%M:%S) ==="
echo "--- stage 3: cooling scan (self-play, 4 rungs) ---"
node cooling_scan.js
echo "=== stage 3 done $(date -u +%H:%M:%S) ==="
echo "--- stage 4: SF-1600 ladder (12 games, 1000ms) ---"
node vs_stockfish.js 1600 1000 200 results/vs_sf1600.json
echo "=== CHAIN COMPLETE $(date -u +%H:%M:%S) ==="
