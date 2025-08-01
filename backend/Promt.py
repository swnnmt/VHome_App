import requests
import base64
import json
import os

def call_chatbot_api(user_question, image_info=None, endpoint=None, api_key=None, model_name="gpt-4o"):
    """
    Gửi câu hỏi người dùng và ảnh tới GPT-4o, hỗ trợ ảnh từ đường dẫn local hoặc URL.
    """

    # Prompt hệ thống giữ nguyên như yêu cầu
    system_prompt = (
        "Bạn là một chuyên gia tư vấn thiết kế nội thất, có khả năng phân tích không gian qua ảnh và "
        "gợi ý màu sơn, gạch lát phù hợp. Hãy trả lời ngắn gọn, dễ hiểu, hữu ích và giới hạn trong 1000 tokens. "
        "Nếu người dùng tải lên hình ảnh, hãy ưu tiên gợi ý dựa trên không gian thật trong ảnh. "
        "Nếu không có ảnh, hãy dựa vào nội dung mô tả của người dùng."
    )

    headers = {
        "Content-Type": "application/json"
    }

    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    # Chuẩn bị phần message gửi đi
    user_message = []

    # Thêm văn bản câu hỏi
    user_message.append({
        "type": "text",
        "text": f"Câu hỏi của khách hàng: {user_question}"
    })

    # Nếu có ảnh:
    if image_info:
        # Nếu là URL (bắt đầu bằng http) → dùng trực tiếp
        if image_info.startswith("http"):
            image_payload = {
                "type": "image_url",
                "image_url": {
                    "url": image_info
                }
            }
        # Nếu là file ảnh local → encode base64
        elif os.path.exists(image_info):
            with open(image_info, "rb") as f:
                base64_image = base64.b64encode(f.read()).decode("utf-8")
            image_payload = {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image}"
                }
            }
        else:
            raise FileNotFoundError(f"Không tìm thấy ảnh tại: {image_info}")
        
        user_message.append(image_payload)

    # Gửi yêu cầu
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "max_tokens": 1000,
        "temperature": 0.7
    }

    if not endpoint:
        raise ValueError("Vui lòng cung cấp endpoint của API chatbot.")

    response = requests.post(endpoint, headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        data = response.json()
        return data["choices"][0]["message"]["content"]
    else:
        raise RuntimeError(f"Yêu cầu thất bại: {response.status_code} - {response.text}")

chatbot_answer = call_chatbot_api(
    user_question="Tôi nên bố trí nội thất thế nào căn phòng trong ảnh này?",
    image_info="https://noithathometime.com/wp-content/uploads/2019/12/ph%C3%B2ng-kh%C3%A1ch-2-1.jpg",  # file ảnh thật trên máy
    endpoint="https://api.openai.com/v1/chat/completions",
    api_key="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",          # key thực
    model_name="gpt-4o"
)

print("Chatbot trả lời:")
print(chatbot_answer)