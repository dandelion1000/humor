/*考虑几个可能的输入格式，Unicode、纯文本（:joy: 这种），
存储/呈现的时候，再 convert 到自己需要的格式，Unicode、纯文本、img 之类的。
*/
/*
可以判断操作系统，
如果是 Windows 就用图片，
否则就直接用 emoji 表情。
也可以简单一点，所有系统都用图片，以保持统一
*/

let emoji_map = {
    unicode_emoji: [
        {
            'grinning': '@/assets/images/emoji/smile1.png'
        },
        {

        }
    ],
    purse_emoji: [

    ]
};
