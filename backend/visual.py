import os
import cv2
import numpy as np
import requests
import base64
from inference_sdk import InferenceHTTPClient

class WallFloorReplacer:
    def __init__(self, api_key):
        """
        Initialize the Wall and Floor Replacer with Roboflow API key

        Args:
            api_key (str): Roboflow API key
        """
        self.api_key = api_key
        # Initialize the Roboflow client
        self.client = InferenceHTTPClient(
            api_url="https://serverless.roboflow.com",
            api_key=api_key
        )

    def encode_image_to_base64(self, image_path):
        """
        Encode image to base64 for API request

        Args:
            image_path (str): Path to the image file

        Returns:
            str: Base64 encoded image
        """
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    def detect_objects(self, image_path, model_id="wall_floor-i5ljr/2"):
        """
        Detect walls and floors using Roboflow Inference SDK

        Args:
            image_path (str): Path to input image
            model_id (str): Roboflow model ID

        Returns:
            dict: Detection results from API
        """
        try:
            # Use the inference SDK to get predictions
            result = self.client.infer(image_path, model_id=model_id)
            print(f"Raw API response: {result}")
            return result

        except Exception as e:
            print(f"Error with inference SDK: {e}")
            # Fallback to old method if SDK fails
            return self.detect_objects_fallback(image_path, model_id)

    def detect_objects_fallback(self, image_path, model_id="wall_floor-i5ljr/2"):
        """
        Fallback detection method using direct API calls

        Args:
            image_path (str): Path to input image
            model_id (str): Roboflow model ID

        Returns:
            dict: Detection results from API
        """
        # Encode image
        image_b64 = self.encode_image_to_base64(image_path)

        # Prepare API request for serverless endpoint
        url = f"https://serverless.roboflow.com/{model_id}"
        params = {
            "api_key": self.api_key,
            "format": "json"
        }

        # Send request
        response = requests.post(
            url,
            params=params,
            data=image_b64,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API request failed: {response.status_code} - {response.text}")

    def create_mask_from_polygon(self, image_shape, points):
        """
        Create a binary mask from polygon points

        Args:
            image_shape (tuple): Shape of the image (height, width)
            points (list): List of polygon points

        Returns:
            numpy.ndarray: Binary mask
        """
        mask = np.zeros(image_shape[:2], dtype=np.uint8)

        # Convert points to proper format
        if isinstance(points[0], dict):
            # Points are in format [{'x': x1, 'y': y1}, ...]
            pts = np.array([[point['x'], point['y']] for point in points], np.int32)
        else:
            # Points are in format [[x1, y1], [x2, y2], ...]
            pts = np.array(points, np.int32)

        # Fill polygon
        cv2.fillPoly(mask, [pts], 255)
        return mask

    def create_mask_from_bbox(self, image_shape, bbox):
        """
        Create a binary mask from bounding box

        Args:
            image_shape (tuple): Shape of the image (height, width)
            bbox (dict): Bounding box with x, y, width, height

        Returns:
            numpy.ndarray: Binary mask
        """
        mask = np.zeros(image_shape[:2], dtype=np.uint8)

        # Calculate bounding box coordinates
        x = int(bbox['x'] - bbox['width'] / 2)
        y = int(bbox['y'] - bbox['height'] / 2)
        w = int(bbox['width'])
        h = int(bbox['height'])

        # Ensure coordinates are within image bounds
        x = max(0, x)
        y = max(0, y)
        w = min(w, image_shape[1] - x)
        h = min(h, image_shape[0] - y)

        # Fill rectangle
        mask[y:y + h, x:x + w] = 255
        return mask

    def resize_texture(self, texture_image, target_shape):
        """
        Resize texture image to match target area

        Args:
            texture_image (numpy.ndarray): Texture image
            target_shape (tuple): Target shape (height, width)

        Returns:
            numpy.ndarray: Resized texture
        """
        return cv2.resize(texture_image, (target_shape[1], target_shape[0]))

    def apply_texture_with_perspective(self, original_image, mask, texture_image, blend_mode='replace'):
        """
        Apply texture to masked area with various blending options

        Args:
            original_image (numpy.ndarray): Original image
            mask (numpy.ndarray): Binary mask
            texture_image (numpy.ndarray): Texture to apply
            blend_mode (str): 'replace', 'blend', or 'overlay'

        Returns:
            numpy.ndarray: Image with applied texture
        """
        result = original_image.copy()

        # Find contours of the mask
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            if cv2.contourArea(contour) < 500:  # Skip very small areas
                continue

            # Get bounding rectangle
            x, y, w, h = cv2.boundingRect(contour)

            # Ensure coordinates are within image bounds
            x = max(0, x)
            y = max(0, y)
            w = min(w, original_image.shape[1] - x)
            h = min(h, original_image.shape[0] - y)

            if w <= 0 or h <= 0:
                continue

            # Create mask for this specific contour
            contour_mask = np.zeros_like(mask)
            cv2.fillPoly(contour_mask, [contour], 255)

            # Resize texture to fit the bounding rectangle
            resized_texture = cv2.resize(texture_image, (w, h))

            # Apply texture only to the masked area
            roi = result[y:y + h, x:x + w]
            roi_mask = contour_mask[y:y + h, x:x + w]

            # Convert mask to 3-channel for blending
            roi_mask_3ch = np.stack([roi_mask] * 3, axis=-1) / 255.0

            if blend_mode == 'replace':
                # Complete replacement
                roi = np.where(roi_mask_3ch > 0, resized_texture, roi)
            elif blend_mode == 'blend':
                # Alpha blending
                alpha = 0.8
                roi = np.where(roi_mask_3ch > 0,
                               roi * (1 - alpha) + resized_texture * alpha,
                               roi)
            elif blend_mode == 'overlay':
                # Overlay blending
                roi = np.where(roi_mask_3ch > 0,
                               np.clip(roi * resized_texture / 128.0, 0, 255),
                               roi)

            result[y:y + h, x:x + w] = roi.astype(np.uint8)

        return result

    def adjust_brightness(self, original_image, result_image, mask):
        """
        Giữ lại ánh sáng gốc bằng cách phối sáng từ original_image lên các vùng đã thay texture.

        Args:
            original_image (numpy.ndarray): Ảnh gốc
            result_image (numpy.ndarray): Ảnh sau khi dán texture
            mask (numpy.ndarray): Mask vùng được thay thế

        Returns:
            numpy.ndarray: Ảnh sau khi phối sáng
        """
        # Convert to float32 for blending
        original_float = original_image.astype(np.float32)
        result_float = result_image.astype(np.float32)

        # Normalize mask to [0,1]
        norm_mask = (mask / 255.0).astype(np.float32)
        norm_mask_3ch = np.stack([norm_mask] * 3, axis=-1)

        # Blend texture (result) with original lighting
        blended = result_float * norm_mask_3ch + original_float * (1 - norm_mask_3ch)

        return blended.clip(0, 255).astype(np.uint8)
    def tile_texture_to_fit(self, mask_shape, tile_texture, tile_size=(100, 100)):
        h, w = mask_shape
        tile_w, tile_h = tile_size
        tile = cv2.resize(tile_texture, (tile_w, tile_h))
        reps_x = (w + tile_w - 1) // tile_w
        reps_y = (h + tile_h - 1) // tile_h
        tiled = np.tile(tile, (reps_y, reps_x, 1))
        return tiled[:h, :w]

    def rotate_image(self, image, angle_degrees):
        h, w = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle_degrees, 1.0)
        rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        return rotated

    def apply_texture_with_perspective(self, original_image, mask, texture_image, blend_mode='replace'):
        result = original_image.copy()
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            if cv2.contourArea(contour) < 500:
                continue

            x, y, w, h = cv2.boundingRect(contour)
            x = max(0, x)
            y = max(0, y)
            w = min(w, original_image.shape[1] - x)
            h = min(h, original_image.shape[0] - y)
            if w <= 0 or h <= 0:
                continue

            contour_mask = np.zeros_like(mask)
            cv2.fillPoly(contour_mask, [contour], 255)
            roi_mask = contour_mask[y:y + h, x:x + w]

            roi = result[y:y + h, x:x + w].astype(np.float32)
            roi_mask_f = (roi_mask / 255.0).astype(np.float32)
            mask_3ch = np.stack([roi_mask_f] * 3, axis=-1)

            # Đảm bảo texture khớp kích thước roi
            roi_h, roi_w = roi.shape[:2]
            tex_h, tex_w = texture_image.shape[:2]
            if (roi_h, roi_w) != (tex_h, tex_w):
                resized_texture = cv2.resize(texture_image, (roi_w, roi_h)).astype(np.float32)
            else:
                resized_texture = texture_image.astype(np.float32)

            if blend_mode == 'replace':
                blended = np.where(mask_3ch > 0, resized_texture, roi)
            elif blend_mode == 'blend':
                alpha = 0.7
                blended = np.where(mask_3ch > 0, roi * (1 - alpha) + resized_texture * alpha, roi)
            elif blend_mode == 'overlay':
                blended = np.where(mask_3ch > 0, np.clip(roi * resized_texture / 255.0, 0, 255), roi)
            else:
                raise ValueError(f"Blend mode '{blend_mode}' không hợp lệ")

            result[y:y + h, x:x + w] = blended.astype(np.uint8)

        return result

    def process_with_predictions(self, input_image_path, floor_texture_path, wall_texture_path,
                                 predictions, output_path, confidence_threshold=0.5):
        image = cv2.imread(input_image_path)
        floor_texture = cv2.imread(floor_texture_path)
        wall_texture = cv2.imread(wall_texture_path)
        result = image.copy()
        combined_mask = np.zeros(image.shape[:2], dtype=np.uint8)

        for pred in predictions:
            if pred.get("confidence", 0) < confidence_threshold:
                continue
            if "points" in pred:
                mask = self.create_mask_from_polygon(image.shape, pred["points"])
                pts = np.array([[p["x"], p["y"]] for p in pred["points"]], dtype=np.int32)
                x, y, w, h = cv2.boundingRect(pts)
            else:
                mask = self.create_mask_from_bbox(image.shape, pred)
                x, y, w, h = 0, 0, image.shape[1], image.shape[0]

            combined_mask = cv2.bitwise_or(combined_mask, mask)

            if pred["class"].lower() == "floor":
                canvas_size = int(np.ceil(np.sqrt(h ** 2 + w ** 2))) * 2
                tile_canvas = self.tile_texture_to_fit((canvas_size, canvas_size), floor_texture, tile_size=(80, 80))

                contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                angle = 0
                if contours:
                    rect = cv2.minAreaRect(contours[0])
                    angle = rect[-1]
                    if angle < -45:
                        angle += 90
                    print(f"Detected floor angle: {angle:.2f} degrees")

                rotated_tile = self.rotate_image(tile_canvas, angle)

                center_y, center_x = rotated_tile.shape[0] // 2, rotated_tile.shape[1] // 2
                start_y = center_y - h // 2
                start_x = center_x - w // 2
                cropped_tile = rotated_tile[start_y:start_y + h, start_x:start_x + w]

                if cropped_tile.shape[:2] != (h, w):
                    cropped_tile = cv2.resize(cropped_tile, (w, h))

                result = self.apply_texture_with_perspective(result, mask, cropped_tile, blend_mode="blend")

            elif pred["class"].lower() == "wall":
                result = self.apply_texture_with_perspective(result, mask, wall_texture, blend_mode="overlay")

        result = self.adjust_brightness(image, result, combined_mask)
        cv2.imwrite(output_path, result)
        return result



    

    def visualize_detections(self, input_image_path, output_path, model_id="wall_floor-i5ljr/2"):
        """
        Visualize detections without texture replacement

        Args:
            input_image_path (str): Path to input image
            output_path (str): Path to save visualization
            model_id (str): Roboflow model ID
        """
        # Load image
        image = cv2.imread(input_image_path)
        if image is None:
            raise ValueError("❌ Không đọc được ảnh đầu vào")

        # Get detections
        detections = self.detect_objects(input_image_path, model_id)
        predictions = detections.get("predictions", [])

        # Draw detections
        for detection in predictions:
            class_name = detection['class']
            confidence = detection.get('confidence', 0)

            if 'points' in detection:
                # Draw polygon
                points = np.array([[point['x'], point['y']] for point in detection['points']], np.int32)
                cv2.polylines(image, [points], True, (0, 255, 0), 2)
                # Add label at centroid
                M = cv2.moments(points)
                if M["m00"] != 0:
                    cx = int(M["m10"] / M["m00"])
                    cy = int(M["m01"] / M["m00"])
                else:
                    cx, cy = int(detection.get('x', 0)), int(detection.get('y', 0))
            else:
                # Draw bounding box
                x = int(detection['x'] - detection['width'] / 2)
                y = int(detection['y'] - detection['height'] / 2)
                w = int(detection['width'])
                h = int(detection['height'])
                cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cx, cy = int(detection['x']), int(detection['y'])

            # Add label
            label = f"{class_name}: {confidence:.2f}"
            cv2.putText(image, label, (cx - 50, cy),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(image, label, (cx - 50, cy),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 1)

        # Save to output_path
        success = cv2.imwrite(output_path, image)
        if not success:
            raise Exception(f"❌ Không thể lưu ảnh tại {output_path}")

        return image, predictions



