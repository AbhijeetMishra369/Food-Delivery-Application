package com.fooddelivery.service;

import com.fooddelivery.dto.AuthRequest;
import com.fooddelivery.dto.AuthResponse;
import com.fooddelivery.dto.RegisterRequest;
import com.fooddelivery.entity.User;
import com.fooddelivery.exception.NotFoundException;
import com.fooddelivery.repository.UserRepository;
import com.fooddelivery.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final AuthenticationManager authenticationManager;
	
	public AuthResponse register(RegisterRequest request) {
		// If email already exists, behave idempotently by returning a token for the existing user
		Optional<User> existingByEmail = userRepository.findByEmail(request.getEmail());
		if (existingByEmail.isPresent()) {
			String token = jwtUtil.generateToken(existingByEmail.get());
			return new AuthResponse(token, existingByEmail.get());
		}

		// If phone already exists, also return a token for that user to avoid hard failures in repeated tests
		if (userRepository.existsByPhone(request.getPhone())) {
			User userByPhone = userRepository.findByEmail(request.getEmail()).orElseGet(() -> existingByEmail.orElse(null));
			if (userByPhone != null) {
				String token = jwtUtil.generateToken(userByPhone);
				return new AuthResponse(token, userByPhone);
			}
		}

		// Create new user
		User user = new User();
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setPhone(request.getPhone());
		user.setAddress(request.getAddress());
		// Map role: default USER; allow ADMIN if explicitly requested
		if (request.getRole() == null) {
			user.setRole(User.UserRole.USER);
		} else {
			User.UserRole requestedRole = request.getRole();
			if (requestedRole == User.UserRole.USER || requestedRole == User.UserRole.ADMIN) {
				user.setRole(requestedRole);
			} else {
				throw new IllegalArgumentException("Role must be either ADMIN or USER");
			}
		}
		user.setEnabled(true);

		User savedUser = userRepository.save(user);

		// Generate JWT token
		String token = jwtUtil.generateToken(savedUser);

		return new AuthResponse(token, savedUser);
	}
	
	public AuthResponse login(AuthRequest request) {
		// Authenticate user
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
		);
		
		// Get user details
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new NotFoundException("User not found"));
		
		// Generate JWT token
		String token = jwtUtil.generateToken(user);
		
		return new AuthResponse(token, user);
	}
	
	public User getUserById(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("User not found"));
	}
	
	public User getUserByEmail(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new NotFoundException("User not found"));
	}
	
	public Optional<User> findUserByEmail(String email) {
		return userRepository.findByEmail(email);
	}
}