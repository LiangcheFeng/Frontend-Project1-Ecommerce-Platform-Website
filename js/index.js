//需要将所有DOM元素对象以及相关资源全部都加载完毕之后，再实现的函数
window.onload = function () {

    //声明一个记录点击的缩略图下标
    var bigimgIndex = 0;


    //路径导航的数据渲染：
    navPathDataBind();
    function navPathDataBind() {
        /** 
            * 1.先获取路径导航的页面元素（navPath);
            * 2.获取所需要的数据（data.js -> goodData.path)
            * 3.由于数据是需要动态产生的，那么相应的DOM元素也应该动态产生的（需要根据数据数量来创建DOM元素）
            * 4.再遍历数据创建DOM元素最后一条，只创建a标签，不创建i标签
           */
        var navPath = document.querySelector("#wrapper #content .contentMain .navPath ");
        console.log(navPath);
        var path = goodData.path;
        for (var i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                var aNode = document.createElement("a");
                aNode.innerText = path[i].title;
                navPath.appendChild(aNode);
            } else {
                var aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;

                var iNode = document.createElement("i");
                iNode.innerText = "/";

                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }

        }
    }

    // 动态：放大镜的移入、移出效果
    bigClassBind();
    function bigClassBind() {
        /**
         * 思路：
         * 1. 鼠标移入mouseenter小图框smallPic
         * 2. 动态创建蒙版元素mask和大图框bigPic、大图片
         * 3. 鼠标移出时 移出蒙版元素mask和大图框bigPic、大图片
         */
        var smallPic = document.getElementById("smallPic");
        var leftTop = document.getElementById("leftTop");
        var imagessrc = goodData.imagessrc;
        smallPic.addEventListener("mouseenter", function () {
            //创建蒙版元素
            var maskDiv = document.createElement('div');
            maskDiv.className = "mask";
            //创建大图框
            var BigPic = document.createElement("div");
            BigPic.id = "bigPic";
            //创建大图片
            var BigImg = document.createElement("img");
            BigImg.src = imagessrc[bigimgIndex].b;
            //大图框里插入大图片
            BigPic.appendChild(BigImg);
            //小图框里插入蒙版元素
            smallPic.appendChild(maskDiv);
            //left元素追加大图框
            leftTop.appendChild(BigPic);

            //鼠标移动蒙版元素跟着元素
            smallPic.onmousemove = function (event) {
                var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;
                if (left < 0) {
                    left = 0;
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth;
                }
                if (top < 0) {
                    top = 0;
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight;
                }
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top + "px";
                //移动的比例关系= 蒙版元素移动距离/大图片元素移动距离
                //蒙版元素移动距离=小图框宽度-蒙版元素宽度；
                //大图片元素移动距离=大图片宽度-大图框元素宽度
                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (BigImg.offsetWidth - BigPic.clientWidth);
                BigImg.style.left = -left / scale + "px";
                BigImg.style.top = -top / scale + "px";


            }
            //设置鼠标移出函数：
            smallPic.onmouseleave = function () {
                //小图框移除蒙版元素
                smallPic.removeChild(maskDiv);
                //leftTop元素移除大图框
                leftTop.removeChild(BigPic);
            }
        })

    }

    //动态渲染放大镜缩略图的数据
    thumbnailData();
    function thumbnailData() {
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');

        //2.获取imagessrc数据
        var imagessrc = goodData.imagessrc;

        //3.遍历数组
        for (var i = 0; i < imagessrc.length; i++) {
            //4.创建li元素
            var newLi = document.createElement('li');

            //5.创建img元素
            var newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;

            //6.让li追加img元素
            newLi.appendChild(newImg);

            //7.让ul追加li元素
            ul.appendChild(newLi);
        }
    }

    //点击缩略图的效果
    thumbnailClick();
    function thumbnailClick() {
        /**
         * 1.获取所有li，并且循环发生点击事件
         * 2. 点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有的src路径
         */
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');
        var smallPic_img=document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img');
        var imagessrc=goodData.imagessrc;
        smallPic_img.scr=imagessrc[0].s;
        for(var i = 0;i<liNodes.length;i++){
            //在点击事件之前，给每一个元素都添加上自定义的下标
            liNodes[i].index = i; /** 还可以通过setAttribute('index',i) */
            liNodes[i].onclick = function(){
                 var idx = this.index; /** 事件函数中的this永远指向的是实际发生事件的目标源对象 */
                 bigimgIndex = idx;

                 //变换小图路径
                 smallPic_img.src = imagessrc[idx].s;

            }
        }


    }

    //点击缩略图左右箭头效果
    thumbnailLeftRightClick();
    function thumbnailLeftRightClick() { 
        /**
         * 1. 先获取左右两端的箭头
         * 2. 再获取可视的div、ul元素、li元素
         * 3.计算
         * 4. 发生点击事件
         */

        var prev =document.querySelector("#wrapper #content .contentMain #center #left #leftBottom a.prev");
        var next =document.querySelector("#wrapper #content .contentMain #center #left #leftBottom a.next");
       var piclist= document.querySelector("#wrapper #content .contentMain #center #left #leftBottom #piclist")
       var ul = document.querySelector("#wrapper #content .contentMain #center #left #leftBottom #piclist ul");
       var liNodes=document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');

       var start =0;
       var step= (liNodes[0].offsetWidth+20)*2
       var endPosition = (liNodes.length-5)*(liNodes[0].offsetWidth+20);

       prev.onclick = function(){
        start-=step;
        if(start < 0){
            start = 0;
        }
        ul.style.left = -start + "px";
    }

    next.onclick = function(){
        start+=step;
        if(start > endPosition){
            start = endPosition;
        }
        ul.style.left = -start + "px";
    }
    }

    //商品详情的动态渲染
    rightTopData();
    function rightTopData(){
       var rightTop = document.querySelector("#wrapper #content .contentMain #center .right .rightTop");
       var goodsDetail=goodData.goodsDetail;
      var s =`<h3>${goodsDetail.title}</h3>
      <p>${goodsDetail.recommend}</p>
      <div class="priceWrap">
          <div class="priceTop">
              <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
              <div class="price">
                  <span>￥</span>
                  <p>${goodsDetail.price}</p>
                  <i>降价通知</i>
              </div>
              <p>
                  <span>累计评价</span>
                  <span>${goodsDetail.evaluateNum}</span>
              </p>
          </div>
          <div class="priceBottom">
              <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
              <p>
                  <span>${goodsDetail.promoteSales.type}</span>
                  <span>${goodsDetail.promoteSales.content}</span>
              </p>
          </div>
      </div>
      <div class="support">
          <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
          <p>${goodsDetail.support}</p>
      </div>
      <div class="address">
          <span>配&nbsp;送&nbsp;至</span>
          <p>${goodsDetail.address}</p>
      </div>`;

       rightTop.innerHTML=s;

    }

}