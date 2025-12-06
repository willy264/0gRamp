0G-Ramp Monorepo

Quickstart
- Backend: `cd backend && npm run dev` (listens on `http://localhost:3001`).
- Contracts: `cd contracts && npm run compile` then `npx hardhat node` in one shell and `npm run deploy -- --network localhost` in another.
- Frontend: `cd frontend && npm run dev` (open the printed URL).

Docker Compose (optional)
- Requirements: Docker Desktop.
- Run: `docker compose up -d` from the repo root.
- Services:
  - `contracts-node`: Hardhat JSON-RPC on `http://localhost:8545`.
  - `contracts-deploy`: one-off deployment to the `docker` network (logs contract addresses).
  - `backend`: Express API on `http://localhost:3001`.

Environment
- Backend `.env` already includes `PORT=3001` and a SQLite `DATABASE_URL`.
- If you want the backend to reference on-chain data, add contract addresses printed by deployment.

Hardhat Scripts
- `npm run deploy` deploys all contracts.
- `npm run deposit` approves and deposits MockUSDC into the vault.
- `npm run withdraw` withdraws MockUSDC to a recipient.
- `npm run receipt` registers a receipt CID in `ReceiptRegistry`.

Notes
- Contracts use Solidity `0.8.23` with optimizer.
- Hardhat is configured for both `localhost` and Docker (`docker`).