
const { ENCRYPT_KEY, VERIFICATION_TOKEN } = require('./config');
const url_router = require('./router');
const { calc_signature, decrypt } = require('./common');
const router = require('./router');

const port = 5555;

/* 引入express框架 */
const express = require('express');
const app = express();

/* 引入cors */
const cors = require('cors');
app.use(cors());

// 因为签名验证或加解密需要用到 rawBody，这里增加一个中间件来获取 HTTP 请求的原始 body
// 并根据返回数据的格式来自动识别是否开启了加密，如果开启了加密，则自动解密
app.use(function (req, res, next) {

    var contentType = req.headers['content-type'] || '', mime = contentType.split(';')[0];

    let data = '';

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {
        req.rawBody = data;
        if (['application/json'].indexOf(mime) !== -1) {
            req.body = JSON.parse(req.rawBody);

            if (req.body.encrypt) {
                req.body = JSON.parse(decrypt(ENCRYPT_KEY, req.body.encrypt));
            }
        }
        next();
    });

});

app.use(express.urlencoded({ extended: false }));

// 插入一个中间件用来做签名验证
app.all('*', function (req, res, next) {
    console.log(`\n${new Date().toISOString()}\t${req.method}\t${req.url}`);
    console.log(`${req.body.method} - ${req.body.url}`);

    // 获取签名验证的 header
    const timestamp = req.headers['x-lark-request-timestamp'];
    const nonce = req.headers['x-lark-request-nonce'];
    const signature = req.headers['x-lark-signature'];

    console.log(req.headers);

    // webhook 验证
    if (req.body && req.body.type === 'url_verification') {
        res.json({
            challenge: req.body.challenge
        })
        return;
    }

    // 签名信息验证
    if (!signature || !timestamp || !nonce) {
        console.log('auth info is empty');
        res.status(403).json({
            code: 400003,
            msg: 'auth info is empty'
        })
        return;
    }

    // 签名对比
    const sign = calc_signature(timestamp, nonce, ENCRYPT_KEY, req.rawBody);
    if (sign !== signature) {
        console.log(`${sign} !== ${signature}`);
        console.log('signature not match');
        res.status(403).json({
            code: 400003,
            msg: 'signature not match'
        })
        return;
    }

    next();
});

// 处理回调，实现预览整个生命周期
app.all('/url_preview/webhook', async (req, res) => {

    console.log('enter router');

    // 将请求透传给 router，由 router 识别预览请求类型，然后分发给不同的 handler 进行处理
    const resp = await router(req.body);

    console.log('response:')
    console.log(resp);

    // 将预览处理结果回传
    res.json(resp);
})

/* 监听端口 */
app.listen(port, () => {
    console.log(`listening: ${port}`);
})
