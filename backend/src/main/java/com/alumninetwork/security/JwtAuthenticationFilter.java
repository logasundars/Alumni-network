package com.alumninetwork.security;

import com.alumninetwork.entity.User;
import com.alumninetwork.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", header);
        String token = null;
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            token = header.substring(7);
            logger.debug("Extracted token: {}", token);
        }
        if (token != null && jwtUtil.validateToken(token)) {
            String email = jwtUtil.getEmailFromToken(token);
            logger.debug("Token valid. Email from token: {}", email);
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        user, null, null);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("Authentication set for user: {}", email);
            } else {
                logger.debug("User not found for email: {}", email);
            }
        } else {
            logger.debug("Token is null or invalid.");
        }
        filterChain.doFilter(request, response);
    }
} 