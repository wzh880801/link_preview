const parser = require('../parser/zh_parser');
const fs = require('fs');
const lark = require('../lark_sdk');
const { HTML_CACHE_DIR } = require('../config');

if (!fs.existsSync(HTML_CACHE_DIR)) {
    fs.mkdirSync(HTML_CACHE_DIR);
}

/**
 * 用户看到消息时。开发者会受到 GET 请求，开发者可以响应这个请求返回预览数据
 * 
 * @param {URLPreviewRequest} params 
 * @returns {URLPreviewResponse}
 */
module.exports = async function (params) {

    const preview_token = params.preview_token;
    const cached_file = `${HTML_CACHE_DIR}/${preview_token}.json`;
    if (fs.existsSync(cached_file)) {
        return JSON.parse(fs.readFileSync(cached_file, 'utf-8'));
    }

    // 如果没有获取到缓存数据，尝试直接获取预览数据并返回
    const data = await parser(params.url);
    console.log(data);

    if (data.book_name) {
        const resp = {
            status: {
                status_code: 200,
                status_message: 'success'
            },
            preview: {
                title: data.book_name,
                expired_at: 0,
                preview_card: {
                    card_id: 'AAqqb0mgN8pDe',
                    version_name: '1.0.4',
                    card_url: {
                        url: params.url
                    },
                    variables: {
                        book_name: data.book_name,
                        book_intro: data.book_intro,
                        user: data.user,
                        user_desc: data.user_desc,
                        book_img: await lark.upload_img(data.img_url),
                        user_img: await lark.upload_img(data.user_avatar)
                    },
                    actions: {
                        cmd_btn: {
                            method: 3,
                            url: '',
                            command: {
                                action_payload: JSON.stringify({ book_url: params.url, book_name: data.book_name })
                            }
                        },
                        open_url_btn: {
                            method: 4,
                            url: '',
                            open_url: {
                                open_url: {
                                    url: 'https://open.feishu.cn'
                                }
                            }
                        },
                        toast_btn: {
                            method: 6,
                            url: '',
                            show_toast: {
                                type: 1,
                                content: '操作成功',
                                duration: 2000
                            }
                        }
                    }
                }
            }
        };
        fs.writeFileSync(cached_file, JSON.stringify(resp));
        return resp;
    }
}