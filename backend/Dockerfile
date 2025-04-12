FROM gradle:8.13.0-jdk-jammy AS build-env
WORKDIR /src/
COPY . ./
RUN gradle --no-daemon build jar

FROM eclipse-temurin:24-jre-alpine
WORKDIR /usr/app
COPY --from=build-env /src/build/libs/backend.jar ./
RUN mkdir -p uploads
CMD ["java", "-jar", "backend.jar"]