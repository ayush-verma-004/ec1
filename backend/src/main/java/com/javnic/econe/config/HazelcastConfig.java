package com.javnic.econe.config;

import com.hazelcast.config.*;
import com.hazelcast.core.Hazelcast;
import com.hazelcast.core.HazelcastInstance;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class HazelcastConfig {

    @Bean
    public HazelcastInstance hazelcastInstance() {
        Config config = new Config();
        config.setClusterName("econe-dev-cluster");

        // Define map configurations
        config.addMapConfig(carbonCreditsMapConfig());
        config.addMapConfig(marketplaceListingsMapConfig());
        config.addMapConfig(farmersMapConfig());
        config.addMapConfig(landsMapConfig());
        config.addMapConfig(businessmanMapConfig());
        config.addMapConfig(ngosMapConfig());
        config.addMapConfig(governmentMapConfig());
        config.addMapConfig(defaultMapConfig());

        // Network configuration for embedded mode but ready for clustering
        NetworkConfig network = config.getNetworkConfig();
        network.setPort(5701)
                .setPortAutoIncrement(true);

        JoinConfig join = network.getJoin();
        join.getMulticastConfig().setEnabled(false); // Disable multicast for simple local/cloud setup
        join.getTcpIpConfig().setEnabled(true)
                .addMember("127.0.0.1"); // Default to localhost for now

        return Hazelcast.newHazelcastInstance(config);
    }

    private MapConfig carbonCreditsMapConfig() {
        MapConfig mapConfig = new MapConfig("carbonCredits");
        mapConfig.setTimeToLiveSeconds(600); // 10 minutes TTL
        mapConfig.setMaxIdleSeconds(300); // 5 minutes max idle

        EvictionConfig evictionConfig = mapConfig.getEvictionConfig();
        evictionConfig.setEvictionPolicy(EvictionPolicy.LRU);
        evictionConfig.setMaxSizePolicy(MaxSizePolicy.PER_NODE);
        evictionConfig.setSize(1000);

        return mapConfig;
    }

    private MapConfig marketplaceListingsMapConfig() {
        MapConfig mapConfig = new MapConfig("marketplaceListings");
        mapConfig.setTimeToLiveSeconds(300); // 5 minutes TTL

        EvictionConfig evictionConfig = mapConfig.getEvictionConfig();
        evictionConfig.setEvictionPolicy(EvictionPolicy.LRU);
        evictionConfig.setMaxSizePolicy(MaxSizePolicy.PER_NODE);
        evictionConfig.setSize(500);

        return mapConfig;
    }

    private MapConfig farmersMapConfig() {
        MapConfig mapConfig = new MapConfig("farmers");
        mapConfig.setTimeToLiveSeconds(1800); // 30 minutes TTL

        EvictionConfig evictionConfig = mapConfig.getEvictionConfig();
        evictionConfig.setEvictionPolicy(EvictionPolicy.LRU);
        evictionConfig.setMaxSizePolicy(MaxSizePolicy.PER_NODE);
        evictionConfig.setSize(2000);

        return mapConfig;
    }

    private MapConfig landsMapConfig() {
        MapConfig mapConfig = new MapConfig("lands");
        mapConfig.setTimeToLiveSeconds(1800); // 30 minutes TTL

        EvictionConfig evictionConfig = mapConfig.getEvictionConfig();
        evictionConfig.setEvictionPolicy(EvictionPolicy.LRU);
        evictionConfig.setMaxSizePolicy(MaxSizePolicy.PER_NODE);
        evictionConfig.setSize(5000);

        return mapConfig;
    }

    private MapConfig defaultMapConfig() {
        MapConfig mapConfig = new MapConfig("default");
        mapConfig.setTimeToLiveSeconds(300);
        return mapConfig;
    }

    private MapConfig businessmanMapConfig() {
        MapConfig mapConfig = new MapConfig("businessmen");
        mapConfig.setTimeToLiveSeconds(1800); // 30 minutes TTL

        EvictionConfig evictionConfig = mapConfig.getEvictionConfig();
        evictionConfig.setEvictionPolicy(EvictionPolicy.LRU);
        evictionConfig.setMaxSizePolicy(MaxSizePolicy.PER_NODE);
        evictionConfig.setSize(2000);

        return mapConfig;
    }

    private MapConfig ngosMapConfig() {
        MapConfig mapConfig = new MapConfig("ngos");
        mapConfig.setTimeToLiveSeconds(1800); // 30 minutes TTL

        EvictionConfig evictionConfig = mapConfig.getEvictionConfig();
        evictionConfig.setEvictionPolicy(EvictionPolicy.LRU);
        evictionConfig.setMaxSizePolicy(MaxSizePolicy.PER_NODE);
        evictionConfig.setSize(500);

        return mapConfig;
    }

    private MapConfig governmentMapConfig() {
        MapConfig mapConfig = new MapConfig("government");
        mapConfig.setTimeToLiveSeconds(1800); // 30 minutes TTL

        EvictionConfig evictionConfig = mapConfig.getEvictionConfig();
        evictionConfig.setEvictionPolicy(EvictionPolicy.LRU);
        evictionConfig.setMaxSizePolicy(MaxSizePolicy.PER_NODE);
        evictionConfig.setSize(100);

        return mapConfig;
    }
}
