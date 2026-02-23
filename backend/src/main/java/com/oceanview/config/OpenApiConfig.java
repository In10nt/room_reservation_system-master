package com.oceanview.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI Configuration
 * Configures Swagger UI documentation
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Ocean View Resort Reservation System API",
        version = "1.0.0",
        description = "RESTful API for hotel room reservation management",
        contact = @Contact(
            name = "Ocean View Resort",
            email = "support@oceanviewresort.lk"
        )
    ),
    servers = {
        @Server(url = "http://localhost:8081", description = "Local Development Server")
    }
)
@SecurityScheme(
    name = "Bearer Authentication",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    scheme = "bearer"
)
public class OpenApiConfig {
}
