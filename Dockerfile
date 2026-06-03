FROM node:20

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile

RUN cd artifacts/api-server && pnpm build

CMD ["sh", "-c", "cd artifacts/api-server && pnpm start"]