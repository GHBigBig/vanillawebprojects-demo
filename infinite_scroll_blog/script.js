const postsContainer = document.querySelector('#posts-container');
const loader = document.querySelector('.loader');
const filter = document.querySelector('#filter');

const dom = new Proxy({}, {
    get(target, property) {
        return function(attrs={}, ...children) {
            const el = document.createElement(property);
            for(let prop of Object.keys(attrs)) {
                el.setAttribute(prop, attrs[prop]);
            }
            
            for(let child of children) {
                if(typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
                    child = document.createTextNode(child);
                }
                el.appendChild(child);
            }

            return el;
        };
    }
});

let limit = 5;
let page = 1;

//抓取数据
async function getPosts() {
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
    );
    const data = await res.json();

    return data;
}

//生成 DOM
async function showPosts() {
    const posts = await getPosts();

    posts.forEach(post => {
        const postEl = dom.div({class:'post'}, 
            dom.div({class:'number'}, post.id), 
            dom.section(
                {class:'post-info'},
                dom.h2({class:'post-title'}, post.title),
                dom.p({class:'post-body'}, post.body))
            );

        postsContainer.appendChild(postEl);
    });
}

//追加数据
function showLoading() {
    
    // loader.classList.add('show'); 把动画加载放到节流函数中

    
    loader.classList.remove('show');

    setTimeout(()=> {
        page++;
        showPosts();
    }, 300);
    
}

//过滤关键字
function filterPosts(keywords) {
    postsContainer.childNodes.forEach(post => {
        if(post.querySelector('.post-title').innerText.includes(filter.value) ||
            post.querySelector('.post-body').innerText.includes(filter.value)) {
             post.style.display = 'block';   
        }else {
            post.style.display = 'none';
        }
        
    });
}

//去抖动,多次触发取消计时，重新计时
function debounce(fn, delay){
    var timer = null;
    return function() {
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
}

//节流，delay时间内多次触发只执行一次
function throttle(fn, delay) {
    let throttled = false;
    loader.classList.add('show');

    return () => {
        let args = arguments;
        setTimeout(() => {
            fn.apply(this, args);
            throttled = true;
        }, delay);
    };
}


showPosts();
window.addEventListener('scroll', ()=> {
    //Element.scrollHeight属性返回一个整数值（小数会四舍五入），
    //表示当前元素的总高度（单位像素），包括溢出容器、当前不可见的部分。
    //它包括padding，但是不包括border、margin以及水平滚动条的高度（如果有水平滚动条的话），
    //还包括伪元素（::before或::after）的高度。
    
    //Element.scrollTop属性表示当前元素的垂直滚动条向下滚动的像素数量。对于那些没有滚动条的网页元素，这两个属性总是等于0。

    //Element.clientHeight属性返回一个整数值，表示元素节点的 CSS 高度（单位像素），
    //只对块级元素生效，对于行内元素返回0。如果块级元素没有设置 CSS 高度，则返回实际高度。
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    if(scrollTop + clientHeight >= scrollHeight - 5) {
        throttle(showLoading, 1000)();
    }
});

filter.addEventListener('input', filterPosts);