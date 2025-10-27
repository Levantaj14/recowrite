FROM node:lts-jod AS build-env
WORKDIR /src/
COPY . ./
ARG VITE_BASE_URL
ENV VITE_BASE_URL="/api"
RUN npm install
RUN npm run build

FROM nginx:trixie-perl
WORKDIR /usr/app
COPY --from=build-env /src/dist/ /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]