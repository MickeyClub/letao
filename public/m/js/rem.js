// 监听屏幕大小事件
window.addEventListener('resize',setHtmlFontSize);

// 初始化rem
setHtmlFontSize();

// 根据当前宽度改变rem
function setHtmlFontSize() {
    // 根据屏幕的宽度来改变根元素的字体大小的值
    // 当前屏幕 / 标准的375屏幕 求得你当前屏幕是标准屏幕的多少倍  * 标准屏幕根元素的字体大小
    // 当前屏幕的宽度 / 375 * 100
    // 假如当前750/375 = 2 * 100 == 200px  
    // 1. 当前屏幕的宽度
    var windowWidth = document.documentElement.offsetWidth;

    // 限制最大屏幕 和最小屏幕
    if(windowWidth > 640){
        windowWidth = 640;
    }else if(windowWidth < 320){
        windowWidth = 320;
    }

    //2. 标准屏幕的宽度
    var StandardWidth = 375;
    // 标准屏幕的字体大小
    var StandardHtmlFontSize = 100;
    // 根据公式(当前屏幕 / 标准屏幕 * 标准屏幕字体大小)
    var htmlFontSize = windowWidth / StandardWidth * StandardHtmlFontSize;

    // 计算结果改变html的根元素
    document.querySelector('html').style.fontSize = htmlFontSize + 'px';

}
