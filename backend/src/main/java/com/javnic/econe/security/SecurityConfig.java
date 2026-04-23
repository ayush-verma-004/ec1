package com.javnic.econe.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/api/health")
                        .permitAll()
                        .requestMatchers("/api/government/**").hasAuthority("ROLE_GOVERNMENT")
                        .requestMatchers("/api/ngo/**").hasAuthority("ROLE_NGO")
                        .requestMatchers("/api/ngo-land/**").hasAuthority("ROLE_NGO")
                        .requestMatchers("/api/farmer/**").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/api/farmer-land/**").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/api/businessman/**").hasAuthority("ROLE_BUSINESSMAN")
                        .requestMatchers("/api/farmer-carbon/**").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/api/farmer-transaction/**").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/api/ngo-carbon/**").hasAuthority("ROLE_NGO")
                        .requestMatchers("/api/businessman-carbon/**").hasAuthority("ROLE_BUSINESSMAN")
                        .requestMatchers("/api/businessman-transaction/**").hasAuthority("ROLE_BUSINESSMAN")
                        .requestMatchers("/api/government-carbon/**").hasAuthority("ROLE_GOVERNMENT")
                        .requestMatchers("/api/government-transaction/**").hasAuthority("ROLE_GOVERNMENT")
                        .requestMatchers("/api/marketplace/listings", "/api/marketplace/stats").permitAll()
                        .requestMatchers("/api/marketplace/**").authenticated()
                        .requestMatchers("/api/transaction/**").authenticated()
                        .requestMatchers("/api/profile/**").authenticated()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
