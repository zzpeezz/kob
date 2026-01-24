package com.kob.backend.config.filter;

import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import com.kob.backend.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {

    private final UserMapper userMapper;

    public JwtAuthenticationTokenFilter(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // 没有 token：直接放行（交给后面的 Security 配置决定哪些接口需要登录）
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();
        if (!StringUtils.hasText(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Claims claims = JwtUtil.parseJWT(token);
            String userIdStr = claims.getSubject();

            if (!StringUtils.hasText(userIdStr)) {
                unauthorized(response, "Invalid token: missing subject");
                return;
            }

            int userId;
            try {
                userId = Integer.parseInt(userIdStr);
            } catch (NumberFormatException ex) {
                unauthorized(response, "Invalid token: subject is not a user id");
                return;
            }

            User user = userMapper.selectById(userId);
            if (user == null) {
                unauthorized(response, "User not found");
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetailsImpl loginUser = new UserDetailsImpl(user);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                loginUser,
                                null,
                                loginUser.getAuthorities()
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            unauthorized(response, "Token expired");
        } catch (JwtException e) {
            unauthorized(response, "Invalid token");
        }
    }

    private void unauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"error\":\"" + message + "\"}");
    }
}
