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
# -Xmx350m: Sets max heap size
# -Djava.net.preferIPv4Stack=true: Helps with connection issues in some cloud VPCs
ENV JAVA_OPTS="-Xmx350m -XX:+UseSerialGC -Djava.net.preferIPv4Stack=true -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
