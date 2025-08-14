import requests
import json
import os
import time

# 飞书API配置 - 从环境变量获取
APP_ID = os.getenv('FEISHU_APP_ID')
APP_SECRET = os.getenv('FEISHU_APP_SECRET')
APP_TOKEN = 'Ahetby21Macl32smTgyj6XL9pkg'  # 替换为实际值
TABLE_ID = 'tblce4FPIsrwofFf'    # 替换为实际值

def get_feishu_token():
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    headers = {"Content-Type": "application/json"}
    payload = {"app_id": APP_ID, "app_secret": APP_SECRET}
    
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json().get('tenant_access_token')
    else:
        raise Exception(f"获取token失败: {response.text}")

def get_feishu_records():
    token = get_feishu_token()
    url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{TABLE_ID}/records"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    records = []
    page_token = ""
    
    while True:
        params = {"page_size": 100}
        if page_token:
            params["page_token"] = page_token
            
        response = requests.get(url, headers=headers, params=params)
        if response.status_code != 200:
            raise Exception(f"获取记录失败: {response.text}")
            
        data = response.json()
        records.extend(data.get('data', {}).get('items', []))
        
        if 'page_token' in data.get('data', {}):
            page_token = data['data']['page_token']
        else:
            break
            
        time.sleep(0.5)  # 避免请求过快
        
    return records

def process_records(records):
    result = {}
    for record in records:
        fields = record.get('fields', {})
        team_id = fields.get('team_id', {}).get('text', '')
        if not team_id:
            continue
            
        # 处理图片字段
        main_image = fields.get('main_image', [])
        overlap_image = fields.get('overlap_image', [])
        
        result[team_id] = {
            "title": fields.get('title', {}).get('text', ''),
            "main_image": main_image[0]['url'] if main_image else '',
            "overlap_image": overlap_image[0]['url'] if overlap_image else '',
            "content": fields.get('content', {}).get('text', '')
        }
    return result

def save_to_json(data):
    os.makedirs('data', exist_ok=True)
    with open('data/team-content.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print("数据已成功保存到 data/team-content.json")

if __name__ == "__main__":
    print("开始从飞书多维表格同步数据...")
    try:
        records = get_feishu_records()
        print(f"获取到 {len(records)} 条记录")
        processed_data = process_records(records)
        save_to_json(processed_data)
        print("同步完成!")
    except Exception as e:
        print(f"同步失败: {str(e)}")
        exit(1)