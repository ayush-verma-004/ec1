# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first (cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Optimizing for low-memory environments (Render Free Tier)
# -Xmx350m: Sets max heap size to leave room for off-heap and metaspace
# -XX:+UseSerialGC: More CPU efficient for small heaps
ENV JAVA_OPTS="-Xmx350m -XX:+UseSerialGC -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
