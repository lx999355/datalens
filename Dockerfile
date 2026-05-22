FROM node:20-alpine

WORKDIR /app

# 复制 standalone 输出
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# 复制 prisma schema（运行时需要）
COPY prisma ./prisma

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
