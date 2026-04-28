plugins {
    java
    id("org.springframework.boot") version "4.0.0"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.taskmanagement"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
    maven { url = uri("https://repo.spring.io/milestone") }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")

    runtimeOnly("org.postgresql:postgresql:42.7.4")
    runtimeOnly("com.h2database:h2")

    implementation("org.flywaydb:flyway-core:11.3.0")
    implementation("org.flywaydb:flyway-database-postgresql:11.3.0")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
