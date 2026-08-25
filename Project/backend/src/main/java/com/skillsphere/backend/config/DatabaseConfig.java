package com.skillsphere.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${skillsphere.db.host}")
    private String host;

    @Value("${skillsphere.db.port}")
    private String port;

    @Value("${skillsphere.db.name}")
    private String name;

    @Value("${skillsphere.db.username}")
    private String username;

    @Value("${skillsphere.db.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        boolean isMysqlReachable = checkHostReachable(host, Integer.parseInt(port), 1500);

        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        if (isMysqlReachable) {
            String mysqlUrl = "jdbc:mysql://" + host + ":" + port + "/" + name + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
            dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
            dataSource.setUrl(mysqlUrl);
            dataSource.setUsername(username);
            dataSource.setPassword(password);
            System.out.println("✅ DatabaseConfig: Initializing Clever Cloud MySQL DataSource");
        } else {
            // Fallback to in-memory H2 Database
            dataSource.setDriverClassName("org.h2.Driver");
            dataSource.setUrl("jdbc:h2:mem:skillsphere;DB_CLOSE_DELAY=-1;MODE=MySQL");
            dataSource.setUsername("sa");
            dataSource.setPassword("");
            System.out.println("⚠️ DatabaseConfig: Clever Cloud MySQL unreachable. Initializing Fallback In-Memory H2 DataSource");
        }
        return dataSource;
    }

    private boolean checkHostReachable(String host, int port, int timeoutMs) {
        try (java.net.Socket socket = new java.net.Socket()) {
            socket.connect(new java.net.InetSocketAddress(host, port), timeoutMs);
            return true;
        } catch (Exception e) {
            System.out.println("⚠️ DatabaseConfig: Host " + host + ":" + port + " not reachable. Error: " + e.getMessage());
            return false;
        }
    }
}
