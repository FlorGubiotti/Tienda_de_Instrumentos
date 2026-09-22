# Etapa de build: compila el jar con Gradle
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x gradlew && ./gradlew bootJar --no-daemon

# Etapa de ejecución: solo el JRE y el jar ya compilado, imagen final más chica
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/build/libs/TiendaDeMusica-0.0.1-SNAPSHOT.jar app.jar

# Render pisa esto con la variable PORT en runtime (ver server.port en application.properties)
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
