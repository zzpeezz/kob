package com.kob.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    public static final long JWT_TTL = 1000L * 60 * 60 * 24 * 14; // 14天

    // ⚠️ HS256 的 key 至少 32 字节（256 bit），否则会 WeakKeyException
    public static final String JWT_KEY = "SDFGjhdsfalshdfHFdsjkdsfds121232131afasdfac";

    public static String getUUID() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    public static String createJWT(String subject) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date exp = new Date(nowMillis + JWT_TTL);

        return Jwts.builder()
                .id(getUUID())
                .subject(subject)
                .issuer("sg")
                .issuedAt(now)
                .expiration(exp)
                .signWith(secretKey())     // ✅ 0.13 推荐
                .compact();
    }

    public static Claims parseJWT(String jwt) {
        return Jwts.parser()
                .verifyWith(secretKey())   // ✅ 0.13 推荐
                .build()
                .parseSignedClaims(jwt)    // ✅ 解析并验签（JWS + Claims）
                .getPayload();             // ✅ 取 Claims
    }

    private static SecretKey secretKey() {
        return Keys.hmacShaKeyFor(JWT_KEY.getBytes(StandardCharsets.UTF_8));
    }
}
