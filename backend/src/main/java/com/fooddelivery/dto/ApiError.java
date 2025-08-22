package com.fooddelivery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiError {
	private LocalDateTime timestamp;
	private int status;
	private String error;
	private String message;
	private String path;
	private String code; // optional error code
	private Map<String, String> fieldErrors;
}