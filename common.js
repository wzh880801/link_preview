const crypto = require("crypto");

module.exports = {
    /**
     * 解析 URL 中的图书 ID
     * @param {String} url_str 
     * @returns {String}
     */
    parse_id: function (url_str) {
        if (!url_str) {
            return '';
        }
        const regex = /https:\/\/.+?\/(?<id>\d+)/gm;
        const mt = regex.exec(url_str);
        if (mt.length) {
            return mt.groups['id'];
        }
    },

    /**
     * 解密数据
     * @param {String} encrypt_key 链接预览回调里配置的 key
     * @param {String} encrypt_str 服务器反馈的 encrypt 的内容
     * @returns 
     */
    decrypt: function (encrypt_key, encrypt_str) {
        const hash = crypto.createHash('sha256').update(encrypt_key);
        const encryptBuffer = Buffer.from(encrypt_str, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-cbc', hash.digest(), encryptBuffer.slice(0, 16));
        let decrypted = decipher.update(encryptBuffer.slice(16).toString('hex'), 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    },

    /**
     * 签名计算
     * @param {String} timestamp x-lark-request-timestamp
     * @param {String} nonce x-lark-request-nonce
     * @param {String} encrypt_key 链接预览回调里配置的 key
     * @param {String} body 服务器请求的原始 body
     * @returns 
     */
    calc_signature: function (timestamp, nonce, encrypt_key, body) {
        const content = timestamp + nonce + encrypt_key + body;
        return crypto.createHash('sha256').update(content).digest('hex');
    }
}