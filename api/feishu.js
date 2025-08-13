import axios from 'axios';
import * as lark from '@larksuiteoapi/node-sdk';

export default async (req, res) => {
  try {
    const client = new lark.Client({
      appId: process.env.FEISHU_APP_ID,
      appSecret: process.env.FEISHU_APP_SECRET,
    });
    
    // 获取访问令牌
    const tokenResp = await client.authen.getAccessToken();
    const accessToken = tokenResp.app_access_token;
    
    // 从多维表格读取数据
    const response = await client.bitable.appTableRecord.list({
      path: {
        app_token: process.env.BITABLE_APP_TOKEN,
        table_id: 'tblce4FPIsrwofFf', // 替换为你的表格ID
      },
      params: {
        page_size: 100,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    
    // 处理表格数据
    const teamData = {};
    response.items.forEach(item => {
      const fields = item.fields;
      const teamId = fields['team_id'];
      
      teamData[teamId] = {
        title: fields['title'],
        main_image: fields['main_image']?.[0]?.url || '',
        overlap_image: fields['overlap_image']?.[0]?.url || '',
        content: fields['content'] || ''
      };
    });
    
    res.status(200).json(teamData);
    
  } catch (error) {
    console.error('飞书API错误:', error);
    res.status(500).json({ error: '数据获取失败' });
  }
};