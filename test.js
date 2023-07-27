const url = 'https://www.zhihu.com/remix/instabooks/1113758834618834944';
const { parse_id } = require('./common');

console.log(parse_id(url))


const lark = require('./lark_sdk');

async function main(){
    const a = await lark.upload_img('https://pic1.zhimg.com/v2-5d1c63f970861571b0bf091be7ed9086.jpg');
    console.log(a);
}

main();