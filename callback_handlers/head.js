
const parser = require('../parser/zh_parser');

/**
 * 
 * @param {URLPreviewRequest} params 
 * @returns {URLPreviewResponse}
 */

/**
 * 这是响应 HEAD 请求的处理器
 * HEAD 请求代表用户在输入框中输入的 URL 命中了开发者设置的 URL 规则
 * 开发者可以反馈精简数据，如标题等，这样客户端会将 URL 渲染为超链接的样式
 * 
 * @param {URLPreviewRequest} params 
 * @returns {URLPreviewResponse}
 */
module.exports = async function (params) {

    // 返回精简预览数据（inline preview data）

    // 这里演示通过简单的爬虫去获取 URL 对应的 title
    // 这里可以实际替换为根据 URL 获取概览信息的逻辑
    const data = await parser(params.url);
    console.log(data);

    // 返回概览数据
    return {
        status: {
            status_code: 200,
            status_message: 'success'
        },
        preview: {
            title: data.book_name,
            expired_at: 0,
            inline_image_key: 'img_v2_f048daeb-5aba-415b-a2df-fdde5f930aag'
        }
    };
}