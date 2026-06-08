FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_BASE_URL

ENV VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2hhcm1pbmctc25pcGUtMTkuY2xlcmsuYWNjb3VudHMuZGV2JA
ENV VITE_BASE_URL=http://localhost:8080

RUN npm run build

RUN npm install -g serve

EXPOSE 5001

CMD ["serve", "-s", "dist", "-l", "5001"]