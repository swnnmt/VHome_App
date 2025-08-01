from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from visual import WallFloorReplacer
import cv2
import numpy as np
import tempfile
import os
import json
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = ".... api"
replacer = WallFloorReplacer(api_key=API_KEY)

def save_upload_file(upload_file: UploadFile) -> str:
    suffix = os.path.splitext(upload_file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(upload_file.file.read())
        return tmp.name

def create_blank_image(path: str):
    blank = np.ones((10, 10, 3), dtype=np.uint8) * 255
    cv2.imwrite(path, blank)
    

@app.post("/detect")
async def detect(image: UploadFile = File(...)):
    try:
        # B1: Lưu ảnh upload vào file tạm
        input_path = save_upload_file(image)
        print(f"📥 Nhận ảnh từ client: {input_path}")

        # B2: Gọi visualize_detections (trả về ảnh + danh sách predictions)
        visualized_path = input_path + "_viz.jpg"
        image_np, predictions = replacer.visualize_detections(input_path, visualized_path)
        print(f"✅ Phát hiện {len(predictions)} vùng tường/sàn")

        # B3: Mã hóa ảnh kết quả (sau khi vẽ box) sang base64
        success, encoded_img = cv2.imencode(".jpg", image_np)
        if not success:
            raise Exception("❌ Không thể mã hóa ảnh")

        img_base64 = base64.b64encode(encoded_img.tobytes()).decode("utf-8")

        # B4: Trả kết quả về frontend
        return {
            "predictions": predictions,
            "image": img_base64
        }

    except Exception as e:
        print(f"❌ Lỗi trong quá trình xử lý /detect: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
@app.get("/solid_color_image")
def solid_color_image(hex: str):
    try:
        hex = hex.strip("#")
        rgb = tuple(int(hex[i:i+2], 16) for i in (0, 2, 4))
        img = np.full((50, 50, 3), rgb, dtype=np.uint8)
        _, img_encoded = cv2.imencode(".jpg", img)
        return Response(content=img_encoded.tobytes(), media_type="image/jpeg")
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/render_with_masks")
async def render_with_masks(
    image: UploadFile = File(...),
    floor_texture: UploadFile = File(None),
    wall_texture: UploadFile = File(None),
    predictions: str = Form(...)  # JSON dạng string từ client
):
    try:
        # Tạo file tạm từ ảnh và texture
        input_path = save_upload_file(image)
        floor_path = save_upload_file(floor_texture) if floor_texture else tempfile.NamedTemporaryFile(suffix=".jpg", delete=False).name
        wall_path = save_upload_file(wall_texture) if wall_texture else tempfile.NamedTemporaryFile(suffix=".jpg", delete=False).name

        if not floor_texture:
            create_blank_image(floor_path)
        if not wall_texture:
            create_blank_image(wall_path)

        output_path = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False).name

        # Parse chuỗi JSON predictions thành danh sách Python
        parsed_predictions = json.loads(predictions)

        # Gọi process_with_predictions với polygon hoặc bbox đều hỗ trợ
        replacer.process_with_predictions(
            input_path, floor_path, wall_path, parsed_predictions, output_path
        )

        # Trả ảnh kết quả về client
        with open(output_path, "rb") as f:
            image_data = f.read()
        return Response(content=image_data, media_type="image/jpeg")

    except Exception as e:
        print(f"❌ Lỗi xử lý /render_with_masks: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)
