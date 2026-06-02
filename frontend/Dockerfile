FROM node:lts-alpine3.23 AS build-env
WORKDIR /src/
COPY . ./
ARG VITE_BASE_URL
ENV VITE_BASE_URL="/api"
RUN npm install
RUN npm run build

FROM nginx:stable-alpine3.23-perl
WORKDIR /usr/app
COPY --from=build-env /src/dist/ /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]